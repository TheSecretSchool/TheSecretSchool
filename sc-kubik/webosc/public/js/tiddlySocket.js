
var socket = io();

socket.on('message', function(msg){
    
    window.location.href = msg;
});
