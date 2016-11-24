Description
-----------
When a regular expression is used to find matches in a string, it is first
"compiled". During compilation, when a '\' escape character is encountered, 
the RegExpComp::PnodeParse function reads the next character to determine the
type of escape sequence. However, if the last character in a regular expression
is a '\' character, the code will read and use the terminating '\0' character
as the second character in the escape sequence. This causes the code to ignore
the end of the string and continue to compile whatever data is found beyond it
as if it was part of the regular expression.

Exploit
-------
The regular expressions string is stored in a BSTR, which means that the heap
block in which it is stored may be larger than the regular expression. This
means that if the heap block was used to store something else, then freed and
reused for the regular expression, it may contain interesting information
immediately following the regular expression. It also means that
[Heap Feng-Shui][] can be used to control this as well as control the contents
of the next heap block, which may also contain useful information.

[Heap Feng-Shui]:https://www.blackhat.com/presentations/bh-europe-07/Sotirov/Presentation/bh-eu-07-sotirov-apr19.pdf

This amount of control suggests that it may be possible to store this useful
information compiled as if it was part of the regular expression. A number of
functions can then be used to attempt to extract this information, such as
matching to a string containing a sequence that contains all the possible
values for the information: the resulting matches should reveal what
information was compiled into the regular expression.

I did not implement such an attack, but here's one example of what it might look
like:

Let's assume we can allocate 0x20 bytes of heap, of which the last four bytes
contain a pointer into a dll and then free it.
```
0000 ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  |  ????????
0010 ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  <<pointer>>  |  ??????ab
```
(In the above, "a" represents the least significant half of the address as a
Unicode character and "b" the most significant half.)

Let's also assume we can allocate a heap block immediately following it in which
we can control the first four bytes and set them to "]\0", or [5D 00 00 00].
```
0000 ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  |  ????????
0010 ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  <<pointer>>  |  ??????ab
0020 5D 00 00 00  ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  |  ].??????
```

Finally, let's assume we can reallocate the freed heap block to store a regular
expression "468ACE02|[\\".
```
0000 18 00 00 00  34 00 36 00  38 00 3A 00  3C 00 3E 00  |  ..468ACE
0010 30 00 32 00  7C 00 5B 00  5C 00 00 00  <<pointer>>  |  02|[\.ab
0020 5D 00 00 00  ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  |  ].??????
```

When using the regular expression, it will effectively be compiled into
"468ACE02|[\0ab]". Using this regular expression to find matches in a string
that contains all valid Unicode characters should yield two matches: "a" and
"b", in any order. You could then do the entire thing over and construct
compiled regular expression that is effectively "468ACE02|(\0ab)" and matching
this against the string "\0ab\0ba" to find out in which order "a" and "b"
should be used to determine the value of the address.

Time-line
---------
* *June 2014*: This vulnerability was found through fuzzing, but I was unable
  to reproduce it outside of my fuzzing framework for unknown reasons.
* *April 2015*: This vulnerability was found through fuzzing again.
* *April 2015*: This vulnerability was submitted to [ZDI][].
* *May 2015*: ZDI rejects the submission.
* *November 2016*: The issue does not reproduce in the latest build of MSIE 11.
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
