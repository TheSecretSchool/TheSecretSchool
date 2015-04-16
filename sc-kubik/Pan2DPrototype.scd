//:

Server.default.reboot;

Server.default.options.numOutputBusChannels = 43;

//:
Help.gui;

//:

Server.default.scope;

//: Getting acquainted with PanAz
(
~test1 = { | out = 0 pos = 0 level = 1 width = 0 orientation = 0 rate = 1 |
	var source, pan;
	source = WhiteNoise.ar(0.1) * Decay2.kr(Impulse.kr(rate));
	pan = PanAz.ar(10, source, pos * 0.8, level, width * 8 + 2, orientation);
	Out.ar(out, pan);
}.play;
)

~test1.set(\orientation, 0, \pos, 0);
~test1.set(\pos, 1);
~test1.set(\width, 1);

//: Allocate internal bus for routing vertical pan to horizontal panners:
~ringBusses = Bus.audio(Server.default, 10);

//: test the above

~ringBusses;
~ringBusses.index;


//:

(
~vertical1 = { | out = 0 pos = 0 level = 1 width = 0 orientation = 0 rate = 1, freq = 400 |
	var source, source2, pan;
	// source = WhiteNoise.ar(0.1) * Decay2.kr(Impulse.kr(rate));
	source2 = LFNoise2.ar(freq * LFNoise0.kr(5 + LFNoise0.kr(0.2, 10, 10), 20, 22), 0.1);
	source2 = source2 * LFNoise1.ar(0.2 + LFNoise0.kr(0.1, 3)) ;
	source = LFNoise2.ar(freq, 0.1) * LFPar.kr(5);

	pan = PanAz.ar(10, source + source2, pos * 0.8, level, width * 8 + 2, orientation);
	Out.ar(out, pan);
}.play(args: [out: ~ringBusses.index]);
)

//:
~vertical1.free;
//:
~vertical1.set(\pos, 0.25);
//:
~vertical1.set(\pos, 0.5);
//:
~vertical1.set(\pos, 0.75);
//:
~vertical1.set(\pos, 1);

//:
~vertical1.set(\pos, 0);

//:

~vertical1.set(\width, 0);

//:

{ Out.ar(0, In.ar(51)) }.play(addAction: 'addToTail');

//:

(
~ring1 = { | in = 0 out = 0 pos = 0 level = 1 width = 2 orientation = 0 |
	var source, pan;
	source = In.ar(in);
	pan = PanAz.ar(14, source, pos, level, width, orientation);
	Out.ar(out, pan);
}.play(args: [in: ~ringBusses.index], addAction: 'addToTail');
)

//:
~ring1.set(\pos, 1);


//:

~ring1.set(\width, 20);


//:

(
~ring2 = { | in = 0 out = 0 pos = 0 level = 1 width = 2 orientation = 0 |
	var source, pan;
	source = In.ar(in);
	pan = PanAz.ar(14, source, pos, level, width, orientation);
	Out.ar(out, pan);
}.play(
	args: [in: ~ringBusses.index + 1, out: 14],
	addAction: 'addToTail'
);
)

//:

(
~ring3 = { | in = 0 out = 0 pos = 0 level = 1 width = 2 orientation = 0 |
	var source, pan;
	source = In.ar(in);
	pan = PanAz.ar(8, source, pos, level, width, orientation);
	Out.ar(out, pan);
}.play(
	args: [in: ~ringBusses.index + 2, out: 28],
	addAction: 'addToTail'
);
)

//:

(
~ring4 = { | in = 0 out = 0 pos = 0 level = 1 width = 2 orientation = 0 |
	var source, pan;
	source = In.ar(in);
	pan = PanAz.ar(6, source, pos, level, width, orientation);
	Out.ar(out, pan);
}.play(
	args: [in: ~ringBusses.index + 3, out: 36],
	addAction: 'addToTail'
);
)

//:

(
~ring5 = { | in = 0 out = 0 level = 1 |
	var source;
	source = In.ar(in);
	Out.ar(out, source);
}.play(
	args: [in: ~ringBusses.index + 4, out: 42],
	addAction: 'addToTail'
);
)

////////////////////////////////////////////////////////////////////

//: OSC
(
thisProcess.openUDPPort(5556);
OSCFunc.trace(false);

)

(
~createOSCreceivers = { | messageSpecs |
	messageSpecs keysValuesDo: { | key func |
		[key, func].postln;
		OSCdef(key, { | msg |
			[msg].postln;
			func.(msg[1]);
		}, key)
	}
}
)

//:
(
~createOSCreceivers.(
	(
		x: { | val |
			~ring1.set(\pos, val);
			~ring2.set(\pos, val);
			~ring3.set(\pos, val);
			~ring4.set(\pos, val);
		},
		y: { | val | ~vertical1.set(\pos, val) },
		xwidth: { | val |
			~ring1.set(\width, val * 18 + 2);
			~ring2.set(\width, val * 18 + 2);
			~ring3.set(\width, val * 12 + 2);
			~ring4.set(\width, val * 10 + 2);
		},
		ywidth: { | val | ~vertical1.set(\width, val) },
		level: { | val | ~vertical1.set(\level, val * 3) },
		// orientation: { | val | val * 5 + 2.5 }
	)
)
)









