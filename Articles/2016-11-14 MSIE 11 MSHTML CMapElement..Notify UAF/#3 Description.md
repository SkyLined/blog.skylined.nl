AFAICT, this event-within-an-event itself is the root cause of the bug and
allows memory corruption in various ways. I discovered the issue because the
code in `CMapElement::Notify` does not handle this sequence of events well.
The below pseudo-code represents that function and shows how this can lead to
memory corruption:
