enum eTreePosFlags {
  fTPBegin =           0x01, // if set, this is a markup node
  fTPEnd =             0x02, // if set, this is a markup node
  fTPText =            0x04, // if set, this is a markup node
  fTPPointer =         0x08, // if set, this is not a markup node
  fTPTypeMask =        0x0f
  fTPLeftChild =       0x10,
  fTPLastChild =       0x20, // poNextSiblingOrParent => fTPLastChild ? parent : sibling
  fTPData2Pos =        0x40, // valid if fTPPointer is set
  fTPDataPos =         0x80,
  fTPUnknownFlag100 = 0x100, // if set, this is not a markup node
}
struct CTreePos {
  /*offs size*/                                             // THE BELOW ARE BEST GUESSES BASED ON INADEQUATE INFORMATION!!
  /*0000 0004*/ eTreePosType  fFlags00;                     
  /*0004 0004*/ UINT          uCharsCount04;                // Seems to be counting some chars - not sure what exactly
  /*0008 0004*/ CTreePos*     poFirstChild;                 // can be NULL if no children exist.
  /*000C 0004*/ CTreePos*     poNextSiblingOrParent;        // fFlags00 & fTPLastChild ? parent end tag : sibling start tag
  /*0010 0004*/ CTreePos*     poThreadLeft10;               // fFlags00 & fTPBegin ? previous sibling or parent : last child or start tag
  /*0014 0004*/ CTreePos*     poThreadRight14;              // fFlags00 & fTPBegin ? first child or end tag : 
                                                            
  /*0018 0004*/ flags  (0x10 = something with CDATA         
  /*0028 0004*/                                             
}                                                           

struct CTreeNode {
  /*offs size*/                                             // THE BELOW ARE BEST GUESSES BASED ON INADEQUATE INFORMATION!!
  /*0000 0004*/ CElement*     poElement00;                  
  /*0004 0004*/ CTreeNode*    poParent04;                   
  /*0008 0004*/ DWORD         dwUnknown08;                  // flags?
  /*000C 0018*/ CTreePos      oTreePosBegin0C;              // represents the position in the document immediately before the start tag
  /*0024 0018*/ CTreePos      oTreePosEnd24;                // represents the position in the document immediately after the end tag
  /*003C ????*/ Unknown
}
struct TextNode { // I did not figure out what this is called in MSIE
  /*0000 0018*/ CTreePos      oTreePosEnd00;                // represents the position in the document immediately after the node.
  /*0018 0014*/ Unknown
}

CTreeNode* CTreePos::Branch() {
  // Given a pointer to a CTreePos instance in a CTreeNode instance, calculate a pointer to the CTreeNode instance.
  // The CTreePos instance must be either the oTreePosBegin0C (oTreePosBegin0C->fFlags00 & fTPBegin != 0) or the
  // oTreePosEnd24 (oTreePosEnd24->fFlags00 & fTPEnd != 0).
  BOOL bIsTreePosBegin0C = this->fFlags00 & fTPBegin;
  INT uOffset = offsetof(CTreeNode, bIsTreePosBegin0C ? oTreePosBegin0C : oTreePosEnd24);
  return (CTreeNode*)((BYTE*)this - uOffset);
}

BOOL CGeneratedContent::HasGeneratedSVGMarker() {
  for (
    CTreePos* poCurrentTreePos = this->oTreePosBegin0C.poThreadRight14,
      CTreePos* poEndTreePos = &(this->oTreePosEnd24);
    poCurrentTreePos != poEndTreePos;
    poCurrentTreePos = poCurrentTreePos->poThreadRight14
  ) {
    if (poCurrentTreePos->fFlags00 & fTPUnknownFlag100) {
      // Calling Branch is only valid in the context of CTreePos embedded in a CTreeNode, so the code should check for
      // the presence of fTPBegin or fTPEnd in fFlags00 before doing so. This line of code may fix the issue:
      // if (poCurrentTreePos->fFlags00 & (fTPBegin | fTPEnd) == 0) continue;
      CTreeNode* poTreeNode = poCurrentTreePos->Branch();
      if (poTreeNode && poTreeNode->dw64 == 20) {
          return 1
      }
    }
  }
  return 0
}
