([MS15-009][], [CVE-2015-0040][])

[MS15-009]: https://technet.microsoft.com/library/security/MS15-009
[CVE-2015-0040]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-0040

A specially crafted webpage can cause MSIE 11 to interrupt the handling of one
`readystatechange` event with another. This causes a call to one of the various
`C<ElementName>Element::Notify` functions, at least one of which is
[non-reentrant][]. This can have various repercussions, e.g. when an attacker
triggers this vulnerability using a `CMapElement` object, a reference to that
object can be stored in a linked list and the object itself can be freed. This
pointer can later be re-used to cause a classic use-after-free issue.

[non-reentrant]: https://en.wikipedia.org/wiki/Reentrancy_(computing)
