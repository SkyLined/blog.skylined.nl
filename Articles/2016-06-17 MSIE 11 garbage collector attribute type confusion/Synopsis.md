([MS16-063][], [CVE-2016-0199][])
[MS16-063]: https://technet.microsoft.com/library/security/MS16-063
[CVE-2016-0199]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-0199

With [MS16-063] Microsoft has patched [CVE-2016-0199]: a memory corruption bug
in the garbage collector of the JavaScript engine used in Internet Explorer 11.
By exploiting this vulnerability, a website can causes this garbage collector
to handle some data in memory as if it was an object, when in fact it contains
data for another type of value, such as a string or number. The garbage
collector code will use this data as a virtual function table (vftable) in order
to make a virtual function call. An attacker has enough control over this data
to allow execution of arbitrary code.

[MS16-063]: https://technet.microsoft.com/library/security/MS16-063
[CVE-2016-0199]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-0199