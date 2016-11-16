Microsoft Internet Explorer 11 MSHTML CMapElement::Notify use-after-free
========================================================================
([MS15-009][], [CVE-2015-0040][])

[MS15-009]: https://technet.microsoft.com/library/security/MS15-009
[CVE-2015-0040]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-0040

Synopsis
--------
A specially crafted web-page can cause MSIE 11 to interrupt the handling of one
`readystatechange` event with another. This interrupts a call to one of the
various `C<ElementName>Element::Notify` functions to make another such call and
at least one of these functions is [non-reentrant][]. This can have various
repercussions, e.g. when an attacker triggers this vulnerability using a
`CMapElement` object, a reference to that object can be stored in a linked list
and the object itself can be freed. This pointer can later be re-used to cause
a classic use-after-free issue.

[non-reentrant]: https://en.wikipedia.org/wiki/Reentrancy_(computing)

Known affected versions, attack vectors and mitigations
-----------------------
* **Microsoft Internet Explorer 11**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling JavaScript should prevent an attacker from triggering
  the vulnerable code path.

Description
-----------
When a `DocumentFragment` containing an applet element is added to the DOM, all
elements receive a notification that they are removed from the `CMarkup`.
Next, they are added to the DOM and receive notification of being added to
another `CMarkup`. When the applet is added, a `CObjectElement` is created and
added to the `CMarkup`. This causes a `readystatechange` event to fire, which
interrupts the current code. During this `readystatechange` event, the DOM may
be modified, which causes further notifications to fire. However, elements in
the `DocumentFragment` that come after the applet element have already received
a notification that they have been remove from one `CMarkup`, but not that they
have been added to the new one. Thus, these elements may receive another
notification of removal, followed by two notifications of being added to a
`CMarkup`.