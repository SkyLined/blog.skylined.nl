Software components such as memory managers often use [magic values][] to mark
memory as having a certain state. These magic values have often (but not always)
been chosen to coincide with addresses that fall outside of the user-land
address space on 32-bit versions of the Operating System. This ensures that if
a vulnerability in the software allows an attacker to get the code to use such
a value as a pointer, this results in an access violation. However, on 64-bit
architectures the entire 32-bit address space can be used for user-land
allocations, allowing an attacker to allocate memory at all the addresses
commonly used as magic values and exploit such a vulnerability.

[magic values]: https://en.wikipedia.org/wiki/Magic_number_%28programming%29#Magic_debug_values