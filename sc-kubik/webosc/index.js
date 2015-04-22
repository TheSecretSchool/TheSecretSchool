var colors = require('colors');
var express = require('express');
var osc = require('osc-min');
var udp = require("dgram");

var config = require("./config.json");

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var oscListener;

var oscEmmiter;

var clientsConnected = 0;

app.use(express.static(__dirname + '/public'));

oscListener = udp.createSocket("udp4", function(buf, rinfo) {
  // try {
    //io.sockets.emit('osc', osc.fromBuffer(msg));
    var msg = osc.fromBuffer(buf);
    // *** Sending message to tiddly upon receiving OSC
    console.log("OSC > Browser: " + msg.address);
    // console.log(colors.green("OSC > Browser: " + JSON.stringify(msg)));
    io.sockets.emit('message', msg.address);
  // } catch (e) {
  //   return console.log(colors.red("invalid OSC packet:" + e));
  // }
});

oscListener.bind(config.osc.port.in);

oscEmmiter = udp.createSocket("udp4");

io.on('connection', function (websocket) {
    clientsConnected++;
    console.log("A client just connected."); // for debugging

    io.sockets.emit('users', clientsConnected);

    websocket.on('osc', function (msg) {
        var buf = osc.toBuffer(msg); // Must add a  real buffer. Check also JSON decoding.
	io.sockets.emit('message', "Data"); // test tiddly connection
        console.log(colors.blue("Browser > OSC: " + JSON.stringify(msg)));
        oscEmmiter.send(buf, 0, buf.length, config.osc.port.out, config.osc.address);
    });

    websocket.on('disconnect', function () {
        clientsConnected--;
        io.sockets.emit('users', clientsConnected);
    });


});

http.listen(config.http.port.in, function () {
    console.log(colors.rainbow("The Secret School main server: " + config.http.port.in));
});

process.on('exit', function(code) {
    oscListener.close();
    oscEmmiter.close();
    http.close();
    console.log(colors.rainbow("Quitting Secret School"));
});
