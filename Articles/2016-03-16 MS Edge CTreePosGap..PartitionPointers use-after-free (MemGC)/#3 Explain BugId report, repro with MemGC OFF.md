The most important information that [BugId][] reports is shown in the summary
above. It consists of:
* `Id: AVR:NULL 484.a53`
  
  This is a unique identification code for this crash. Every time you run this
  (or any other repro that hits the same bug), [BugId][] should give you the
  same value - even in a different build of the same application on a different
  platform.
  This code consists of two parts separated by a space:
  * `AVR:NULL`
    
    The first part describes the type of crash (**A**ccess **V**iolation while
    **R**eading memory using a **NULL** pointer).
  * `484.a53`
    
    The second part describes the location in the code where the crash happened.
    It consists of the first three hexadecimal digits of the [MD5][] hashes of
    the two most *relevant* functions on the stack, separated by a dot. In this
    case, the hash for `CTreePosGap::PartitionPointers` is 484 and the hash for
    `CSpliceTreeEngine::Init` is a53. A high-tech algorithm based on dark magic
    determines which functions in the stack are the most relevant for a bug,
    but in this case they are simply the top two functions.
* `Description: Access violation while reading memory at 0x0 using a NULL ptr`
  
  This describes the type of crash [BugId][] detected in an easier-to-read
  format than `AVR:NULL`. It also provides the exact address. This is useful
  because the Id value will not contain the exact address: if, for instance,
  the access violation would have been an attempt to read memory at address
  0x30, the [BugId][] would have been `AVR:NULL+4*N 484.a53`. This indicates
  that the address was a NULL pointer + an offset that is a multiple of 4.
  [BugId][] does not use the exact offset in the Id because that value may
  change between builds and can depend on the platform (x86 vs x64) the
  application was build for. But the *alignment* of an offset is almost always
  the same - even for different builds on 32- or 64-bit platforms. Using the
  alignment rather than the offset allows [BugId][] to give you the same Id
  value for a crash in two different builds for two different platforms.
  
* `Location: microsoftedgecp.exe!edgehtml.dll!CTreePosGap::PartitionPointers`
  
  This consists of two or three parts, separated by a "!": the binary for the
  process in which the crash was detected (in this case `microsoftedgecp.exe`),
  the module in or address at which the crash happened (`edgehtml.dll`) and (if
  the crash happened in a module) the function symbol or code offset at which
  the crash happened (`CTreePosGap::PartitionPointers`).
* `Security impact: None`
  
  This indicates that [BugId][] doubts this is a security issue, which in this
  case is correct. Obviously, this is a guess: if [BugId][] says that something
  is exploitable, it may not be *practically* exploitable and if [BugId][] says
  that a crash has no security impact, the underlying issue may still be a
  security
  issue, it's just not obvious from the crash [BugId][] analyzed.

Let's turn MemGC off and try again. You can do this by modifying the registry,
but I prefer using the [MemGC.cmd][] script that I recently added to [BugId][].
The only argument to [MemGC.cmd][] is "ON" or "OFF", but it must be run as an
administrator in order to change the registry. Simply run the following command
in an administrator command prompt to disable MemGC:
```
MemGC.cmd OFF
```
Now let's run Edge in [BugId][] again using the same [EdgeBugId.cmd][] command
as before. [BugId][] will again detect an access violation exception and
analyze it. After analysis it will output slightly different information.
Here's the new [BugId][] report for this crash:

[BugId]: https://github.com/SkyLined/BugId
[MD5]: https://en.wikipedia.org/wiki/MD5
[MemGC.cmd]: https://github.com/SkyLined/BugId/blob/master/MemGC.cmd
[EdgeBugId.cmd]: https://github.com/SkyLined/EdgeDbg/blob/master/EdgeBugId.cmd
