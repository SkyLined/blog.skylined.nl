Description
-----------
Calling the `isPrototypeOf` method of the `DOMImplementation` interface as a
function results in type confusion where an object is assumed to implement
`IUnknown` when in fact it does not. The code attempts to call the `Release`
method of `IUnknown` through the vftable at offset 0, but since the object has
no vftables, a member property is stored at this offset, which appears to have
a static value `002dc6c0`. An attacker that is able to control this value, or
allocate memory and store data at that address, may be able to execute
arbitrary code.

Exploit
-------
No attempts were made to further reverse the code and determine the exact root
cause. A few attempts were made to control the value at offset 0 of the object
in question, as well as get another object in its place with a different value
at this location, but both efforts were brief and unsuccessful.

Time-line
---------
* *September 2015*: This vulnerability was found through fuzzing.
* *October 2015*: This vulnerability was submitted to [ZDI][].
* *November 2015*: This vulnerability was acquired by ZDI.
* *February 2016*: This issue was addressed by Microsoft in [MS16-009][].
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[MS16-009]: https://technet.microsoft.com/library/security/MS16-009