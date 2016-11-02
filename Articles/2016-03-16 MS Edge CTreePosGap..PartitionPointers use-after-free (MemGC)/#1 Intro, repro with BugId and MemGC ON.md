MS Edge CTreePosGap::PartitionPointers use-after-free (MemGC)
=============================================================

A specially crafted Javascript inside an HTML page can trigger a use-after-free
bug in the `CTreePosGap::PartitionPointers` function of edgehtml.dll in
Microsoft Edge. This use-after-free bug is mitigated by [MemGC][] by default:
with MemGC enabled the memory is never actually freed. This mitigation is
considered sufficient to make this a non-security issue as explained by
Microsoft SWIAT in their blog post [Triaging the exploitability of IE/Edge
crashes][].

Since this is not considered a security issue, I have the opportunity to share
details about the issue with you before the issue has been fixed. And since
Microsoft are unlikely to provide a fix for this issue on short notice, you
should be able to reproduce this issue for some time after publication of this
post. I will try to explain how I analyzed this issue using [BugId][] and
[EdgeDbg][], so that you can reproduce what I did and see for yourself.

Known affected software, attack vectors and mitigations
-------------------------------------------------------
+ **Microsoft Edge 11.0.10240.16384-16724** (earlier versions may also be
  affected)

  An attacker would need to get a target user to open a specially crafted
  web page. Disabling Javascript should prevent an attacker from triggering the
  vulnerable code path.

Repro
-----
The following html can be used to reproduce this issue:
```Javascript
<script>
  onload = function() {
    x.appendChild(h)
    x.offsetTop;
    x.insertBefore(h,h);
  };
</script>
<br id=h>
<select id=x>
x
```
I've attached the repro file at the end of this post for you to download as
well.

Prerequisites
-------------
I normally start a simple web server listening on port 28876 on the local
computer that serves the repro. That way I can load it by opening the URL
`http://%COMPUTERNAME%:28876` in my browser. The rest of this article assumes
you have done the same.

I will be using two tools that I created myself: [BugId][] to automatically
analyze crashes and [EdgeDbg][] to start Microsoft Edge on demand and have it
open the URL that serves the repro.

In order to reliably reproduce use-after-free issues, you will need to enable
[Page Heap][] for Microsoft Edge using gflags.exe. I won't explain the
details of page heap and gflags.exe here - there are plenty of pages that do
so already available on the internet. Instead, let's use the [PageHeap.cmd][]
script provided with [BugId][] to enable page heap with the right settings
required for running [BugId][] reliably. The first argument to [PageHeap.cmd][]
is the file name of the binary that you want to enable Page Heap for. The
second argument is either "ON" or "OFF". [PageHeap.cmd][] must be run as an
administrator because it will run gflags.exe which requires administrative
privileges to work. To enable Page Heap in all of Microsoft Edge, there are
four binaries that you will want to enable Page Heap for. The following four
commands, run in an administrator command prompt, will do this:
```
PageHeap.cmd MicrosoftEdge.exe ON
PageHeap.cmd MicrosoftEdgeCP.exe ON
PageHeap.cmd browser_broker.exe ON
PageHeap.cmd RuntimeBroker.exe ON
```
Once you have enabled Page Heap, we're ready to run Microsoft Edge using
[BugId][].

Detection and analysis using BugId
----------------------------------
Let's start with MemGC still enabled to see if the issue is indeed mitigated by
MemGC. You can use the [EdgeBugId.cmd][] script that comes with [EdgeDbg][] to
run Edge in [BugId][]. The first argument to [EdgeBugId.cmd][] is the URL that
Edge should load once started. This conveniently defaults to
`http://%COMPUTERNAME%:28876`, so you only need to run the following command to
start Edge in [BugId][] and load the repro:
```
EdgeBugId.cmd
```
Once Edge has started and loaded the repro, [BugId][] will detect an access
violation exception and analyze it. After analysis it will output information
about the crash and save a HTML report in the current working directory. I've
attached the [BugId][] report for this crash below.

[MemGC]: https://securityintelligence.com/memgc-use-after-free-exploit-mitigation-in-edge-and-ie-on-windows-10/
[Triaging the exploitability of IE/Edge crashes]: https://blogs.technet.microsoft.com/srd/2016/01/12/triaging-the-exploitability-of-ieedge-crashes/
[BugId]: https://github.com/SkyLined/BugId
[EdgeDbg]: https://github.com/SkyLined/EdgeDbg
[Page Heap]: https://blogs.msdn.microsoft.com/webdav_101/2010/06/22/detecting-heap-corruption-using-gflags-and-dumps/
[PageHeap.cmd]: https://github.com/SkyLined/BugId/blob/master/PageHeap.cmd
[EdgeBugId.cmd]: https://github.com/SkyLined/EdgeDbg/blob/master/EdgeBugId.cmd
