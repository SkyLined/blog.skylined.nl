Description
-------
Internally MSIE uses various lists of linked `CTreePos` objects to represent
the DOM tree. For HTML/SVG elements a `CTreeNode` element is created, which
embeds two `CTreePos` instances: one that contains information about the first
child of the element and one that indicates the next sibling or parent of the
element. For text nodes an object containing only one `CTreePos` is created, as
such nodes never have any children. `CTreePos` instances have various flags
set. This includes a flag that indicates if they are the first (`fTPBegin`) or
second (`fTPEnd`) `CTreePos` instance for an element, or the only instance for
a test node (`fTPText`).

The `CTreePos::Branch` method of an `CTreePos` instance embedded in a
`CTreeNode` can be used to calculate a pointer to the `CTreeNode`. It
determines if the `CTreePos` instance is the first or second in the `CTreeNode`
by looking at the `fTPBegin` flag and subtract the offset of this `CTreePos`
object in a `CTreeNode` object to calculate the address of the later. This
method assumes that the `CTreePos` instance is part of a `CTreeNode` and not a
`TextNode`. It will yield invalid results when called on the later. In a
`TextNode`, the `CTreePos` does not have the `fTPBegin` flag set, so the code
assumes this is the second `CTreePos` instance in a `CTreeNode` object and
subtracts 0x24 from its address to calculate the address of the `CTreeNode`.
Since the `CTreePos` instance is the first element in a `TextNode`, the
returned address will be 0x24 bytes before the `TextNode`, pointing to memory
that is not part of the object.

Note that this behavior is very similar to [another issue I found around the
same time][1], in that that issues also caused the code to access memory 0x24
bytes before the start of a memory region containing an object. Looking back I
believe that both issues may have had the same root cause and were fixed at the
same time.

[1]: 20161104001.html

The `CGeneratedContent::HasGeneratedSVGMarker` method walks the DOM using one
of the `CTreePos` linked lists. It looks for any descendant node of an element
that has a `CTreePos` instance with a specific flag set. If found, the
`CTreePos::Branch` method is called to find the related `CTreeNode`, without
checking if the `CTreePos` is indeed part of a `CTreeNode`. If a certain flag
is set on this `CTreeNode`, it returns true. Otherwise it continues scanning.
If nothing is found, it returns false.

The repro creates a situation where the
`CGeneratedContent::HasGeneratedSVGMarker` method is called on an SVG path
element which has a `TextNode` instance as a descendant with the right flags
set to cause it to call `CTreePos::Branch` on this `TextNode`. This leads to
type confusion/a bad cast where a pointer that points before a `TextNode` is
used as a pointer to a `CTreeNode`.

Reversed code
-------------
While reversing the relevant parts, I created the following pseudo-code to
illustrate the issue:

