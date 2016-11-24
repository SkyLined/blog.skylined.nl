Microsoft Edge CTextExtractor::GetBlockText OOB read
=====================================
([MS16-104][], [CVE-2016-3247][])

[MS16-104]: https://technet.microsoft.com/library/security/MS16-104
[CVE-2016-3247]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-3247

Synopsis
--------
A specially crafted web-page can cause an integer underflow in Microsoft Edge.
This causes `CTextExtractor::GetBlockText` to read data outside of the bounds
of a memory block.

Known affected software, attack vectors and mitigations
-------------------------------------------------------
* **Microsoft Edge 11.0.10240.16384**

  An attacker would need to get a target user to open a specially crafted
  web-page. JavaScript is not necessarily required to trigger the issue.