Time-line
---------
* *13 October 2012*: This vulnerability was found through fuzzing.
* *29 October 2012*: This vulnerability was submitted to [EIP][].
* *18 November 2012*: This vulnerability was submitted to [ZDI][].
* *27 November 2012*: EIP declines to acquire this vulnerability because they
  believe it to be a copy of another vulnerability they already acquired.
* *7 December 2012*: ZDI declines to acquire this vulnerability because they
  believe it not to be exploitable.

During the initial report detailed above, I did not have a working exploit to
prove exploitability. I also expected the bug to be fixed soon, seeing how
EIP believed they already reported it to Microsoft. However, about two years
later, I decided to look at the issue again and found it had not yet been
fixed. Apparently it was not the same issue that EIP reported to Microsoft. So,
I decided to try to have another look and developed a Proof-of-Concept exploit.

* *April 2014*: I start working on this case again, and eventually develop a
  working Proof-of-Concept exploit.
* *6 November 2014*: ZDI was informed of the new analysis and reopens the case.
* *15 November 2014*: This vulnerability was submitted to [iDefense][].
* *16 November 2014*: iDefense responds to my report email in plain text,
  potentially exposing the full vulnerability details to world+dog.
* *17 November 2014*: ZDI declines to acquire this vulnerability after being
  informed of the potential information leak.
* *11 December 2012*: This vulnerability was acquired by iDefense.

The accidentally potential disclosure of vulnerability details by iDefense was
of course a bit of a disappointment. They reported that they have since updated
their email system to automatically encrypt emails, which should prevent this
from happening again.

* *9 June 2015*: Microsoft addresses this vulnerability in [MS15-056][].
* *6 December 2016*: Details of this vulnerability are released.

[EIP]: https://rsp.exodusintel.com/
[ZDI]: http://zerodayinitiative.com/
[iDefense]: https://labs.idefense.com/vcpportal/
[MS15-056]: https://technet.microsoft.com/library/security/ms15-056
