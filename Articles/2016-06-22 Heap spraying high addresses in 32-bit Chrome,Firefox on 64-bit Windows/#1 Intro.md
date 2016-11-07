Heap spraying high addresses in 32-bit Chrome/Firefox on 64-bit Windows
=======================================================================

In my [previous blog post][] I wrote about [magic values] that were originally
chosen to help mitigate exploitation of memory corruption flaws and how this
mitigation could potentially be bypassed on 64-bit Operating Systems,
specifically Windows. In this blog post, I will explain how to create a [heap
spray] (of sorts) that can be used to allocate memory in the relevant address
space range and fill it with arbitrary data for use in exploiting a
vulnerability that involves referencing a magic value pointer.

The relevant address space range in most cases is between `0xC0000000` and
`0xF0000000`, so the Proof-of-Concept code will attempt to allocate memory
at the address `0xDEADBEEF` and store the `DWORD` value `0xBADC0DED` at this
address.

Using typed arrays for heap sprays
----------------------------------
Most browser heap sprays are based on the code I developed for an exploit in
2004\. For reasons I won't get into here, this heap spray repeatedly
concatenated a string to itself to exponentially grow the size of this string.
A number of copies were than made of this string in order to fill the desired
amount of memory. 

Since 2004, a lot has changed and a lot of features have been added to modern
browsers that can be used to spray the heap faster, easier and with better
control over its content. One such feature is [typed arrays]. As explained on
the MDN page, these are similar to "normal" Javascript arrays, except that they
are never sparse. Data stored in typed arrays is stored in an ArrayBuffer,
which is backed up by one consecutive block of memory in which the values are
stored. By creating a typed array, one can therefore allocate one consecutive
block of memory of a controlled size, and the contents of the memory can be
controlled by setting array elements to specific values.

Spraying the heap in the right place
------------------------------------
Heap blocks are normally allocated at the lowest possible address. If you
allocate two blocks on an empty, unused heap, these blocks should normally be
sequential: the second block will get allocated immediately after the first in
memory and therefore be located at a higher address. After the heap has been
used for some time and blocks have been freed, the heap can become fragmented.
This means that there are unused (freed) areas in between the areas that are
still in use. When you allocate a new block from the heap, one of these freed
areas can be reallocated, so two sequential allocations may no longer end up
next to each other and the second allocation may end up before the first.
([heap feng shui] can be used to get around this in some cases, but I digress).

Fortunately, these gaps in the heap tend to be a lot smaller than the large
blocks used in a heap spray, so fragmentation can be ignore in this case: when
asked to allocate a very large block of memory, it will almost certainly get
allocated after everything else already allocated on the heap.

Because 32-bit applications have all their modules (dll) loaded at addresses
close to, but below `0x80000000`, there is only so much space available for a
large allocation immediately after the heap and before these modules. If you
attempt to allocate a block that is larger than the gap between the heap and
the modules, there is no place this allocation can go but after the modules.

So, by allocating sufficiently large memory blocks, we can all but guarantee
that these blocks will be allocated at addresses above `0x80000000`. And since
there is nothing there to fragment their allocation, they should end up
sequential, allowing us to reliably allocate memory in the region around
`0xDEADBEEF`.

The Proof-of-Concept
--------------------
Unlike Firefox, Chrome has an artificial limit on the number of bytes you can
allocate through a typed array. This means that on Firefox, you can simply
allocate one large block that starts at `0x80000000` and contains all memory up
to and including `0xDEADBEEF`. On Chrome, you will need to allocate two blocks,
one to fill the lower part of memory and one that contains the target address.
After allocating the(se) block(s), setting the value at address `0xDEADBEEF` to
to `0xBADC0DED` is as simple as setting a few values in the array at the right
index. Because the base address of the memory block depends on the allocator
used by the browser, it is deterministic and the right index can be guessed
with very high reliability. The code below shows how this is done. After
loading this web-page you can inspect the memory at `0xDEADBEEF` (in Chrome
make sure you have the render process) to make sure it contains the value
`0xBADC0DED`.

[previous blog post]: http://blog.skylined.nl/20160621001.html
[magic values]: https://en.wikipedia.org/wiki/Magic_number_(programming)
[heap spray]: https://en.wikipedia.org/wiki/Heap_spraying
[typed arrays]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
[heap feng shui]: https://en.wikipedia.org/wiki/Heap_feng_shui