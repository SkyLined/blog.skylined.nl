The above code allocates a Uint32Array that is so large it will only fit in the
(assumed) unused area above `0x80000000`. This causes it to be reliably
allocated at address `0x80004000`. Using this array, a pointer at `0xD0D0D0D0 +
0x24` is set to `0xDEADBEEF`. When `msvcrt!_freefls` is called with the
uninitialized FLS pointer, it will check if the pointer at `0x24` is not NULL
and call `msvcrt!free` to free the memory it points to. This leads to an
attempt to free memory at address `0xDEADBEEF`, which should result in a crash.

verifier!AVrfDebugPageHeapAllocate incorrect memory initialization
------------------------------------------------------------------
After doing a more thorough analysis, Ricky Zhou explained to me in the
[Chromium bug][] that the issue is not in Chromium, but in `verifier.dll`.
This DLL is used to implement page heap on Windows. The problem is that in
`verifier!AVrfDebugPageHeapAllocate`, the `HEAP_ZERO_MEMORY` flag is sometimes
ignored, which in this case caused the memory to get initialized with the wrong
value. I reported this issue to Microsoft at the end of October last year and
after getting the MSRC case number 31596, I did not hear back from them again
until after I reached out again when I was writing this blog. Microsoft
informed me that they consider this attack scenario too limited to warrant a
security updated.

[Chromium bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=525288

