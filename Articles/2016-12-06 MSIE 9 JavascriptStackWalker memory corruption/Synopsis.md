([MS15-056][], [CVE-2015-1730][])

[MS15-056]: https://technet.microsoft.com/library/security/ms15-056
[CVE-2015-1730]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-1730

A specially crafted web-page can trigger a memory corruption vulnerability in
Microsoft Internet Exlorer 9. A pointer set up to point to certain data on the
stack can be used after that data has been removed from the stack. This results
in a stack-based analog to a heap use-after-free vulnerability. The stack
memory where the data was stored can be modified by an attacker before it is
used, allowing remote code execution.