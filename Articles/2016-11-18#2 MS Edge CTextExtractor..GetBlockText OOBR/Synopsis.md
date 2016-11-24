([MS16-104][], [CVE-2016-3247][])

[MS16-104]: https://technet.microsoft.com/library/security/MS16-104
[CVE-2016-3247]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-3247

A specially crafted web-page can cause an integer underflow in Microsoft Edge.
This causes `CTextExtractor::GetBlockText` to read data outside of the bounds
of a memory block.
