Description
-----------
Appending one element to its parent in the DOM tree will cause MSIE to first
remove the element from its parent, which triggers a `DOMNodeRemoved` event,
and then re-append the element as the last child of its original parent. During
the `DOMNodeRemoved` event, a Javascript event handler function can modify the
DOM tree, e.g. by appending a text node to the parent element. This operation is
completed during the event and thus this text node is appended as a child
*before* the element that fired the event is. Once the event handler returns,
the element is appended. It appears that the code determines the location where
this element should be appended before firing the `DOMNodeRemoved` event
handler, and the element is thus inserted as a child of the parent *before* the
text node, rather than *after* it.

After all this is done, the DOM tree has become corrupted. This can be confirmed
by checking that the `.nextSibling` property of the text node is the text node
itself, i.e. there is *a loop in the DOM tree*.

Another effect is that reading the `.nodeValue` of the text node will cause the
code to confuse a C++ object that Trident/Edge uses to model the DOM tree with
a BSTR object that represents the text data stored in the text node. This allows
an attacker to read the data stored in this C++ object, which includes various
pointers.

Exploit
-------
A PoC exploit that reads and shows partial content of the DOM tree object was
created; it has been tested on x64 systems to show heap pointers, allowing an
attacker to undo heap ASLR.

The amount of data read can be controlled by the attacker and data beyond the
memory allocated for the C++ object can be read. An attacker may be able to use
[Heap Feng-Shui][] to position another object with interesting information in
the memory following the C++ DOM tree object and read data from this second
object as well.

[Heap Feng-Shui]:https://www.blackhat.com/presentations/bh-europe-07/Sotirov/Presentation/bh-eu-07-sotirov-apr19.pdf

Finally, setting the `nodeValue` property is possible and caused an access
violation when I attempted it. I did not analyze the code path or the reason
for the AV; but it is speculated that it may be possible to modify the C++
DOM tree object and/or other memory using this bug. This is of course an even
more interesting aspect for an attacker, as it may allow remote code execution.

No attempt to create a PoC exploit that abuses this issue to undo ASLR and/or
execute arbitrary code was made.
