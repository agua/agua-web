var Agua;
var widget;

require([
	"dojo/_base/declare"
	,"dojo/dom"
	,"dojo/ready"
	,"t/unit/doh/util"
	//,"t/unit/doh/Agua"
	,"plugins/workflow/UserWorkflows"
	,"plugins/workflow/RunStatus/Status"

	,"plugins/core/Agua/Cluster"
	,"plugins/core/Agua/Data"
	,"plugins/core/Agua/Exchange"
	,"plugins/core/Agua/Hub"
	,"plugins/core/Agua/Project"
	,"plugins/core/Agua/Stage"
	,"plugins/core/Agua/StageParameter"
	,"plugins/core/Agua/Workflow"
	,"plugins/core/Common"
	,"plugins/core/Updater"

	//,'intern!object'
	//,'intern/chai!assert'
	//,'intern/dojo/Deferred'
	//'dojo/has' 

],


function (declare
	,dom
	,ready
	,util
	//,Agua
	,UserWorkflows
	,RunStatus
	,Cluster
	,Data
	,Exchange
	,Hub
	,Project
	,Stage
	,StageParameter
	,Workflow
	,Common
	,Updater
	
	//,registerSuite
	//,assert
	//,Deferred
	//has
) {

// setup

// INSTANTIATE MOCK AGUA
var Module = new declare([
	Cluster
	,Data
	,Exchange
	,Hub
	,Project
	,Stage
	,StageParameter
	,Workflow
	,Common
], {

	updater : new Updater(),
	cookies : 	[],
	controllers : 	[],
	constructor : function (args) {
		console.log("runTests    Agua.constructor");
	},
	cookie : function(name, value) {
		if ( value != null ) {
			return this.cookies[name] = value;
		}
		else {
			return this.cookies[name];
		}
	},
});

Agua = new Module({});
console.log("runTests    Agua:");
console.dir({Agua:Agua});

window.Agua = Agua;
Agua.data = util.fetchJson("data.json");
Agua.cookie("username", "testuser");
Agua.cookie("sessionid", "9999999999.9999.999");

Agua.exchange = new Object();
Agua.responses = [];
Agua.exchange.send = function (data) {
	console.log("runTests    Agua.send    data", data);

	return this.responses.shift();
};


// run


ready(function(){

	var core = new Object();
	//var runstatus = new RunStatus({
	//	core: core
	//});

	widget = new UserWorkflows({
		attachPoint : dojo.byId("attachPoint"),
		core: core
	});

	// DELAY FOR setClusterCombo TO FINISH
	setTimeout(function(){

		// SET UP
		var response = Agua.fetchJson("response.json");
		Agua.responses.push(response);


		var combo = widget.clusterCombo;
		console.log("runTests    combo", combo);
		combo.focusNode.value = "TEST-CLUSTER";
		combo.onChange();	


	},
	1000,
	this);
	
	//var stagehash	=	util.fetchJson("stage.json");
	//console.log("runTests    stagehash:");
	//console.dir({stagehash:stagehash});
	
	//console.log("runTests    DOING parameters.load(stagehash)");
	//widget.load(stagehash);

	
	//stageparameters = Agua.filterByKeyValues(stageparameters, ["project", "workflow", "paramtype", "appnumber", "appname"], ["Project1", "Workflow1", "input", "1", "sleep"]);


});
});

