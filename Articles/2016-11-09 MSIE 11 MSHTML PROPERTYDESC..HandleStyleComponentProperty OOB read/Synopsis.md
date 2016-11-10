([MS16-104][], [CVE-2016-3324][])

[MS16-104]: https://technet.microsoft.com/library/security/ms16-104
[CVE-2016-3324]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-3324

A specially crafted web-page can cause Microsoft Internet Explorer 9-11 to
assume a CSS value stored as a string can only be `"true"` or `"false"`. To
determine which of these two values it is, the code checks if the fifth
character is an `'e'` or a `'\0'`. An attacker that is able to set it to a
smaller string can cause the code to read data out-of-bounds and is able to
determine if a `WCHAR` value stored behind that string is `'\0'` or not.
