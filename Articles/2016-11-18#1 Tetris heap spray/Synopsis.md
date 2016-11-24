Over the past decade, heap sprays have become almost synonymous with exploits
in web-browsers. After having developed my first practical implementation of a
heap spray about ten years ago, I found that the amount of memory needed in
some cases was too much for a realistic attack scenario. I needed a new kind of
heap spray that did not allocate as much RAM as traditional heap sprays do. So,
I developed a heap spray that uses significantly less RAM than a traditional
heap spray does. In practice it uses about 33% less in most cases, but
theoretically it could be much, mush less in ideal situations. This new
technique requires only the ability to free some of the blocks of memory used
to spray the heap during spraying and should otherwise be applicable to every
existing implementation.