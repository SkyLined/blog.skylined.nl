function getElementTree(oRootElement, bIncludeAll) {
  function getElementName(oElement) {
    return oElement ? (oElement.tagName || oElement.nodeName + ':"' + oElement.data + '"') : "null";
  }
  function getElementTreeLines(oElement, oExpectedParent, oExpectedPreviousSibling, oExpectedNextSibling,
      sFirstLinePrefix, sSubLinesPrefix) {
    if (!oElement) return [sFirstLinePrefix + "null"];
    var aoChildren = oElement.childNodes,
        sHeader = sFirstLinePrefix + getElementName(oElement);
    try {
      if (oExpectedParent && oElement.parentNode != oExpectedParent)
          sHeader += " (parent:" + getElementName(oElement.parentNode) + ")";
    } catch (e) {
      sHeader += " (parent error:" + e.message + ")"; 
    }
    try {
      if (oElement.previousSibling != oExpectedPreviousSibling) {
        sHeader += " (previousSibling:" + getElementName(oElement.previousSibling) + ")";
        oExpectedPreviousSibling && aoShouldBeIncludedElements.push(oElement.previousSibling);
      }
    } catch (e) {
      sHeader += " (previousSibling error:" + e.message + ")"; 
    }
    try {
      if (oElement.nextSibling != oExpectedNextSibling) {
        sHeader += " (nextSibling:" + getElementName(oElement.nextSibling) + ")";
        oExpectedNextSibling && aoShouldBeIncludedElements.push(oElement.nextSibling);
      }
    } catch (e) {
      sHeader += " (nextSibling error:" + e.message + ")"; 
    }
    try {
      if (aoChildren.length > 0 && oElement.firstChild != aoChildren.item(0)) {
        sHeader += " (firstChild:" + getElementName(oElement.firstChild) + ")";
        aoShouldBeIncludedElements.push(oElement.firstChild);
      }
    } catch (e) {
      sHeader += " (firstChild error:" + e.message + ")"; 
    }
    for (var i = 0; i < aoActuallyIncludedElements.length; i++) {
      if (aoActuallyIncludedElements[i] == oElement) {
        return [sHeader + " => previously referenced!"];
      }
    }
    var sLastChildErrorLine = null;
    try {
      if (aoChildren.length > 0 && oElement.lastChild != aoChildren.item(aoChildren.length - 1)) {
        sLastChildErrorLine = sSubLinesPrefix + "\u2514 lastChild:" + getElementName(oElement.lastChild);
        aoShouldBeIncludedElements.push(oElement.lastChild);
      }
    } catch (e) {
      sLastChildErrorLine = sSubLinesPrefix + "\u2514 lastChild error:" + e.message;
    }
    aoActuallyIncludedElements.push(oElement);
    var asTree = [sHeader], oPreviousSibling = null;
    for (var i = 0; i < aoChildren.length; i++) {
      try {
        var oChild = aoChildren.item(i)
      } catch (e) {
        asTree.push(sSubLinesPrefix + (i == aoChildren.length - 1 ? "\u255A" : "\u2560") + "child error:" + e.message);
        continue;
      }
      try {
        var oNextSibling = i + 1 <= aoChildren.length - 1 ? aoChildren.item(i + 1) : null;
      } catch (e) {
        oNextSibling = "error: " + e.message;
      }
      var asChildTree = getElementTreeLines(oChild, oElement, oPreviousSibling, oNextSibling, 
          sSubLinesPrefix + (i == aoChildren.length - 1 ? "\u255A" : "\u2560"),
          sSubLinesPrefix + (i == aoChildren.length - 1 ? (sLastChildErrorLine ? "\u2502" : " ") : "\u2551"));
      oPreviousSibling = oChild;
      for (j = 0; j < asChildTree.length; j++) {
        asTree.push(asChildTree[j]);
      }
    }
    if (sLastChildErrorLine) {
      asTree.push(sLastChildErrorLine);
    }
    return asTree;
  }
  var aoShouldBeIncludedElements = [oRootElement], aoActuallyIncludedElements = []
  var asTreeBlocks = [];
  find_next_missing_element:
  while(aoShouldBeIncludedElements.length) {
    var oShouldBeIncludedElement = aoShouldBeIncludedElements.pop();
    for (var j = 0; j < aoActuallyIncludedElements.length; j++) {
      if (oShouldBeIncludedElement == aoActuallyIncludedElements[j]) {
        continue find_next_missing_element;
      }
    }
    asTreeLines = getElementTreeLines(oShouldBeIncludedElement, oShouldBeIncludedElement.parentNode,
        oShouldBeIncludedElement.previousSibling, oShouldBeIncludedElement.nextSibling, 
        oShouldBeIncludedElement.parentNode ? "\u255A" : "",
        oShouldBeIncludedElement.parentNode ? " " : "");
    asTreeBlocks.push(asTreeLines.join("\r\n"));
    if (!bIncludeAll) break;
  }
  return asTreeBlocks.join("\r\n");
}
