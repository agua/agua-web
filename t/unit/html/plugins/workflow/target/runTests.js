var Agua;
var Data;
var data;
var workflows;

require([
	"dojo/_base/declare",
	"dojo/dom",
	"dojo/ready",
	"doh/runner",
	"t/unit/doh/util",
	"t/unit/doh/Agua",
	"plugins/workflow/UserWorkflows",
	"plugins/workflow/Parameters",
	"dojo/domReady!"
],

function (declare, dom, ready, doh, util, Agua, UserWorkflows, Parameters) {

// SET GLOBALS
window.Agua = Agua;
console.log("runTests    Agua:");
console.dir({Agua:Agua});

var fetchJson = function(url) {
	console.log("runTests.fetchJson    url: " + url);

    var jsonObject;
    dojo.xhrGet({
        // The URL of the request
        url: url,
		// Make synchronous so we wait for the data
		sync: true,
		// Long timeout
		timeout: 5000,
        // Handle as JSON Data
        handleAs: "json",
        // The success callback with result from server
        load: function(response) {
            console.log("runTests.fetchJson    response:");
			console.dir({response:response});
			
			jsonObject = response;
	    },
        // The error handler
        error: function(response) {
			console.debug(response)
            console.log("runTests.fetchJson    Error, response: " + dojo.toJson(response));
        }
    });

	return jsonObject;
};

ready(function() {
	
	// DATA
	Agua.data	=	fetchJson("./data.json");
	Agua.token 	= 	"Eliyjj4WlqmZfR5M";
	console.log("runTests    Agua.data:");
	console.dir({Agua_data:Agua.data});
	
	// STAGE
	var stage			=	fetchJson("stage.json");
	stage.application	=	stage.data;
	console.log("runTests    stage:");
	console.dir({stage:stage});
	Agua.cookie("username", stage.username);
	Agua.cookie("sessionid", stage.sessionid);
	
	// ATTACH
	var attachPoint	=	dojo.byId("attachPoint");
	console.log("runTests    attachPoint: " + attachPoint);

	// CORE
	var core	=	{};
	
	// PARAMETERS
	var parameters	=	new Parameters({
		core		:	core,
		attachPoint	:	dojo.byId("parameterPoint")
	});
	console.log("runTests    parameters:");
	console.dir({parameters:parameters});

	// WORKFLOWS
	workflows = new UserWorkflows({
		//attachNode: Agua.tabs
		core 		: 	core,
		attachPoint	: 	dojo.byId("attachPoint")
	});
	console.log("runTests    workflows:");
	console.dir({workflows:workflows});
	
	// COMBOS	
	workflows.projectCombo.set('value', "Project1");
	workflows.workflowCombo.set('value', "Workflow1");
	
	// TARGET
	var target	=	workflows.dropTarget;
	console.log("runTests    target:");
	console.dir({target:target});

	var source 	= 	target;
	var nodes	=	[stage];
	var copy	=	false;
	target.containerState	=	"Over";
	target.checkAcceptance	=	function(){
		return true;
	};
	
	target.onDndDrop(source, nodes, copy);

});


//
//	console.log("runTests    AFTER new plugins.workflow.Workflows");

//
//doh.register("plugins/workflow/Workflows",
//[
//	
////{
////	name: "getYieldStats",
////	setUp: function(){
////	},
////	runTest : function(){
////		var uploaderId = dijit.getUniqueId("plugins.form.UploadDialog");
////		var username = "admin";
////		var sessionid = "9999999999.9999.999";
////		var uploader = new UploadDialog({
////			uploaderId: uploaderId,
////			username: 	username,
////			sessionid: 	sessionid
////		});
////		//uploader.setPath("Project1/Workflow2");
////		uploader.dialog.set('title', "Upload Manifest File");
////		
////		uploader.show();
////	}
////}
//
//
//]);	// doh.register

////]}}

//Execute D.O.H. in this remote file.
//doh.run();

}); // require
//dojo.addOnLoad(function(){
//
//	//Agua = new plugins.core.Agua( {
//	//	dataUrl : "data.json"
//	//});
//	
//	workflows = new plugins.workflow.Workflows({
//		//attachNode: Agua.tabs
//		core : {},
//		attachNode: dijit.byId("attachPoint")
//	});
//
//	console.log("runTests    AFTER new plugins.workflow.Workflows");

	//// SET DELAY
	//runStatus.delay = 21000;
	//
	//
	//Agua.updateStagesStatus = function () {
	//	console.log("Agua.updateStagesStatus    IN runTests");
	//};
	//
	//Agua.getWorkflowNumber = function () {
	//	console.log("Agua.getWorkflowNumber    IN runTests");
	//	return 1;
	//};
	//
	//runStatus.core = new Object;
	//runStatus.core.userWorkflows = {}
	//runStatus.core.userWorkflows.getProject = function() {
	//	return "Project1";
	//}
	//runStatus.core.userWorkflows.getWorkflow = function() {
	//	return "Workflow1";
	//}
	//runStatus.core.userWorkflows.getCluster = function() {
	//	return "";
	//}
	//
	//runStatus.pauseWorkflow = function () {
	//	console.log("runStatus.pauseWorkflow    IN runTests");
	//};
	//
	//runStatus.stopWorkflow = function () {
	//	console.log("runStatus.stopWorkflow    IN runTests");
	//};
	//
	//runStatus.core.userWorkflows.dropTarget = {};
	//runStatus.core.userWorkflows.dropTarget.getAllNodes = function () {
	//	return [1,2,3];
	//}
	//
	//console.clear();
	//console.log("After console.clear()");
	//
	//doh.register("t.plugins.workflow.runstatus.test",
	//[
	//	{
	//		name: "getStatus",
	//		runTest: function(){
	//			runStatus.runner = {
	//				childNodes  : [1,2,3],
	//				cluster     :	"smallcluster",
	//				project     :	"Project1",
	//				sessionid   :	"9999999999.9999.999",
	//				start       :   2,
	//				stop        :	2,
	//				username    :	"admin",
	//				workflow    :	"Workflow1",
	//				workflownumber:	"1"
	//			};
	//			var singleton = true;
	//			runStatus.polling = false;
	//			runStatus.setCgiUrl("./test-incomplete-unpretty.json", 5);
	//			
	//			console.log("runTests    DOING FIRST CALL TO runStatus.getStatus()");
	//			runStatus.getStatus(runStatus.runner, singleton);
	//
	//			var deferred = new doh.Deferred();
	//			//setTimeout(function(){
	//			//	try {
	//			//		//console.log("runTests    Doing RunStatus.clearDeferreds()");
	//			//		//runStatus.clearDeferreds()
	//			//		
	//			//		//runStatus.deferred.callback = function () {
	//			//		//	console.log("deleted callback");
	//			//		//};
	//			//		
	//			//	} catch(e) {
	//			//	  deferred.errback(e);
	//			//	}
	//			//}, 3000);
	//
	//			setTimeout(function(){
	//				try {
	//					console.log("runTests   DOING SECOND CALL to RunStatus.getStatus()");
	//					runStatus.polling = false;
	//					runStatus.getStatus(runStatus.runner, singleton);
	//
	//				} catch(e) {
	//				  deferred.errback(e);
	//				}
	//			}, 4000);
	//			
	//			setTimeout(function(){
	//				try {
	//					console.log("runTests    WAITING FOR getStatus TO COMPLETE");
	//					// DEFAULT NO ERRORS
	//					doh.assertTrue(true);
	//					
	//					deferred.callback(true);
	//				} catch(e) {
	//				  deferred.errback(e);
	//				}
	//			}, 12000);
	//
	//			return deferred;
	//		
	//		},
	//		timeout: 15000
	//	}
	//
	//]);	// doh.register
	
	////Execute D.O.H. in this remote file.
	//doh.run();

//}); // dojo.addOnLoad

