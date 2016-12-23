MSIE 11 MSHTML CSpliceTreeEngine::RemoveSplice use-after-free
=============================================================
([MS14-035][], [CVE-2014-1785][])

[MS14-035]: http://technet.microsoft.com/en-us/security/bulletin/ms14-035
[CVE-2014-1785]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-1785

Synopsis
--------
A specially crafted web-page can trigger a use-after-free vulnerability in
Microsoft Internet Explorer 11. There is sufficient time between the free and
reuse for an attacker to control the contents of the freed memory and exploit
the vulnerability.

Known affected software, attack vectors and potential mitigations
-----------------------------------------------------------------
* **Microsoft Internet Explorer 11**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling JavaScript should prevent an attacker from triggering the
  vulnerable code path.

Details
-------
This was one of the first bugs where I attempted to do a proper analysis, and I
got some feedback from ZDI that explained what I got right and what I got
wrong. Basically, on x86, a 0x28 byte memory block is allocated in
`MSHTML!CMarkup::DoEmbedPointers` and when you execute
`document.execCommand("Delete")`. This memory can be freed when you execute
`document.open()` in a `DOMNodeRemoved` event handler. After that, you can 
use Javascript to reallocate the memory before it is reused.
