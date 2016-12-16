const AtomicString& AXObject::getAttribute(const QualifiedName& attribute) const
{
    Node* elementNode = node();   /*** returns bad value ***/
    if (!elementNode)
        return nullAtom;

    if (!elementNode->isElementNode()) /*** Potential crash here ***/
        return nullAtom;

    Element* element = toElement(elementNode);
    return element->fastGetAttribute(attribute); /*** Potential crash here ***/
//                  | 
//                  `---------------.
//                                  V
inline const AtomicString& Element::fastGetAttribute(const QualifiedName& name) const
{
    ASSERT(fastAttributeLookupAllowed(name));
    if (elementData()) { /*** Potential crash here ***/
        if (const Attribute* attribute = elementData()->attributes().find(name)) /*** Potential crash here ***/
//                                                                   |
//                                                                   `---------------------------------------------------------------------------.
//                                                                                                                                               V
template <typename Container, typename ContainerMemberType>
inline typename AttributeCollectionGeneric<Container, ContainerMemberType>::iterator AttributeCollectionGeneric<Container, ContainerMemberType>::find(const QualifiedName& name) const
{
    /*** this is working on corrupted data and almost certain to crash ***/
    iterator end = this->end();
    for (iterator it = begin(); it != end; ++it) {
        if (it->name().matches(name))
            return it;
    }
    return nullptr;
}

