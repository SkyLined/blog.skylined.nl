([MS14-056][], [CVE-2014-4141][])
[MS14-056]: https://technet.microsoft.com/en-us/library/security/MS14-056
[CVE-2014-4141]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-4141

A specially crafted web-page can cause Microsoft Internet Explorer 9 to
reallocate a memory buffer in order to grow it in size. The original buffer
will be copied to newly allocated memory and then freed. The code continues to
use the freed copy of the buffer.

