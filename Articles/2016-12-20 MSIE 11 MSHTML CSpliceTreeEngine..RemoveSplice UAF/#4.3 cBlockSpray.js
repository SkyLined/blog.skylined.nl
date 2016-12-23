var cBlockSpray = (function() {
  var uChunkSize = 0x10000;
  var uBlockHeaderSize = 0x10;
  var uBlockFooterSize = 0x04;
  var asChunkTemplate = new Array(uChunkSize / 2);
  for (var uIndex = 0; uIndex < asChunkTemplate.length; uIndex += 2) {
    asChunkTemplate[uIndex] = String.fromCharCode(uIndex);
    asChunkTemplate[uIndex + 1] = String.fromCharCode(0xDEAD);
  }
  return function cBlockSpray(uBlockCount, uChunkCount) {
    this.uBlockSize = uChunkCount * uChunkSize - uBlockHeaderSize - uBlockFooterSize;
    var sChunk = asChunkTemplate.join("");
    var sBlock, asBlocks = new Array(uBlockCount);
    this.setChunkDWord = function (uOffset, uValue) {
      this.setChunkWord(uOffset, uValue & 0xFFFF);
      this.setChunkWord(uOffset + 2, (uValue >> 16) & 0xFFFF);
    }
    this.setChunkWord = function (uOffset, uValue) {
      if (sBlock) throw new Error("Cannot set chunk values after generating block");
      if (uOffset & 1) throw new Error("uOffset (" + uOffset.toString(16) + ") must be Word aligned");
      if (uOffset >= uChunkSize) throw new Error("uOffset (" + uOffset.toString(16) + ") must be smaller than 0x" + uChunkSize.toString(16));
      var uIndex = uOffset / 2;
      var sValue = String.fromCharCode(uValue & 0xFFFF);
      sChunk = sChunk.substr(0, uIndex) + sValue + sChunk.substr(uIndex + 1);
    }
    this.generateBlock = function () {
      if (sBlock) throw new Error("Cannot generating block twice");
      sBlock = (
        sChunk.substr(uBlockHeaderSize / 2) +
        new Array(uChunkCount - 1).join(sChunk) +
        sChunk.substr(0, (uChunkSize - uBlockFooterSize) / 2)
      );
    }
    this.setBlockDWord = function (uOffset, uValue) {
      this.setBlockWord(uOffset, uValue & 0xFFFF);
      this.setBlockWord(uOffset + 2, (uValue >> 16) & 0xFFFF);
    }
    this.setBlockWord = function (uOffset, uValue) {
      if (!sBlock) this.generateBlock();
      if (uOffset & 1) throw new Error("uOffset (" + uOffset.toString(16) + ") must be Word aligned");
      var uIndex = (uOffset - uBlockHeaderSize) / 2;
      if (uIndex < 0) throw new Error("uOffset (" + uOffset.toString(16) + ") must be larger than 0x" + uBlockHeaderSize.toString(16));
      if (uIndex >= sBlock.length) throw new Error("uOffset (" + uOffset.toString(16) + ") must be smaller than 0x" + (uBlockHeaderSize + sBlock.length * 2).toString(16));
      var sValue = String.fromCharCode(uValue & 0xFFFF);
      sBlock = sBlock.substr(0, uIndex) + sValue + sBlock.substr(uIndex + 1);
    }
    this.spray = function() {
      if (!sBlock) this.generateBlock();
      for (var i = 0; i < uBlockCount; i++) {
        asBlocks[i] = ("" + sBlock).slice(0);
      }
    }
  }
})();