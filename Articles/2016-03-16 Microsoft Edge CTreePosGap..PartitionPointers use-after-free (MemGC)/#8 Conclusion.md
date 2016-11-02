Conclusion
----------
We now know the following about this issue:
* A block of 0xe8 bytes of memory gets allocated when Edge attempts to
  determine the value of `x.offsetTop`.
* This block is freed and reused when Edge executes `x.insertBefore(h,h)`.
* Since the free and the (first) re-use happen during execution of one
  Javascript method, there does not appear to be an obvious way to reallocate
  the freed memory and fill it with data of our choosing before the re-use.

The fact that we cannot execute any Javascript between the free and reuse makes
this very hard, if not impossible to exploit in practise. This is why I've not
attempted to do so here. But in case you want to take a shot at it, here are
some things you could try:

* DOM events can allow you to execute Javascript *while* a DOM method is being
  executed. However, when I tested this in this case, the event handlers were
  fired *after* the re-use.
* There may be ways to reallocate the freed memory from another thread, but
  I am not aware of a practical way to do this at this point.
* It may be that the memory can be re-used again later, which would allow
  Javascript to be executed in the mean time. To find out, you would have to
  reverse engineer the code to determine if the pointer to the freed memory is
  discarded or not and how one might get the code to reuse it later.

If you decide to try and exploit this issue, do let me know how far you get!
