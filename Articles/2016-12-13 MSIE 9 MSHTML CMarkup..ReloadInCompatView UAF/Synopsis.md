(The fix and CVE number for this issue are not known)

A specially crafted web-page can trigger a use-after-free vulnerability in
Microsoft Internet Explorer 9. During a method call, the `this` object can be
freed and then continues to be used by the code that implements the method.
It appears that there is little to no time for an attacker to attempt to
control the contents of the freed memory before the re-use, which would allow
remote code execution.