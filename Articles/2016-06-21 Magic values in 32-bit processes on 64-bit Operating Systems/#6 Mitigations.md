Mitigating this type of attack
------------------------------
While working on these issues, I realized that this type of attack is easy to
mitigate by making sure the magic values point to memory that has been reserved
and marked inaccessible. That way there is no risk of an attacker allocating
the memory with data under his/her control for use in an exploit: whenever the
application would attempt to access memory using a magic value as a pointer,
this would reliably cause an access violation.

Having a memory allocation at the various addresses represented by common magic
values fragments the address space, reducing the largest possible continuous
allocation and the total amount of memory available to the application. But
most 32-bit applications do not depend on being able to allocate such large
chunks of memory for normal operations, as this is impossible on 32-bit
versions of Windows. Regardless, should one want to prevent this fragmentation,
and at the same time organize the magic values to be more coherent and
intuitive to developers, it might be useful to create an API that can be used
to generate the magic values, and have the generated values be more similar,
closer together and/or located at either edge of the free memory above address
`0x80000000`. It might make particular sense to use addresses towards the
higher end (`0xFFxxxxxx`) as adding a large enough offset to overflow the 32-bit
address would have a large chance of resulting in a NULL pointer; which would
still cause an access violation.

Such a "magic value API" could implement this mitigation during start-up of a
process, and reserve a chunk of the address space for use with magic values.
The API then allows the application to request magic values which would be
sequential addresses at the start of the reserved memory region, so that when
an offset gets added to them, the resulting address would still be very likely
to fall within in. This API would provide different 32-bit magic values, which
may not always be desired, for instance in the case of the Firefox memory
allocator, which fills memory with one specific byte, repeated over and over.
The API could therefore also allow the application to request a byte, at which
point the API would find an address consisting of the same four bytes and
reserve it before returning it. This would increase memory fragmentation, but
not by much (assuming the number of magic values needed is in the order of two
or three, as is the case with Firefox).

I have suggested adding mitigations such as this API to MSRC and they responded
in November 2015 that they forwarded it to the Windows team for their
consideration.

Obviously, this type of mitigation may be of interest to authors of security
software that aims to mitigate exploitation of 0-day: it should be possible to:
1. actively reserve memory regions referenced by such pointers to prevent
  allocation by an exploit. The additional address space fragmentation should
  not be a problem for most applications, but I have no data to back this up,
  so you might want to:
2. analyze various binaries for their use of magic values, and actively reserve
  only those memory regions referenced by such pointers. If that still causes
  problems in some applications, you could:
3. white-/black-list applications for this mitigation.
