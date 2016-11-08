(The fix and CVE number for this bug are not known)

A specially crafted script can cause the VBScript engine to read data beyond a
memory block for use as a regular expression. An attacker that is able to run
such a script in any application that embeds the VBScript engine may be able to
disclose information stored after this memory block. This includes all versions
of Microsoft Internet Explorer.
