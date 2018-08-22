var Agua;

require([
	"dojo/_base/declare"
	,"dojo/dom"
	,"dojo/ready"
	,"t/unit/doh/util"
	//,"t/unit/doh/Agua"
	,"plugins/folders/Folders"
	,"plugins/folders/ProjectFiles"

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

	,Folders
	,ProjectFiles

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
Agua.data = util.fetchJson("getData.aguatest.120525.json");
Agua.cookie("username", "testuser");
Agua.cookie("sessionid", "9999999999.9999.999");

Agua.exchange = new Object();
Agua.exchange.send = function (data) {
	console.log("runTests    Agua.send    data: ");
	console.dir({data:data});
};


// run

ready(function(){

	var test = "unit.plugins.folders.fileinfo";
	console.log("# test: " + test);
	dom.byId("pagetitle").innerHTML = test;
	dom.byId("pageheader").innerHTML = test;


	var widget = new Folders({
		attachPoint : dojo.byId("attachPoint")
	});
	console.log("runTests    widget:");
	console.dir({widget:widget});
	
	console.log("runTests    projectFiles: ");
	var projectFiles = widget.projectFiles;
	console.dir({projectFiles:projectFiles});

	//var stagehash	=	util.fetchJson("stage.json");
	//console.log("runTests    stagehash:");
	//console.dir({stagehash:stagehash});
	
	//console.log("runTests    DOING parameters.load(stagehash)");
	//widget.load(stagehash);

	
	//stageparameters = Agua.filterByKeyValues(stageparameters, ["project", "workflow", "paramtype", "appnumber", "appname"], ["Project1", "Workflow1", "input", "1", "sleep"]);


});
});


