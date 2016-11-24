Description
-----------
Creating a `webkitSpeechRecognition` Javascript object in a popup window before
closing the popup frees a C++ object used internally by the speech recognition
API code but leaves a dangling pointer to the freed memory in another C++
object. When the `start()` Javascript method is called, this dangling pointer
is used to try to read a function pointer from a virtual function table and
call that function. An attacker has ample time to groom the heap between the
free and re-use in order to control the function pointer used by the code,
allowing arbitrary code execution.

This sequence of events describes the process happening in the repro:
1. When a new window is opened from Javascript, a C++
   `SpeechRecognitionClientProxy` object is instantiated.

2. When a new `webkitSpeechRecognition` object is created in Javascript, a 
   `SpeechRecognition` C++ object is created to back it up internally. 

3. In the constructor of the `SpeechRecognition` C++ object, the `m_controller`
   member variable is initialized by creating a new
   `SpeechRecognitionController` C++ object using
   `SpeechRecognitionController::from`.
   
   `speech/SpeechRecognition.cpp:`
   ```C++
   SpeechRecognition::SpeechRecognition(ExecutionContext* context)
   /* <<<snip>>> */
       m_controller = SpeechRecognitionController::from(page);
       ASSERT(m_controller);
   /* <<<snip>>> */
   ```

4. In the constructor of the `SpeechRecognitionController` C++ object, the
   `m_client` member variable is initialized by storing a pointer to the 
   `SpeechRecognitionClientProxy` C++ object created in step 1.
   
   `speech/SpeechRecognitionController.cpp:`
   ```C++
   SpeechRecognitionController::SpeechRecognitionController(PassOwnPtr<SpeechRecognitionClient> client)
       : m_client(client)
   /* <<<snip>>> */
   ```

5. When the window created in step 1 is closed, the
   `SpeechRecognitionClientProxy` C++ object created in step 1 is destroyed
   and the memory previously used to store the object is freed.

6. When the `start` Javascript method of the `webkitSpeechRecognition` object
   created in step 2 is called, the `start` C++ method of the
   `SpeechRecognitionController` object is called internally. This method in
   turn calls the `start` C++ method of the previously freed
   `SpeechRecognitionClientProxy` object through its `m_client` member
   variable.
   
   `speech/SpeechRecognition.cpp:`
   ```C++
   void SpeechRecognition::start(ExceptionState& exceptionState)
   /* <<<snip>>> */
       m_controller->start(/* <<<snip>>> */);
   /* <<<snip>>> */
   ```
   
   `speech/SpeechRecognitionController.h`:
   ```C++
   void start(/* <<<snip>>> */)
   {
       m_client->start(/* <<<snip>>> */);
   }
   ```
   
   In the last code snippet, when this code is executed, the `m_client` member
   no longer points to a valid object, as this object has been deleted and its
   memory freed.

Exploit
-------
An attacker looking to exploit this issue is going to want to try and control
the contents of the freed memory, before getting the code to use the dangling
pointer to call a virtual function. Doing so would allow an attacker to execute
arbitrary code. This is made possible because steps 5 and 6 can both be
triggered at a time of the attackers choosing, giving the attacker the ability
to free the memory in step 5 whenever this is convenient and attempt to
reallocate and fill it with any data before executing step 6. This should allow
an attacker to create a fake `vftable` pointer and gain arbitrary code
execution. In order to develop a working exploit, existing mitigations will
need to be bypassed, most significantly ASLR and DEP. As this vulnerability by
itself does not appear to allow bypassing these mitigations, I did not develop
a working exploit for it.

Time-line
---------
* *November 2014*: This vulnerability was found through fuzzing.
* *December 2014*: This vulnerability was submitted to [ZDI][] and
  [iDefense][].
* *January 2015*: This vulnerability was acquired by ZDI.
* *February 2015*: This vulnerability was fixed in [revision 190993][].
* *May 2015*: This vulnerability was addressed by Google in
  [Chrome 43.0.2357.65][].
* *November 2016*: Details of this issue are released.

[ZDI]: http://www.zerodayinitiative.com/
[iDefense]: https://labs.idefense.com/vcpportal/
[revision 190993]: https://src.chromium.org/viewvc/blink?view=revision&revision=190993
[Chrome 43.0.2357.65]: https://googlechromereleases.blogspot.nl/2015/05/stable-channel-update_19.html