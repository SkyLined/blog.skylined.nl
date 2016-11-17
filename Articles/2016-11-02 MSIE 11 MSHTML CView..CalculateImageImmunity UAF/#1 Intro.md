MSIE 11 MSHTML CView::CalculateImageImmunity use-after-free
===========================================================
(The fix and CVE number for this bug are not known)

Synopsis
--------
A specially crafted web-page can cause Microsoft Internet Explorer 11 to free
a memory block that contains information about an image. The code continues
to use the data in freed memory block immediately after freeing it. It does not
appear that there is enough time between the free and reuse to exploit this
issue.

Known affected versions, attack vectors and mitigations
-------------------------------------------------------
+ **Microsoft Internet Explorer 11**

  An attacker would need to get a target user to open a specially crafted
  web-page. As far as can be determined, disabling JavaScript should prevent an
  attacker from triggering the vulnerable code path.
