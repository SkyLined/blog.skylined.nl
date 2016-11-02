verifier!AVrfDebugPageHeapAllocate incorrect memory initialization a.k.a Google Chrome use of uninitialized FLS pointer
=======================================================================================================================
In August last year, I found what appear to be a  thread-safety vulnerability
in Google Chrome when handling audio data, that could lead to use of an
uninitialized pointer. This issue is only visible when running Chrome with
[page heap][] enabled, as the memory used to store the pointer appears to be
set to `0x00000000` after allocation when page heap is not enabled. This means
this NULL pointer will not be used by the code to reference memory. However,
when running Chrome with page heap enabled, the pointer will be initialized to
`0xD0D0D0D0` and gets used in code that allows at least freeing of arbitrary
memory pointers.

Repro
-----
```HTML
<!doctype html>
<html><head>
<script>
  new AudioContext("notification").decodeAudioData(
    new ArrayBuffer(1),
    function(){},
    function(){}
  );
  location.reload();
</script></head></html>
```

Description
-----------
The repro triggers a race condition in the AudioOutputDevice thread, where the
thread is terminated before a pointer to fiber local storage (FLS) is
initialized.

When the thread is terminated and the FLS pointer is not NULL, the FLS pointer
is passed to `msvcrt!_freefls`, which assumes it points to a structure with
some more pointers. For a number of pointer in the structure, it calls
`msvcrt!free` if they are not NULL.

Exploit
-------
An attacker could use a heap spray to allocate memory around address
`0xD0D0D0D0` and have the uninitialized pointer point to whatever data is
useful. When the `msvcrt!_freefls` function is called, it will process that
attacker supplied data.

[Page Heap]: https://blogs.msdn.microsoft.com/webdav_101/2010/06/22/detecting-heap-corruption-using-gflags-and-dumps/
