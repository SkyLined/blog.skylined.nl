Description
-----------
This is the first security vulnerability I sold to [ZDI][] after I quit my job
at Google to live off security bug bounties. It appears I either did not
analyze this issue (probably), or misplaced my analysis (probably not), as I
cannot find any details in my archives, other than a repro and a HTML bug
report (provided below) created by a predecessor to [BugId](https://github.com/SkyLined/BugId).
From the information provided by ZDI in [their advisory][ZDI-13-025], and
Microsoft in [their bulletin][MS13-009], as well as the bug report, it seems to
have been a use-after-free vulnerability. Unfortunately, that is all the
analysis I can provide.

Time-line
---------
* *June 2012*: This vulnerability was found through fuzzing.
* *June 2012*: This vulnerability was submitted to [ZDI][].
* *July 2012*: This vulnerability was acquired by ZDI.
* *September 2012*: This vulnerability was disclosed to Microsoft by ZDI.
* *February 2013*: Microsoft addresses this vulnerability in [MS13-009][].
* *December 2016*: Details of this vulnerability are released.

[ZDI]: http://zerodayinitiative.com/
[ZDI-13-025]: http://www.zerodayinitiative.com/advisories/ZDI-13-025/
[MS13-009]: https://technet.microsoft.com/library/security/ms13-009