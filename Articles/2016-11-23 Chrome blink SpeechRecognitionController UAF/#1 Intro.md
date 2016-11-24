Chrome blink SpeechRecognitionController use-after-free
=======================================================
([Chromium 455857][], [CVE-2015-1251][])

[Chromium 455857]: https://bugs.chromium.org/p/chromium/issues/detail?id=455857
[CVE-2015-1251]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-1251

Synopsis
--------
A specially crafted web-page can cause the blink rendering engine used by
Google Chrome and Chromium to continue to use a speech recognition API object
after the memory block that contained the object has been freed. An attacker
can force the code to read a pointer from the freed memory and use this to call
a function, allowing arbitrary code execution.

Known affected software and attack vectors
------------------------------------------
+ **Google Chrome 39.0**

  An attacker would need to get a target user to open a specially crafted
  webpage. Disabling Javascript should prevent an attacker from triggering the
  vulnerable code path.
