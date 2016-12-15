MSIE 9 IEFRAME CSelectionInteractButtonBehavior::_UpdateButtonLocation use-after-free
=====================================================================================
([MS13-047][], [CVE-2013-3111][])

[MS13-047]: http://technet.microsoft.com/en-us/security/bulletin/ms13-047
[CVE-2013-3111]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2013-3111

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
analysis on use-after-free bugs, so I have no details to share. EIP revealed
that this was a use-after-free vulnerability. I have included a number of
reports created using a predecessor of [BugId][] below.

[BugId]: https://github.com/SkyLined/BugId
