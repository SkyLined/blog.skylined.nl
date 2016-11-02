Proof-of-Concept for 32-bits MSIE
------------------------
Using this scanner, I found that the `loop` attribute of the `BGSOUND`, `IMG`
and `INPUT` elements accepts 32-bit integer values in the range `0-0x7FFFFFFF`,
and that this value is used as a pointer when determining the address of the
function. Using a standard heap spray, it should be possible to create a
pointer that points to data under the attacker's control and so control 
execution flow. However, the function call is protected by Control Flow Guard,
so additional tricks are needed to bypass this in order to execute arbitrary
code. The provided repro results in an access violation around address
`0x41424344`.
