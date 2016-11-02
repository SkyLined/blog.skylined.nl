(The fix and CVE number for this bug are not known)

A specially crafted webpage can cause Microsoft Internet Explorer 11 to free
a memory block that contains information about an image. The code continues
to use the data in freed memory block immediately after freeing it. It does not
appear that there is enough time between the free and reuse to exploit this
issue.
