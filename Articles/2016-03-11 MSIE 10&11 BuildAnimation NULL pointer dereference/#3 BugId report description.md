Example BugId reports
---------------------
Below are two BugId reports. The first was created by triggering the
`BuildAnimation` issue in Microsoft Internet Explorer 11, which has *CFG*
enabled. As you can see in this report the exception happened in the
`ntdll.dll!LdrpValidateUserCallTarget` function, but BugId knows that this
function is not the root cause and has ignored it when determining which
function calls on the stack are relevant to the bug. The end result is that
a read access violation is reported at an "arbitrary" address.

The second report was created by triggering the same issue in Internet Explorer
10, which does *not* have *CFG* enabled. In this case an access violation while
attempting to execute memory at address 0 is reported.

I have considered adding code to BugId that will detect this situation and
report it as a special case of a NULL pointer access violation (`AVE:NULL`),
but I suspect that this will be very fragile. Since I have not encountered any
other instances of this issue so far, I don't believe if is worth the effort.