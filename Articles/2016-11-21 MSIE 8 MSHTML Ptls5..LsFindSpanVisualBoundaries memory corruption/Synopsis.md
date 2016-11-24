(The fix and CVE number for this bug are unknown)

A specially crafted web-page can cause an unknown type of memory corruption in
Microsoft Internet Explorer 8. This vulnerability can cause the
`Ptls5::LsFindSpanVisualBoundaries` method (or other methods called by it) to
access arbitrary memory.