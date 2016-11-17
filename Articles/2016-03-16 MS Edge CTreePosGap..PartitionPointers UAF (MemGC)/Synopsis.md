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

[MemGC]: https://securityintelligence.com/memgc-use-after-free-exploit-mitigation-in-edge-and-ie-on-windows-10/
[Triaging the exploitability of IE/Edge crashes]: https://blogs.technet.microsoft.com/srd/2016/01/12/triaging-the-exploitability-of-ieedge-crashes/
[BugId]: https://github.com/SkyLined/BugId
[EdgeDbg]: https://github.com/SkyLined/EdgeDbg
