([MS15-018][], [CVE-2015-2482][])

[MS15-018]: https://technet.microsoft.com/en-us/library/security/MS15-108
[CVE-2015-2482]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-2482

A specially crafted web-page can cause the Javascript engine of Microsoft
Internet Explorer 8 to free memory used for a string. The code will keep a
reference to the string and can be forced to reuse it when compiling a regular
expression.
