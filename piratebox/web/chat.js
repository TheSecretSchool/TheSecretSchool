// *** Extract information out of the URL query string
var photoID = getParameterByName("id");
var addr = getParameterByName("addr");
if (addr == "") { addr = "http://secretschool" }
addr = addr.replace("<<<", "#");
// alert(addr); // If u ever need to know...

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
	self.xmlHttpReq.send( '&entry=' + escape( form.entry.value ) + '</span>' + '&color=' + escape( color ) );
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
    document.getElementById("chatform").innerHTML = '<hr><div id="title"><span style="float:right;">Go to the <a href="' + addr + '"><strong>Secret<span style="color:maroon;">School</span> HomePage</strong></a></span><br></div><hr>' + 
'<form action="/chat" method="post" enctype="application/x-www-form-urlencoded" name="chat"><br>' +
'<textarea name="entry" wrap="virtual" placeholder="Message..." cols="30"></textarea><br>' +
'<input type="radio" value="black" name="color" checked>B</font><input type="radio" value="grey" name="color"><font color="grey">G</font><input type="radio" value="maroon" name="color"><font color="maroon">R</font></strong><br>' +
'<div id="sendBtn"><input value="Post" type="button" onclick=\'JavaScript:xmlhttpPost("/chat")\'></div>' +
'</form><hr>';
    xmlhttpGet();
}

window.onload = function() {
    chatInit();
    
    // *** If there is a url parameter, create a link back to the wiki and create a subtitle
    if (photoID != "") {
	document.getElementById("text").innerHTML = "<p style='margin-left:5%'><strong>" + photoID + "</strong><span style='margin-left:20%;'>" + "<br /></p><img style='" + dimension + ":50" + mp + ";min-" + dimension + ":400px;margin:5%;' src='" + imgPath + "'>";
    }
    chatReload = window.setInterval( xmlhttpGet, 5000 );
};
