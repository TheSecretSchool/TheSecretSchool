
var socket = io();

socket.on('message', function(msg){
    // *** Need to change this -- also the 'message' address
    alert(msg);
    window.location.href = msg
});
