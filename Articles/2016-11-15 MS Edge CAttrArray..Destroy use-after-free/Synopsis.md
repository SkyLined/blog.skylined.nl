(This fix and CVE number for this issue are not known)

A specially crafted web-page can cause Microsoft Edge to free memory used for
a CAttrArray object. The code continues to use the data in freed memory block
immediately after freeing it. It does not appear that there is enough time
between the free and reuse to exploit this issue.
