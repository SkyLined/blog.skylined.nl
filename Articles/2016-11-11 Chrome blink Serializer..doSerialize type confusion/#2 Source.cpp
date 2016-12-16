Serializer::StateBase* Serializer::doSerialize(v8::Handle<v8::Value> value, StateBase* next)
{
    m_writer.writeReferenceCount(m_nextObjectReference);
    uint32_t objectReference;
    uint32_t arrayBufferIndex;
    if ((value->IsObject() || value->IsDate() || value->IsRegExp())
        && m_objectPool.tryGet(value.As<v8::Object>(), &objectReference)) {
        // Note that IsObject() also detects wrappers (eg, it will catch the things
        // that we grey and write below).
        ASSERT(!value->IsString());
        m_writer.writeObjectReference(objectReference);
    } else if (value.IsEmpty()) {
        return handleError(InputError, "The empty property name cannot be cloned.", next);
    } else if (value->IsUndefined()) {
        m_writer.writeUndefined();

/*** SNIP more special cases for various object types, but not Symbol ***/

    } else {
/*** No special case; treat as a regular object: the bad cast happens here ***/
        v8::Handle<v8::Object> jsObject = value.As<v8::Object>();

/*** SNIP code proceeds to use the badly cast object ***/

    }
    return 0;
}
