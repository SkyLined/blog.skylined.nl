MSIE 9 IEFRAME CMarkupPointer::MoveToGap use-after-free
=======================================================
(The fix and CVE number for this issue are not known)

Synopsis
--------
A specially crafted web-page can trigger a use-after-free vulnerability in
Microsoft Internet Explorer 9. The use appears to happen only once almost
immediately after the free, which makes practical exploitation unlikely.

Known affected software and attack vectors
------------------------------------------
* **Microsoft Internet Explorer 9**

  An attacker would need to get a target user to open a specially crafted
  web-page. Disabling JavaScript should prevent an attacker from triggering the
  vulnerable code path.

Details
-------
It appears there is an implementation bug in the `splitText` method of
`CDATASection` (Text) objects in SVG. `splitText` should split a `Text` node
into two `Text` nodes, by creating a new `Text` node and moving some of the
text data from the original node to the new node. After this, each node
contains a sub-string of the original text.

The bug can be triggered by calling this method with zero as the index argument
on a `CDATASection` which contains some text. In this case, the code will
return a new `Text` node that contains the entire text but it does not remove
the text from the original node. I am speculating that this causes an
additional reference to the test data without increasing its reference counter.
This failure to increase the reference counter can cause this reference counter
to drop to zero before all references are destroyed. I believe this is the case
because the below repro triggers a use-after-free.

```HTML
<svg xmlns='http://www.w3.org/2000/svg'>
  <script type="text/javascript">
    var oCDATASection = document.createCDATASection("Aa");
    oTextNode1 = oCDATASection.splitText(0);
    alert("Expected ''+'Aa', got '" + oCDATASection.wholeText + "'+'" + oTextNode1.wholeText + "'");
    oCDATASection.appendData("Bb");
    alert("Expected 'Bb'+'Aa', got '" + oCDATASection.wholeText + "'+'" + oTextNode1.wholeText + "'");
    oTextNode3 = oCDATASection.splitText(0);
// Uncommenting the following line prevents the crash - not sure why.
//    alert("Expected ''+'Bb'+'Aa', got '" + oCDATASection.wholeText + "'+'" + oTextNode3.wholeText + "'+'" + oTextNode1.wholeText + "'");
    oTextNode3.replaceWholeText("Cc");
  </script>
</svg>
```

I've created another, more complex repro as well: