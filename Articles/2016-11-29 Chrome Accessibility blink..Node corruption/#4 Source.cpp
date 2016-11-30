void AXNodeObject::insertChild(AXObject* child, unsigned index)
{
    if (!child)
        return;

    // If the parent is asking for this child's children, then either it's the first time (and clearing is a no-op),
    // or its visibility has changed. In the latter case, this child may have a stale child cached.
    // This can prevent aria-hidden changes from working correctly. Hence, whenever a parent is getting children, ensure data is not stale.
    child->clearChildren();

    if (child->accessibilityIsIgnored()) {
//      |
//      `------.
//             V
bool AXObject::accessibilityIsIgnored() const
{
    updateCachedAttributeValuesIfNeeded();
//  |
//  `----------.
//             V
void AXObject::updateCachedAttributeValuesIfNeeded() const
{
    if (isDetached())
        return;

    AXObjectCacheImpl& cache = axObjectCache();

    if (cache.modificationCount() == m_lastModificationCount)
        return;

    m_lastModificationCount = cache.modificationCount();
    m_cachedIsInertOrAriaHidden = computeIsInertOrAriaHidden();
    m_cachedIsDescendantOfLeafNode = (leafNodeAncestor() != 0);
    m_cachedIsDescendantOfDisabledNode = (disabledAncestor() != 0);
    m_cachedHasInheritedPresentationalRole = (inheritsPresentationalRoleFrom() != 0);
//                                            |
//                            ,---------------'
//                            V
const AXObject* AXNodeObject::inheritsPresentationalRoleFrom() const
{
    // ARIA states if an item can get focus, it should not be presentational.
    if (canSetFocusAttribute())
        return 0;

    if (isPresentational())
        return this;

    // http://www.w3.org/TR/wai-aria/complete#presentation
    // ARIA spec says that the user agent MUST apply an inherited role of presentation
    // to any owned elements that do not have an explicit role defined.
    if (ariaRoleAttribute() != UnknownRole)
        return 0;

    AXObject* parent = parentObject();
    if (!parent)
        return 0;

    HTMLElement* element = nullptr;
    if (node() && node()->isHTMLElement())
        element = toHTMLElement(node());
    if (!parent->hasInheritedPresentationalRole()) {
//               |
//             ,-'
//             V
bool AXObject::hasInheritedPresentationalRole() const
{
    updateCachedAttributeValuesIfNeeded();
//  |
//  `----------.
//             V
void AXObject::updateCachedAttributeValuesIfNeeded() const
{
    if (isDetached())
        return;

    AXObjectCacheImpl& cache = axObjectCache();

    if (cache.modificationCount() == m_lastModificationCount)
        return;

    m_lastModificationCount = cache.modificationCount();
    m_cachedIsInertOrAriaHidden = computeIsInertOrAriaHidden();
    m_cachedIsDescendantOfLeafNode = (leafNodeAncestor() != 0);
    m_cachedIsDescendantOfDisabledNode = (disabledAncestor() != 0);
    m_cachedHasInheritedPresentationalRole = (inheritsPresentationalRoleFrom() != 0);
//                                            |
//                            ,---------------'
//                            V
const AXObject* AXNodeObject::inheritsPresentationalRoleFrom() const
{
    // ARIA states if an item can get focus, it should not be presentational.
    if (canSetFocusAttribute())
//      |
//      `----------.
//                 V
bool AXNodeObject::canSetFocusAttribute() const
{
    Node* node = this->node();   /*** returns bad value ***/
    if (!node)
        return false;

    if (isWebArea())
        return true;

    // NOTE: It would be more accurate to ask the document whether setFocusedNode() would
    // do anything. For example, setFocusedNode() will do nothing if the current focused
    // node will not relinquish the focus.
    if (!node)
        return false;

    if (isDisabledFormControl(node))
//      |
//      `---.
//          V
inline bool isDisabledFormControl(const Node* node) /*** node is corrupted ***/
{
    return node->isElementNode() && toElement(node)->isDisabledFormControl();     /*** Potential crash here ***/

