//function handleError(error){
//  console.log("handleERROR: " + error.src + error.id);
//}
//require.on("error", handleError);

//define([
//  'intern!bdd',
//  'intern/chai!expect',
//  '../MyWidget'
//], function (bdd, expect, MyWidget) {
//  bdd.describe('demo widget', function () {
//    var widget;
//
//    bdd.before(function () {
//      widget = new MyWidget();
//    });
//
//    bdd.after(function () {
//      widget.destroy();
//    });
//
//    bdd.it('should have children', function () {
//      expect(widget.children).to.not.be.empty;
//    });
//  });
//});
//


console.log("t/unit/plugins/workflow/workflows/runTests    LOADING");

// GLOBAL VARIABLES
var Agua = {};
var Data = {};

var dojoConfig = {
	isDebug: true,
	locale: "en-us",
	//extraLocale: ['ja-jp'],
	debugAtAllCosts: true,
	useCommentedJson: true,
	parseOnLoad: true,
	async : 0,
	insertAbsMids: false,
	has : {
		"dojo-undef-api": 1
	},

	packages: [
		{
			name: "t",
			location: "../../t"
		},
		{
			name: "plugins",
			location: "../../plugins"
		}
	]
};

var Agua;
var Data;
var data;
var workflows;
var widget;
var core;

define([
	"dojo/_base/declare",
	'intern!bdd', 
	'intern/chai!expect', 
	'intern/dojo/Deferred',
	'dojo/has',

	"dojo/dom",
	"dojo/ready",
	"t/unit/doh/util",
	"t/unit/doh/Agua",
	"plugins/workflow/Workflow"
],

function (
	declare,
	bdd,
	expect,
	dom,
	ready,
	util,
	Agua,
	Workflow
) {

// SET GLOBALS
window.Agua = Agua;
console.log("runTests    Agua:");
console.dir({Agua:Agua});

ready(function() {
	

	console.log("runTests    BEFORE require.undef");
	require.undef('plugins/workflow/Workflow');
	console.log("runTests    AFTER require.undef");


  bdd.describe('instantiate', function () {
    var widget;

    bdd.before(function () {

	  // DATA
	  Agua.data	=	util.fetchJson("./data.json");
	  Agua.token 	= 	"Eliyjj4WlqmZfR5M";
	  console.log("runTests    Agua.data:");
	  console.dir({Agua_data:Agua.data});
	  
	  // CORE
	  var core	=	{};
	  
	  console.log("runTests    BEFORE new Workflow()");
	  widget	=	new Workflow({
		  core		:	core,
		  attachPoint	:	dojo.byId("attachPoint")
	  });
	  console.log("runTests    AFTER new Workflow()");
	  
	  console.log("runTests    widget:");
	  console.dir({widget:widget});


    });

    bdd.after(function () {
      widget.destroy();
    });

    bdd.it('should have children', function () {
      expect(widget.core).to.not.be.empty;
    });
  });

		
}); // ready


	//var rowClass = "plugins/workflow/Apps/AppRow";
	//console.log("runTests    rowClass: " + rowClass);
	//console.log("runTests    Plugin: ");
	//console.dir({Plugin:Plugin});
	//
	////dojo.require(rowClass);
	//var args = {
	//	name		: 	"test",
	//	description	: 	"test desscription",
	//	location	: 	"test/location",
	//	version		: 	"0.0.1",
	//	executor	: 	"/usr/bin/perl",
	//	localonly	: 	0,
	//	notes		:	""
	//};
	//
	//var plugin;
	//require([rowClass], function (Module) {
	//	plugin = new Module(args);
	//	console.log("runTests    INSIDE plugin: " + plugin);
	//	console.dir({plugin:plugin});
	//	
	//});
	//console.log("runTests    AFTER plugin: " + plugin);
	//console.dir({plugin:plugin});
	//


	//function testIt(expected, fooValue, barValue) {
	//	has.add("foo", fooValue, true, true);
	//	has.add("bar", barValue, true, true);
	//	var dfd = new Deferred();
	//	require([ "./foobarPlugin!" ], function(data) {
	//		assert.strictEqual(data, expected);
	//		dfd.resolve();
	//	});
	//	return dfd;
	//}
	//
	//registerSuite({
	//	name : 'foobarPlugin',
	//	setup : function() {
	//		require({async:true});	// only fails in async mode
	//	},
	//	beforeEach : function() {
	//		require.undef('./foobarPlugin!');
	//		require.undef('./foobarPlugin');
	//	},
	//	teardown : function() {
	//		require.undef('./foobarPlugin!');
	//		require.undef('./foobarPlugin');
	//	},
	//	expectFoo : function() {
	//		return testIt("foo", true, false);
	//	},
	//	expectBar : function() {
	//		return testIt("bar", false, true);
	//	},
	//	expectUndefined : function() {
	//		return testIt("undefined", false, false);
	//	}
	//});
	//
	//testIt();
	
	//console.log("runTests    require:");
	//console.dir({require:require});

	//require([ "plugins/workflow/Workflow" ], function(data) {
	//	console.log("runTests    INSIDE REQUIRE");
	//});

	//console.log("runTests    require.undef: " + require.undef);
	//console.dir({require_undef:require.undef});
	//
	//console.log("runTests    BEFORE require.undef");
	//require.undef('plugins/workflow/Workflow');
	//console.log("runTests    AFTER require.undef");
	
	//console.log("runTests    BEFORE require");
	//require(['plugins/workflow/Workflow']);
	//console.log("runTests    AFTER require");

}); // require



//// REGISTER module path FOR PLUGINS
//dojo.registerModulePath("plugins","../../plugins");	
//dojo.registerModulePath("t","../../t/unit");	
//
//// DOJO TEST MODULES
////dojo.require("dijit.dijit");
//////dojo.require("dojox.robot.recorder");
//////dojo.require("dijit.robot");
//dojo.require("doh.runner");
//dojo.require("dojo.parser");
//
//// Agua TEST MODULES
//dojo.require("t.doh.util");
////dojo.require("dojoc.util.loader");
//
//// TESTED MODULES
//dojo.require("plugins.core.Agua");
//dojo.require("plugins.workflow.Workflow");
//
//// GLOBAL Agua VARIABLE
//var Agua;
//dojo.addOnLoad(function(){
//
//Agua = new plugins.core.Agua( {
//	cgiUrl : "../../../../../../cgi-bin/aguadev/",
//	database: "aguatest",
//	dataUrl: "getData-execute.json"
//});
//Agua.cookie('username', 'testuser');
//Agua.cookie('sessionid', '9999999999.9999.999');
//Agua.loadPlugins([
//	"plugins.data.Controller",
//	"plugins.workflow.Controller"
//]);
//
//// CREATE TAB
//Agua.controllers["workflow"].createTab();
//
//console.log("agua.html    BEFORE Agua.loadPlugins");
//Agua.loadPlugins([ "plugins.workflow.Controller" ]);
//console.log("agua.html    AFTER Agua.loadPlugins");
//
//doh.register("t.plugins.workflow.io.test", [{
//
//name	: 	"chainInputs",
//timeout	:	30000,
//
//runTest	: function(){
//
//	// SET DEFERRED OBJECT
//	var deferred = new doh.Deferred();
//
//	// OPEN DIRECTORIES AUTOMATICALLY
//	setTimeout(function() {
//		try {
//			console.log("runTests    ************************************************");
//
//			// OK LOADS PARAMETER
//			var workflow = Agua.controllers["workflow"].tabPanes[0];
//			var dragSource = workflow.core.stages.dropTarget;
//			var node = dragSource.node.childNodes[0];
//			parameters.load(node);
//		
//		
//			// STANDBY TEST CODE COPIED FROM Workflows.js
//			console.log("runTests    Doing this.loadParametersPane(allNodes[0])");
//			//console.log("runTests    allNodes[0]: " + allNodes[0]);
//		
//			var stages = this.getStagesStandby();
//			console.log("runTests    stages: " + stages);
//			console.log("runTests    stages.target: " + stages.target);
//			
//			console.log("runTests    stages._displayed: " + stages._displayed);
//			console.log("runTests    stages.show()");
//			stages.show();
//			console.log("runTests    stages._displayed: " + stages._displayed);
//			
//			console.log("runTests    stages.domNode.innerHTML: " + stages.domNode.innerHTML);
//			console.log("runTests    stages: ");
//			console.dir({ stages:stages });
//		
//			deferred.callback(true);
//
//		} catch(e) {
//		  deferred.errback(e);
//		}
//	}, 5000);
//
//	return deferred;
//}
//
//
//}]);	// doh.register
//
//
//}); // dojo.addOnLoad



console.log("t/unit/plugins/workflow/workflows/runTests    COMPLETED");
