
// *** Extract information out of the URL query string
var photoID = getParameterByName("id");
var addr = getParameterByName("addr");
var imgPath = getParameterByName("imgPath");
var dimension = getParameterByName("dim")

// *** variable to determine the measure points of the image
if (dimension == "width") {
    var mp = "vw";
}
else if (dimension == "height") {
    var mp = "vh";
}

function xmlhttpGet() {
    var xmlHttpReq = false;
    var self = this;
    // Mozilla/Safari
    if ( window.XMLHttpRequest ) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if ( window.ActiveXObject ) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    self.xmlHttpReq.open('GET', '/chat', true);
//    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4) {
            document.getElementById("chattext").innerHTML = "<br />" + self.xmlHttpReq.responseText;
        }
    }
    self.xmlHttpReq.send();
}

function xmlhttpPost(strURL) {
    var xmlHttpReq = false;
    var self = this;
    // Mozilla/Safari
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    self.xmlHttpReq.open('POST', strURL, true);
    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4) {
            document.getElementById("chattext").innerHTML =  self.xmlHttpReq.responseText;

        }
    }
    var form = document.forms['chat'];
    var color = '';
    for( var i = 0; i < form.color.length; i++ ) {
        if( form.color[i].checked == true ) {
            color = form.color[i].value;
        }
    }
    // *** If there is an id parameter, include image thumbnail in the message.
    if (photoID != "") {
	// *** Compute the thumbnail path from the photo path
	var slashPos = imgPath.lastIndexOf('/');
	var newPath = imgPath.slice(0, slashPos) + "-thumbnails" + imgPath.slice(slashPos, imgPath.length);
	// *** randomize the position of the image
	var position = Math.floor(Math.random()*60);
	
	self.xmlHttpReq.send( '&entry=' + escape( form.entry.value ) + '</span><br><img style="margin-left:' + position + '%;' + dimension + ':20' + 'vw' + ';min-' + dimension + ':110px;max-' + dimension + ':150px" src="' + newPath + '">' + '&color=' + escape( color ) );
    }
    else {
	self.xmlHttpReq.send( '&entry=' + escape( form.entry.value ) + '&color=' + escape( color ) );
    }
    form.entry.value = "";
}

// *** get URL arguments
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function chatInit() {
    document.getElementById("chatform").innerHTML = '<div id="title"><strong>Pirate<span style="color: maroon;">ShoutBox</span></strong><br></div>' + 
'<form action="/chat" method="post" enctype="application/x-www-form-urlencoded" name="chat"><br>' +
'<textarea name="entry" wrap="virtual" placeholder="Message..." cols="30"></textarea><br>' +
'<input type="radio" value="black" name="color" checked>B<input type="radio" value="blue" name="color"><font color="blue">B</font><input type="radio" value="green" name="color"><font color="green">G</font><input type="radio" value="orange" name="color"><font color="orange">O</font><input type="radio" value="red" name="color"><font color="red">R</font></strong><br>' +
'<div id="sendBtn"><input value="Post" type="button" onclick=\'JavaScript:xmlhttpPost("/chat")\'></div>' +
'</form><hr>';
    xmlhttpGet();
}

window.onload = function() {
    chatInit();
    
    // *** If there is a url parameter, create a link back to the wiki and create a subtitle
    if (photoID != "") {
	addr = addr.replace("<<<", "#");
	// alert(addr); // If u ever need to know...
	document.getElementById("title").innerHTML += 'Now commenting on ' + photoID + '.<br/>';

	document.getElementById("text").innerHTML = "<p style='margin-left:5%'><strong>" + photoID + "</strong><span style='margin-left:20%;'><a href='" + addr + "'>Go back to Wiki.</a><br /></p><img style='" + dimension + ":50" + mp + ";min-" + dimension + ":400px;margin:5%;' src='" + imgPath + "'>";
    }
    chatReload = window.setInterval( xmlhttpGet, 5000 );
};
