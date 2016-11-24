MSIE 11 MSHTML CGeneratedContent::HasGeneratedSVGMarker type confusion
=======================================================
(The fix and CVE number for this issue are unknown)

Synopsis
--------
A specially crafted web-page can cause a type confusion in HTML layout in
Microsoft Internet Explorer 11. An attacker might be able to exploit this issue
to execute arbitrary code.

Known affected software and attack vectors
------------------------------------------
+ **Microsoft Internet Explorer 11**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling Javascript should prevent an attacker from triggering the
  vulnerable code path.
