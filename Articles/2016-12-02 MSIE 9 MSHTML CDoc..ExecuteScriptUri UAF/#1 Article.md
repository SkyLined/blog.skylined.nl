MSIE 9 CDoc::ExecuteScriptUri use-after-free
==========================================
([MS13-009][], [CVE-2013-0019][])

[MS13-009]: https://technet.microsoft.com/library/security/ms13-009
[CVE-2013-0019]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2013-0019

Synopsis
--------
A specially crafted web-page can trigger a use-after-free vulnerability in
Microsoft Internet Explorer 9. I did not investigate this vulnerability
thoroughly, so I cannot speculate on the potential impact or exploitability.

Known affected software and attack vectors
------------------------------------------
* **Microsoft Internet Explorer 9**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling JavaScript does not prevent an attacker from triggering
  the vulnerable code path.
  
