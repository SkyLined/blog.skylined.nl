MSIE 10 MSHTML CEditAdorner::Detach use-after-free
==================================================
([MS13-047][], [CVE-2013-3120][])

[MS13-047]: https://technet.microsoft.com/library/security/ms13-047
[CVE-2013-3120]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2013-3120

Synopsis
--------
A specially crafted web-page can cause Microsoft Internet Explorer 10 to
continue to use an object after freeing the memory used to store the object.
An attacker might be able to exploit this issue to execute arbitrary code.

Known affected software and attack vectors
------------------------------------------
+ **Microsoft Internet Explorer 10**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling Javascript should prevent an attacker from triggering the
  vulnerable code path.
