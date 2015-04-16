(
// chat data
OSCdef(\chat, {
	| args |
	args.postln;
}, "/chatMsg");
// slider 1
OSCdef(\sld1, {
	| args |
	args.postln;
}, "/slider1");
// slider 2
OSCdef(\sld2, {
	| args |
	args.postln;
}, "/slider2");
// slider 3
OSCdef(\sld3, {
	| args |
	args.postln;
}, "/slider3");
// slider 4
OSCdef(\sld4, {
	| args |
	args.postln;
}, "/slider4");
// slider 5
OSCdef(\sld5, {
	| args |
	args.postln;
}, "/slider5");
)

// send OSC to piratebox

n = NetAddr("192.168.77.1", 5566);
n.sendMsg("\chatPost", "SuperColliderBot", "Hey PirateBox, it's SuperCollider!", "red");