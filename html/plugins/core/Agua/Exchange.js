/* Listen and respond to socket.IO messages */
define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/json",
	"dojo/on",
	"dijit/registry",
	"dojo/when"
	,
	"plugins/exchange/Exchange",
],

function (
	declare,
	arrayUtil,
	JSON,
	on,
	registry,
	when
	,
	Exchange
) {

return declare([], {

lastMessage : null,

connectTimeout : 2000,

///////}}}}}

///////}}}}}

setExchange : function (Exchange) {
	console.log("Exchange", Exchange);

	return this._milestoneFunction( 'setExchange', function( deferred ) {
		console.log("Agua.Exchange.setExchange    Exchange:");
		console.dir({Exchange:Exchange});
	
		// SET TOKEN
		console.log("Agua.Exchange.setExchange    BEFORE this.setToken())");
		this.setToken();
		
		// SET exchange
		console.log("Agua.Exchange.setExchange    BEFORE this.exchange = new Exchange()");
		this.exchange = new Exchange({});
		console.log("Agua.Exchange.setExchange    AFTER this.exchange = new Exchange()");
		console.log("Agua.Exchange.setExchange    this.exchange: ", this.exchange); 
		//this.exchange = {};
	
		// SET onMessage LISTENER
		var thisObject = this;
		this.exchange.onMessage = function (json) {
	
			var data = json;
			if ( typeof json != "object") {
				try {
					data = JSON.parse(json);
				}
				catch (error) {
					console.log("Agua.Exchange.setExchange    Error parsing json: " + json);
					return;
				}
			}
			
			if ( data && data.sendtype && data.sendtype == "request" ) {
				//console.log("Agua.Exchange.setExchange    this.exchange.onMessage FIRED    data type is 'request'. Returning");
				return;
			}
			
			thisObject.onMessage(data);
		};
		
		// CONNECT
		var connectTimeout = this.connectTimeout;
		setTimeout(function(){
			try {
				console.log("Agua.Exchange.setExchange    thisObject: " + thisObject);
				console.log("Agua.Exchange.setExchange    thisObject.exchange: " + thisObject.exchange);
				thisObject.exchange.connect();
	
				console.log("Agua.Exchange.setExchange    {} {} {} CONNECTED {} {} {}");
	
				deferred.resolve({success:true});
			}
			catch(error) {
				console.log("Agua.Exchange.setExchange    *** CAN'T CONNECT TO SOCKET ***");
				console.log("Agua.Exchange.setExchange    error: " + error);
			}
		},
		connectTimeout);	
	});
},
sendRequest : function (query) {
	if ( ! query.data ) console.log("Agua.Exchange.sendRequest    query.data not defined");
	if ( ! query.mode ) console.log("Agua.Exchange.sendRequest    query.mode not defined");
	if ( ! query.module ) console.log("Agua.Exchange.sendRequest    query.module not defined");
	if ( ! query.sourceid ) console.log("Agua.Exchange.sendRequest    query.sourceid not defined");
	if ( ! query.callback ) console.log("Agua.Exchange.sendRequest    query.callback not defined");

	query.username		=	Agua.cookie("username");
	query.sessionid		=	Agua.cookie("sessionid");
	query.sendtype		=	"request";

	console.log("Agua.Exchange.sendRequest    SENDING query:");
	console.dir({query:query});

	this.exchange.send(query);
},
setToken : function () {
	if ( this.token ) {
		console.log("Agua.Exchange.setToken    USING PRESET TOKEN this.token: " + this.token);
		return;
	}

	this.token = this.randomString(16, 'aA#');
	console.log("Agua.Exchange.setToken    this.token: " + this.token);
},
getTaskId : function () {
	return this.randomString(16, 'aA');
},
randomString : function (length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
},
onMessage : function (data) {
	console.log("Agua.Exchange.onMessage    data:");
	console.dir({data:data});

	var identical = this._identicalHashes(data, this.lastMessage);

	if ( this._identicalHashes(data, this.lastMessage) ) {
		//console.log("Agua.Exchange.onMessage    SKIPPING REPEAT MESSAGE");
		return;
	}
	else {
		this.lastMessage = data;
		var thisObj = this;
		setTimeout(function() {
			thisObj.lastMessage = null;
		},
		1000);
	}
	
	// GET INPUTS	
	var queue 		=	data.queue;
	var token 		=	data.token;
	var sourceid 	=	data.sourceid;
	var widget		=	registry.byId(sourceid);
	console.log("Agua.Exchange.onMessage    data.sourceid: " + data.sourceid);
	console.log("Agua.Exchange.onMessage    queue: " + queue);
	console.log("Agua.Exchange.onMessage    token: " + token);
	console.log("Agua.Exchange.onMessage    widget: " + widget);
	console.dir({widget:widget});

	// RETURN IF NO TOKEN MATCH
	if ( token != this.token ) {
		console.log("Agua.Exchange.onMessage    token: " + token + " does not match this.token: " + this.token + ". RETURNING");
		return;
	}
	
	var callback	=	data.callback;
	console.log("Agua.Exchange.onMessage    DOING widget[" + callback + "](" + JSON.stringify(data).substring(0,500) + ")");
	widget[callback](data);

	console.log("Agua.Exchange.onMessage    END");
}

});

});