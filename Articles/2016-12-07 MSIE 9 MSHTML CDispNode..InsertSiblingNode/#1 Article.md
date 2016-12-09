MSIE 9 MSHTML CDispNode::InsertSiblingNode use-after-free
=========================================================
([MS13-037][], [CVE-2013-1309][])

[MS13-037]: https://technet.microsoft.com/en-us/security/bulletin/ms13-037
[CVE-2013-1309]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2013-1309

Synopsis
--------
A specially crafted web-page can trigger a memory corruption vulnerability in
Microsoft Internet Explorer 9. I did not investigate this vulnerability
thoroughly, so I cannot speculate on the potential impact or exploitability.

Known affected software and attack vectors
------------------------------------------
* **Microsoft Internet Explorer 9**

  An attacker would need to get a target user to open a specially crafted
  web-page. JavaScript does not appear to be required for an attacker to
  triggering the vulnerable code path.
  
Details
-------
This bug was found back when I had very little knowledge and tools to do
analysis on use-after-free bugs, so I have no details to share. The ZDI did do
a more thorough analysis and [provide some details in their advisory](http://www.zerodayinitiative.com/advisories/ZDI-13-083/).
I have included a number of reports created using a predecessor of [BugId][]
below.

[BugId]: https://github.com/SkyLined/BugId
