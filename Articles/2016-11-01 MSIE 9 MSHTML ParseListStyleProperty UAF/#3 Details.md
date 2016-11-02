Analysis
--------
The `CAttrArray` object initially allocates a `CImplAry` buffer of 0x40 bytes,
which can store 4 attributes. When the buffer is full, it is grown to 0x60
bytes. A new buffer is allocated at a different location in memory and the
contents of the original buffer is copied there. The repro causes the code to
do this, but the code continues to access the original buffer after it has been
freed.

Exploit
-------
If an attacker was able to cause MSIE to allocate 0x40 bytes of memory and have
some control over the contents of this memory before MSIE reuses the freed
memory, there is a chance that this issue could be used to execute arbitrary
code. I did not attempt to write an exploit for this vulnerability myself.

Timeline
--------
* *April 2014*: This vulnerability was found through fuzzing.
* *July 2014*: This vulnerability was submitted to [ZDI][].
* *July 2014*: ZDI reports a collision with a report by another researcher.
  (From the credits given by Microsoft and ZDI, I surmise that it was Peter
  'corelanc0d3r' Van Eeckhoutte of [Corelan][] who reported this issue.
* *October 2014*: Microsoft release [MS14-056][], which addresses this issue.
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[Corelan]: https://www.corelangcv.com/