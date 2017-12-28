window.onload = function () {
  var url,
      i,
      jqxhr;
  getIp();
};

var myIpAddr;
function getIp(){
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnect$
    var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
    pc.createDataChannel("");    //create a bogus data channel
    pc.createOffer(pc.setLocalDescription.bind(pc), noop);    // create offer a$
    pc.onicecandidate = function(ice){  //listen for candidate events
        if(!ice || !ice.candidate || !ice.candidate.candidate)  return;
        myIpAddr = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){$
        pc.onicecandidate = noop;
                changeIpInput();
    };
function changeIpInput(){
        var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "ip").val(myIpAddr);
$('#regForm').append($(input));
}
