MSIE 11 MSHTML CPasteCommand::ConvertBitmaptoPng heap-based buffer overflow
===========================================================================
([MS14-056][], [CVE-2014-4138][])

[MS14-056]: https://technet.microsoft.com/en-us/library/security/MS14-056
[CVE-2014-4138]: http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-4138

Synopsis
--------
A specially crafted web-page can trigger an out-of-bounds write in Microsoft
Internet Explorer 11. Code that handles pasting images from the clipboard uses
an incorrect buffer length, which allows writing beyond the boundaries of a
heap-based buffer. An attacker able to trigger this vulnerability can execute
arbitrary code.

Known affected software, attack vectors and potential mitigations
-----------------------------------------------------------------
* **Microsoft Internet Explorer 11.0.9600.16521** 

  An attacker would need to get a target user to open a specially crafted
  web-page. In order to trigger the issue, the web-page needs to either
  programmatically copy/paste an image using Javascript or get the user to do
  this (for instance by tricking the user into typing keyboard shortcuts such
  as CTRL+C/CTRL+V) . By default, MSIE prompts the user to allow or disallow
  programmatically copy/pasting the first time a website tries to do this, so
  user-interaction is normally required in such cases. Disabling the `Allow
  Programmatic clipboard access` setting in `Internet Options` -> `Security
  Settings` -> [Choose a zone] -> `Scripting` should prevent websites from
  programmatically copy/pasting an image. Disabling execution of scripts on
  web-pages altogether will have the same effect. Please note that neither
  option prevents a website from social engineering the user into typing a
  keyboard shortcut to copy/paste the image.

Details
-------
When an image is pasted in MSHTML, it gets converted from BMP format to PNG.
This is done in the `MSHTML!CPasteCommand::ConvertBitmaptoPng` function. This
function incorrectly uses the size of the original BMP image to allocate memory
for storing the converted PNG image. The PNG image will be smaller than the BMP
under most circumstances, but if a specially crafted image leads to the
original BMP image being smaller than the converted PNG, the function will
write PNG data beyond the bounds of the allocated memory.

Here is some pseudo code that was created by reverse engineering the
`CPasteCommand::ConvertBitmaptoPng` function, which shows the vulnerability:
```C++
ConvertBitmaptoPng(
  [IN] VOID* poBitmap,  UINT uBitmapSize,
  [OUT] VOID** ppoPngImage, UINT* puPngImageSize
) {
  // Convert a BMP formatted image to a PNG formatted image.
  CMemStm* poCMemStm;
  IWICStream* poWicBitmap;
  STATSTG oStatStg;
  TSmartArray<unsigned char> poPngImage;
  UINT uReadSize;
  // Create a CMemStm for the PNG image.
  CreateStreamOnHGlobal(NULL, True, poCMemStm);
  // Create an IWICStream from the BMP image.
  InitializeFromMemory(poBitMap, uBitmapSize,
      &GUID_ContainerFormatBmp, &poWicBitmap)));
  // Write BMP image in IWICStream to PNG image in CMemStm
  WriteWicBitmapToStream(poWicBitmap, &GUID_ContainerFormatPng, poCMemStm);
  // Get size of PNG image in CMemStm and save it to the output variable.
  oCMemStm->Stat(&oStatStg, 0);
  *puPngImageSize = oStatStg.cbSize.LowPart;
  // Allocate memory for the PNG
  poPngImage->New(uBitmapSize);
  // Go to start of PNG image in CMemStm
  poCMemStm->Seek(0, STREAM_SEEK_SET, NULL, &pPositionLow);
  // Read PNG image in CMemStm to allocated memory.
  poCMemStm->Read(poPngImage, *puPngImageSize, &uReadSize);
  // Save location of allocated memory with PNG image to output variable.
  *ppoPngImage = poPngImage;
}
```

Notes:
+ The code uses the wrong size to allocate memory in
  `poPngImage->New(uBitmapSize);`. Changing this line of code to
  `poPngImage->New(*puPngImageSize);` should address the issue.
+ The PNG image is written to the allocated memory in
  `poCMemStm->Read(poPngImage, *puPngImageSize, &uReadSize);`. This is where
  the code can potentially write beyond the boundaries of the allocated memory
  if `uBitmapSize` is smaller than `*puPngImageSize`.
