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
	"plugins/workflow/RunStatus/Status"
],

function (declare,
	dom,
	ready,
	doh,
	util,
	Agua,
	Status
) {

// SET GLOBALS
window.Agua = Agua;
console.log("runTests    Agua:");
console.dir({Agua:Agua});

ready(function() {
	
	// DATA
	Agua.data	=	util.fetchJson("./data.json");
	Agua.token 	= 	"Eliyjj4WlqmZfR5M";
	console.log("runTests    Agua.data:");
	console.dir({Agua_data:Agua.data});
	
	// ATTACH
	var middlePanel	=	dojo.byId("middlePanel");
	console.log("runTests    middlePanel: " + middlePanel);

	// CORE
	var core	=	{};
	
	// STATUS
	// PARAMETERS
	var status	=	new Status({
		core		:	core,
		attachPoint	:	dojo.byId("rightPanel")
	});

	status.setTargetClasses = function () {
		console.log("runTests    OVERRIDE status.setTargetClasses()");
	};
	
	// TEST 1
	var test1 = util.fetchJson("test1.json");
	
	console.log("runTests    DOING status.handleRunWorkflow(test1)");
	status.handleStatus(test1);
	console.log("runTests    AFTER status.handleRunWorkflow(test1)");
	
	console.log("runTests    AFTER FIRST queryStatus");
	console.log("runTests    status.stageStatus is NULL: " + doh.assertFalse(status.stageStatus == null));
	console.log("runTests    data and rows[1] 'queued' values match");
	console.log("runTests    status.stageStatus.rows[1].queuedNode.innerHTML: " + status.stageStatus.rows[1].queuedNode.innerHTML);

	// CONFIRM CHANGES TO Agua.data.stages
	var stages = test1.data.stagestatus.stages;
	console.log("runTests    stages:");
	console.dir({stages:stages});

	var expected	=	[
		{
			status:	"completed"
		},
		{
			status:	"running"
		},
	];
	stages = Agua.sortNumericHasharray(stages, "number");
	for ( var i = 0; i < stages.length; i++ ) {
		console.log("Agua.Stage.updateStagesStatus     stage " + i + ": ");
		console.dir({stage:stages[i]});
		console.log("Agua.Stage.updateStagesStatus     stage " + i + " number: " + stages[i].number + ", status: " + stages[i].status + ", started: " + stages[i].started + ", completed: " + stages[i].completed);
		
		var stageStatus	=	status.stageStatus;
		console.log("Agua.Stage.updateStagesStatus     stageStatus: " + stageStatus);
		console.dir({stageStatus:stageStatus});

		var row	=	stageStatus.rows[i];
		console.log("Agua.Stage.updateStagesStatus     status: " + status);
		console.dir({status:status});
		
		doh.assertEqual(stages[i].status, expected[i].status);
	}

	// TEST 2
	var test2 = util.fetchJson("test2.json");


	//console.log("runTests    test2.stagestatus.stages[1].queued: " + test2.stagestatus.stages[1].queued);
	//doh.assertEqual(status.stageStatus.rows[1].queuedNode.innerHTML, test2.stagestatus.stages[1].queued);
	//
	//console.log("runTests    data and rows[1] 'started' values match");
	//console.log("runTests    status.stageStatus.rows[1].started: " + status.stageStatus.rows[1].started);
	//doh.assertEqual(status.stageStatus.rows[1].started, test2.stagestatus.stages[1].started);
	//
	//console.log("runTests    status.completed is false: " + doh.assertFalse(status.completed));
	//console.log("runTests    status.polling is true: " + doh.assertTrue(status.polling));
	//
	//
	//console.log("runTests    AFTER SECOND queryStatus");
	//console.log("runTests    data and rows[1] 'completed' values match: " + doh.assertEqual(status.stageStatus.rows[1].completed, test2.stagestatus.stages[1].completed));
	//console.log("runTests    data and rows[1] 'status' values match: " + doh.assertEqual(status.stageStatus.rows[1].test, test2.stagestatus.stages[1].test));
	//
	//console.log("runTests    duration is correct: " + doh.assertEqual(status.stageStatus.rows[1].durationNode.innerHTML, "13 hours 31 min 5 sec"));


	//// TEST 3
	//var test3 = util.fetchJson("test3.json");



	//// STAGE
	//var waiting			=	fetchJson("waiting.json");
	//waiting.application	=	waiting.data;
	//console.log("runTests    waiting:");
	//console.dir({waiting:waiting});

	//Agua.cookie("username", waiting.username);
	//Agua.cookie("sessionid", waiting.sessionid);
	
	
	//// PARAMETERS
	//var parameters	=	new Parameters({
	//	core		:	core,
	//	middlePanel	:	dojo.byId("rightPanel")
	//});
	//console.log("runTests    parameters:");
	//console.dir({parameters:parameters});
	//
	//// WORKFLOWS
	//workflows = new UserWorkflows({
	//	//attachNode: Agua.tabs
	//	core 		: 	core,
	//	middlePanel	: 	dojo.byId("middlePanel")
	//});
	//console.log("runTests    workflows:");
	//console.dir({workflows:workflows});
	//
	//// COMBOS	
	//workflows.projectCombo.set('value', "Project1");
	//workflows.workflowCombo.set('value', "Workflow1");
	//
	//// TARGET
	//var target	=	workflows.dropTarget;
	//console.log("runTests    target:");
	//console.dir({target:target});
	//
	//var source 	= 	target;
	//var nodes	=	[stage];
	//var copy	=	false;
	//target.containerState	=	"Over";
	//target.checkAcceptance	=	function(){
	//	return true;
	//};
	//
	//target.onDndDrop(source, nodes, copy);

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
//		attachNode: dijit.byId("middlePanel")
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

