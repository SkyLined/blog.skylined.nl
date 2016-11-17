Microsoft Internet Explorer 11 iertutil LCIEGetTypedComponentFromThread use-after-free
==========================================================================================
(The fix and CVE number for this issue are unknown)

Synopsis
--------
A specially crafted web-page can cause the iertutil.dll module of Microsoft
Internet Explorer 11 to free some memory while it still holds a reference to
this memory. The module can be made to use this reference after the memory has
been freed. Unliky many use-after-free bugs in MSIE, **this issue, and
apparently all code in this module, is not mitigated by MemGC**. This issue
appears to have been addressed in July 2016, as it failed to reproduce after
the July security updates were installed.


Known affected software, attack vectors and mitigation
------------------------------------------------------
+ **Microsoft Internet Explorer 11**

  An attacker would need to get a target user to open a specially crafted
  webpage and allow the webpage to open a popup.
  The target user may need to run MSIE in the non-default single process mode.
  Disabling JavaScript should prevent an attacker from triggering the
  vulnerable code path.
