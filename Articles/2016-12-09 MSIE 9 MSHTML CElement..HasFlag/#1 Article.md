MSIE 9 MSHTML CElement::HasFlag memory corruption
=================================================
(The fix and CVE number for this issue are not known)

Synopsis
--------
A specially crafted web-page can trigger a memory corruption vulnerability in
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
analysis on use-after-free bugs, so I have no details to share. In addition,
EIP said they were already aware of the bug and provided no details, this issue
appears to have been fixed before ZDI was able to look at it.
I have included a number of reports created using a predecessor of [BugId][]
below.

[BugId]: https://github.com/SkyLined/BugId
