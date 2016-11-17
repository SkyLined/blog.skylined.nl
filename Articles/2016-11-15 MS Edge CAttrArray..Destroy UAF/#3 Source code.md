The code
--------
Below you can find an annotated disassembly for the `CAttrArray::Destroy`
function, which calls `CAttrArray::Set` (in which the memory is freed) before
looping and re-using the memory. This loop shows there is very little time
between the two events in which to reallocate the memory and attempt to control
its contents. There also does not appear to be much this function can be made
to do if the memory could be controlled.

