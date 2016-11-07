Description
-----------
During normal operation, when you execute the `RegExp.Execute` method from
`VBScript` the code in vbscript.dll executes the `CRegExp::Execute` function.
This function creates a `CMatch` object for each match found, and stores
pointers for all of these `CMatch` objects in a singly linked list of
`CMatchBlock` structures (Note: the vbscript.dll symbols do not provide a name for
this structure, so I gave it this name). Each `CMatchBlock` structure can store
up to 16 such pointers, as well as a pointer to the next `CMatchBlock`. This
last pointer is NULL unless all pointers in the `CMatchBlock` object are in
use and more storage is needed, in which case a new `CMatchBlock` object is
created and a link to the new object is added to the last one in the list. The
code counts how many matches it has found so far, and this corresponds to the
number of `CMatch` objects it has allocated.

The following pseudo-code represents these two structures:
```C++
CMatchBlock {
  00 04 CMatchBlock* poNextCMatchBlock
  04 40 CMatch* apoCMatches[16]
} // size = 0x44 (x86) or 0x88 (x64)

CMatch {
  00 0C void** apapVFTables[3]              
  0C 04 DWORD dwUnknown_0C
  10 04 DWORD poUnknownObject_10
  14 04 DWORD poUnknownObject_14
  18 04 DWORD poUnknownObject_18
  1C 04 DWORD poUnknownObject_1C
  20 04 DWORD dwUnknown_20
  24 04 BSTR sValue
  28 04 INT[]* paiMatchStartAndEndIndices
  2C 04 INT iCountMatchAndSubMatches
} // size = 0x30 (x86) or unknown (x64)
```

When an error occurs in this part of the code, the error handling code will
try to clean up and free all `CMatchBlock` structures created before the error
occurred. To do this, it walks the linked list of `CMatchBlock` structures and
for each structure, release each `CMatch` object in the structure. All
`CMatchBlock` structures except the last one should have 16 such pointers, the
last `CMatchBlock` structure can have 1-16, depending on how many matches where
found in total. This appears to have been designed to count how many `CMatch`
objects it has yet to free. This counter is initialized to the number of
matches found before the error occurred and should be decremented whenever the
code frees a `CMatch` object, so the code can determine how many `CMatch`
object are in the last `CMatchBlock` structure. However, this code neglects to
decrement this counter. This causes the code to assume all `CMatchBlock`
structures have 16 `CMatch` object pointers if there were more than 16 matches
in total, and attempt to release 16 `CMatch` objects from the last
`CMatchBlock` structure, even if less than 16 pointers to `CMatch` objects
were stored there.

The below pseudo-code represents how the real code works:
```C++
poCMatchBlock = poFirstCMatchBlock;
do {
    if (iTotalMatchesCount < 0x10) { // Note 1
        iMatchesInCMatchBlock = iTotalMatchesCount;
    } else {
        iMatchesInCMatchBlock = 0x10; // Note 2
    }
    for (iIndex = 0; iIndex < iMatchesInCMatchBlock; iIndex++) {
        poCMatchBlock->apoCMatches[iIndex].Release(); // Note 3
    }
    poOldCMatchBlock = poCMatchBlock;
    poCMatchBlock = poCMatchBlock->poNextCMatchBlock;
    delete poOldCMatchBlock;
    // Note 4
} while (poCMatchBlock);
```

For example: if the code finds 17 matches before an error is triggered, 2
`CMatchBlock` structures will have been created: the first will contain 16
pointers to `CMatch` objects and the second will contain exactly 1. The error
handling code will run with `iTotalMatchesCount` set to 17 but never decrements
it (Note 4 shows where that decrement should happen). The loop is executed
twice, once for each `CMatchBlock` structure. On each `do...while`-loop
`iTotalMatchesCount` will be larger than 17 (Note 1) and thus
`iMatchesInCMatchBlock` will be set to 16 (Note 2). This causes the `for`-loop
to try to free 16 `CMatch` objects from the second `CMatchBlock` structure, in
which only one was stored. This results in the code using uninitialized memory
as a pointer to an object on which it attempts to call the `Release` method.

To fix this, the following code would have to be inserted at Note 4:
```C++
    iTotalMatchesCount -= iMatchesInCMatchBlock
```

Exploitation
------------
An attacker looking to exploit this bug will commonly attempt to allocate
memory blocks of the same size and on the same heap as the `CMatchBlock`
structure and fill these blocks with certain data before releasing them. If done
correctly, the heap manager will then reuse these memory blocks when the
`CMatchBlock` objects are allocated, causing these structures to contain the
attacker supplied data. Once the vulnerability is triggered, this attacker
supplied data is then used as pointers to `CMatch` objects, and when the code
attempts to call the `Release` method of these objects, they are treated as
pointers to a list of virtual function tables, from which the code retreives an
address to call to execute that method. Control over these pointers therefore
gives an attacker control over execution flow.

[Heap Feng-Shui], a common technique used to manipulate the heap in MSIE, can
not be used in this case, as it uses strings to manipulate the heap. Strings in
both JavaScript and VBScript are allocated through OLEAUT32, whereas the
`CMatchBlock` structures are allocated through msvcrt, which uses a different
heap. The Trident rendering engine also uses a different heap to allocate
various potentially useful memory blocks.

To find out if there was a way to allocate and free memory in order to
manipulate the heap an control what the uninitialized memory contains, I logged
all allocations made while executing the `CRegExp::Execute` method. This showed
that it allocates a block of memory through msvcrt to store the indices of the
start and end of a match and each of its sub-matches. The size of this block
depends on the number of sub-matches in the regular expression and the contents
of the block depends on where the matches are found in the string. Both are
attacker controlled, allowing for the creation of memory blocks of near
arbitrary size and content.

To exploit the bug, one can execute a regular expression that generates the
desired sub-matches and free them in order to manipulate the heap before
executing another regular expression that triggers the issue. This should cause
the code to use attacker supplied values for the uninitialized `CMatch` object
pointers. The Proof-of-Concept exploit below attempts to do this and execute
memory under an attacker's control. As this is a simple PoC sploit, nothing is
done in order to attempt to bypass mitigations such as [DEP] and the
"shellcode" is simply a bunch of INT3-s.

Time-line
---------
* *March 2014*: This vulnerability was found through fuzzing.
* *March/April 2014*: This vulnerability was submitted to [ZDI][] and
  [iDefense][].
* *May 2014*: The vulnerability was acquired by iDefense.
* *June 2014*: The vulnerability was reported to Microsoft by iDefense.
* *December 2014*: The vulnerability was address by Microsoft in [MS14-080][]
  and [MS14-084][].
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[iDefense]: https://www.verisign.com/en_US/security-services/security-intelligence/vulnerability-reports/articles/index.xhtml?id=1075
[MS14-080]: https://technet.microsoft.com/en-us/library/security/MS14-080
[MS14-084]: https://technet.microsoft.com/en-us/library/security/MS14-084
