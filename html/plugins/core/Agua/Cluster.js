/* CLUSTER METHODS INHERITED BY Agua.js */

console.log("Loading plugins.core.Agua.Cluster");

define([
	"dojo/_base/declare",
],

function(declare) {

return declare([], {

/////}}}}}}

/////}}}
// CLUSTER
getClusterObject : function (clusterName) {
	console.log("Agua.Cluster.getClusterObject    plugins.core.Data.getClusterObject(clusterName)");
	console.log("Agua.Cluster.getClusterObject    clusterName: " + clusterName);
	var clusters = this.getClusters();
	console.log("Agua.Cluster.getClusterObject    clusters: " + dojo.toJson(clusters));
	if ( clusters == null )	return [];
	var keyArray = ["cluster"];
	var valueArray = [clusterName];
	clusters = this.filterByKeyValues(clusters, keyArray, valueArray);
	console.log("Agua.Cluster.getClusterObject    FILTERED clusters: " + dojo.toJson(clusters));
	
	if ( clusters != null && clusters.length != 0 )
		return clusters[0];
	return null;
},
getClusters : function () {
// RETURN A COPY OF THE clusters ARRAY
	//console.log("Agua.Cluster.getClusters    plugins.core.Data.getClusters()");
	return this.cloneData("clusters");
},
getClusterByWorkflow : function (projectName, workflowName) {
// RETURN THE CLUSTER FOR THIS WORKFLOW, OR "" IF NO CLUSTER ASSIGNED
	//console.log("Agua.Cluster.getClusterByWorkflow    plugins.core.Data.getClusterByWorkflow(projectName, workflowName)");
	//console.log("Agua.Cluster.getClusterByWorkflow    projectName: " + projectName);
	//console.log("Agua.Cluster.getClusterByWorkflow    workflowName: " + workflowName);

	var clusterworkflows = this.cloneData("clusterworkflows");
	//console.log("Agua.Cluster.getClusterObjectByWorkflow   clusterworkflows: " + dojo.toJson(clusterworkflows));
    clusterworkflows = this.filterByKeyValues(clusterworkflows, ["project", "workflow"], [projectName, workflowName]);
	//console.log("Agua.Cluster.getClusterObjectByWorkflow   clusterworkflows: " + dojo.toJson(clusterworkflows));
    
	if ( clusterworkflows != null && clusterworkflows.length > 0 )
        return clusterworkflows[0].cluster;
		
    return null;
},
isClusterWorkflow : function (clusterObject) {
// RETURN 1 IF THE ENTRY ALREADY EXISTS IN clusterworkflows, 0 OTHERWISE
	//console.log("Agua.Cluster.isClusterWorkflow    plugins.core.Data.isClusterWorkflow(clusterObject)");
	//console.log("Agua.Cluster.isClusterWorkflow    clusterObject: " + dojo.toJson(clusterObject));

	var clusterworkflows = this.cloneData("clusterworkflows");
	//console.log("Agua.Cluster.isClusterWorkflow    BEFORE clusterworkflows: " + dojo.toJson(clusterworkflows));
    clusterworkflows = this.filterByKeyValues(clusterworkflows, ["project", "workflow", "cluster"], [clusterObject.project, clusterObject.workflow, clusterObject.cluster]);
	//console.log("Agua.Cluster.isClusterWorkflow    AFTER clusterworkflows: " + dojo.toJson(clusterworkflows));
    
	if ( clusterworkflows != null && clusterworkflows.length > 0 )
        return 1;
		
    return 0;
},
getClusterObjectByWorkflow : function (projectName, workflowName) {

	var clusterName = this.getClusterByWorkflow(projectName, workflowName);
	if ( clusterName == null || ! clusterName) 	return null;
	console.log("Agua.Cluster.getClusterObjectByWorkflow    clusterName: " + clusterName);
	
	return this.getClusterObject(clusterName);
},
getClusterLongName : function (cluster) {
	var username = this.cookie("username");
	var clusterName = "";
	if ( cluster != null && cluster ) clusterName = username + "-" + cluster;
	
	return clusterName;
},
isCluster : function (clusterName) {
// RETURN true IF A CLUSTER EXISTS
	//console.log("Agua.Cluster.isCluster    plugins.core.Data.isCluster(clusterName)");
	//console.log("Agua.Cluster.isCluster    clusterName: *" + clusterName + "*");

	var clusterObjects = this.getClusters();
	var inArray = this._objectInArray(clusterObjects, { cluster: clusterName }, ["cluster"]);	
	//console.log("Agua.Cluster.isCluster    inArray: " + inArray);
	//console.log("Agua.Cluster.isCluster    clusterObjects: " + dojo.toJson(clusterObjects));

	return inArray;
},
addCluster : function (data) {
// MODIFIES EXISTING CLUSTER. DOES NOT CREATE NEW CELL DIR
	console.log("Agua.Cluster.newCluster    data", data);
	
	// SEND REQUEST
	this.sendRequest({
		data		: 	data,
		mode		:	"addCluster",
		module 		: 	"Agua::Workflow",
		sourceid	:	this.id,
		callback	:	"handleAddCluster"
	});
	
	//this._removeCluster(clusterObject);
	//this._addCluster(clusterObject);

	//// SAVE ON REMOTE DATABASE
	//var url = this.cgiUrl + "agua.cgi?";
	//clusterObject.username = this.cookie("username");	
	//clusterObject.sessionid = this.cookie("sessionid");	
	//clusterObject.mode = "addCluster";
	//clusterObject.module = "Agua::Workflow";
	//console.log("Agua.Cluster.addCluster    clusterObject: " + dojo.toJson(clusterObject));
	//
	//this.doPut({
	//	url: url,
	//	query: clusterObject,
	//	sync: false,
	//	timeout: 15000,
	//	callback: null
	//});
},
handleAddCluster : function (response) {
	console.log("Agua.Cluster.handleAddCluster   response: ", response);
	var data	=	response.data;
	console.log("Agua.Cluster.handleAddCluster   data: ", data);
	this._removeCluster(data);
	this._addCluster(data);	
},
removeCluster : function (data, sourceid) {
	console.log("Agua.Cluster.removeCluster    data", data);

	// SEND REQUEST
	this.sendRequest({
		data		: 	data,
		mode		:	"removeCluster",
		module 		: 	"Agua::Workflow",
		sourceid	:	sourceid,
		callback	:	"handleRemoveCluster"
	});
},
handleRemoveCluster : function (response) {
	console.log("Agua.Cluster.handleRemoveCluster   response: ", response);
	var data	=	response.data;
	console.log("Agua.Cluster.handleRemoveCluster   data: ", data);
	
	var success = this._removeCluster(data)
	if ( success == false ) {
		console.log("this.removeCluster    this._removeCluster(data) returned false for cluster: " + data.cluster);
		return;
	}	
},
// CLUSTER WORKFLOW
saveClusterWorkflow : function (data, sourceid) {
	console.log("Agua.Cluster.saveClusterWorkflow    data", data);
	console.log("Agua.Cluster.saveClusterWorkflow    sourceid", sourceid);
	
	// SEND REQUEST
	this.sendRequest({
		data		: 	data,
		mode		:	"saveClusterWorkflow",
		module 		: 	"Agua::Workflow",
		sourceid	:	sourceid,
		callback	:	"handleSaveClusterWorkflow"
	});
},
newCluster : function (data, sourceid) {
// CREATES NEW CELL DIR
	console.log("Agua.Cluster.newCluster    data", data);

	// SEND REQUEST
	this.sendRequest({
		data		: 	data,
		mode		:	"newCluster",
		module 		: 	"Agua::Workflow",
		sourceid	:	sourceid,
		callback	:	"handleNewCluster"
	});
},
handleNewCluster : function (response) {
	console.log("Agua.Cluster.handleNewCluster   response: ", response);
	var data	=	response.data;
	console.log("Agua.Cluster.handleNewCluster   data: ", data);
	this._removeCluster(clusterObject);
	this._addCluster(clusterObject);

	//// SAVE ON REMOTE DATABASE
	//var url = this.cgiUrl + "agua.cgi?";
	//clusterObject.username = this.cookie("username");	
	//clusterObject.sessionid = this.cookie("sessionid");	
	//clusterObject.mode = "newCluster";
	//clusterObject.module = "Agua::Workflow";
	//console.log("Agua.Cluster.newCluster    clusterObject: " + dojo.toJson(clusterObject));
	//
	//this.doPut({
	//	url: url,
	//	query: clusterObject,
	//	sync: false,
	//	timeout: 15000,
	//	callback: dojo.hitch(this, "toast")
	//});
},
updateClusterNodes : function (data) {
	console.log("Agua.Cluster.removeCluster    data", data);

	// SEND REQUEST
	this.sendRequest({
		data		: 	data,
		mode		:	"updateClusterNodes",
		module 		: 	"Agua::Workflow",
		sourceid	:	this.id,
		callback	:	"handleNewCluster"
	});

	//Agua._removeCluster(clusterObject);
	//Agua._addCluster(clusterObject);
	//
	//this.savingCluster = false;
	//
	//// SAVE ON REMOTE DATABASE
	//var url = Agua.cgiUrl + "agua.cgi?";
	//var query = dojo.clone(clusterObject);
	//query.username = Agua.cookie('username');	
	//query.sessionid = Agua.cookie('sessionid');	
	//query.mode = "updateClusterNodes";
	//query.module = "Agua::Admin";

},
_removeCluster : function (data) {
// REMOVE A CLUSTER DATA HASH FROM THE clusters ARRAY
	console.log("Agua.Cluster._removeCluster    plugins.core.Data._removeCluster(data)");
	console.log("Agua.Cluster._removeCluster    data: " + dojo.toJson(data));
	var requiredKeys = ["cluster"];
	return this.removeData("clusters", data, requiredKeys);
},
_addCluster : function (data) {
// ADD A CLUSTER TO clusters AND SAVE ON REMOTE SERVER
	console.log("Agua.Cluster._addCluster    plugins.core.Data._addCluster(data)");
	//console.log("Agua.Cluster._addCluster    data: " + dojo.toJson(data));

	// DO THE ADD
	var requiredKeys = ["cluster"];
	return this.addData("clusters", data, requiredKeys);
},
_removeClusterWorkflow : function (data) {
// REMOVE A CLUSTER OBJECT FROM THE clusters ARRAY
	console.log("Agua.Cluster._removeClusterWorkflow    plugins.core.Data._removeClusterWorkflow(data)");
	var requiredKeys = ["project", "workflow"];
	return this.removeData("clusterworkflows", data, requiredKeys);
},
_addClusterWorkflow : function (data) {
// ADD A CLUSTER TO clusters AND SAVE ON REMOTE SERVER
	console.log("Agua.Cluster._addClusterWorkflow    plugins.core.Data._addClusterWorkflow(data)");
	console.log("Agua.Cluster._addClusterWorkflow    data: " + dojo.toJson(data));

	// DO THE ADD
	var requiredKeys = ["cluster", "project", "workflow"];
	return this.addData("clusterworkflows", data, requiredKeys);
}

});

});