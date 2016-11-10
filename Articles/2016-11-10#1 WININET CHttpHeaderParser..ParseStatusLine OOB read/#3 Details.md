Description
-----------
When WININET is processing a `HTTP 100` response, it expects another HTTP
response to follow. WININET stores all data received from the server into a
buffer, uses a variable to store an index into this buffer to track where it is
currently processing data, and uses another variable to store the length of the
remaining data in the buffer.

When processing the headers of the `HTTP 100` request, the code updates the
index correctly, but does not decrement the length variable. When the code
processes the next request, the length variable is too large, which can cause
the code to read beyond the end of the data received from the server. This may
cause it to parse data stored in the buffer that was previously received as
part of the current HTTP response, and can even cause it to do the same for
data read beyond the end of the buffer. This can potentially lead to
information disclosure.

The larger the `HTTP 100` response is, the more bytes the code reads beyond the
end of the data. Here are some example responses and their effect:
```
  "HTTP 100\r\n\r\nX" (12 bytes in HTTP 100 response)
    => read "X" and the next 11 bytes in memory as the next response.
  "HTTP 100\r\n\r\nXXXX" (12 bytes in HTTP 100 response)
    => read "XXXX" and the next 8 bytes in memory as the next response.
  "HTTP 100XXX\r\n\r\nX" (15 bytes in HTTP 100 response)
    => read "X" and the next 14 bytes in memory as the next response.
  "HTTP 100XXX........XXX\r\n\r\nX..." (N bytes in HTTP 100 response)
    => read "X" and the next (N-1) bytes in memory as the next response.
```

Exploit
-------
This issue is remarkably similar to [an issue in HTTP 1xx response handling I
found in Google Chrome](https://code.google.com/p/chromium/issues/detail?id=299892)
a while back. That issue allowed disclosure of information from the main
process' memory through response headers. I attempted to leak some data using
this vulnerability by using the following response:
```
  "HTTP 100XXX........XXX\r\nHTTP 200 X"
```
I was hoping this would cause the OOB read to save data from beyond the end of
the `HTTP 200` reponse in the `statusText` property of the `XMLHttpRequest`,
but I did not immediately see this happen; all I got was "OK" or an empty
string.

Unfortunately, I did not have time to reverse the code and investigate further
myself. All VCPs I submitted the issue to rejected it because they though it
was not practically exploitable.

Time-line
---------
* *October 2014*: This vulnerability was found through fuzzing.
* *October-November 2014*: This vulnerability was submitted to [ZDI][],
  [iDefense][] and [EIP][].
* *November-December 2014*: ZDI, iDefense and EIP all either reject the
  submission because Windows 10 is in pre-release, or fail to respond.
* *August 2015*: re-submitted to ZDI, iDefense and EIP, since Windows 10 is now
  in public release.
* *September-October 2015*: ZDI, iDefense and EIP all either reject the
  submission because they do not consider it practically exploitable, or fail
  to respond.
* *June 2016*: This vulnerability was reported to Microsoft with a 60-day
  deadline to address the issue.
* *September 2016*: The vulnerability was address by Microsoft in [MS16-105][].
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[iDefense]: https://labs.idefense.com/vcpportal/
[EIP]: https://rsp.exodusintel.com/
[MS16-105]: https://technet.microsoft.com/library/security/ms16-104


