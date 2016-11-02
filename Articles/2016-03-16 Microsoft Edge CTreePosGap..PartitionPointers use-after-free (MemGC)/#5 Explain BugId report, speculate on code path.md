The most relevant changes from the previous report are the following:
* `Id: AVR:Free 484.a53`
  
  The part that describes the type of crash (`AVR:Free`) has changed to
  indicate the access violation happened while attempting to read from memory
  that was previously **Free**d. The part containing the stack hashes has not
  changed, so the crash is in the same code area.
* `Description: Access violation while reading freed memory at 0xE8990B3F50`
  
  The description changed to explain this is no longer a NULL pointer, but a
  use-after-free bug.
* `Security impact: Potentially exploitable security issue`
  
  [BugId][] believes this issue is a security issue (which it would be if not
  for MemGC).

If you look at the HTML report created by [BugId][] for this second crash, you
will notice that it has an extra section titled *Page heap*. In this section
you can find information reported by Page Heap about the memory at the location
where the exception happened. It shows that the memory was freed and provides
the call stack at the time it was freed. Here's part of that information:
```
Page heap report for address 0xE8990B3F50:
    address 000000e8990b3f50 found in
    _DPH_HEAP_ROOT @ e899001000
    in free-ed allocation (  DPH_HEAP_BLOCK:         VirtAddr         VirtSize)
                                 e899002208:       e8990b3000             2000
    00007ffa23bacc13 ntdll!RtlDebugFreeHeap+0x0000000000000047
    00007ffa23b653d9 ntdll!RtlpFreeHeap+0x0000000000079519
    00007ffa23aeaa16 ntdll!RtlFreeHeap+0x0000000000000106
    00007ffa1089366c EDGEHTML!MemoryProtection::HeapFree+0x00000000003736dc
    00007ffa105e5807 EDGEHTML!CTreeNode::NodeRelease+0x0000000000000057
    00007ffa10ec66d6 EDGEHTML!Tree::TreeWriter::UnwrapInternal+0x000000000000002e
    00007ffa1064939f EDGEHTML!Tree::TreeWriter::Unwrap+0x0000000000000133
    00007ffa105e38ea EDGEHTML!CTreePosGap::PartitionPointers+0x000000000000040a
    00007ffa105e320a EDGEHTML!CSpliceTreeEngine::Init+0x000000000000017a
```

At the top of this stack are a few heap manager functions, which we can ignore.
After these functions we can see that the order to free the memory came from
`CTreeNode::NodeRelease`. This function was called, through two other functions,
by `CTreePosGap::PartitionPointers`. This later function happens to be the same
function in which the re-used happened. If you compare the stack at the time of
the access violation to the stack at the time of the free, you may notice that
`CTreePosGap::PartitionPointers` is called by `CSpliceTreeEngine::Init` in both
cases, but that the offsets from which these two calls are made in
`CSpliceTreeEngine::Init` differ. The rest of the stack is exactly the same.
This appears to indicate that there is one call to `CSpliceTreeEngine::Init`,
in which there are (at least) two calls to `CTreePosGap::PartitionPointers`.
One of these two calls results in freeing some memory and a subsequent call
results in re-use of that freed memory.

Note that I am speculation at this point: it may also be that a function
higher up the stack is running a loop and that there were two calls made from
the same offset in the code, making it look the same. So we ned to check if our
assumption is true. At the same time, we can should try to find more information
on the memory being freed. [BugId][] is useful for automated detection and
analysis of crashes, but it cannot provide much information about what happened
before the crash that may have caused it or contributed to it. To gather this
information, we'll have to debug Edge manually.

[BugId]: https://github.com/SkyLined/BugId
