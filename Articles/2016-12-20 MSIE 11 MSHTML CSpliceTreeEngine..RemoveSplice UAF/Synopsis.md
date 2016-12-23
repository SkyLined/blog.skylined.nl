([MS14-035][], [CVE-2014-1785][])

[MS14-035]: http://technet.microsoft.com/en-us/security/bulletin/ms14-035
[CVE-2014-1785]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-1785

A specially crafted web-page can trigger a use-after-free vulnerability in
Microsoft Internet Explorer 11. There is sufficient time between the free and
reuse for an attacker to control the contents of the freed memory and exploit
the vulnerability.