MSIE 10 MSHTML CElement::GetPlainTextInScope out-of-bounds read
===============================================================

(The fix and CVE number for this bug are not known)

Synopsis
--------
An unknown issue in Microsoft Internet Explorer 10 could cause it to read data
out-of-bounds. This issue was fixed before I was able to analyze it in detail,
hence I did not determine exactly what the root cause was.

Known affected software
-----------------------
  + Internet Explorer 10
    
    An attacker would need to get a target user to open a specially crafted
    web-page. No special configuration settings are required in order to trigger
    the issue. No realistic mitigations are known; Javascript is not required
    to trigger the issue.

Repro
-----
While my fuzzing framework does reduce the size of the repro for every case it
finds, this unfortunately does not yet produce the very tiny, straight-forward
repro files you may have come to expect from me. In order to create these, I
need to manually clean up what my fuzzers produced. In this case, because the
issue was addressed my Microsoft before I was able to look at the bug, I did
not go trough that step, so the only repro I have is a bit of a mess, does not
clearly provide information on what triggers the issue and probably contains a
lot of data that is not actually needed to trigger it at all.
