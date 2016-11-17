Microsoft Internet Explorer 8 jscript RegExpBase::FBadHeader use-after-free
===========================================================================
([MS15-018][], [CVE-2015-2482][])

[MS15-018]: https://technet.microsoft.com/en-us/library/security/MS15-108
[CVE-2015-2482]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-2482

Synopsis
--------
A specially crafted web-page can cause the Javascript engine of Microsoft
Internet Explorer 8 to free memory used for a string. The code will keep a
reference to the string and can be forced to reuse it when compiling a regular
expression.

Known affected software, attack vectors and mitigations
-------------------------------------------------------
* **Microsoft Internet Explorer 8**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling Javascript should prevent an attacker from triggering the
  vulnerable code path.
