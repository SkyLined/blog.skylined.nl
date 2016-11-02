Finding the exact point where the memory is freed
-------------------------------------------------
We know from the [BugId][] analysis that the memory will be freed during a call
to `CTreeNode::NodeRelease`. Let's see how many calls there are from this point
until the access violation. If there is only one, that call should be the one
that frees the memory. So, let's restart Edge, and put the breakpoint on
`CSpliceTreeEngine::Init` like before and run Edge until we hit this
breakpoint. We can then set a breakpoint on `CTreeNode::NodeRelease` to detect
each call:
```
1:050> g
Breakpoint 0 hit
EDGEHTML!CSpliceTreeEngine::Init:
1:050> bp EDGEHTML!CTreeNode::NodeRelease
1:050> g
Breakpoint 1 hit
EDGEHTML!CTreeNode::NodeRelease:
1:050> g
(fa8.e48): Access violation - code c0000005 (first chance)
First chance exceptions are reported before any exception handling.
This exception may be expected and handled.
EDGEHTML!CTreePosGap::PartitionPointers+0x68:
1:050>
```
So there is only one call to `CTreeNode::NodeRelease`, which makes it easy for
us to check if that call is the one that frees the memory.

Let's restart Edge again and run right up to the `CTreeNode::NodeRelease`
breakpoint. A convenient way to do this is to execute this command in WinDbg
once you've broken into the debugger during the `alert()`:
```
|1s; bp EDGEHTML!CSpliceTreeEngine::Init "bp EDGEHTML!CTreeNode::NodeRelease; g"; g
```
It does everything we've done previously in one go; after you have execute the
command, Edge will be running again so you can dismiss the `alert()` and hit the
breakpoint in `CTreeNode::NodeRelease`.

To find out if any memory is freed during this call, and whether it is the same
memory that will be re-used, we will want to put a breakpoint on
`ntdll!RtlFreeHeap`. However, you may find that it gets called *a lot* from
other threads as well, which is terribly confusing. Luckily, you can avoid this
problem by setting the breakpoint on `ntdll!RtlFreeHeap` only for the current
thread before resuming Edge:
```
Breakpoint 1 hit
EDGEHTML!CTreeNode::NodeRelease:
1:050> ~. bp ntdll!RtlFreeHeap
1:050> g
Breakpoint 2 hit
ntdll!RtlFreeHeap:
1:050>
```
[The documentation for RtlFreeHeap][] informs us that it takes three arguments,
the third of which contains a pointer to the memory to be freed. As I am
debugging an x64 version of Edge and the [x64 calling convention][] says the
third argument is passed using the r8 register, we can ask Page Heap for
information about the memory being freed:
```
1:050> !heap -p -a @r8
    address 00000010810bdf10 found in
    _DPH_HEAP_ROOT @ 1081001000
    in busy allocation (  DPH_HEAP_BLOCK:         UserAddr         UserSize -         VirtAddr         VirtSize)
                              1081002000:       10810bdf10               e8 -       10810bd000             2000
    00007ffa23bac1fb ntdll!RtlDebugAllocateHeap+0x0000000000000047
    00007ffa23b66582 ntdll!RtlpAllocateHeap+0x0000000000075a22
    00007ffa23aeef52 ntdll!RtlpAllocateHeapInternal+0x0000000000000292
    00007ffa1094f98e EDGEHTML!MemoryProtection::HeapAllocClear<1>+0x000000000032fa7e
    00007ffa1061feca EDGEHTML!_MemIsolatedAllocClear<1>+0x000000000000001a
    00007ffa1064aa82 EDGEHTML!Tree::TreeWriter::CreateElementNode+0x000000000000002a
***snipped*for*brevity***
    00007ffa10691856 EDGEHTML!CElement::get_offsetTop+0x0000000000000056
    00007ffa10691e45 EDGEHTML!CFastDOM::CHTMLElement::Trampoline_Get_offsetTop+0x0000000000000065
***snipped*for*brevity***
1:050>
```
This tells us that the memory about to be freed is a block of 0xe8 bytes that
was allocated during a call to the `Tree::TreeWriter::CreateElementNode`
function, which happened during a call to `CElement::get_offsetTop`. We can
safely assume this corresponds to `x.offsetTop;` in the repro. You can check
if this is true in the same way we're checking where the free happens, but I'll
leave that as an exercises to the reader.

Let's resume Edge so we hit the access violation and find out if this memory
being freed is the memory being re-used. But we should clear the breakpoint
on `ntdll!RtlFreeHeap` first, as it gets called a lot and we're not interested
in any more calls.
```
1:050> bc 2
1:050> g
(c60.e60): Access violation - code c0000005 (first chance)
First chance exceptions are reported before any exception handling.
This exception may be expected and handled.
EDGEHTML!CTreePosGap::PartitionPointers+0x68:
1:050> .exr -1
ExceptionAddress: 00007ffa105e3548 (EDGEHTML!CTreePosGap::PartitionPointers+0x0000000000000068)
   ExceptionCode: c0000005 (Access violation)
  ExceptionFlags: 00000000
NumberParameters: 2
   Parameter[0]: 0000000000000000
   Parameter[1]: 00000010810bdf50
Attempt to read from address 00000010810bdf50
1:050>
```
The address 0x10810bdf50 falls inside the 0xe8 byte memory block at address
0x10810bdf10 we saw getting freed earlier. This  proves that the call to
`CTreeNode::NodeRelease` we put a breakpoint on is the one that frees the
memory that gets re-used later.

[BugId]: https://github.com/SkyLined/BugId
[The documentation for RtlFreeHeap]: https://msdn.microsoft.com/en-us/library/windows/hardware/ff552276%28v=vs.85%29.aspx
[x64 calling convention]: https://msdn.microsoft.com/en-us/library/windows/hardware/ff561499%28v=vs.85%29.aspx
