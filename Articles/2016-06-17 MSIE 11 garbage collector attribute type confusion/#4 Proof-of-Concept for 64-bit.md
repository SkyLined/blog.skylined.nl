Proof-of-Concept for 64-bits MSIE
------------------------
On 64-bit systems, this element/attribute combination is not very useful as
none of the upper 32-bits of the address can be controlled. Various attributes
will take a limited set of valid string as their value, such as the `method`
attribute of the `FORM` element, which can be set to "get" or "post". The BSTR
character data of such strings end up being used as the pointer, allowing an
attacker to provide a pointer of the form `0x00??00??00??00??`, but the number of
valid string values is very limited, so the number of possible pointer values
is very limited too. The chances of any of these values being useful are very,
very slim.

There are however element/attribute combinations that require a number which is
stored as a BSTR, e.g. the `size` attribute of the `HR` element. Setting this
attribute to 0 will cause the code to allocate a BSTR containing "0", setting
it to 3333 will cause it to allocate a BSTR containing "3333". This BSTR may
get allocated from the heap or "allocated" from the OLEAUT32 cache, heap-feng-
shui style. "3333" results in the pointer address `0x0033003300330033`, but "0"
results in the address `0x????????00000030`, where `??` can be data taken from
a reused BSTR that was "allocated" from the cache. This should allow an attacker
full control over the upper 32 bits of the pointer address, as well as some
control over the lower 4 bits. If an attacker can do a heap spray covering an
address that follows this format, and determine the address at which the heap
spray is located, full control over execution flow may be possible. Again, the
function call is protected by Control Flow Guard, so additional tricks are
needed to bypass this in order to execute arbitrary code. The provided repro
results in an access violation around address `0x414200000030`.

