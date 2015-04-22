
var socket = io();

socket.on('message', function(msg){
    // *** Need to change this -- also the 'message' address
    alert(msg);
    window.location.href = "http://192.168.77.1:8686";
});
