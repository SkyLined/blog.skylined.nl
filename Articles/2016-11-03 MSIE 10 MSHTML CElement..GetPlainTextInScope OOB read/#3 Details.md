Description
-----------
My fuzzers were using a predecessor of [BugId][] to generate a report whenever
they found a bug. Unfortunately, this wasn't as sophisticated as BugId is, so
the information contained in these report is not as helpful. Still, I saved
three reports, for crashes with slightly different stacks. This could have been
caused by three different versions of MSIE 10 (every month when Microsoft
released a new version with patches, the code may be optimized differently,
which could explain these differences). It could also have been caused by the
fuzzing framework attempting to reduce the size of the repro by cutting out
chunks, which could lead to slightly different code-paths. Unfortunately, I do
not know which.

Either way, looking at the reports that were automatically generated for this
bug (which can be found at the end of this article), one can find the following
interesting information on all three:
1. The stack tells us that there was a call to `CTextArea::Notify`, which
   suggests the one `textarea` element found in the repro is important to
   triggering the issue.
2. The stack also tells us that there was a call to
   `CElement::GetPlainTextInScope`, which is commonly used to extract the
   text inside an element, so the text content in the `textarea` element is
   probably also important to triggering the issue. Since there is no closing
   `</textarea>` tag, this could be all the data in the repro after the opening
   `<textarea ...>` tag, or up to the first closing tag (`</div>`), depending
   on how the HTML parser works.
3. Clicking on stack `Frame 1` in the report shows the report contains some
   disassembly and registers. Unfortunately, the code that generated the
   disassembly had a bug and started at the wrong address, so this isn't very
   useful. However, clicking on `Registers` will show that:
   * The crash happened in `MSHTML!memcpy`
   * the code looked for a unicode linefeed (0x000A) immediately after data
     pointed to by `edx`.
   
   The `Registers` section also suggest the following:
   * `ecx` was 0, so maybe all the data was already copied at this point?
   * `edx` was apparently used as a pointer to the data being copied.
   
Online documentation for `memcpy` does not mention this behavior of looking for
a linefeed, so it could be that `MSHTML` has an odd implementation, or that the
symbol is simply wrong. I'm assuming that the code did copy the text content of
a `textarea` element and was looking for a `CR`, `LF` line terminator.
Unfortunately, the data at `edx` only contained one or the other, causing the
code to look for the `LF` outside of the memory area allocated to store the
data.

Exploit
-------
The above suggests that there is limit opportunity for exploiting this issue:
it may be possible to determine if a memory block allocated for a string of an
attacker controlled size is followed by a memory block that starts with the
bytes `0A 00`. To better understand the impact, one would have to get an older
version of MSIE 10 and debug the crash. Unfortunately, I did not have time to
do so.