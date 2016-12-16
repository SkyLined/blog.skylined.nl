MSIE 8 MSHTML SRunPointer::SpanQualifier/RunType OOB read
=========================================================
([MS15-009][], [CVE-2015-0050][])

[MS15-009]: https://technet.microsoft.com/library/security/ms15-009
[CVE-2015-0050]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-0050

Synopsis
--------
A specially crafted web-page can cause Microsoft Internet Explorer 8 to attempt
to read data beyond the boundaries of a memory allocation. The issue does not
appear to be easily exploitable.

Known affected software, attack vectors and mitigations
-------------------------------------------------------
* **Microsoft Internet Explorer 8**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling Javascript should prevent an attacker from triggering the
  vulnerable code path.
