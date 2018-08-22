var Agua;

require([
	"dojo/_base/declare"
	,"dojo/dom"
	,"dojo/ready"
	,"t/unit/doh/util"

	,"plugins/files/FileDrag"
	,"plugins/dojox/data/FileStore"

	//,"t/unit/doh/Agua"
	//,"plugins/folders/Folders"
	//,"plugins/folders/ProjectFiles"

	,"plugins/core/Agua/File"
	,"plugins/core/Agua/Data"

	//,"plugins/core/Agua/Cluster"
	//,"plugins/core/Agua/Hub"
	//,"plugins/core/Agua/Project"
	//,"plugins/core/Agua/Shared"
	//,"plugins/core/Agua/Source"
	//,"plugins/core/Agua/Stage"
	//,"plugins/core/Agua/StageParameter"
	//,"plugins/core/Agua/Workflow"
	//,"plugins/core/Common"
	//,"plugins/core/Updater"

	//,'intern!object'
	//,'intern/chai!assert'
	//,'intern/dojo/Deferred'
	//'dojo/has' 

],


function (
	declare
	,dom
	,ready
	,util

	,FileDrag
	,FileStore
	,AguaFile
	,AguaData
	
	//,Agua

	//,Folders
	//,ProjectFiles

	//,Cluster
	//,Hub
	//,Project
	//,Shared
	//,Source
	//,Stage
	//,StageParameter
	//,Workflow
	//,Common
	//,Updater
	
	//,registerSuite
	//,assert
	//,Deferred
	//has
) {

// setup

// INSTANTIATE MOCK AGUA
var Module = new declare([
	AguaFile,
	AguaData
	
	//Cluster
	//,Data
	//,Hub
	//,Project
	//,Shared
	//,Source
	//,Stage
	//,StageParameter
	//,Workflow
	//,
	//Common
], {

	//updater : new Updater(),
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

	var response = Agua.fetchJson("response.json");
	response.sourceid	=	store.id;

	return response;
};

//Agua.getFileSystem = function (putData, callback, request) {
//	console.log("runTests    Agua.File.getFileSystem    caller: " + this.getFileSystem.caller.nom);
//	
//	console.log("runTests    Agua.File.getFileSystem    putData:");
//	console.dir({putData:putData});
//	console.log("runTests    Agua.File.getFileSystem    callback: " + callback);
//	console.dir({callback:callback});
//	console.log("runTests    Agua.File.getFileSystem    request:");
//	console.dir({request:request});
//
//	return {
//        "name": "run3-s_1_sequence.txt",
//        "path": "/data/sequence/demo/runs/run3/run3-s_1_sequence.txt",
//        "parentPath": "/data/sequence/demo/runs/run3",
//        "parentDir": "/data/sequence/demo/runs/run3",
//        "directory": false,
//        "size": "264466702",
//        "modified": 1358547292,
//        "sample": "@HWI-EAS185:1:17:17:481#0/1&nbsp;NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&nbsp;+HWI-EAS185:1:17:17:481#0/1&nbsp;DW&#93;\X\XZ\&#93;&#93;X\\_\\W_\\\\Y\&#91;X`\XYTRQ&#91;\&#93;`Y^&nbsp;@HWI-EAS185:1:17:18:533#0/1&nbsp;NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
//		"bytes" : "200"
//	};
//		
//	//return data.response;
//}

// TESTS
ready(function(){

	// SETUP
	var test = "unit.plugins.folders.filedrag";
	console.log("# test: " + test);
	dom.byId("pagetitle").innerHTML = test;
	dom.byId("pageheader").innerHTML = test;

	var directory = {
		owner	: 	"testuser",
		name	:	"Project1",
		description:	""
	};

	// STORE	
	console.log("%crunTests    BEFORE store = new FileStore()", "color: green");
	var store = new FileStore({
		url					: 	"testurl",
		data				: 	{},
		pathAsQueryParam	: 	true,
		parentPath			: 	"",
		path				: 	directory.name
	});
	console.log("%crunTests    store: " + store, "color: green");
	console.dir({store:store});
	
	// FILEDRAG
	var filedrag = new FileDrag({
			style			: 	"height: auto; width: 100%; minHeight: 50px;",
			store			: 	store,
			fileMenu		: 	null,
			folderMenu		: 	null,
			workflowMenu	: 	null,
			core			: 	{},
			parentWidget	:	null,
			owner			:	directory.owner,
			path			:	directory.name,
			description		:	directory.description || ''
	});
	console.log("%crunTests    filedrag: " + filedrag, "color: green");

	var attachPoint = dom.byId("attachPoint");
	console.log("%crunTests    attachPoint: " + attachPoint, "color: green");
	attachPoint.appendChild(filedrag.domNode);
	
	// START UP FileDrag
	console.log("%crunTests    DOING filedrag.startup()", "color: green");
	filedrag.startup();





	//var widget = new Folders({
	//	attachPoint : dojo.byId("attachPoint")
	//});
	//console.log("runTests    widget:");
	//console.dir({widget:widget});
	//
	//console.log("runTests    projectFiles: ");
	//var projectFiles = widget.projectFiles;
	//console.dir({projectFiles:projectFiles});

	//var stagehash	=	util.fetchJson("stage.json");
	//console.log("runTests    stagehash:");
	//console.dir({stagehash:stagehash});
	
	//console.log("runTests    DOING parameters.load(stagehash)");
	//widget.load(stagehash);

	
	//stageparameters = Agua.filterByKeyValues(stageparameters, ["project", "workflow", "paramtype", "appnumber", "appname"], ["Project1", "Workflow1", "input", "1", "sleep"]);


});
});






//// REGISTER MODULE PATHS
//dojo.registerModulePath("doh","../../dojo/util/doh");	
//dojo.registerModulePath("plugins","../../plugins");	
//dojo.registerModulePath("t","../../t/unit");	
//
//// DOJO TEST MODULES
//dojo.require("dijit.dijit");
////dojo.require("dojox.robot.recorder");
////dojo.require("dijit.robot");
//dojo.require("doh.runner");
//
//// Agua TEST MODULES
//dojo.require("t.doh.util");
//
//// DEBUG LOADER
////dojo.require("dojoc.util.loader");
//
//// TESTED MODULES
//dojo.require("plugins.core.Agua");
//dojo.require("plugins.folders.Folders");
//dojo.require("plugins.folders.ProjectFiles");
//
//// GLOBAL VARIABLES
//var Agua;
//var Data;
//var data;
//var folders;
//var projectFiles;
//
//dojo.addOnLoad(function(){
//
//Agua = new plugins.core.Agua({
//	cgiUrl 		: 	dojo.moduleUrl("plugins", "../../../cgi-bin/agua/")
//	, dataUrl	:	"getData.aguatest.120525.json"	
//});
//
//Agua.cookie('username', 'testuser');
//Agua.cookie('sessionid', '9999999999.9999.999');
//Agua.loadPlugins([
//	"plugins.data.Controller",
//	"plugins.folders.Controller"
//]);
//
//// CREATE TAB
//Agua.controllers["folders"].createTab();
//
//doh.register("t.plugins.folders.filedrag.test",
//[	
//	{
//		name: "fileDrag",
//		runTest: function(){
//
//			projectFiles = Agua.controllers["folders"].tabPanes[0].projectFiles;
//			console.log("copyFile    projectFiles: ");
//			console.dir({projectFiles:projectFiles});
//
//			
//			// SET DEFERRED OBJECT
//			var deferred = new doh.Deferred();
//			
//			// OPEN DIRECTORIES AUTOMATICALLY
//			setTimeout(function() {
//				try {
//					console.log("copyFile    Doing timeout groupDragPane.onclickHandler(event)");
//					var fileDrag1 = projectFiles.fileDrags[0];
//					console.log("fileDrag1 not null: " + doh.assertFalse(fileDrag1 == null));
//					console.log("fileDrag1.getChildren().length == 1: " + doh.assertEqual(fileDrag1.getChildren().length, 1));
//					var groupDragPane1 = fileDrag1.getChildren()[0];
//					var item = groupDragPane1.items[0];
//					var event = { target: { item: item } };
//					groupDragPane1.onclickHandler(event);
//					console.log("fileDrag1.getChildren().length == 2: " + doh.assertEqual(fileDrag1.getChildren().length, 2));
//
//					var fileDrag2 = projectFiles.fileDrags[1];
//					console.log("fileDrag2 not null: " + doh.assertFalse(fileDrag2 == null));
//					console.log("fileDrag2.getChildren().length == 1: " + doh.assertEqual(fileDrag2.getChildren().length, 1));
//					var groupDragPane2 = fileDrag2.getChildren()[0];
//					var item = groupDragPane2.items[0];
//					var event = { target: { item: item } };
//
//					// OPEN DIRECTORIES AUTOMATICALLY
//					groupDragPane2.onclickHandler(event);
//					console.log("fileDrag2.getChildren().length == 2: " + doh.assertEqual(fileDrag2.getChildren().length, 2));
//	
//				} catch(e) {
//				  deferred.errback(e);
//				}
//			}, 15000);
//
//			// FAKE DRAG DROP
//			setTimeout(function() {
//				try {
//					console.log("copyFile    Doing timeout    dragSource.onDropExternal(source, nodes, copy)");
//					var fileDrag1 = projectFiles.fileDrags[0];
//					var groupDragPane3 = fileDrag1.getChildren()[1];
//					console.log("groupDragPane3 " + groupDragPane3); 
//					var dragSource1 = groupDragPane3._dragSource;
//					
//					var fileDrag2 = projectFiles.fileDrags[1];
//					var groupDragPane4 = fileDrag2.getChildren()[1];
//					console.log("groupDragPane4 " + groupDragPane4); 
//					var dragSource2 = groupDragPane4._dragSource;
//					console.log("dragSource2: " + dragSource2);
//					var dndItem = dragSource2.node.childNodes[6];
//					console.log("dndItem: " + dndItem);
//					
//					dragSource1.onDropExternal(dragSource2, [dndItem], true);
//
//					deferred.callback(true);		
//
//				} catch(e) {
//					deferred.errback(e);
//				}
//			}, 30000);
//
//			return deferred;
//		},	
//		timeout: 45000 
//	}
//
//]);	// doh.register
//
////Execute D.O.H. in this remote file.
//doh.run();
//
//
//
//}); // dojo.addOnLoad
//
