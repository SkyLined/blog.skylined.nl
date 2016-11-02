Magic values in 32-bit processes on 64-bit OS-es
================================================

Software components such as memory managers often use [magic values][] to mark
memory as having a certain state. These magic values can be used during
debugging to determine the state of the memory, and have often (but not always)
been chosen to coincide with addresses that fall outside of the user-land
address space on 32-bit versions of the Operating System. This can help detect
vulnerabilities by causing an access violation when such magic value is used as
a pointer as well as mitigate exploitation of such vulnerabilities by making it
impossible to have this "poisoned" pointer refer allocated memory under the
attacker's control.

For instance, Microsoft's C++ debugging runtime library initializes stack
memory to `0xCCCCCCCC`. When an uninitialized object pointer is used to read
the value of a property or call a method of the object, this reliably causes an
access violation on 32-bit versions of Microsoft Windows and prevents an easy
path to exploitation.

The [Wikipedia article][] on magic values has a list containing some of the
values and when they are used. You will notice how all of the values used on
Windows have their high bit set (i.e. >= 0x80000000). As explain earlier, this
is because on 32-bit versions of Windows these addresses cannot be used to
allocate memory in user-land by default. Windows does have a [/3GB][] switch
that allows you to change the upper limit for user-land memory to 0xC0000000,
but AFAIK this is not used very often and still excludes a large number of
magic values.

Magic values on 64-bit OS-es
----------------------------
On 64-bit architectures, there is no need to reserve part of the 32-bit address
space for kernel memory. Consequently, a 32-bit applications running on 64-bit
versions of Windows is able to allocate memory in almost the entire 32-bit
address range. This allows 32-bit applications to allocate more memory, 
including at all addresses that these magic values can reference. Ever since
their introduction over 10 years ago, Javascript heap-sprays in web-browsers in
particular offers an attacker the ability to finely control memory allocations
and their content for use in exploits.

Proof-of-Concept
----------------
Last year I stumbled upon two different bugs in two different web browsers
where a magic value was used to mark memory, and subsequently used as a
pointer. Using Javascript, it was possible to allocate memory at the address
based on the magic values the web browsers were using and store information at
this location to exploit both of these two vulnerabilities. These issues have
both been address, so I can discuss them in more detail here.

[magic values]: https://en.wikipedia.org/wiki/Magic_number_%28programming%29#Magic_debug_values
[Wikipedia article]: https://en.wikipedia.org/wiki/Magic_number_%28programming%29#Magic_debug_values
[/3GB]: https://technet.microsoft.com/en-us/library/bb124810%28v=exchg.65%29.aspx

