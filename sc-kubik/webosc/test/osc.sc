(
NetAddr.broadcastFlag = true;
NetAddr("127.0.0.1", 5555).sendMsg("/hello", "world");
)

OSCFunc.trace(true);

NetAddr.localAddr.sendMsg('/browser', 260.2344);

thisProcess.openUDPPort(5556);

'/browser'.osc addDependant: { | sender, message, value  |
 (freq: 330).play;
};

(
OSCdef('out', { | msg, time, addr, recvPort, argTemplate |
 	[msg, time, addr, recvPort].postln;
	msg[1].class.postln;
	(freq: msg[1]).play.postln;
}, '/out');

OSCdef('pos', { | msg, time, addr, recvPort, argTemplate |
 	[msg, time, addr, recvPort].postln;
	msg[1].class.postln;
	(freq: msg[1]).play.postln;
}, '/pos');

OSCdef('level', { | msg, time, addr, recvPort, argTemplate |
 	[msg, time, addr, recvPort].postln;
	msg[1].class.postln;
	(freq: msg[1]).play.postln;
}, '/level');

)

(freq: 4000).play.postln;
