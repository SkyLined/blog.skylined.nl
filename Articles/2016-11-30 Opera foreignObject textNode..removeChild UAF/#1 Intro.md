Opera foreignObject textNode::removeChild use-after-free
========================================================
(The fix and CVE number for this issue are unknown)

Synopsis
--------
A specially crafted web-page can trigger a use-after-free vulnerability in
Opera. This vulnerability was found a very long time ago, back when I did not
keep organized records of my analysis, so unfortunately, I cannot speculate on
the potential impact or exploitability.

Known affected software and attack vectors
------------------------------------------
* **Opera 12**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling JavaScript should prevent an attacker from triggering the
  vulnerable code path.
