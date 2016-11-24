(The fix and CVE number for this bug are not known)

A specially crafted web-page can cause Microsoft Internet Explorer 9 to access
data before the start of a memory block. An attack that is able to control
what is stored before this memory block may be able to disclose information
from memory or execute arbitrary code.