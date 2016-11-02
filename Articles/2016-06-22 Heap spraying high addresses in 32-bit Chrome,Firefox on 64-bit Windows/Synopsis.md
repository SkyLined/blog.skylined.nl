In my [previous blog post][] I wrote about "magic values" that were originally
chosen to help mitigate exploitation of memory corruption flaws and how this
mitigation could potentially be bypassed on 64-bit Operating Systems,
specifically Windows. In this blog post, I will explain how to create a heap
spray (of sorts) that can be used to allocate memory in the relevant address
space range and fill it with arbitrary data for use in exploiting such a
vulnerability.

[previous blog post]: http://blog.skylined.nl/20160621001.html
