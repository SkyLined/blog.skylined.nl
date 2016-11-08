VBScript CRegExp::Execute use of uninitialized memory
=====================================================
([MS14-080][] and [MS14-084][], [CVE-2014-6363][])

[MS14-080]: https://technet.microsoft.com/en-us/library/security/MS14-080
[MS14-084]: https://technet.microsoft.com/en-us/library/security/MS14-084
[CVE-2014-6363]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-6363

Synopsis
--------
A specially crafted script can cause the VBScript engine to access data before
initializing it. An attacker that is able to run such a script in any
application that embeds the VBScript engine may be able to control execution
flow and execute arbitrary code. This includes all versions of Microsoft
Internet Explorer.

Known affected versions, attack vectors and mitigations
-------------------------------------------------------
* **vbscript.dll**
  
  The issue affects versions 5.6 through 5.8 and both the 32- and 64-bit
  vbscript.dll binaries.

* **Windows Script Host**
  
  VBScript can be executed in the command line using cscript.exe/wscript.exe.
  An attacker would need to find a script running on a target machine that
  accepts an attacker supplied regular expression and a string, or be able to
  execute his/her own script. However, since the later should already provide
  an attacker with arbitrary code execution, no additional privileges are
  gained by exploiting this vuln.
* **Microsoft Internet Explorer**
  
  VBScript can be executed from a web-page; MSIE 8, 9, 10 and 11 were tested
  and are all affected. MSIE 11 requires a META tag to force it to render the
  page as an earlier version, as MSIE 11 attempts to deprecate vbscript (but
  fails, so why bother?).
  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling scripting, particularly VBScript, should prevent an
  attacker from triggering the vulnerable code path.
  Enabling *Enhanced Protected Mode* appears to disable VBScript on my
  systems, but I have been unable to find documentation on-line that confirms
  this is by design.
* **Internet Information Server (IIS)**
  
  If *Active Server Pages* (ASP) are enabled, VBScript can be executed in
  Active Server Pages. An attacker would need to find an asp page that accepts
  an attacker supplied regular expression and a string, or be able to inject
  VBScript into an ASP page in order to trigger the vulnerability.

Repro
-----
Below are three repro files that trigger the issue in *Windows Script Host*
(repro.vbs), *Microsoft Internet Explorer* (repro.html), and *Internet
Information Server* (repro.asp).