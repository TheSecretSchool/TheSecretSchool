var photoID = getParameterByName("id");
var addr = getParameterByName("addr");

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
            document.getElementById("chattext").innerHTML = '<p><strong>Messages:</strong></p>' + self.xmlHttpReq.responseText;
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
            document.getElementById("chattext").innerHTML = '<p><strong>Messages:</strong></p>' + self.xmlHttpReq.responseText;

        }
    }
    var form = document.forms['chat'];
    var color = '';
    for( var i = 0; i < form.color.length; i++ ) {
        if( form.color[i].checked == true ) {
            color = form.color[i].value;
        }
    }
    // *** If there is an id parameter, include comment notification in the message.
    if (photoID != "") {
	self.xmlHttpReq.send( 'name=' + escape( form.name.value ) + '&entry=' + escape( form.entry.value ) + ' <small>(comment on ' + photoID + ')</small>' + '&color=' + escape( color ) );
    }
    else {
	self.xmlHttpReq.send( 'name=' + escape( form.name.value ) + '&entry=' + escape( form.entry.value ) + '&color=' + escape( color ) );
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
'<input name="name" type="text" value="Anonymous" placeholder="Nickname"><br>' + '<textarea name="entry" wrap="virtual" placeholder="Message..."></textarea><br>' +
'<input type="radio" value="black" name="color" checked>B<input type="radio" value="blue" name="color"><font color="blue">B</font><input type="radio" value="green" name="color"><font color="green">G</font><input type="radio" value="orange" name="color"><font color="orange">O</font><input type="radio" value="red" name="color"><font color="red">R</font></strong><br>' +
'<div id="sendBtn"><input value="Send" type="button" onclick=\'JavaScript:xmlhttpPost("/chat")\'></div>' +
'</form><hr>';
    xmlhttpGet();
}

window.onload = function() {
    chatInit();
    // *** If there is a url parameter, create a link back to the wiki and create a subtitle. -- TODO: Display the photo instead of the upload section
    if (photoID != "") {
	addr = addr.replace("<<<", "#");
	alert(addr);
	document.getElementById("title").innerHTML += 'Now commenting on ' + photoID + '.<br/>';
	document.getElementById("sendBtn").innerHTML += '<a style="padding-left:5%;" href="' + addr + '">Go back to ' + photoID + ' in Wiki.</a>';
	document.getElementById("text").innerHTML = "<p style='text-align:center;'><strong>" + photoID + "</strong><br />Image goes here.</p>";
    }
    chatReload = window.setInterval( xmlhttpGet, 5000 );
};
