
var socket = io();

socket.on('message', function(msg){
    alert("Got Something: " + msg);
});
