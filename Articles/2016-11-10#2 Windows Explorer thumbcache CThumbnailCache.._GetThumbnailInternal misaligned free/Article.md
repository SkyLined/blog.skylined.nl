Windows Explorer thumbcache CThumbnailCache::_GetThumbnailInternal misaligned free
==================================================================================
(This issue is currently not fixed)

Synopsis
--------
When handling long path names on network shares mapped to a drive,
thumbcache.dll loaded in explorer.exe can be made to free a memory block with a
pointer that does not actually point to the start of the memory block, but
rather to the start plus a static offset. The offset is such that the pointer
is no longer aligned correctly, which is detected by the heap manager. The heap
manager then causes explorer.exe to terminate.

Known affected versions, attack vectors and mitigations
-------------------------------------------------------
* **explorer.exe & thumbcache.dll 10.0.14393.0 on Windows 10**

  An attacker would need to get a target user to open a specially crafted
  folder in explorer.exe in thumb-nail view, or get a target user to attempt to
  drag & drop a file in such a folder. This specially crafted folder must
  reside on a drive on the victim's machine that is mapped to a network share.
  The vulnerability does not appear to be exploitable.
  Limiting the size of the path for files mitigates the issue, as a very long
  path is required in order to trigger it. Browsing a network share directly,
  rather than through a mapped drive also prevents triggering the vulnerable
  code path.
    
Repro
-----
To prevent explorer.exe crashing prematurely, please set the default view to
`details`:

* Select the `view` tab at the top of the explorer.exe window
* Select `Details` from the list of ways to view the current folder.
* Click on `Options` on the right hand side of the `view` banner.
* Select the `view` tab at the top.
* Click on `Apply to Folders`
* From the list of options, enable `Launch folder windows in a separate
  process`

(The above steps are not required to trigger the issue AFAIK, but they make
debugging easier.)

From a cmd.exe shell, execute the following commands to reproduce the issue:
```
    > %SystemDrive%
    > mkdir \test
    > cd \test
    > mkdir ___237_bytes_________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    > cd ___237_bytes_________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    > ECHO. >x.URL
    > net share test=%SystemDrive%\test
    > pushd \\localhost\test
    > explorer.exe ___237_bytes_________________________________________________________________________________________________________________________________________________________________________________________________________________________________
```
At this point you may want to attach your debugger to the newly spawned
explorer.exe process. When you are ready to proceed, try to drag and drop the
`x` Internet Shortcut file: this should cause explorer.exe to create a
thumbnail for the file, which triggers the issue and causes an exception in
explorer.exe

Description
-----------
When explorer.exe needs to look up the thumbnail for a file with a long path
name on a mapped network share, it will replace the drive letter in the path of
the file with the network share. For example: when the network share
`\\server\share` is mapped to drive `Z:` and explorer.exe needs to render the
thumbnail for the file  `Z:\__long_path__...__\z.URL`, it will lookup the
thumbnail for `\\server\share\__long_path__...__\x.URL`. When doing so, the
code at some point attempts to free this string. However, the string is part
of a struct and a pointer is located before this string, like so:
```C++
struct _ThumbNailStruct {
  PVOID pUnknown;
  WCHAR[] szFilePath;
};
```
This will cause the code to try to free a memory block using a pointer that is
4 (x86) or 8 (x64) bytes after the start of that block.

The size of the block can be controlled through the name of the server and
share: chaning the length of the name for the server or share results in a 
similar change to the length of the path and thus the memory block.

Exploit
-------
The attacker does not appear to have control over the value in the pointer and
the pointer is not aligned correctly, which is immediately detected by the heap
manager. To my knowledge, this issue is not exploitable. 

BugId
-----
This is the first time I ran into this type of bug and therefore there was no
code in [BugId][] that handled it, which resulting in limited information being
available for analysis. I have since added code to BugId that detects this
issue and reports it correctly, as can be seen in the report near the end of
this page.

[BugId]: https://github.com/SkyLined/BugId

Time-line
---------
* *August/September 2016*: I notice explorer.exe on my desktop machine
  inexplicably terminating while I'm working on issues I found through fuzzing.
* *October 2016*: This is happening often enough to get really annoying, so I
  investigate and find the root cause.
* *October 2016*: This issue was submitted to [ZDI][] and [iDefense][], just in
  case I missed something and they find a way to exploit it.
* *October 2016*: ZDI rejects the submission as they do not consider it
  exploitable.
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[iDefense]: https://labs.idefense.com/vcpportal/

Notice that Microsoft was not informed prior to releasing this information to
the public, as I do not believe this is a security issue that warrants a
private report. In the contrary: I believe that if people are experiencing
seemingly random crashes of explorer.exe, they may want to know about this
issue, so they can determine if they are impacted by it and work around it.