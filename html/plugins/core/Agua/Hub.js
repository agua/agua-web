/* HUB METHODS INHERITED BY Agua.js */

console.log("Loading plugins.core.Agua.Hub");

define([
	"dojo/_base/declare",
],

function(declare) {

/////}}}}}}

return declare([], {

/////}}}}}}

getHub : function () {
// RETURN CLONE OF this.hub
	console.log("Agua.Hub.getHub    data:");
	console.dir({this_data:this.data});
	
	return this.cloneData("hub");
},

addHub : function (data) {
	console.log("Agua.Hub.addHub    data: ", data);

	data.username 			= 	Agua.cookie('username');
	data.hubtype			= 	"github";
	console.log("Agua.Hub.addHub    FINAL data: ", data);

	// SEND REQUEST
	this.sendRequest({
		data		: 	data,
		mode		:	"addHub",
		module 		: 	"Agua::Workflow",
		sourceid	:	this.id,
		callback	:	"handleAddHub"
	});
},
handleAddHub : function(response) {	
	console.log("Hub.addHub    response: ", response);
	
	var data = response.data.data;
	console.log("Hub.addHub    data: ", data);

	// SET hub DATA
	this.setHub(data);
	
	// DISPLAY data
	// RELOAD RELEVANT DISPLAYS
	this.updater.update("updateHub", {originator: this, reload: true});
},
setHub : function (hub) {
// RETURN ENTRY FOR username IN this.hub
	console.log("Agua.Hub.setHub    hub: ", hub);
	if ( hub == null ) {
		console.log("Agua.Hub.setHub    hub is null. Returning");
		return;
	}
	if ( hub.login == null ) {
		console.log("Agua.Hub.setHub    hub.login is null. Returning");
		return;
	}
	this.setData("hub", hub);
	
	return hub;
},
addHubCertificate : function(data) {
	console.log("Agua.Hub.addHubCertificate    data: ", data);

	// SEND REQUEST
	this.sendRequest({
		data			: 	data,
		mode			:		"addHubCertificate",
		module 		: 	"Agua::Workflow",
		sourceid	:		this.id,
		callback	:		"handleAddHubCertificate"
	});
},
handleAddHubCertificate : function(response) {	
	var hub = response.data;
	console.log("Hub.addHubCertificate    hub", hub);
	
	this.setHub(hub);
	
	// DISPLAY publiccert
	// RELOAD RELEVANT DISPLAYS
	this.updater.update("updateHub", {originator: this, reload: true});
}


});

});