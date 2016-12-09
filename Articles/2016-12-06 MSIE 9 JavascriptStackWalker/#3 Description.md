Description
-----------
A Javascript can construct an `URIError` object and sets that object's `name`
property to refer to the `URIError` object, creating a circular reference. When
that Javascript than attempts to convert the `URIError` object to a string,
MSIE attempts to convert the `URIError` object's `name` to a string, which
creates a recursive code loop that eventually causes a stack exhaustion.

MSIE attempts to handle this situation gracefully by generating a JavaScript
exception. While generating the exception, information about the call stack is
gathered using the JavascriptStackWalker class. It appears that the code that
does this initializes a pointer variable on the stack the first time it is run,
but re-uses it if it gets called a second time. Unfortunately, the information
the pointer points to is also stored on the stack, but is removed from the
stack after the first exception is handled. Careful manipulation of the stack
during both exceptions allow an attacker to control the data the pointer points
to during the second exception.

This problem is not limited to the `URIError` object: any recursive function
call can be used to trigger the issue, as shown in the exploit below.
