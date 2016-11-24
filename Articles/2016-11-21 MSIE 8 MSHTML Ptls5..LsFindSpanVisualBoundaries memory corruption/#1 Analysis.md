MSIE8 MSHTML Ptls5::LsFindSpanVisualBoundaries memory corruption
================================================================
(The fix and CVE number for this bug are unknown)

Synopsis
--------
A specially crafted web-page can cause an unknown type of memory corruption in
Microsoft Internet Explorer 8. This vulnerability can cause the
`Ptls5::LsFindSpanVisualBoundaries` method (or other methods called by it) to
access arbitrary memory.

Known affected software, attack vectors and mitigations
-------------------------------------------------------
* **Microsoft Internet Explorer 8**

  An attacker would need to get a target user to open a specially crafted
  web-page. JavaScript is not necessarily required to trigger the issue.

Description
-----------
The memory corruption causes the `Ptls5::LsFindSpanVisualBoundaries` method to
access data at seemingly random addresses. However, these addresses appear to
always be in the same range as valid heap addresses, even if they are often not
DWORD aligned. The reason for the memory corruption is not immediately obvious.
