And there you have it: in the above example, we never allocated more than
101,001 bytes, but the final memory block was allocated at an offset of 101,999
from the start and ends at address 201,999. If you were targeting the address
200,000, you used only 200,000/101,001 the amount of RAM a normal heap spray
would require.

Conclusion
----------
The amount of RAM installed in most modern desktop and server systems is not as
much of a limit to a successful exploit using a heap spray as it was 10 years
ago. However, many phones and Internet-of-Things devices still have limited
amounts of RAM. Also, the widespread use of 64-bit applications means that
32-bit integer math mistakes can result in out-of-bounds memory access at
offsets several Gigabytes from the actual memory allocation. In such
situations, the effectiveness of a heap-spray can still be impacted by
available RAM.

As shown above, there are practical ways of implementing a heap spray that uses
significantly less memory to reach a given address range than a traditional
heap spray would, thus improving the speed and reliability of an exploit that
uses it.

This technique does not require anything other than the ability to selectively
free memory blocks used during the heap spray. It should therefore be possible
to apply this technique to any existing heap spray implementations, providing
they can free memory during the process of spraying the heap.

I've tried to come up with a generic algorithm for getting to any address with
the least amount of RAM, but unfortunately it seems there are many factors that
complicate things beyond the point at which I can write something generic. For
instance, the minimum page size, maximum size of a heap block, other heap
allocator quirks, uncertainty about the start address, and desired memory
range for the final block are all things that need to be taken into
consideration in such an algorithm. I'm sure some math wiz can find the optimal
allocation/free algorithm for spraying a memory range up to any given address
given a set of variables for these values - do let me know if you've worked it
out. All I can say is that I believe the theoretical maximum gain from this
technique is using about 50% less memory than a regular heap spray, but proving
that is beyond my capabilities given the time I've allotted for such
activities.
