MSIE 11 MSHTML CView::CalculateImageImmunity UAF
=====================================

(The fix and CVE number for this bug are not known)

Synopsis
--------
Setting the `listStyleImage` property of an Element object causes MSIE 11 to
allocate 0x4C bytes for an "image context" structure, which contains a
reference to the document object as well as a reference to the same `CMarkup`
object as the document. When the element is removed from the document/document
fragment, this image context is freed on the next "draw". However, the code
continues to use the freed context almost immediately after it is freed.

Known affected versions, attack vectors and mitigations
-----------------------
+ **Microsoft Internet Explorer 11**

  An attacker would need to get a target user to open a specially crafted
  webpage. As far as can be determined, disabling JavaScript should prevent an
  attacker from triggering the vulnerable code path.
