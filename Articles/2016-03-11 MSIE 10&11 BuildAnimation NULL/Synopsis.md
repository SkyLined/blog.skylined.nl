A specially crafted style sheet inside an HTML page can trigger a NULL pointer
dereference in Microsoft Internet Explorer 10 and 11. The pointer in question
is assumed to point to a function, and the code attempts to use it to execute
this function, which normally leads to an access violation when attempting to
execute unmapped memory at address 0. In some cases, [Control Flow Guard][]
(*CFG*) will attempt to check if the address is a valid indirect call target.
Because of the way *CFG* is implemented, this can lead to a read access
violation in unmapped memory at a seemingly arbitrary address.

[Control Flow Guard]: https://msdn.microsoft.com/en-us/library/windows/desktop/mt637065%28v=vs.85%29.aspx
