MS Edge Tree::ANode::IsInTree use-after-free (MemGC) & Abandonment
==================================================================

A specially crafted Javascript inside an HTML page can trigger a use-after-free
bug in `Tree::ANode::IsInTree` or a breakpoint in
`Abandonment::InduceAbandonment` in Microsoft Edge. The use-after-free bug is
mitigated by [MemGC][]: if MemGC is enabled (which it is by default) the memory
is never freed. This effectively prevents exploitation of the issue. The
*Abandonment* appears to be triggered by a stack exhaustion bug; the Javascript
creates a loop where an event handler triggers a new event, which in turn
triggers the event handler, etc.. This consumes a stack space until there is no
more stack available. MSIE does appear to be able to handle such a situation
gracefully under certain conditions, but not all. It is easy to avoid those
conditions to force triggering the Abandonment.

The interesting thing is that this indicates that the assumption that *"hitting
Abandonment means a bug is not a security issue"* may not be correct in all
cases.

Known affected software, attack vectors and mitigations
-------------------------------------------------------
+ **Microsoft Edge 11.0.10240.16384-16724** (earlier versions may also be
  affected)

  An attacker would need to get a target user to open a specially crafted
  web page. Disabling Javascript should prevent an attacker from triggering the
  vulnerable code path.

Use-after-free
--------------
The reuse of freed memory happens in `Tree::ANode::IsInTree`, and as mentioned
earlier, it is mitigated by MemGC by default. This mitigation is considered
sufficient to consider this not a security issue as explained by SWIAT in
[Triaging the exploitability of IE/Edge crashes].

Abandonment
-----------
The original repro that was created during fuzzing triggered the use-after-free
bug some of the time, but also had a decent chance of trigger the Abandonment.
From what I've heard through the grapevine, Microsoft Internet Explorer
developers consider hitting an Abandonment as an indication that a bug is not a
security issue: it's considered a sign that the code has detected an error
before it can be exploited. This particular repro appears to contradict that
view to a degree; while this use-after-free is not exploitable in real-life
because of MemGC, the fact that the original repro sometimes hit an Abandonment
that appears to be caused by stack exhaustion did nothing to prevent that same
repro from sometimes triggering a use-after-free when MemGC is disabled. In
other words: **triggering Abandonment is not a reliable indication that a repro
is not able to a trigger a security issue**.

Obviously, it is also not true that triggering Abandonment *does* mean you have
found a security issue. However, it may be wise to repeatedly test a repro that
has triggered Abandonment in order to see if it can also trigger other
exceptions. Another potentially good idea is to use such a repro as input for
a fuzzer; slight modifications to the repro may modify the code path in such a
way that the chance of hitting another exception increases. Unfortunately, I
have not encountered this situation often enough to have sufficient data to
offer any guidelines on how much effort to put into this.

Analysis
--------
In this case, I used [EdgeDbg][] together with [BugId][] to repeatedly run the
original repro until I had triggered both the use-after-free and Abandonment.
This can be done by running the `EdgeBugId.cmd` script provided with EdgeDbg.
I added the command line switch `--BugId.bSaveDump=true` after the URL, which
will cause BugId to write a memory dump whenever it detects a bug. This
provided me with BugId reports and memory dumps for both issues. I then loaded
the memory dumps in a debugger to analyze them and found out the Abandonment
was probably triggered by a loop in the event handler. This allowed me to tweak
the repro until it was able to trigger one or the other on demand.

[MemGC]: https://securityintelligence.com/memgc-use-after-free-exploit-mitigation-in-edge-and-ie-on-windows-10/
[Triaging the exploitability of IE/Edge crashes]: https://blogs.technet.microsoft.com/srd/2016/01/12/triaging-the-exploitability-of-ieedge-crashes/
[EdgeDbg]: https://github.com/SkyLined/EdgeDbg
[BugId]: https://github.com/SkyLined/BugId