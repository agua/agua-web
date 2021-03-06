require([
	"dojo/_base/declare",
	"dijit/registry",
	"dojo/dom",
	"dojo/parser",
	"doh/runner",
	"t/unit/doh/util",
	//"t/unit/doh/Agua",
	"plugins/workflow/History",
	"dojo/ready"
],

function (
	declare,
	registry,
	dom,
	parser,
	doh,
	util,
	//Agua,
	History,
	ready
) {

window.Agua = Agua;
console.dir({Agua:Agua});

ready(function(){
	
	var test = "unit.plugins.apps.parameterrow";
	console.log("# test: " + test);
	dom.byId("pagetitle").innerHTML = test;
	dom.byId("pageheader").innerHTML = test;
	
	var response	=	util.fetchJson("history.json");
	console.log("runTests    response: ");
	console.dir({response:response});
	
	var widget 	=	new History({
		attachPoint	:	dom.byId("attachPoint"),
		showHistory : 	function() {
			console.log("runTests    OVERRIDE showHistory");
		}
	});
	console.log("runTests    widget: ");
	console.dir({widget:widget});

	widget.handleHistory(response);
	
});




});

////}}}}}

//doh.register("plugins.apps.History", [
//
//////}}}}}
//
//{
//
//////}}}}}
//
//	name: "new",
//	setUp: function(){
//		// ENSURE attachPoint __WIDGET__ IS INSTANTIATED
//		parser.parse();
//		
//		//Agua.data = new Object;
//		//Agua.data.parameters = util.fetchJson("./parameters.json");
//	},
//	runTest : function(){
//		console.log("# new");
//
//		var history 	=	new History({
//			attachPoint	:	dom.byId("attachPoint")
//		});
//
//		console.log("new    instantiated");
//		//doh.assertTrue(true);
//	},
//	tearDown: function () {}
//}
//
//
//]);
//
//	//Execute D.O.H. in this remote file.
//	doh.run();
//});


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
//// REGISTER module path FOR PLUGINS
//dojo.registerModulePath("plugins","../../plugins");	
//
//// DEBUG LOADER
////dojo.require("dojoc.util.loader");
//
//// TESTED MODULES
//dojo.require("plugins.core.Agua");
//dojo.require("plugins.workflow.Grid");
//
//var Agua;
//var Data;
//var projectPanel;
//
//dojo.addOnLoad(function(){
//
//	Agua = new plugins.core.Agua( {
//		cgiUrl : "../../../../../../cgi-bin/agua/",
//		htmlUrl : "../../../../agua/",
//		//,
//		////dataUrl: "../../../../t/json/getData-workflow-runstatus.json"
//		dataUrl: "../../../../t/json/getData.json"
//	});
//	
//	Agua.cookie('username', 'testuser');
//	Agua.cookie('sessionid', '9999999999.9999.999');
//	Agua.loadPlugins([
//	"plugins.data.Controller",
//	"plugins.workflow.Controller"
//]);
//
//	var projectPanel = new plugins.workflow.History({
//		attachNode : Agua.tabs
//	});
//
//	
//	
//});
