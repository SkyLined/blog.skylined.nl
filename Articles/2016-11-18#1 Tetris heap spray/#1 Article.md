Tetris heap spraying: spraying the heap on a budget
===================================================

Over the past decade, heap sprays have become almost synonymous with exploits
in web-browsers (but let's not forget that they can be used in exploits against
many other kinds of software). A great many people have published excellent
descriptions of how they work, and produced various implementations with
different benefits and draw-backs that fit almost any need. I won't bother
describing the basic concept and the various implementations in more detail
here. If you'd like to freshen up on the subject, I suggest you read the
[Wikipedia page on heap spraying][] and its the external links and references.

[Wikipedia page on heap spraying]: https://en.wikipedia.org/wiki/Heap_spraying

After having developed my first practical implementation of a heap spray for
Microsoft Internet Explorer about ten years ago, I found that the amount of
memory needed in some cases was too much for a realistic attack scenario. At
that time, not many machines had the multiple Gigabytes of RAM needed to spray
to some of the higher addresses I was forced to use for various reasons. Sure,
the OS could swap memory to disk, but since disk storage was not very fast, it
caused the exploit to slow to a crawl if it did not cause an out-of-memory
crash.

*Side note: did you know you could make a pretty good estimate of the amount
of RAM installed on a system by timing large memory allocations? Simply have
some Javascript allocated several megabytes of RAM over and over and when it
suddenly slows down, that means the OS is swapping memory to disk. You can then
see how much you have allocated, make some assumptions about how much RAM was
used by other applications and the OS and calculate the amount of RAM installed
pretty accurately in my experience...*

Anyway, I needed a new kind of heap spray that did not allocate as much RAM as
traditional heap sprays do. So, I developed a heap spray that uses
significantly less RAM than a traditional heap spray does. In practice it uses
about 33% less in most cases, but theoretically it could be less in certain
situations.

Tetris heap-spray
-----------------
To me the best way to describe this kind of heap spray is with an analogy to
the game Tetris: what if the game rules were reversed and you get points for
getting a block at the top of the screen as fast as possible? i.e. you get more
points if you use less blocks. The best way to do this is to stack them such
that you leave gaps to the sides as large as possible.

Alternating frees
-----------------
Similarly, this kind of heap-spray tries to leave large gaps between memory
blocks that are not immediately relevant; e.g. they are there to block lower
portions of the address space from being used by future allocations, in order
to get blocks that are allocated later at an address you want or need. The key
to this is that even if there are large freed address ranges available between
these allocated blocks, a block that is larger than all of these freed ranges
cannot be stored in them and needs to be allocated after them, at a higher
address. So, if, on a fresh heap, you were to repeatedly allocate memory blocks
of 1 bytes, then free all the even blocks while keeping the odd blocks
allocated, and then allocate a memory block of 2 bytes, that last block will
be stored *after* all the 1 byte blocks. Because of the fragmentation we
deliberately caused, these 2 bytes cannot be stored at a lower address, even
though there is a lot more than 2 bytes available between the 1 byte blocks.
