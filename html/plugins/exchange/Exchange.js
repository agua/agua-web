console.log("%cplugins.exchange.Exchange    LOADING", "color: blue");

define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/json",
	"dojo/on",
	"dojo/_base/connect",
	"dojo/_base/lang",
	//"plugins/exchange/socketio",
	//"socketio",
	"dojo/ready"
],

function (
	declare,
	arrayUtil,
	JSON,
	on,
	connect,
	lang,
	//SocketIO,
	ready
) {

////}}}}}

return declare([], {

// listeners : Function[]
// 		Array of event listeners
listeners : [],

// port : Integer
//		Port on which SocketIO is communicating
port : "8080",

// host : String
//		Absolute URL of host SocketIO is running on
host : "localhost",

// socketJs : String
//		Location of socketio.js file
socketJs : require.toUrl("plugins/exchange/socketio.js"),

// delayConnect : Integer
//		Length of time (milliseconds) to delay in setTimeout before calling this.connect()
delayConnect : 500,

// callback : Function reference
// 		Call this with 'object' argument when message is received
callback : function(object) {},

//////}}

constructor : function(args) {	
    // MIXIN ARGS
    lang.mixin(this, args);

	// LOAD SOCKET.IO
	this.loadSocketIO();
	
	// SET HOST URL
	this.setHost();
},
loadSocketIO : function () {

// BAD
//// {version: "0.9.11", protocol: 1, transports: Array[0], j: Array[0], sockets: Object…}
//
//	connect: function (host, details) {
//	j: Array[0]
//	protocol: 1
//	sockets: 
//		EMPTY
//	transports: Array[0]
//	version: "0.9.11"


// GOOD
//// {version: "0.9.11", protocol: 1, transports: Array[4], j: Array[0], sockets: Object…}
//
//	EventEmitter: function EventEmitter() {}
//	JSON: Object 
//	Socket: function Socket(options) {
//	SocketNamespace: function SocketNamespace(socket, name) {
//	Transport: function Transport(socket, sessid) {
//	connect: function (host, details) {
//	j: Array[0]
//	parser: Object
//	protocol: 1
//	sockets: 
//		http://localhost:80: Socket
//	transports: Array[4]
//	util:
//		chunkQuery: function (qs) {
//		defer: function (fn) {
//		indexOf: function (arr, o, i) {
//		inherit: function (ctor, ctor2) {
//		intersect: function (arr, arr2) {
//		isArray: function isArray() { [native code] }
//		load: function (fn) {
//		merge: function merge(target, additional, deep, lastseen) {
//		mixin: function (ctor, ctor2) {
//		arguments: 
//		nullcaller: 
//		nulllength: 2 
//		name: ""
//		prototype: util.
//		mixin__proto__: function Empty() {}<function scope>
//		on: function (element, event, fn, capture) {
//		parseUri: function (str) {						<======================= HERE
//		query: function (base, addition) {
//		request: function (xdomain) {
//		toArray: function (enu) {
//		ua: Object 
//		uniqueUri: function (uri) {
//		
//	version: "0.9.11"
//
	//require("plugins/exchange/socketio");

	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = this.socketJs;
	document.getElementsByTagName('head')[0].appendChild(script);	
},
setHost : function () {
	var host = window.location.host || this.host;

	this.host = host;
},
connect : function () {
	console.log("Exchange.connect    caller: " + this.connect.caller.nom);
	console.log("Exchange.connect    this.id: " + this.id);
	console.log("Exchange.connect    io: ", io);

	//require("socketio");

	var thisObject = this;
	//setTimeout(function () {
	
		// CONNECT WITH SOCKET.IO VERSION 0.9.11
		console.log("Exchange.connect    io: ", io);
		var host = thisObject.host;
		var port = thisObject.port;
		console.log("Exchange.connect    host: ", host);
		console.log("Exchange.connect    port: ", port);

		thisObject.conn = io.connect(host, { port: port} );
		console.log("Exchange.connect    CONNECTED, thisObject.conn: ", thisObject.conn);
	
		// REMOVE LISTENERS
		console.log("Exchange.connect    thisObject.listeners: ", thisObject.listeners);
		for ( var i = 0; i < thisObject.listeners.length; i++ ) {
			connect.disconnect(thisObject.listeners[i]);
		}
		thisObject.listeners = [];
		//console.log("Exchange.connect    AFTER DISCONNECT, thisObject.listeners: " + thisObject.listeners);
		//console.dir({thisObject_listeners:thisObject.listeners});
		
		// ADD LISTENER
		var listener = on(thisObject.conn, 'message', function(object){
			console.log("Exchange.connect    on(this.conn, message, ...) FIRED");
			thisObject.onMessage(object);
		});
		thisObject.listeners.push(listener);
	//},
	//10
	//);
	return this.conn;
},
sendMessage : function (message) {
    console.log("Exchange.sendMessage    message: " + message);
	console.dir({message:message});
	
	this.send({
		message : message
	});
},
send : function (data) {
	console.log("Exchange.send    caller: ", this.send.caller.nom);

	console.log("Exchange.send    this.id: ", this.id);
    console.log("Exchange.send    data: ", data);
	console.log("Exchange.send    this.conn: ", this.conn);
	console.dir({this_conn:this.conn});

	// SET TOKEN
	data.token		=	Agua.token;
	
	// SET SENDTYPE
	data.sendtype	=	"request";
	
	// SET DATABASE
	data.database 	= 	data.database || Agua.database;

	// SET USERNAME		
	data.username 	= 	data.username || Agua.cookie('username');

	// SET USERNAME		
	data.sessionid 	= 	data.sessionid || Agua.cookie('sessionid');

	//if ( ! this.conn ) {
	//	console.log("Exchange.send    ! this.conn. REDOING this.connect()");
	//	this.connect();
	//}
	
	var json = JSON.stringify(data);
	
	var thisObject = this;
	setTimeout(function () {
		console.log("Exchange.send    DOING thisObject.conn.send(json)");
	    thisObject.conn.send(json);
	},
	20);
	

	console.log("Exchange.send    END");
},
// OVERRIDE THIS TO FIRE callback WITH RECEIVED DATA
onMessage : function (object) {
	console.log("YOU DID NOT OVERRIDE Exchange.onMessage    object: " + object);
	console.dir({object:object});
	if ( object && object.type && object.type == "request" ) {
		console.log("Exchange.onMessage    object.type is 'request'. Returning");
		return;
	}
	
	this.callback(object);
}

}); 	//	end declare

});		//	end define


console.log("%cplugins.exchange.Exchange    COMPLETE", "color: blue");