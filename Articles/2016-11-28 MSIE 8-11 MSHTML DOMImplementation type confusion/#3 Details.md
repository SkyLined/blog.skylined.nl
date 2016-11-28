Description
-----------
In an SVG page, a copy of the `hasFeature` method of a `DOMImplementation`
object from a HTML page is created. This copy is used as a method of a new
object and called with one argument. This can cause at least two issues in the
`MSHTML!Method_VARIANTBOOLp_BSTR_o0oVARIANT` function of MSIE:
* A FailFast exception when the code detects that calling a method of an object
  has not cleaned up the stack as expected; this is because the called function
  appears to expect a different number of arguments or a different calling
  convention. This issue can be triggered by changing the line `o.x();` in the
  repro to `o.x(new Array)`.
* An out-of-bounds write when `MSHTML!CBase::PrivateGetDispID` is called; this
  is probably caused by a type confusion bug: the code expects a `VARIANT`
  object of one type, but is working on an object of a different type.

The repro was tested on x86 systems and does not reproduce this issue on x64
systems. I did not determine if this is because x64 systems are not affected,
or because the repro needs to be modified to work on x64 systems.

Exploit
-------
Exploitation was not attempted. I reversed `Method_VARIANTBOOLp_BSTR_o0oVARIANT`
only sufficiently to get an idea of the root cause, but not enough to determine
exactly what is going on or how to control the issue for command execution.
