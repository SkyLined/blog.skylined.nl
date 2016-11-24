Rinse, repeat
-------------
One might think at this point that this does not actually allow you to spray to
a higher address without having to allocate almost the same amount of memory as
a traditional heap spray first: after all, in our example we did allocate
a lot of memory before we got to free most of it. However, this problem goes
away once you start "stacking" these kinds of Swiss-cheese heap-sprays: first
you do this for memory blocks of size `A` and `B`, where `A` is large and
`B` small up to about half your target address. You then free all the `A`
blocks and then do it again for blocks of size `C` and `A+1`, where `C` is
significantly larger than `A`. You do this up to the point where if you
allocate another `C` block, you cover your target address. At that point, you
free all the `C` blocks before allocating a block of `C+1` bytes.

After the step using the `A` and `B` blocks, you have allocated about half the
memory needed for a normal heap spray up to the target address. You then free
almost all the memory you have allocated so far, because the `A` blocks are
much larger than the `B` blocks. The larger the difference between these two,
the closer your total allocated memory goes back to 0 after this step.

During the next step you only need to cover the second half of the distance to
your target, so you should not need to allocate more than half of a normal heap
spray again. When you are done allocating, you have again used about half the
memory of a normal heap spray, but you are now very near to allocating a block
at the target address. You again free a large part of the memory you allocated,
before allocating nowhere near enough to increase the amount of memory you have
allocated beyond half of a normal heap spray. This then does allow us to spray
the heap without having to have all memory in between the start address and the
target address allocated at any point in time.
