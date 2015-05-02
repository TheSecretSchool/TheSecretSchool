
var socket = io();

socket.on('message', function(msg){
    // *** Need to change this -- also the 'message' address
    var url = window.location.href;
    var slashPos1 = url.indexOf('#');
    var slashPos2 = url.lastIndexOf(':');
    url = url.slice(0, slashPos1 + 1) + msg + ":[[" + msg + "]] " + url.slice(slashPos2 + 1, url.length);
    // alert(url);
    window.location.href = url;
});
