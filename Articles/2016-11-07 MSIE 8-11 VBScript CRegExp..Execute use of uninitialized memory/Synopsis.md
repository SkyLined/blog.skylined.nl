([MS14-080][] and [MS14-084][], [CVE-2014-6363][])

[MS14-080]: https://technet.microsoft.com/en-us/library/security/MS14-080
[MS14-084]: https://technet.microsoft.com/en-us/library/security/MS14-084
[CVE-2014-6363]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-6363

A specially crafted script can cause the VBScript engine to access data before
initializing it. An attacker that is able to run such a script in any
application that embeds the VBScript engine may be able to control execution
flow and execute arbitrary code. This includes all versions of Microsoft
Internet Explorer.
