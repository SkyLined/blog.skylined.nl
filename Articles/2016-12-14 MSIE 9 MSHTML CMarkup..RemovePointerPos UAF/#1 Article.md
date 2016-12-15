MSIE 9 IEFRAME CMarkup::RemovePointerPos use-after-free
=======================================================
([MS13-055][], [CVE-2013-3143][])

[MS13-055]: http://technet.microsoft.com/en-us/security/bulletin/ms13-055
[CVE-2013-3143]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2013-3143

Synopsis
--------
A specially crafted web-page can trigger a use-after-free vulnerability in
Microsoft Internet Explorer 9. I did not investigate this vulnerability
thoroughly, so I cannot speculate on the potential impact or exploitability.

Known affected software and attack vectors
------------------------------------------
* **Microsoft Internet Explorer 9**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling JavaScript should prevent an attacker from triggering the
  vulnerable code path.

Details
-------
This bug was found back when I had very little knowledge and tools to do
analysis on use-after-free bugs, so I have no details to share. ZDI revealed
that this was a use-after-free vulnerability, though [their advisory](http://www.zerodayinitiative.com/advisories/ZDI-13-163/)
mentions an iframe, which is not in the repro I provided. I have included a
number of reports created using a predecessor of [BugId][] below.

[BugId]: https://github.com/SkyLined/BugId
