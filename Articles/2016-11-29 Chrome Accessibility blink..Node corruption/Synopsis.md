(The fix and CVE number for this issue are unknown)

A specially crafted web-page can trigger an unknown memory corruption
vulnerability in Google Chrome Accessibility code. An attacker can cause code
to attempt to execute a method of an object using a vftable, when the pointer
to that object is not valid, or the object is not of the expected type.
Successful exploitation can lead to arbitrary code execution.
