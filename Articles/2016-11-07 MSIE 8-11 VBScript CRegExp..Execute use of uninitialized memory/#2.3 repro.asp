<%
Set oRegExp = New RegExp
oRegExp.Pattern = "A|()*?$"
oRegExp.Global = True
oRegExp.Execute(String(&H11, "A") & "x")
%>