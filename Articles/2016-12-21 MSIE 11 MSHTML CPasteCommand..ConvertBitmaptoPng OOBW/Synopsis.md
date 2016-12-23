([MS14-056][], [CVE-2014-4138][])

[MS14-056]: https://technet.microsoft.com/en-us/library/security/MS14-056
[CVE-2014-4138]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-4138

A specially crafted web-page can trigger an out-of-bounds write in Microsoft
Internet Explorer 11. Code that handles pasting images from the clipboard uses
an incorrect buffer length, which allows writing beyond the boundaries of a
heap-based buffer. An attacker able to trigger this vulnerability can execute
arbitrary code.
