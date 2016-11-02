([MS14-056][], [CVE-2014-4141][])

A specially crafted webpage can cause Microsoft Internet Explorer to reallocate
a CImplAry buffer in order to grow it in size. The original buffer will be
copied to newly allocated memory and then freed. The code continues to use the
freed copy of the buffer. This vulnerability could potentially be used to
execute arbitrary code.

[MS14-056]: https://technet.microsoft.com/en-us/library/security/MS14-056
[CVE-2014-4141]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-4141
