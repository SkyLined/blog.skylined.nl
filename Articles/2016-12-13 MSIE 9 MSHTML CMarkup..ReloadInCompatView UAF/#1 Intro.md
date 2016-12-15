MSIE 9 MSHTML CMarkup::ReloadInCompatView use-after-free
=======================================================
(The fix and CVE number for this issue are not known)

Synopsis
--------

A specially crafted web-page can trigger a use-after-free vulnerability in
Microsoft Internet Explorer 9. During a method call, the `this` object can be
freed and then continues to be used by the code that implements the method.
It appears that there is little to no time for an attacker to attempt to
control the contents of the freed memory before the re-use, which would allow
remote code execution.

Known affected software and attack vectors
------------------------------------------
* **Microsoft Internet Explorer 9**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling JavaScript should prevent an attacker from triggering the
  vulnerable code path.

