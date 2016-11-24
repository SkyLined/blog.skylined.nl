Description
-----------
Certain code that handles CSS properties in MSIE assumes that the property
value is always a string set to either `"true"` or `"false"`. To determine
which of these two values it is, the code checks if the fifth character is
`'\0'`. However, it is possible to set such values to arbitrary strings,
including a smaller string. This causes the code to read beyond the end of the
string and allows an attacker to determine if an WORD stored after the string
is `'\0'`.

The vulnerable code is in `MSHTML!PROPERTYDESC::HandleStyleComponentProperty`.
This code is heavily branched to handle various types of CSS properties.
Luckily, the type being exploited is one of the first to be handled. The code
appears to assume that the value is provided as a pointer to a `BSTR` which
will always have a `WCHAR` at offset +8 that may be `'\0'` or not. If this
`WCHAR` is not `'\0'`, a CSS property is set to a certain value, otherwise it
is set to an empty string. As long as this `BSTR` is always either be `"true"`
or `"false"`, this code works as expected. However, it is possible to provide
an arbitrary value for this `BSTR`, which can be shorter than 4 `WCHARs`. This
would causing the code to read a `WCHAR` outside of the memory used to store
that `BSTR`.

In the repro, we used [Heap Feng-Shui][] to put a `BSTR` containing 3 `WCHARs`
in the `OLEAUT32` cache. This causes MSIE to allocate 12 byte of memory to
store the string: 4 bytes to store the `DWORD` length of the `BSTR`, 6 to store
the characters, and 2 to store a "\0" terminator. This memory is then reused to
store a 1 `WCHAR` string `"x"`. When the code attempts to check if the fifth
character in this his `BSTR` is `'\0'`, it will attempt to read the two bytes
at offset 14 (The characters are stored at offset 4, after the `DWORD` length,
and the fifth character is at offset `10` from the first). This causes the code
to read outside of the bounds of that `BSTR` and trigger an access violation.
(On x86 systems, page heap will provide some padding at the end of the string,
causing the code to read these padding bytes, so no AV happens).

[Heap Feng-Shui]:https://www.blackhat.com/presentations/bh-europe-07/Sotirov/Presentation/bh-eu-07-sotirov-apr19.pdf

Known properties of the type that leads to the vulnerable code path include
`textDecorationBlink`, `textDecorationLineThrough`, `textDecorationLineNone`,
`textDecorationOverline`, and `textDecorationUnderline`.

Exploit
-------
The value of a CSS property is updated based on the value of the fifth `WCHAR`,
and this CSS property can be read from Javascript to determine if this `WCHAR`
was `'\0'` or not. This allows a limited form of information disclosure. During
my testing, I used the `textDecorationBlink` property, which can be used to set
the CSS `text-decoration` property to `"blink"` or an empty string.

Using Heap-Feng Shui, it may be possible to reuse memory allocated for other
strings that have since been freed and determine if they had a `'\0'` `WCHAR`
as their fifth character. This includes strings to should normally not be
accessible to the website, such as those from a different origin. Also using
Heap Feng-Shui, it may be possible to allocate some interesting object
immediately following the string, in order to determine if a `WORD` at the
start of that object is 0 or not.

The "exploit" provided below shows that it is possible to determine if the
fifth `WCHAR` of the last freed `BSTR` was `'\0'` or not.

Time-line
---------
* *Februari 2016*: This vulnerability was found through fuzzing.
* *Februari 2016*: This vulnerability was submitted to [ZDI][], [iDefense][]
  and [EIP][].
* *March-July 2016*: ZDI, iDefense and EIP all either reject the submission or
  fail to respond.
* *July 2016*: This vulnerability was reported to Microsoft with a 60-day
  deadline to address the issue.
* *August 2016*: Microsoft is granted an 11 day extension to the deadline to
  address it in September's Patch Tuesday.
* *September 2016*: The vulnerability was address by Microsoft in [MS16-104][].
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[iDefense]: https://labs.idefense.com/vcpportal/
[EIP]: https://rsp.exodusintel.com/
[MS16-104]: https://technet.microsoft.com/library/security/ms16-104
