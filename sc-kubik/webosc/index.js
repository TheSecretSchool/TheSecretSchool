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
    // *** Sending message to specific tiddly socket if the address is /url
    if (msg.address == "/url") {
	console.log("OSC > Browser: " + msg.address + ": " + msg.args[0].value + " | " + msg.args[1].value);
	// *** Alternate way - didn't work
	// io.to(msg.args[0].value).emit('message', 'Hey Bro!');
	if (io.sockets.connected[msg.args[0].value]) {
	    io.sockets.connected[msg.args[0].value].emit('message', msg.args[1].value);
	}
    }
    // console.log(colors.green("OSC > Browser: " + JSON.stringify(msg)));
    
  // } catch (e) {
  //   return console.log(colors.red("invalid OSC packet:" + e));
  // }
});

oscListener.bind(config.osc.port.in);

oscEmmiter = udp.createSocket("udp4");

io.on('connection', function (websocket) {

    // *** post connection info
    console.log("A client just connected: " + websocket.id);
    clientsConnected++;
    io.sockets.emit('users', clientsConnected);

    // // *** debugging -- send socket ID to supercollider
    // var idOsc = {
    //     address: '/tiddler',
    //     args: [
    //         websocket.id
    //     ]
    // };
    // idOsc = osc.toBuffer(idOsc);
    // oscEmmiter.send(idOsc, 0, idOsc.length, config.osc.port.out, "192.168.77.122"); // *** the IP will probably need to change

    // *** Receive info from tiddlywiki
    websocket.on('tiddler info', function (msg) {
	console.log(websocket.id + " | " + msg.type + " | " + msg.val + " | " + msg.url);

	// *** Determine if the value of the message refers to keyword or title and send the according message to SC
	if (msg.type == "key") {

	    // *** Make the info a keyword OSC
	    var infosc = {
		address: '/tiddlyKey',
		args: [
		    websocket.id,
		    msg.val,
		    msg.url
		]
	    };
	}
	else if (msg.type == "title") {

	    // *** Make the info a title OSC
	    var infosc = {
		address: '/tiddlyTitle',
		args: [
		    websocket.id,
		    msg.val,
		    msg.url
		]
	    };
	}
	else { console.log("Error: Invalid type!!!"); }
	
	infosc = osc.toBuffer(infosc);
	oscEmmiter.send(infosc, 0, infosc.length, config.osc.port.out, config.osc.address);
    });
    
    websocket.on('osc', function (msg) {
        var buf = osc.toBuffer(msg); // Must add a  real buffer. Check also JSON decoding.
	// io.sockets.emit('message', "Data"); // test tiddly connection
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
