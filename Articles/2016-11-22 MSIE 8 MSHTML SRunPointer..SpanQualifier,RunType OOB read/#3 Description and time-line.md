Description
-----------
The issue requires rather complex manipulation of the DOM and results in
reading a value immediately following an object. The lower three bits of this
value are returned by the function doing the reading, resulting in a return
value in the range 0-7. After exhaustively skipping over the read AV and having
that function return each value, no other side effects were noticed. For that
reason I assume this issue is hard if not impossible to exploit and did not
investigate further. It is still possible that there may be subtle effects that
I did not notice that allow exploitation in some form or other.

Time-line
---------
* *June 2014*: This vulnerability was found through fuzzing.
* *October 2014*: This vulnerability was submitted to [ZDI][].
* *October 2014*: This vulnerability was rejected by ZDI.
* *November 2014*: This vulnerability was reported to [MSRC][].
* *February 2015*: This vulnerability was addressed by Microsoft in
  [MS15-009][].
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[MSRC]: http://microsoft.com/msrc
[MS15-009]: https://technet.microsoft.com/library/security/ms15-009