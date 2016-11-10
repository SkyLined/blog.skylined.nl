WININET CHttpHeaderParser::ParseStatusLine out-of-bounds read
=============================================================
([MS16-104][], [MS16-105][], [CVE-2016-3325][])
[MS16-104]: https://technet.microsoft.com/library/security/MS16-104
[MS16-105]: https://technet.microsoft.com/library/security/MS16-105
[CVE-2016-3325]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-3325

Synopsis
--------
A specially crafted HTTP response can cause the
`CHttpHeaderParser::ParseStatusLine` method in WININET to read data beyond the
end of a buffer. The size of the read can be controlled through the HTTP
response. An attacker that is able to get any application that uses WININET to
make a request to a server under his/her control may be able to disclose
information stored after this memory block. This includes Microsoft Internet
Explorer, Microsoft Edge and Microsoft Windows Media Player. **As far as I can
tell WININET is widely used by Microsoft applications to handle HTTP requests,
and probably be all third-party applications that use Windows APIs to make HTTP
requests.** All these applications may be vulnerable to the issue, though it
may be hard to exploit in most (if not all, see below). 

Known affected versions, attack vectors and mitigations
-------------------------------------------------------
* **WININET.dll**

  The issue was first discovered in pre-release Windows 10
  fbl_release.140912-1613, which contained WININET.DLL version 11.00.9841.0.
  This vulnerability appears to have been present in all versions of Windows
  10 since, up until the issue was addressed in August 2016.
  No mitigations against the issue are known.

* **Microsoft Internet Explorer**
  
  XMLHttpRequest can be used to trigger this issue - I have not tried other
  vectors. To exploit the vulnerability, Javascript is most likely required, so
  disabling Javascript should mitigate it.

* **Microsoft Edge**
  
  XMLHttpRequest can be used to trigger this issue - I have not tried other
  vectors. To exploit the vulnerability, Javascript is most likely required, so
  disabling Javascript should mitigate it.

* **Microsoft Windows Media Player**

  Opening a link to a media file on a malicious server can be used to trigger
  the issue.

Microsoft has released two bulletins to address this issue, one for Microsoft
Internet Explorer and one for Microsoft Edge. I do not know why Microsoft did
not mention other applications in their bulletins, nor why they have two fixes
for these specific applications, rather than one fix for a component of the
Windows Operating System.

One wonders what would happen on a system where you have previously
uninstalled both MSIE and Edge: do neither of the fixes apply and will your
system be left vulnerable? Let me know if you found out!

Repro
-----
The below repro consists of two parts: an HTML file that constructs an
`XMLHttpRequest` in order to trigger the issue and a raw HTTP response that
actually triggers it.