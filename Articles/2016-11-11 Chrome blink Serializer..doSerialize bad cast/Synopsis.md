(This fix and CVE number for this issue are not known)

When serializing JavaScript objects for sending to another window using the
`postMessage` method, the code in blink does not handle `Symbol` objects
correctly and attempts to serialize this kind of object as a regular object,
which results in a bad cast. An attacker that can trigger this issue may be
able to execute arbitrary code.
