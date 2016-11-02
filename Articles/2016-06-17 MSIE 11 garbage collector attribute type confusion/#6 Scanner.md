Scanner
-------
In order to determine what elements and attributes are affected, I've created
a web-page that can be used to scan for this. This scanner does the following:

1. Creates a number of elements 
2. Enumerate potential attribute names for each.
3. Attempt to set the attribute to a poison value.
4. Attempt to trigger the issue and cause an access violation at an address
   based on the poison value.

When run, the scanner will show which element/attribute combination it is
scanning in the document's title as well as show a popup for each test. Clicking
on cancel stops the popups, allowing the scanner to proceed very fast. However,
when a crash occurs, the document's title may not have been updated in a while.
You can copy the element/attribute combination into the `sStartAt` variable in
the scanner and run it again to start from that position. Now click ok at the
popups; your crash should happen relatively soon. This time the document's
title is up-to-date, so you know which element/attribute combination triggered
it. After finding a crashing combination, it can be added to the
blacklist, so the scanner can be restarted to find another combination.

The addresses in the access violations triggered by the scanner should indicate
the type and possible values of the attribute, e.g. a crash at an address based 
on `0x11`, `0x2222` or `0x44444444` indicates the value must be an integer of
type `BYTE`, `WORD` or `DWORD` size. A crash at an address of the form
`0x00??00??` (or on 64-bit systems `0x00??00??00??00??`) indicates a the value
must be a string and if the address is around `0x00330033` or
`0x0033003300330033`, it must be an integer stored as a string.
