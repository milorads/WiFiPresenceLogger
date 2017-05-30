window.onload = function () {
  var url, 
      i,
      jqxhr;

  for (i = 0; i < 2; i++) {
    url = document.URL + 'inputs/' + i;
    jqxhr = $.getJSON(url, function(data) {
      console.log('API response received');
      $('#input').append('<p>input gpio port ' + data['gpio'] + ' on pin ' +
        data['pin'] + ' has current value ' + data['value'] + '</p>');
    });
  }
  getIp();
};

var myIpAddr;
function getIp(){
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;   //compatibility for firefox and chrome
    var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};      
    pc.createDataChannel("");    //create a bogus data channel
    pc.createOffer(pc.setLocalDescription.bind(pc), noop);    // create offer and set local description
    pc.onicecandidate = function(ice){  //listen for candidate events
        if(!ice || !ice.candidate || !ice.candidate.candidate)  return;
        myIpAddr = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1]; 
        pc.onicecandidate = noop;
    };
}