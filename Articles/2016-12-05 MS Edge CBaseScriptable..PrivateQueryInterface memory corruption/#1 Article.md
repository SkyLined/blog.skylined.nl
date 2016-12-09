MS Edge CBaseScriptable::PrivateQueryInterface memory corruption
================================================================
([MS16-068][], [CVE-2016-3222][])

[MS16-068]: https://technet.microsoft.com/library/security/MS16-068
[CVE-2016-3222]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-3222

Synopsis
--------
A specially crafted web-page can trigger a memory corruption vulnerability in
Microsoft Edge. I did not investigate this vulnerability thoroughly, so I
cannot speculate on the potential impact or exploitability.

Known affected software and attack vectors
------------------------------------------
* **Microsoft Edge**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling JavaScript does not prevent an attacker from triggering
  the vulnerable code path.
  
Discovery
---------
This issue was found through fuzzing in the 64-bit version of Microsoft Edge,
in which the original repro triggered what appeared to be a NULL pointer
dereference in `CBaseScriptable::PrivateQueryInterface`. So, after a very brief
look at the repro, I [filed a bug in the public bug tracker][Edge bug tracker]
and [published it on twitter][published on twitter].
The original repro was:

[Edge bug tracker]: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7410216
[published on twitter]: https://twitter.com/berendjanwever/status/729957166447218688

```HTML
<body onload=typeof(open().crypto)>
```

Soon after, I found another repro that trigger a slightly different NULL
pointer dereference in `CBaseScriptable::PrivateQueryInterface` in a 64-bit
version of Edge. The second repro was:

```HTML
<body onload=typeof(open().msCredentials)>
```

I never tested the these two repros in a 32-bit version of Edge before
publishing them, which I immediately regretted after finding that the second
repro triggered an access violation using the obviously non-NULL address
0x1BF37D8 in a 32-bit version of Edge!

Around this time, I started finding many variations of this bug: getting the
type of various properties or objects associated with another window was
triggering all kinds of access violations. Many of these were not using NULL
pointers on 32-bit Edge. I collected all the variations my fuzzers had found
and come up with these additional repros:

```HTML
<body onload=typeof(open().document.createElement("canvas").getContext("2d"))>
```
This triggered an access violation in `edgehtml.dll!CBaseScriptable::PrivateQueryInterface`
while attempting to read from address 0x4C261 in the 32-bit version of Edge.

```HTML
<body onload=typeof(open().navigator.mediaDevices)>
```
This triggered an access violation in `charkra.dll!ThreadContext::PreSweepCallback`
while attempting to read from address 0xFF80A90F in the 32-bit version of Edge.

```HTML
<body onload=typeof(open().toString)>
```
This triggered an assertion failure because it was calling a deprecated API in
the 32-bit version of Edge.

I looked again at the original `crypto` repro and noticed that although it
triggered an access violation using a NULL pointer on both 32-bit and 64-bit
versions of Edge, the two addresses (3 and 8 respectively) had different
alignment. This is rather odd: true NULL pointer dereferences can cause an
access violation at a different offset from NULL on these two architectures
because property values and pointers stored before the one being read/written
can have different sizes on 32-bit and 64-bit systems, but one usually expects
them to have similar alignment: the last two bits of the address should be the
same.

Report
------
If only I had tested the original repro in a 32-bit version of Edge when I
first analyzed the issue, I might have realized it was more than a simple NULL
pointer and not published it before doing additional research.

I contacted ZDI and asked if they would be interested in buying the
vulnerability at this point, given that I publicly released the repro that
triggered a NULL pointer and filed it with Microsoft. I was hoping they would
decide that this did not disclose the underlying vulnerability and that it as
such would still be a 0-day. Unfortunately for me, they were not interested in
acquiring details in this situation.

At that point I decided to contact the Microsoft Security Response Center and
report the additional information I had found. I also contacted a few people
working on the Edge team at Microsoft directly to let them know they might want
to escalate this bug from a simple NULL pointer to a security vulnerability.
Unfortunately, this let them to decided to mark the bug I had filed in the
[Edge bug tracker][] as hidden. I warned them that this did little good, as the
details were still public in my twitter and even if I deleted that, in general
*what goes on the internet stays on the internet*.

Analysis
--------
Since I had publicly released the repro, I was not going to be seeing any kind
of reward for this bug, so analyzing the issue was not a priority for me.
Unfortunately that meant I did not analyze it at all, other than to speculate
that this bug was likely to have been a type-confusion or bad cast, where
assembled code was used as data, leading to most of these repros triggering an
access violation at a static address that depended on the code they were using
as data. It may therefore be possible to find a variation that uses code
that represents an address in the address space of Edge where an attacker might
store data under his/her control. This is especially true for 32-bit Edge, as
the address space is a lot smaller. Depending on what the code does with the
address, it might be possible to execute arbitrary code under perfect
circumstances.
