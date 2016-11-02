([MS16-002][], [CVE-2016-0003][])
[CVE-2016-0003]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-0003
[MS16-002]: https://technet.microsoft.com/library/security/MS16-002

Specially crafted Javascript inside an HTML page can trigger a type confusion
bug in Microsoft Edge that allows accessing a C++ object as if it was a BSTR
string. This can result in information disclosure, such as allowing an attacker
to determine the value of pointers to other objects and/or functions. This
information can be used to bypass ASLR mitigations. It may also be possible to
modify arbitrary memory and achieve remote code execution, but this was not
investigated.
