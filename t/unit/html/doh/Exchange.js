console.log("t.unit.doh.Exchange    LOADING");

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/registry",
	"dojo/json",
],

function (
	declare,
	lang,
	registry,
	JSON
) {

////}}}}}

return declare(null, {

// callback : Function reference
// 		Call this with 'object' argument when message is received
callback : function(object) {},

// responses : Array
//      Array of response hashes
responses : [],

//////}}

constructor : function(args) {	
    // MIXIN ARGS
    lang.mixin(this, args);

	// SET HOST URL
	this.setHost();
},
setHost : function () {
	var host = window.location.host || this.host;

	this.host = host;
},
sendRequest : function (data) {
	console.log("doh.Exchange.sendRequest    caller: " + this.sendRequest.caller.nom);
    console.log("doh.Exchange.sendRequest    data: ", data);
	
	var response = this.shiftResponse();
	console.log("doh.Exchange.sendRequest   response: ", response);
	this.onMessage(response);
},
// OVERRIDE THIS TO FIRE callback WITH RECEIVED DATA
onMessage : function (response) {
	console.log("doh.Exchange.onMessage    response: ", response);
	if ( response && response.type && response.type == "request" ) {
		console.log("doh.Exchange.onMessage    response.type is 'request'. Returning");
		return;
	}
	//console.log("doh.Exchange.onMessage    response:  ", response);
	
	var sourceid 	=	response.sourceid;
	var widget		=	registry.byId(sourceid);
	console.log("doh.Exchange.onMessage    widget: ", widget);
	var callback	=	response.callback;
	console.log("doh.Exchange.onMessage    DOING widget[" + callback + "](" + JSON.stringify(response).substring(0,500) + ")");
	widget[callback](response);
},
loadResponse : function(file) {
	console.log("doh.Exchange.loadResponse    file: ", file);
	var data = this.fetchJson(file);
	//console.log("doh.Exchange.loadResponse    data: ", data);
	
	console.log("doh.Exchange.loadResponse    BEFORE this.responses.length: ", this.responses.length);
	
	this.responses.push(data);

	console.log("doh.Exchange.loadResponse    AFTER this.responses.length: ", this.responses.length);
	console.log("doh.Exchange.loadResponse    AFTER this.responses: ", this.responses);
	console.log("doh.Exchange.loadResponse    AFTER this.responses: " + JSON.stringify(this.responses));
},
shiftResponse : function() {
	console.log("doh.Exchange.onMessage    this.responses: ", this.responses);
	
	return this.responses.shift();
}



});
});

console.log("plugins.exchange.Exchange    COMPLETE");