String.fromWord = function (wValue) {
  // Return a BSTR that contains the desired DWORD in its string data.
  return String.fromCharCode(wValue);
}
String.fromWords = function (awValues) {
  // Return a BSTR that contains the desired DWORD in its string data.
  return String.fromCharCode.apply(0, awValues);
}
String.fromDWord = function (dwValue) {
  // Return a BSTR that contains the desired DWORD in its string data.
  return String.fromCharCode(dwValue & 0xFFFF, dwValue >>> 16);
}
String.fromDWords = function (auValues) {
  var asDWords = new Array(auValues.length);
  for (var i = 0; i < auValues.length; i++) {
    asDWords[i] = String.fromDWord(auValues[i]);
  }
  return asDWords.join("");
}

String.prototype.repeat = function (uCount) {
  // Return the requested number of concatenated copies of the string.
  var sRepeatedString = "",
      uLeftMostBit = 1 << (Math.ceil(Math.log(uCount + 1) / Math.log(2)) - 1);
  for (var uBit = uLeftMostBit; uBit > 0; uBit = uBit >>> 1) {
    sRepeatedString += sRepeatedString;
    if (uCount & uBit) sRepeatedString += this;
  }
  return sRepeatedString;
}
String.createBuffer = function(uSize, uIndexSize) {
  // Create a BSTR of the right size to be used as a buffer of the requested size, taking into account the 4 byte
  // "length" header and 2 byte "\0" footer. The optional argument uIndexSize can be 1, 2, 4 or 8, at which point the 
  // buffer will be filled with indices of said size (this is slower but useful for debugging).
  if (!uIndexSize) return "\uDEAD".repeat(uSize / 2 - 3);
  var auBufferCharCodes = new Array((uSize - 4) / 2 - 1);
  var uMSB = uIndexSize == 8 ? 8 : 4; // Most significant byte.
  for (var uCharIndex = 0, uByteIndex = 4; uCharIndex < auBufferCharCodes.length; uCharIndex++, uByteIndex +=2) {
    if (uIndexSize == 1) {
      auBufferCharCodes[uCharIndex] = uByteIndex + ((uByteIndex + 1) << 8);
    } else {
      // Set high bits to prevents both NULLs and valid pointers to userland addresses.
      auBufferCharCodes[uCharIndex] = 0xF000 + (uByteIndex % uIndexSize == 0 ? uByteIndex & 0xFFF : 0);
    }
  }
  return String.fromCharCode.apply([][0], auBufferCharCodes);
}
String.prototype.clone = function () {
  // Create a copy of a BSTR in memory.
  sString = this.substr(0, this.length);
  sString.length;
  return sString;
}

String.prototype.replaceDWord = function (uByteOffset, dwValue) {
  // Return a copy of a string with the given dword value stored at the given offset.
  // uOffset can be a value beyond the end of the string, in which case it will "wrap".
  return this.replaceWord(uByteOffset, dwValue & 0xFFFF).replaceWord(uByteOffset + 2, dwValue >> 16);
}

String.prototype.replaceWord = function (uByteOffset, wValue) {
  // Return a copy of a string with the given word value stored at the given offset.
  // uOffset can be a value beyond the end of the string, in which case it will "wrap".
  if (uByteOffset & 1) {
    return this.replaceByte(uByteOffset, wValue & 0xFF).replaceByte(uByteOffset + 1, wValue >> 8);
  } else {
    var uCharIndex = (uByteOffset >>> 1) % this.length;
    return this.substr(0, uCharIndex) + String.fromWord(wValue) + this.substr(uCharIndex + 1);
  }
}
String.prototype.replaceByte = function (uByteOffset, bValue) {
  // Return a copy of a string with the given byte value stored at the given offset.
  // uOffset can be a value beyond the end of the string, in which case it will "wrap".
  var uCharIndex = (uByteOffset >>> 1) % this.length,
      wValue = this.charCodeAt(uCharIndex);
  if (uByteOffset & 1) {
    wValue = (wValue & 0xFF) + ((bValue & 0xFF) << 8);
  } else {
    wValue = (wValue & 0xFF00) + (bValue & 0xFF);
  }
  return this.substr(0, uCharIndex) + String.fromWord(wValue) + this.substr(uCharIndex + 1);
}

String.prototype.replaceBufferDWord = function (uByteOffset, uValue) {
  // Return a copy of a BSTR with the given dword value store at the given offset.
  if (uByteOffset & 1) throw new Error("uByteOffset (" + uByteOffset.toString(16) + ") must be Word aligned");
  if (uByteOffset < 4) throw new Error("uByteOffset (" + uByteOffset.toString(16) + ") overlaps BSTR size dword.");
  var uCharIndex = uByteOffset / 2 - 2;
  if (uCharIndex == this.length - 1) throw new Error("uByteOffset (" + uByteOffset.toString(16) + ") overlaps BSTR terminating NULL.");
  return this.substr(0, uCharIndex) + String.fromDWord(uValue) + this.substr(uCharIndex + 2);
}
