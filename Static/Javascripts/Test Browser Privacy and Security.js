var EOL = {};
function fAddContentsToElement(oElement, xContents) {
  if (typeof xContents == "string") {
    // String? => add a text node
    oElement.appendChild(document.createTextNode(xContents));
  } else if (xContents instanceof Array) {
    // Array? => add individual elements sequentially
    for (var uIndex = 0; uIndex < xContents.length; uIndex++) {
      fAddContentsToElement(oElement, xContents[uIndex]);
    };
  } else if (xContents === EOL) {
    oElement.appendChild(document.createElement("br"));
  } else if (xContents instanceof Node) {
    // Assume this is a DOM Node:
    oElement.appendChild(xContents);
  } else {
    console.log("Unknown content type", xContents);
    throw new Error("Unknown content type: " + xContents);
  };
};
function foCreateLinkElementWithContent(sURL, xContents) {
  // Create a link element with specified contents:
  var oLinkElement = foCreateElementWithContents("a", xContents);
  oLinkElement.href = sURL;
  return oLinkElement;
};
function foCreateElementWithContents(sTagName, xContents) {
  var oHeaderElement = document.createElement(sTagName);
  fAddContentsToElement(oHeaderElement, xContents);
  return oHeaderElement;
};
// Warnings are queued until the page is loaded. When the page is loaded, all queued warnings are shown and removed.
// from the queue. Any subsequent warnings are queued, immediately shown and removed from the queue.
var bPageLoaded = false,
    axQueuedWarnings = [];
function fShowOrQueueWarning(xWarning) {
  axQueuedWarnings.push(xWarning);
  if (bPageLoaded) fShowQueuedWarnings();
};
function fShowQueuedWarnings() {
  oSecurityWarningsElement.style.setProperty("display", "block");
  fAddContentsToElement(oSecurityWarningsElement, axQueuedWarnings);
  axQueuedWarnings = [];
};
addEventListener("load", function () {
  bPageLoaded = true;
  if (axQueuedWarnings.length > 0) fShowQueuedWarnings();
});
// Test referrer information leak:
if (document.referrer) {
  console.log("document.referrer: ", document.referrer);
  if (!/^https?:\/\/\w+\.skylined.nl(\/.*)$/.exec(document.referrer)) {
    console.log("Detected referrer information leak: showing warning");
    fShowOrQueueWarning([
      foCreateElementWithContents("h3", "Privacy warning: document.referrer leak detected!"), EOL,
      "This is a friendly warning that your web-browser appears to be leaking the address of the page from which ",
      "you arrived on this website. You may want to reconfigure your web-browser to prevent this, install and ",
      "use an add-on that hides referers, or switch to a different web-browser if none of these options are possible.",
      EOL,
      EOL,
      "You came here from this website: ",
      foCreateElementWithContents("strong", document.referrer), ".", EOL,
      EOL,
      "For more information see the Mozilla Developer Network page for ",
      foCreateLinkElementWithContent("https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer", "Document.referrer"), " ",
      "and/or the Wikipedia page for ",
      foCreateLinkElementWithContent("https://en.wikipedia.org/wiki/HTTP_referer#Referer_hiding", "Referer hiding"),
      ".", EOL,
      EOL,
    ]);
  };
};
// Test cookies by saving the time in a cookie continuously when the page is open. When all pages are closed, the
// cookie should be deleted. Before we start setting the cookie, there should be none: if there is, that means the
// browser has saved the last cookie set the previous time the page was open. We can determine how long ago this was
// from the cookie value.
var SECONDS = 1000, MINUTES = 60 *SECONDS, HOURS = 60 *MINUTES, DAYS = 24 *HOURS, WEEKS = 7 *DAYS, MONTHS = 30 *DAYS, YEARS = 365 *DAYS;
console.log("document.cookie: ", document.cookie);
var asCookies = document.cookie.split('; ');
    dsCookies = {};
for (var uIndex = 0; uIndex < asCookies.length; uIndex++){
  var asCookie = asCookies[uIndex].split("="),
      sName = asCookie.shift(),
      sValue = asCookie.join("=");
  if (sName == "LastCookieSetTime") {
    uLastCookieSetTime = parseInt(sValue);
    var uTimeSinceLastCookieWasSet  = new Date().getTime() - uLastCookieSetTime;
    var sTimeSinceLastCookieWasSet;
    if (uTimeSinceLastCookieWasSet > YEARS) {
      var uYears = Math.round(uTimeSinceLastCookieWasSet / YEARS);
      sTimeSinceLastCookieWasSet = uYears + " year" + (uYears > 1 ? "s" : "");
    } else if (uTimeSinceLastCookieWasSet > MONTHS) {
      var uMonths = Math.round(uTimeSinceLastCookieWasSet / MONTHS);
      sTimeSinceLastCookieWasSet = uMonths + " month" + (uMonths > 1 ? "s" : "");
    } else if (uTimeSinceLastCookieWasSet > WEEKS) {
      var uWeeks = Math.round(uTimeSinceLastCookieWasSet / WEEKS);
      sTimeSinceLastCookieWasSet = uWeeks + " week" + (uWeeks > 1 ? "s" : "");
    } else if (uTimeSinceLastCookieWasSet > DAYS) {
      var uDays = Math.round(uTimeSinceLastCookieWasSet / DAYS);
      sTimeSinceLastCookieWasSet = uDays + " day" + (uDays > 1 ? "s" : "");
    } else if (uTimeSinceLastCookieWasSet > HOURS) {
      var uHours = Math.round(uTimeSinceLastCookieWasSet / HOURS);
      sTimeSinceLastCookieWasSet = uHours + " hour" + (uHours > 1 ? "s" : "");
    } else {
      var uMinutes = Math.round(uTimeSinceLastCookieWasSet / MINUTES);
      sTimeSinceLastCookieWasSet = uMinutes + " minutes";
    };
    console.log("uTimeSinceLastCookieWasSet: ", uTimeSinceLastCookieWasSet, " (about " + sTimeSinceLastCookieWasSet + " ago)");
    // Allow for cookie managers that keep cookies around for some time after closing the last page of this
    // website, in case you want to reopen it without needing to log back in. This should not last more than
    // 10 minutes:
    if (uTimeSinceLastCookieWasSet > 10 *MINUTES) {
      console.log("Detected cookie that was set a long time ago: showing warning");
      fShowOrQueueWarning([
        foCreateElementWithContents("h3", "Privacy warning: persistent cookies detected!"), EOL,
        "This is a friendly warning that your web-browser does not appear to have deleted cookies for this website ",
        "since the last time you visited it. There is no need for your browser to save cookies for this website, but ",
        "cookies can be abused by malicious websites to track you. You may want to reconfigure your web-browser to ",
        "only store cookies for sites that you need them on (e.g. site that you want to remain logged-in to even ",
        "after you've restarted your web-browser), install and use a cookie-management add-on, or switch to a ",
        "different web-browser if none of these options are possible.", EOL,
        EOL,
        "The last time you visited this website was ", foCreateElementWithContents("strong", [
          "about " + sTimeSinceLastCookieWasSet + " ago at ", new Date(uLastCookieSetTime).toLocaleString()
        ]), ".", EOL,
        EOL,
        "For more information see the Wikipedia page for ",
        foCreateLinkElementWithContent("https://en.wikipedia.org/wiki/HTTP_cookie", "HTTP cookies"), ".", EOL,
        EOL,
      ]);
    };
  };
};
setInterval(function () {
  document.cookie = "LastCookieSetTime=" + new Date().valueOf() + "; expires=" + new Date(new Date().getTime() + 10 *YEARS).toGMTString();
  console.log("document.cookie: ", document.cookie);
}, 10 *SECONDS);
// Test ad-blocker by trying to load a file from a URL that matches ".com/ads.js", as this is commonly blocked:
var bAdBlockerDetected = undefined,
    oXHR = new XMLHttpRequest(),
    bAdBlockerCheckCompleted = false;
oXHR.addEventListener("readystatechange", function() {
  if (oXHR.readyState == 4 && oXHR.status == 200) { // Loaded successfully: assume no ad-blocker installed.
    console.log("Status code when loading ads.js: ", oXHR.status);
    console.log("Detected no ad-blocker: showing warning");
    fShowOrQueueWarning([
      foCreateElementWithContents("h3", "Security warning: No ad-blocker detected!"), EOL,
      "This is a friendly warning that you do not appear to have an ad-blocker installed. Malicious advertisements ",
      "are regularly abused as an attack vector to compromise machines when a user visits a website that shows these ",
      "advertisements. You may want to install and use an ad-blocker add-on, or switch to a different web-browser if ",
      "none of these options are possible.", EOL,
      EOL,
      "For more information see the Wikipedia page for ",
      foCreateLinkElementWithContent("https://en.wikipedia.org/wiki/Malvertising", "Malvertising"),
      ".", EOL,
      EOL,
    ]);
  };
});
oXHR.open("GET", "/x.com/ads.js", true);
oXHR.send();
// Test WebRTC local IP address leak
RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
if (RTCPeerConnection) {
  var oRTCPeerConnection = new RTCPeerConnection({"iceServers": [{"urls": "stun:stun.services.mozilla.com"}]}),
      dsLocalIPAddresses = {};
  oRTCPeerConnection.addEventListener("icecandidate",function (oRTCPeerConnectionIceEvent) {
    var oRTCIceCandidate = oRTCPeerConnectionIceEvent.candidate;
    if (oRTCIceCandidate) {
      console.log("oRTCIceCandidate:", oRTCIceCandidate);
      var asCandidate = oRTCIceCandidate.candidate.split(" ");
      if (asCandidate[7] == "host") {
        var sLocalIPAddress = asCandidate[4];
        if (/[0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7}/.exec(sLocalIPAddress)) {
          dsLocalIPAddresses[sLocalIPAddress] = 1;
        };
      };
    } else {
      var asLocalIPAddresses = Object.keys(dsLocalIPAddresses);
      console.log("asLocalIPAddresses:", asLocalIPAddresses);
      if (asLocalIPAddresses.length > 0) {
        console.log("Detected local IP address: showing warning");
        fShowOrQueueWarning([
          foCreateElementWithContents("h3", "Security warning: WebRTC local IP address leak detected!"), EOL,
          "This is a friendly warning that your web-browser appears to be leaking the local IP address of your ", 
          "device through the WebRTC feature. This information is useful if a malicious websites wants to scan your ",
          "local network and/or attack this and other devices on your local network. You may want to reconfigure your ",
          "web-browser, install and use an add-on that hides local IP addresses in WebRTC , or switch to a different ",
          "web-browser if none of these options are possible.", EOL,
          EOL,
          "The leaked local IP address", asLocalIPAddresses.length == 1 ? " is" : "es are", ": ",
          asLocalIPAddresses.join(", "), ".", EOL,
          EOL,
        ]);
      };
    };
  });
  oRTCPeerConnection.createDataChannel("");
  oRTCPeerConnection.createOffer(function (oRTCSessionDescription){
    console.log("oRTCSessionDescription:", oRTCSessionDescription);
    oRTCPeerConnection.setLocalDescription(oRTCSessionDescription, function() {
      console.log("RTCPeerConnection setup completed");
    }, function(sErrorMessage) {
      console.log("RTCPeerConnection.setLocalDescription error:", sErrorMessage);
    });
  }, function (sErrorMessage) {
    console.log("RTCPeerConnection.createOffer error:", sErrorMessage);
  });
};
// Test if Adobe Flash is installed
console.log('navigator.mimeTypes["application/x-shockwave-flash"]: ', navigator.mimeTypes["application/x-shockwave-flash"]);
console.log("Attempting to loading a Flash object");
var oFlashElement = document.createElement("object");
oFlashElement.setAttribute("type", "application/x-shockwave-flash");
oFlashElement.setAttribute("data", "/Flash/HelloWorld.swf");
oFlashElement.addEventListener("readystatechange", function() {
  if (oFlashElement.readyState == 4) {
    console.log("Detected Adobe Flash: showing warning");
    fShowOrQueueWarning([
      foCreateElementWithContents("h3", "Security warning: Adobe Flash detected!"), EOL,
      "This is a friendly warning that your web-browser appears to have Adobe Flash installed and enabled for use on ",
      "this website. There is no need for your browser to allow Adobe Flash on this website, but it is regularly ",
      "abused as an attack vector to compromise machines. You may want to un-install Flash, reconfigure your ",
      "web-browser to block Flash on all websites unless you specifically enable it, use a plugin-management add-on, ",
      "or switch to a different web-browser if none of these options are possible.", EOL,
      EOL,
    ]);
  };
});
// Test Content Security Policy
function fReportInlineScriptContentSecurityPolicyViolation() {
  // The page will attempt to execute an inline script which calls this function. This is forbidden by CSP, so if this
  // function does get called, it should be reported.
  console.log("Detected CSP violation for inline scripts: showing warning");
  fShowOrQueueWarning([
    foCreateElementWithContents("h3", "Security warning: inline script Content Security Policy is not enforced!"), EOL,
    "This is a friendly warning that your web-browser does not appear to implement Content Security Policy ",
    "correctly. Specifically, it does not prevent execution of inline script even though this website explicitly ",
    "asked it to. Content Security Policy is a standard that can mitigate and prevent various attacks. You may want ",
    "to switch to a different web-browser that does implement it correctly.", EOL,
    EOL,
    "For more information see the Wikipedia page for ",
    foCreateLinkElementWithContent("https://en.wikipedia.org/wiki/Content_Security_Policy", "Content Security Policy"),
    ".", EOL,
    EOL,
  ]);
};
// Create an iframe to open a new windows in, to check if the "opener" property is null or not.
console.log("Attempting to load a blank page in an iframe to check for opener CSP violation");
var oCSPOpenerTestIFrame = document.createElement("iframe");
oCSPOpenerTestIFrame.style.setProperty("visibility", "hidden");
oCSPOpenerTestIFrame.style.setProperty("position", "absolute");
oCSPOpenerTestIFrame.style.setProperty("left", "0");
oCSPOpenerTestIFrame.style.setProperty("top", "0");
oCSPOpenerTestIFrame.style.setProperty("height", "0");
oCSPOpenerTestIFrame.style.setProperty("width", "0");
oCSPOpenerTestIFrame.style.setProperty("border", "none");
oCSPOpenerTestIFrame.style.setProperty("z-index", "-1");
oCSPOpenerTestIFrame.setAttribute("name", "CSPOpenerTestIFrame");
document.documentElement.appendChild(oCSPOpenerTestIFrame);
open("Test Content Security Policy violations.html", "CSPOpenerTestIFrame");
function fReportContentSecurityPolicyViolations(asViolatedDirectives) {
  document.documentElement.removeChild(oCSPOpenerTestIFrame);
  if (asViolatedDirectives.length > 0) {
    var asQuotedViolatedDirectives = asViolatedDirectives.map(function (s) { return "'" + s + "'"; }),
        sLastQuotedViolatedDirective = asQuotedViolatedDirectives.pop();
        sFirstQuotedViolatedDirectives = asQuotedViolatedDirectives.join(", ");
        sQuotedViolatedDirectives = (sFirstQuotedViolatedDirectives ? sFirstQuotedViolatedDirectives + " and " : "") + 
              sLastQuotedViolatedDirective;
    console.log("Detected CSP violation for " + sQuotedViolatedDirectives + ": showing warning");
    fShowOrQueueWarning([
      foCreateElementWithContents("h3", "Security warning: Not all Content Security Policy directives are enforced!"), EOL,
      "This is a friendly warning that your web-browser does not appear to implement all Content Security Policy ",
      "features correctly. Specifically, it does not apply the " + sQuotedViolatedDirectives + " directives that this ",
      "website explicitly asked for. Content Security Policy is a standard that can mitigate and prevent various ",
      "attacks. You may want to switch to a different web-browser that does implement it correctly.", EOL,
      EOL,
      "For more information see the Wikipedia page for ",
      foCreateLinkElementWithContent("https://en.wikipedia.org/wiki/Content_Security_Policy", "Content Security Policy"),
      ".", EOL,
      EOL,
    ]);
  };
};
if (navigator.doNotTrack != "1" && navigator.msDoNotTrack != "1") {
  console.log("Detected do-not-track is not enabled: showing warning");
  fShowOrQueueWarning([
    foCreateElementWithContents("h3", "Security warning: Do-Not-Track is not enabled!"), EOL,
    "This is a friendly warning that your web-browser does not appear to have Do-Not-Track enabled. When you enable ",
    "Do-Not-Track, your browser informs web servers that you do not wish to be tracked, which helps protect your ",
    "privacy online. You may want to enable Do-Not-Track in your browser, or switch to a different web-browser if ",
    "that is not possible.", EOL,
    EOL,
    "For more information see the Wikipedia page for ",
    foCreateLinkElementWithContent("https://en.wikipedia.org/wiki/Do_Not_Track", "Do Not Track"),
    ".", EOL,
    EOL,
  ]);
};