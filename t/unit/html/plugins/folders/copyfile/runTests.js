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

	var test = "unit.plugins.folders.copyfile";
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
//var targetFileDrag;
//var targetDragPane;
//var targetDragSource;
//var sourceFileDrag;
//var sourceDragPane;
//var sourceDragSource;
//var dndItem;
//
//
//dojo.addOnLoad(function(){
//
//Agua = new plugins.core.Agua({
//	cgiUrl 		:	dojo.moduleUrl("plugins", "../../../cgi-bin/agua/")
//	, database	:	"aguatest"
//	, dataUrl	:	"getData.aguatest.120525.json"	
//	//dataUrl    :dojo.moduleUrl("t", "json/getData.aguatest.120514.json")
//});
//Agua.cookie('username', 'testuser');
//Agua.cookie('sessionid', '9999999999.9999.999');
//Agua.database = "testuser";
//Agua.loadPlugins([
//	"plugins.data.Controller",
//	"plugins.folders.Controller"
//]);
//
//
//doh.register("t.plugins.folders.copyfile.test", [{
//	timeout: 90000,
//	name: "copyFile",
//	runTest: function() {
//	
//// SET DEFERRED OBJECT
//var deferred = new doh.Deferred();
////Return the deferred.  DOH will 
////wait on this object for one of the callbacks to 
////be called, or for the timeout to expire.
//
//var file 		= 	"Project2/test/test.out";
//var filedir		=	"Project2/test";
//var destination = 	"Project1/Workflow1";
//var username 	= 	"testuser";
//var projectName = 	"Project1";
//var fileName;
//var destinationfile	=	"Project/Workflow1/test.sh";
//
//// SET folders
//var folders 	=	Agua.controllers["folders"].tabPanes[0];
//
//// CREATE TAB
//Agua.controllers["folders"].createTab();
//
//// OPEN DIRECTORIES AUTOMATICALLY
//setTimeout(function() {
//	try {
//		console.log("runTests    ************************ OPEN LOCATION ************************ DOING folders.projectFiles.openLocation(" + destination + "," + username + ")");
//
//Agua.controllers["folders"].tabPanes[0].projectFiles.openLocation(destination, username);
//Agua.controllers["folders"].tabPanes[0].projectFiles.openLocation(filedir, username);
//
//	// GET PROJECTFILES
//	console.log("runTests    projectFiles: ");
//	var projectFiles = Agua.controllers["folders"].tabPanes[0].projectFiles;
//	console.dir({projectFiles:projectFiles});
//
//	// LATER:
//	// CHECK NUMBER OF OPEN PANES
//
//	// CHECK PATHS OF OPEN PANES
//
//		//deferred.callback(true);
//
//	} catch(e) {
//	  deferred.errback(e);
//	}
//
//}, 5000);
//
//// COPY FILE
//setTimeout(function() {
//	try {
//		var folders = Agua.controllers["folders"].tabPanes[0];
//		console.dir({folders:folders});
//		
//		var fileDrag = folders.projectFiles.getFileDragByProject(projectName);
//		console.dir({fileDrag:fileDrag});
//		var dragPanes = fileDrag.getChildren();
//		console.log("runTests    dragPanes.length: " + dragPanes.length);
//		console.dir({dragPanes:dragPanes});
//		var dragPane = dragPanes[0];
//		dragPane.url = "../cgi-bin/agua/folders.cgi";
//		dragPane.putData = {
//			mode        :   "copyFile",    
//			sessionid   :   "9999999999.9999.999",
//			url         :   "../cgi-bin/agua/folders.cgi?",
//			username    :   "testuser",
//			file        :   file,
//			destination :   destination
//		};    
//		
//		console.log("runTests    Doing timeout    dragSource.onDropExternal(source, nodes, copy)");
//
//		// SET copyFile TARGET
//		targetFileDrag = folders.projectFiles.fileDrags[0];
//		console.log("runTests    targetFileDrag: "); 
//		console.dir({targetFileDrag:targetFileDrag});
//		
//		targetDragPane = targetFileDrag.getChildren()[1];
//		console.log("runTests    targetDragPane: " + targetDragPane); 
//		console.dir({targetDragPane:targetDragPane});
//		targetDragSource = targetDragPane._dragSource;
//		
//		sourceFileDrag = folders.projectFiles.fileDrags[1];
//		console.log("runTests    sourceFileDrag: "); 
//		console.dir({sourceFileDrag:sourceFileDrag});
//		
//		// SET COPY SOURCE
//		sourceDragPane = sourceFileDrag.getChildren()[1];
//		console.log("runTests    sourceDragPane ");
//		console.dir({sourceDragPane:sourceDragPane});
//		
//		sourceDragSource = sourceDragPane._dragSource;
//		console.log("runTests    sourceDragSource: ");
//		console.dir({sourceDragSource:sourceDragSource});
//		
//		dndItem = sourceDragSource.node.childNodes[0];
//		console.log("runTests    dndItem: " );
//		console.dir({dndItem:dndItem});
//		fileName = dndItem.item.path;
//		
//		destinationFile = targetDragPane.path + "/" + fileName;
//		console.log("runTests    destinationFile: " + destinationFile);
//		
//		// DELETE DESTINATION FILE
//		console.log("runTests    copyFile    Doing Agua.removeRemoteFile ");		
//		Agua.removeFileTree(username, destinationFile);
//		Agua.removeRemoteFile(username, destinationFile, null);
//		
//		//deferred.callback(true);
//		
//	} catch(e) {
//	  deferred.errback(e);
//	}
//
//}, 10000);
//		
//setTimeout(function() {
//	try {
//		console.log("runTests    DOING TESTS FOR removeFile");
//		
//		// STANDBY HIDDEN
//		console.log("runTests    targetDragPane.standby._displayed is FALSE: " + doh.assertEqual(targetDragPane.standby._displayed, false));
//
//		// FILE NOT PRESENT
//		console.log("runTests    fileCache is NULL: " + doh.assertEqual(Agua.isFileCacheItem(username, destination, fileName), false));
//
//		// DO FILE DROP	
//		console.log("runTests    DOING targetDragSource.onDropExternal()");
//		targetDragSource.onDropExternal(sourceDragSource, [dndItem], true);
//
//		//deferred.callback(true);
//
//	} catch(e) {
//	  deferred.errback(e);
//	}
//
//}, 20000);
//
//setTimeout(function() {
//	try {
//		console.log("runTests    DOING TESTS FOR RUNNING targetDragSource.onDropExternal()");
//	
//		// STANDBY HIDDEN
//		console.dir({targetDragPane:targetDragPane});
//		console.dir({standby:targetDragPane.standby});
//		console.log("runTests    targetDragPane.standby._displayed is TRUE: " + targetDragPane.standby._displayed);
//		// WATCH THE TIMING FOR THIS
//		//console.log(doh.assertEqual(targetDragPane.standby._displayed, true));
//
//		//deferred.callback(true);
//		
//	} catch(e) {
//	  deferred.errback(e);
//	}
//}, 25000);
//
//setTimeout(function() {
//	try {
//		console.log("runTests    DOING TESTS FOR COMPLETED targetDragSource.onDropExternal()");
//	
//		// STANDBY HIDDEN
//		console.dir({targetDragPane:targetDragPane});
//		console.dir({standby:targetDragPane.standby});
//		console.log("runTests    targetDragPane.standby._displayed is TRUE " + doh.assertEqual(targetDragPane.standby._displayed, false));
//
//		// FILE EXISTS
//		console.log("runTests    isItem: " + Agua.isFileCacheItem(username, destination, fileName));
//
//		console.log("runTests    fileCache is NOT NULL" + doh.assertEqual(Agua.isFileCacheItem(username, destination, fileName), true));
//		
//		deferred.callback(true);
//		
//	} catch(e) {
//	  deferred.errback(e);
//	}
//
//}, 60000);
//
//
//
//
//return deferred;
//
//
//
//}
//
//
//}]);	// doh.register
//
//
//	
////Execute D.O.H.
//doh.run();
//
//
//}); // dojo.addOnLoad
//
//
