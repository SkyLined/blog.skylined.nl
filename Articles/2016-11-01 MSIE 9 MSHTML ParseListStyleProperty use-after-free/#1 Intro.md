MSIE 9 MSHTML CAttrArray use-after-free
=======================================

([MS14-056][], [CVE-2014-4141][])

[MS14-056]: https://technet.microsoft.com/en-us/library/security/MS14-056
[CVE-2014-4141]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-4141

Synopsis
--------
A specially crafted webpage can cause Microsoft Internet Explorer 9 to
reallocate a memory buffer in order to grow it in size. The original buffer
will be copied to newly allocated memory and then freed. The code continues to
use the freed copy of the buffer.

Known affected versions, attack vectors and mitigations
-------------------------------------------------------
+ **Microsoft Internet Explorer 9**

  An attacker would need to get a target user to open a specially crafted
  webpage. Disabling JavaScript should prevent an attacker from triggering the
  vulnerable code path.
