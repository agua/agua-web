dojo.provide("plugins.core.Agua.Ami");

/* SUMMARY: THIS CLASS IS INHERITED BY Agua.js AND CONTAINS 
	
	CLUSTER METHODS  
*/

dojo.declare( "plugins.core.Agua.Ami",	[  ], {

/////}}}
getAmis : function () {
// RETURN A COPY OF THE amis ARRAY
	//console.log("Agua.Ami.getAmis    plugins.core.Data.getAmis()");
	return this.cloneData("amis");
},
getAmiObjectById : function (amiid) {
	//console.log("Agua.Ami.getAmiObjectById    plugins.core.Data.getAmiObjectById()");
	var amis = this.getAmis();	
	//console.log("Agua.Ami.getAmiObjectById    amis: " + dojo.toJson(amis));
	return this._getObjectByKeyValue(amis, ["amiid"], amiid);	
},
addAmi : function (data) {
	console.log("Agua.Ami.addAmi    data: ", data);

	data.username = this.cookie("username");

	// SEND REQUEST
	this.sendRequest({
		data		: 	data,
		mode		:	"addAmi",
		module 		: 	"Agua::Workflow",
		sourceid	:	this.id,
		callback	:	"handleAddAmi"
	});
},
handleAddAmi : function(response) {
	console.log("Agua.Ami.handleAmi    response: ", response);
	var data = response.data;
	this._removeAmi(data);
	this._addAmi(data);

	// RELOAD RELEVANT DISPLAYS
	this.updater.update("updateAmis", {originator: this, reload: true});
},
removeAmi : function (data) {
	console.log("Agua.Ami.removeAmi    data: ", data);

	// SEND REQUEST
	this.sendRequest({
		data		: 	data,
		mode		:	"removeAmi",
		module 		: 	"Agua::Workflow",
		sourceid	:	this.id,
		callback	:	"handleRemoveAmi"
	});
},
handleRemoveAmi : function(response) {
	console.log("Agua.Ami.handleAmi    response: ", response);
	var data = response.data;
	this._removeAmi(data);
	
	// RELOAD RELEVANT DISPLAYS
	Agua.updater.update("updateAmis", {originator: this, reload: false});
},
_removeAmi : function (data) {
// REMOVE A CLUSTER OBJECT FROM THE amis ARRAY
	console.log("Agua.Ami._removeAmi    data: ", data);
	//console.log("Agua.Ami._removeAmi    data: " + dojo.toJson(data));
	var requiredKeys = ["amiid"];
	return this.removeData("amis", data, requiredKeys);
},
_addAmi : function (amiObject) {
// ADD A CLUSTER TO amis AND SAVE ON REMOTE SERVER
	console.log("Agua.Ami._addAmi    plugins.core.Data._addAmi(amiObject)");
	//console.log("Agua.Ami._addAmi    amiObject: " + dojo.toJson(amiObject));

	// DO THE ADD
	var requiredKeys = ["amiid"];
	return this.addData("amis", amiObject, requiredKeys);
}


});