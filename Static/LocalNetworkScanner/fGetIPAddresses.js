function fGetIPAddresses(oIFrame, fSuccessCallback, fErrorCallback) {
  console.log("fGetIPAddresses");
  //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
  function fcGetRTCPeerConnection(oWindow) {
    return oWindow && (oWindow.RTCPeerConnection || oWindow.mozRTCPeerConnection || oWindow.webkitRTCPeerConnection);
  }
  var cRTCPeerConnection = fcGetRTCPeerConnection(window) || fcGetRTCPeerConnection(oIFrame.contentWindow);
  if (!cRTCPeerConnection) {
    fErrorCallback("RTCPeerConnection feature not available");
    return;
  };
  var oRTCPeerConnection = new cRTCPeerConnection( 
    { "iceServers": [ ] },
    {
      "optional": [
        { "RtpDataChannels": true },
        { "googIPv6": true },
      ]
    }
  );
  
  dsIPAddresses = {};
  if (oRTCPeerConnection.createDataChannel) {
    oRTCPeerConnection.onicecandidate = function fRTCPeerConnectionIceEventHandler(oRTCPeerConnectionIceEvent){
      console.log("fRTCPeerConnectionIceEventHandler");
      var oRTCIceCandidate = oRTCPeerConnectionIceEvent.candidate;
      if (oRTCIceCandidate) {
        var asCandidate = oRTCIceCandidate.candidate.split(" ");
        if (asCandidate[7] == "host") {
          var sIPAddress = asCandidate[4];
          if (/[0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7}/.exec(sIPAddress)) {
            dsIPAddresses[sIPAddress] = 1;
          } else {
            console.log("Ignored RTCIceCandidate " + JSON.stringify(oRTCIceCandidate.candidate) + ": not an IP address.");
          };
        } else {
          console.log("Ignored RTCIceCandidate " + JSON.stringify(oRTCIceCandidate.candidate) + ": not a \"host\".");
        };
      } else {
        fSuccessCallback(Object.keys(dsIPAddresses));
      };
      console.log("/fRTCPeerConnectionIceEventHandler");
    };
    
    oRTCPeerConnection.createDataChannel("", { "reliable": false });
    oRTCPeerConnection.createOffer(
      function fCreateOfferSuccess(oRTCSessionDescription){
        console.log("fCreateOfferSuccess");
        oRTCPeerConnection.setLocalDescription(
          oRTCSessionDescription,
          function fSetLocalDescriptionSuccess(){
            console.log("fSetLocalDescriptionSuccess/");
          },
          function fSetLocalDescriptionError(sErrorMessage){
            console.log("fSetLocalDescriptionError");
            fErrorCallback("Could not set local description: " + sErrorMessage);
            console.log("/fSetLocalDescriptionError");
          }
        );
        console.log("/fCreateOfferSuccess");
      },
      function fCreateOfferError(sErrorMessage){
        console.log("fCreateOfferError");
        fErrorCallback("Could not create offer: " + sErrorMessage);
        console.log("/fCreateOfferError");
      }
    );
  };
  if (window.RTCIceGatherer) {
    console.log("using RTCIceGatherer");
    var oRTCIceGatherer = new RTCIceGatherer({
      "gatherPolicy": "all",
      "iceServers": [
/*        {
          "urls": "turn:turn-testdrive.cloudapp.net:3478?transport=udp",
          "username": "redmond",
          "credential": "redmond123"
        }, */
      ],
    });
    oRTCIceGatherer.onlocalcandidate = function (oEvent) {
      if (oEvent.candidate.type == "host") {
        dsIPAddresses[oEvent.candidate.ip] = 1;
        console.log("Found local ip address " + JSON.stringify(oEvent.candidate.ip));
      } else if (oEvent.candidate.type) {
        console.log("Ignored non-host IceCandidate " + JSON.stringify(oEvent.candidate));
      } else {
        console.log("done!");
        fSuccessCallback(Object.keys(dsIPAddresses));
      };
    };
    oRTCIceGatherer.onerror = function (oEvent) {
      console.log("RTCIceGatherer.onerror");
      console.log(oEvent);
      console.log("RTCIceGatherer.onerror/");
    };
  }
  console.log("/fGetIPAddresses");
};
