Description
-----------
Recompiling the regular expression pattern during a replace can cause the code
to reuse a freed string, but only if the string is freed from the cache by
allocating and freeing a number of strings of certain size, as explained by
Alexander Sotirov in his [Heap Feng-Shui][] presentation.

[Heap Feng-Shui]:https://www.blackhat.com/presentations/bh-europe-07/Sotirov/Presentation/bh-eu-07-sotirov-apr19.pdf

Exploit
-------
Exploitation was not investigated.

Time-line
---------
* *March 2015*: This vulnerability was found through fuzzing.
* *March 2015*: This vulnerability was submitted to [ZDI][].
* *April 2015*: This vulnerability was acquired by ZDI.
* *October 2015*: Microsoft addressed this issue in [MS15-018][].
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[MS15-018]: https://technet.microsoft.com/en-us/library/security/MS15-108