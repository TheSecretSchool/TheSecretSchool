var fs = require( 'fs' );
var path = require( 'path' );
var pbConfig = require( './pbConfig.js' );
var pbTemplates = require( './pbTemplates.js' );

// *** In this file, I removed the name argument from the functions post and createChatEntry

exports.tainted = false;

exports.chatlog = '';

exports.post = function( entry, color ) {
    this.chatlog = exports.createChatEntry( entry, color ) + this.chatlog;
    this.tainted = true;
};

exports.display = function() {
    return this.chatlog;
};

exports.save = function( init ) {
    if( init == true ) {
        if( path.existsSync( pbConfig.CHATFILE ) == true ) {
            this.chatlog = fs.readFileSync( pbConfig.CHATFILE, 'utf8' );
        } else {
            this.chatlog = exports.createChatEntry( 'Evolving memory in a suitcase', 'black' );
            fs.writeFileSync( pbConfig.CHATFILE, this.chatlog , 'utf8' );
        }
        return false;
	} else {
        if( this.tainted == true ) {
            fs.writeFileSync( pbConfig.CHATFILE, this.chatlog , 'utf8' );
            this.tainted = false;
        }
    }
};

exports.createChatEntry = function( entry, color ) {
    temp = pbTemplates.CHATENTRY;
    // *** Randomize the position of the chat entry
    var position = Math.floor(Math.random()*60);
    return temp.replace( '#ENTRY#', entry ).replace( '#POSITION#', position ).replace( '#COLOR#', color );
}

exports.init = exports.save( true );

exports.interval = setInterval( function() {
    exports.save();
}, 1000 );
