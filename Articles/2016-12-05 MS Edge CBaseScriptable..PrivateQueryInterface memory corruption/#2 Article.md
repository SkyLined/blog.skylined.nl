On Hiding bugs in public bug trackers
-------------------------------------
Hiding a publicly reported bug after the fact is a very bad idea IMHO, as it
paints an easy to detect target on the bug. Every smart attacker should have a
system that makes regular copies of all publicly reported bugs in target
applications and reports to their owner all bugs that become hidden, with a
copy of all the information it scraped from the bug before it was hidden.
Since hiding a public bug only ever happens for one of two reasons: the bug was
found to be a security issue, or the report accidentally contains personal
information that the owner wants hidden. It should be quite easy to distinguish
between the two to filter out the vulnerabilities, giving an attacker a nearly
free stream of nearly 0-day bugs. If you work on a team that has a public
bug-tracker, you may want to discuss this with your team and decided how to
handle such situations.

Conclusion
----------
As useful as BugId is in automating a lot of the analysis I do on every bug I
find, and in helping me prioritize the issues that are most likely to be
vulnerabilities, it is not perfect and cannot always detect a vulnerability for
what it is. [BugId][] is not a perfect replacement for full manual analysis of
bugs.

In this case I relied to heavily on its ability to distinguish vulnerabilities
from other bugs. Because of the nature of this issue, the repros caused access
violations at static addresses, many of which near enough to NULL to be
interpreted as NULL pointer dereferences, especially for the first repro I
found. BugId can not actually determine the root cause of a crash, but attempts
to deduce the root cause based on the details of the crash it causes. In this
case, the crash looked too similar to a regular NULL pointer dereference for
BugId to detect it as anything else.

However, in my current situation, where I am finding *way* more bugs than I can
analyze manually, BugId does a very good job at helping me prioritize and
analyze issues. I have used BugId on hundreds of bugs and, as far as I know,
this is the first time I mistook a security vulnerability for a regular bug
based on the BugId report. As such, the false-negative rate I have experienced
is a fraction of a percent, which IMHO is remarkably low and entirely
acceptable. At the same time, the false-positive rate I have seen so far is
exactly zero.

In order to prevent this from happening in the future, I now test each repro in
both the 32-bit and 64-bit version of Edge, do more manual analysis on bugs
that get reported as a NULL pointer with a non-DWORD-aligned address (e.g. 3
in this case), and wait slightly longer for my fuzzers to find variations of a
bug before I start my analysis and report the issue as a non-security bug.

Time-line
---------
* *29 April 2016*: This vulnerability was first found through fuzzing.
* *10 May 2016*: This issue was [published on Twitter] and [reported to Microsoft][Edge bug tracker].
* *13 May 2016*: This vulnerability was submitted to [ZDI][].
* *18 May 2016*: This vulnerability was declined by ZDI.
* *18 May 2016*: This vulnerability was reported to MSRC and I informed Edge
  developers directly on the seriousness of the bug.
* *18 May 2016*: The issue was hidden in public bug tracker.
* *14 June 2016*: Microsoft addresses this vulnerability in [MS16-068][].
* *December 2016*: Details of this vulnerability are released.

[ZDI]: http://zerodayinitiative.com/
