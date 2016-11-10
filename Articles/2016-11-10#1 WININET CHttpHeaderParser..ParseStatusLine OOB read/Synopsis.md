([MS16-104][], [MS16-105][], [CVE-2016-3325][])
[MS16-104]: https://technet.microsoft.com/library/security/MS16-104
[MS16-105]: https://technet.microsoft.com/library/security/MS16-105
[CVE-2016-3325]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-3325

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