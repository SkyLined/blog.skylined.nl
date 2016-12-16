MSIE 9 MSHTML CDispNode::InsertSiblingNode use-after-free
=========================================================
([MS13-037][], [CVE-2013-1306][])

[MS13-037]: https://technet.microsoft.com/en-us/security/bulletin/ms13-037
[CVE-2013-1306]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2013-1306

Synopsis
--------
A specially crafted web-page can trigger a memory corruption vulnerability in
Microsoft Internet Explorer 9. I did not investigate this vulnerability
thoroughly, so I cannot speculate on the potential impact or exploitability.

Known affected software and attack vectors
------------------------------------------
* **Microsoft Internet Explorer 9**

  An attacker would need to get a target user to open a specially crafted
  web-page. JavaScript does not appear to be required for an attacker to
  triggering the vulnerable code path.
  
Details
-------
This bug was found back when I had very little knowledge and tools to do
analysis on use-after-free bugs, so I have no details to share. The EIP
provided me with some details of their analysis, which I'll paraphrase here:
It is a use-after-free vulnerability where the span object in the frame.html
file is reused after being freed. It appears to be impossible to reallocate the
freed memory before it is reused. Part of the freed memory is overwritten when
it is freed because a WORD `FreeEntryOffset` value is stored at offset 0. This
value is then used as part of a pointer to a vftable in order to call a method.
This pointer now consist of the upper 16-bits of the old vftable and the lower
16-bits contain the `FreeEntryOffset` value. Exploitation is near impossible
without a way to have more control over this pointer in the freed memory block.
ZDI also did a more thorough analysis and [provide very similar details in
their advisory](http://www.zerodayinitiative.com/advisories/ZDI-13-082/).
I have included a number of reports created using a predecessor of [BugId][]
below.

[BugId]: https://github.com/SkyLined/BugId
