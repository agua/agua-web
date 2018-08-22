var Agua;
var fileManager;

require([
	"dojo/_base/declare"
	,"dojo/dom"
	,"dojo/ready"
	,"t/unit/doh/util"
	//,"t/unit/doh/Agua"
	,"plugins/files/FileManager"
	,"plugins/workflow/Parameters"

	,"plugins/core/Agua/Cluster"
	,"plugins/core/Agua/Data"
	,"plugins/core/Agua/File"
	,"plugins/core/Agua/Hub"
	,"plugins/core/Agua/Project"
	,"plugins/core/Agua/Shared"
	,"plugins/core/Agua/Source"
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
	,FileManager
	,Parameters
	,Cluster
	,Data
	,File
	,Hub
	,Project
	,Shared
	,Source
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
	,File
	,Hub
	,Project
	,Shared
	,Source
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
Agua.exchange.send = function (data) {
	console.log("runTests    Agua.send    data: ");
	console.dir({data:data});
};


ready(function(){

	var core = new Object();

	console.log("runTests    BEFORE new FileManager()");
	fileManager = new FileManager({
		attachPoint : dojo.byId("attachPoint"),
		core: core
	});
	console.log("runTests    fileManager", fileManager);

	var showButton = dojo.byId("showFileManager");
	console.log("runTests    showButton", showButton);

	var parameterWidget= {};
	parameterWidget.project = "Project1";
	parameterWidget.workflow = "Workflow1";
	
	console.log("runTests    BEFORE dojo.connect");
	dojo.connect(showButton, "onClick", function() {
		console.log("runTests    dojo.connect ONCLICK FIRED");

		fileManager.show(parameterWidget);
	});
	console.log("runTests    AFTER dojo.connect");
	
	
})

});