Google Chrome Accessibility blink::Node corruption
==================================================
(The fix and CVE number for this issue are unknown)

Synopsis
--------
A specially crafted web-page can trigger an unknown memory corruption
vulnerability in Google Chrome Accessibility code. An attacker can cause code
to attempt to execute a method of an object using a vftable, when the pointer
to that object is not valid, or the object is not of the expected type.
Successful exploitation can lead to arbitrary code execution.

Known affected software and attack vectors
------------------------------------------
* **Chrome 48.0.2540.0 dev-m on Windows** (does not seem to be OS specific)

  An attacker would need to get a target user to open a specially crafted
  webpage. Renderer accessibility must be enabled through the 
  "--force-renderer-accessibility" command-line option. Disabling JavaScript
  will not prevent an attacker from triggering the vulnerable code path.
