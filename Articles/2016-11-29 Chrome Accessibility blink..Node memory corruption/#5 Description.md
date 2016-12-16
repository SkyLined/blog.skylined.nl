This causes an access violation when `blink::isDisabledFormControl` attempts to
call the `isDisabledFormControl` method on the corrupt `blink::Node` instance.

The second code path calls `blink::Element::fastGetAttribute` with the corrupt
`blink::Node` instance as an argument from `blink::AXObject::getAttribute`:
