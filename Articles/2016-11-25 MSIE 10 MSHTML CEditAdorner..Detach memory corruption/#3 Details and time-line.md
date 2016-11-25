Details
-------
The last line of script (`designMode = "off"`) will cause some cleanup in MSIE,
which appears to trigger use of a stale pointer in `CEditAdorner::Detach`. I
did not investigate further.

Time-line
---------
* *November 2012*: This vulnerability was found through fuzzing.
* *November 2012*: This vulnerability was submitted to [EIP][].
* *December 2012*: This vulnerability was rejected by EIP.
* *January 2013*: This vulnerability was submitted to [ZDI][].
* *March 2013*: This vulnerability was acquired by ZDI.
* *June 2013*: This issue was addressed by Microsoft in [MS13-047][].
* *November 2016*: Details of this issue are released.

[EIP]: https://rsp.exodusintel.com/
[ZDI]: http://www.zerodayinitiative.com/
[MS13-047]: https://technet.microsoft.com/library/security/ms13-047