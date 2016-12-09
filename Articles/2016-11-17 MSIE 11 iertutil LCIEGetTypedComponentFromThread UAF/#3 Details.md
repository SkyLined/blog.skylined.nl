Description
-----------
This looks like a pretty straightforward use-after-free, but I did not
investigate at what point in the repro the memory gets freed and when it gets
re-used, so I do not know if an attacker has any chance to force reallocation
of the freed memory before reuse.

The issue can be triggered with MemGC enabled; the object that is freed does
not appear to be protected by MemGC.

The repro requires that MSIE is run in single-process mode in order to trigger
the use-after-free. It is not known if it is possible to tweak the repro to
have MSIE take a similar code-path that leads to a use-after-free when MSIE is
not in single-process mode.

MSIE can be started in single process mode by setting the following registry
key before starting MSIE:

`HKCU\Software\Microsoft\Internet Explorer\Main\TabProcGrowth = DWORD:0`

To revert this change, remove the registry key or set the value to 1 and
restart MSIE.

Exploit
-------
A number of factors appear to be getting in the way of creating a usable
exploit for this issue:
* I did not investigate if it is possible to reproduce the issue without
  opening a pop-up to make it exploitable in the presence of a pop-up blocker.
* I did not investigate if it is possible to reproduce the issue without
  running MSIE in single-process process mode to exploit it on a system with
  default settings.
* I did not investigate if it is possible to reallocate the freed memory
  between the free and the use-after-free in order to modify control flow.
Because there are so many things that would need to be investigated in order to
write an exploit, I felt it was not cost-effective for me to do so.

Time-line
---------
* *July 2016*: This vulnerability was found through fuzzing.
* *July 2016*: This vulnerability was submitted to [ZDI][] and [iDefense][].
* *July 2016*: ZDI reports they are unable to reproduce the issue.
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[iDefense]: https://labs.idefense.com/vcpportal/

