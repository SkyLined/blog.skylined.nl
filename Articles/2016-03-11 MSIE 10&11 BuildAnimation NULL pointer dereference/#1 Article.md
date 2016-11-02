MSIE 10&11 BuildAnimation NULL pointer dereference
==================================================

A specially crafted style sheet inside an HTML page can trigger a NULL pointer
dereference in Microsoft Internet Explorer 10 and 11. The pointer in question
is assumed to point to a function, and the code attempts to use it to execute
this function, which normally leads to an access violation when attempting to
execute unmapped memory at address 0. In some cases, [Control Flow Guard][]
(*CFG*) will attempt to check if the address is a valid indirect call target.
Because of the way *CFG* is implemented, this can lead to a read access
violation in unmapped memory at a seemingly arbitrary address.

Known affected software, attack vectors and mitigation
------------------------------------------------------
+ **Microsoft Internet Explorer 10 and 11**

  An attacker would need to get a target user to open a specially crafted
  webpage.

Description
-----------
This is an non-exploitable NULL pointer dereference bug but it is different from
most because it can cause a read access violation at a non-NULL address in the
`LdrpValidateUserCallTarget` and `LdrpValidateUserCallTargetBitMapCheck`
functions in `ntdll.dll`. To understand why this happens, one will first need
to understand a little bit about how *CFG* works. If you are not familiar with
the internals of *CFG*, I suggest you read the [CFG blog post by TrendMicro][]
before you continue.

When *CFG* checks are in place for an indirect call, the *CFG* code will try to
look up if the call address is valid in a bitmap. This is done by converting the
address into an offset in the bitmap. In order to reduce memory usage, memory
is allocated only for relevant parts of the bitmap. e.g. there is memory
allocated at addresses in the bitmap that map to loaded modules, but addresses
in the bitmap that map to unallocated memory are reserved, but not allocated.
Since no memory is allocated at address 0, that part of the bitmap is not
allocated, but reserved. As a result, an attempt to determine if address 0 is a
valid call target will result in an attempt by the *CFG* code to read from
reserved, but unmapped memory at offset 0 in the bitmap. This causes the
read access violation at the seemingly arbitrary address. This address is in
fact the start address of the *CFG* call target bitmap.

Notes
-----
Ever since I originally analyzed and [tweeted][] about this issue back in
August 2015, as part of what would later become the [#DailyBug][] series. I
have wanted to release more details about it in case others ran into similar
issues. But I did not consider this high priority until recently, when my
ex-colleagues at Google Project Zero [found the exact same issue][] and
reported it to Microsoft as a potential security issue. Microsoft of course
concluded that it was not a security issue after which Google disclosed details.

I hope this article helps explain why this is not a security issue as well as
help others detect when a bug is triggering similar read access violations in
*CFG* and see them for what they are: non-security NULL pointer dereference
bugs.

BugIds
------
This issue has been known to trigger crashes with the following BugIds for me:
* `AVR:Arbitrary b89.30f`
* `AVE:NULL b89.30f`
* `AVR:Arbitrary b89.c4b`
* `AVE:NULL b89.c4b`
* `AVR:Arbitrary c4b.72f`
* `AVE:NULL c4b.72f`
* `AVE:NULL b89.72d`

[Control Flow Guard]: https://msdn.microsoft.com/en-us/library/windows/desktop/mt637065%28v=vs.85%29.aspx
[CFG blog post by TrendMicro]: http://blog.trendmicro.com/trendlabs-security-intelligence/exploring-control-flow-guard-in-windows-10/
[tweeted]: https://twitter.com/berendjanwever/status/637961084742275072
[#DailyBug]: https://twitter.com/hashtag/DailyBug
[found the exact same issue]: https://code.google.com/p/google-security-research/issues/detail?id=669