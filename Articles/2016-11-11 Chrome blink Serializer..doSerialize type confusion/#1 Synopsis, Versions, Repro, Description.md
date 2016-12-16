Google Chrome blink Serializer::doSerialize bad cast
====================================================
(This fix and CVE number for this issue are not known)

Synopsis
--------
When serializing JavaScript objects for sending to another window using the
`postMessage` method, the code in blink does not handle `Symbol` objects
correctly and attempts to serialize this kind of object as a regular object,
which results in a bad cast. An attacker that can trigger this issue may be
able to execute arbitrary code.

Known affected versions, attack vectors and mitigations
-----------------------
* Chrome 38

  An attacker would need to get a target user to open a specially crafted
  webpage. Disabling JavaScript should prevent an attacker from triggering the
  vulnerable code path.

Repro
-----
```HTML
<script>
  postMessage(Symbol());
</script>
```

Description
-----------
The repro causes a call to `blink::V8Window::postMessageMethodCustom` (found in
`third_party\webkit\source\bindings\core\v8\custom\v8windowcustom.cpp`).
This method creates a `Serializer` object for the "script value" of the symbol.
In ``blink::`anonymous namespace'::Serializer::doSerialize`` (found in 
`third_party\webkit\source\bindings\core\v8\serializedscriptvalue.cpp`)
the code attempts to determine the type of object being serialized and runs
specific code to to serialize each type. This code does not distinguish between
a `Symbol` and a regular object, and therefor runs code designed to handle the
later to serialize the former. This results in a bad cast to a `v8::Object`.
