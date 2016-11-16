void MSHTML!CMapElement::Notify(CNotification* pNotification) {
  CElement::Notify(pArg1);

  if (pNotification->dwCode_00 == 17) { // add
    CMarkup* pMarkup = this->CElement::GetMarkup();
    this->pNextMapElement_38 = pMarkup->GetMapHead();
    pMarkup->CMarkup::SetMapHead(this);
  } else if (pNotification->dwCode_00 == 18) { // remove
    CMarkup* pMarkup = this->CElement::GetMarkup();
    CDoc pDoc = pMarkup->CMarkup::GetLookasidePtr(4);
    CMapElement** ppMapElement = &(pDoc->pMapElement_08);
    while(*ppMapElement) {
      if (*ppMapElement == this) {
        *ppMapElement = this->pMapElement_38;
        break;
      }
      ppMapElement = &(*ppMapElement->pMapElement_38);
    }
  }
}
