Description
-----------
Repeatedly loading two different pages in an iframe can cause the accessibility
code to crash. This crash can happen in two different code paths, which are
similar and both end up crashing because of a corrupt `blink::Node` instance.

The first code path calls `blink::isDisabledFormControl` with the corrupt
`blink::Node` instance as an argument from `AXNodeObject::canSetFocusAttribute`:

