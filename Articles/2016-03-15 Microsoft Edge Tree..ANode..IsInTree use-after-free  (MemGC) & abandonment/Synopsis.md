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

[MemGC]: https://securityintelligence.com/memgc-use-after-free-exploit-mitigation-in-edge-and-ie-on-windows-10/
