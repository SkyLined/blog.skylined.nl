MSIE 9 MSHTML CPtsTextParaclient::CountApes out-of-bounds read
==============================================================

(The fix and CVE number for this bug are not known)

Synopsis
--------
A specially crafted web-page can cause Microsoft Internet Explorer 9 to access
data before the start of a memory block. An attack that is able to control
what is stored before this memory block may be able to disclose information
from memory or execute arbitrary code.


Known affected versions, attack vectors and mitigations
-------------------------------------------------------
+ **Microsoft Internet Explorer 9**

  An attacker would need to get a target user to open a specially crafted
  web-page. As far as can be determined, disabling JavaScript should prevent an
  attacker from triggering the vulnerable code path.
