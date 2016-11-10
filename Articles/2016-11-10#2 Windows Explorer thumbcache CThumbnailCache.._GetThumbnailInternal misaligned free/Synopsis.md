(This issue is currently not fixed)

When handling long path names on network shares mapped to a drive,
thumbcache.dll loaded in explorer.exe can be made to free a memory block with a
pointer that does not actually point to the start of the memory block, but
rather to the start plus a static offset. The offset is such that the pointer
is no longer aligned correctly, which is detected by the heap manager. The heap
manager then causes explorer.exe to terminate.
