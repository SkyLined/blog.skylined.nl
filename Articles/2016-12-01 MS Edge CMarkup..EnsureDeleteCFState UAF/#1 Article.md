MS Edge CMarkup::EnsureDeleteCFState use-after-free
===================================================
([MS15-125][], [CVE-2015-6168][])

[MS15-125]: https://technet.microsoft.com/en-us/library/security/ms15-125.aspx
[CVE-2015-6168]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-6168

Synopsis
--------
A specially crafted web-page can trigger a memory corruption vulnerability in
Microsoft Edge. I did not investigate this vulnerability thoroughly, so I
cannot speculate on the potential impact or exploitability.

Known affected software and attack vectors
------------------------------------------
* **Microsoft Edge 11.0.10240.16384**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling JavaScript does not prevent an attacker from triggering
  the vulnerable code path.
  
Repro
-----
```HTML
/<style>:first-letter{word-spacing:9
```

Variation
```HTML
x<style>:first-letter{background-position:inherit
```

Description
-----------
At the time this issue was first discovered, MemGC was just introduced, and I
had not yet fully appreciated what an impact it would have on mitigating
use-after-free bugs. Despite MemGC being enabled in Microsoft Edge by default,
this issue appeared to me to have been a use-after-free vulnerability. However,
both Microsoft and ZDI (whom I sold the vulnerability to) describes it as a
memory corruption vulnerability, so it's probably more complex than I assumed.

At the time, I did not consider this vulnerability to be of great interest, as
there was no immediately obvious way of controlling the vulnerability in order
to exploit it. So, I did not do any further investigation into the root cause
and, if this was indeed a use-after-free, how come MemGC did not mitigate it?
In hindsight, it would have been a good idea to investigate the root cause, as
any use-after-free that is not mitigated by MemGC might provide hints on how to
find more vulnerabilities that bypass it.

Time-line
---------
* *August 2015*: This vulnerability was found through fuzzing.
* *August 2015*: This vulnerability was submitted to [ZDI][].
* *December 2015*: Microsoft addresses this vulnerability in [MS15-125][].
* *December 2016*: Details of this vulnerability are released.

[ZDI]: http://zerodayinitiative.com/
