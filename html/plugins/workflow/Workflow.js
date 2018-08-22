/*	MAIN WORKFLOW CLASS, INSTANTIATES ALL OTHER WORKFLOW CLASSES
 
	1. SET LEFT PANE
		Apps.js
		SharedApps.js
	
	2. MIDDLE PANE
		Stages.js --> Target.js/StageRow.js
		
	
	3. RIGHT PANE
		SET STAGES, HISTORY AND SHARED IN 
	


	WIDGET HIERARCHY
		
				1_to_1	   1_to_1	 
		Workflow --> Stages --> Target 
		 |              |
		 |              |1_to_many
		 |              |   
		 | 1_to_1       --> StageRow
		 |                     |
		 |                     | 1_to_1
		 |                     |
		 -----------------> Parameters --> ParameterRow
                                    1_to_many

    CORE MODULES LIST

    core.workflow       =   plugins.workflow.Workflow
    core.parameters  	=   plugins.workflow.Parameters
    core.stages         =   plugins.workflow.Stages
    core.target         =   plugins.workflow.Target
    core.fileManager    =   plugins.workflow.FileManager
    core.apps           =   plugins.workflow.Apps.Apps
    core.aguaPackages   =   plugins.workflow.Apps.AguaPackages
    core.adminPackages  =   plugins.workflow.App.AdminPackages


-	USAGE SCENARIO 1: CREATION AND LOADING OF A NEW WORKFLOW PANE
	
		--> CREATE RIGHT PANE Parameters.js AS this.Parameters

		--> CREATE MIDDLE PANE Workflows.js VIA ITS METHOD updateDropTarget
	
			--> CREATE DROP TARGET Target.js
		
				--> OVERRIDE onDndDrop TO CONVERT DROPPED NODE
				
					INTO StageRow.js WITH ONCLICK loadParametersPane
		
					(CALLS loadParametersPane METHOD IN Workflow.js
					
					WHICH IN TURN CALLS load METHOD OF Parameters.js
					
			--> CALL loadParametersPane METHOD IN Workflow.js
					
				--> CALLS load METHOD OF Parameters.js

					--> CALLS checkValidParameters IN StageRow

			--> CHECK VALIDITY OF OTHER StageRows (2, 3, 4, ...)

				--> CALL checkValidParameters IN StageRow
			
			--> UPDATE VALIDITY OF Stage.js (RunWorkflow BUTTON)
			

	USAGE SCENARIO 2: USER DROPS APPLICATION INTO TARGET
	
		1. onDndDrop METHOD IN Target.js
		
			--> CONVERTS App.js INTO StageRow.js
		
			--> CALLS loadParametersPane IN Workflow.js 
		
				--> CALLS load IN Parameters.js
				
					--> CALLS checkValidParameters IN StageRow


	USAGE SCENARIO 3: USER UPDATES PARAMETER IN DATA PANE
	
		1. ParameterRow.js CHECKS VALIDITY AND PRESENCE OF FILES
	
			--> CALLS checkValidInputs METHOD OF Parameters.js
			
				GETS this.isValid FROM VALIDITY OF ALL PARAMETERS 
			
				--> CALLS setValid/setInvalid OF StageRow.js 
		
					--> CALLS updateRunButton OF Stages.js
					
						POLL VALIDITY OF ALL StageRows
						
						SET RunWorkflow BUTTON IF ALL STAGES VALID

*/

//
//if ( 1 ) {
//// EXTERNAL MODULES
//
//// EXPANDOPANE
//dojo.require("dojox.layout.ExpandoPane");
//
//// FILE UPLOAD
//dojo.require("plugins.form.UploadDialog");
//
//// NOTES EDITOR
//dojo.require("dijit.form.Textarea");
//
//dojo.require("dijit.form.TextBox");
//dojo.require("dijit.form.ValidationTextBox");
//dojo.require("dijit.form.NumberTextBox");
//dojo.require("dijit.form.CurrencyTextBox");
//dojo.require("dojo.currency");
//dojo.require("dijit.Dialog");
//
//// WIDGETS AND TOOLS FOR EXPANDO PANE
//dojo.require("dijit.form.ComboBox");
//dojo.require("dijit.Tree");
//dojo.require("dijit.layout.AccordionContainer");
//dojo.require("dijit.layout.TabContainer");
//dojo.require("dijit.layout.ContentPane");
//dojo.require("dijit.layout.BorderContainer");
//dojo.require("dojox.layout.FloatingPane");
//dojo.require("dojo.fx.easing");
//dojo.require("dojox.rpc.Service");
//dojo.require("dojo.io.script");
//dojo.require("dijit.TitlePane");
//
//// DnD
//dojo.require("dojo.dnd.Source"); // Source & Target
//dojo.require("dojo.dnd.Moveable");
//dojo.require("dojo.dnd.Mover");
//dojo.require("dojo.dnd.move");
//
//// Menu
//dojo.require("plugins.menu.Menu");
//
//// TIMER
//dojo.require("dojox.timing");
//
//// TOOLTIP
//dojo.require("dijit.Tooltip");
//
//// TOOLTIP DIALOGUE
//dojo.require("dijit.Dialog");
//dojo.require("dijit.form.Textarea");
//dojo.require("dijit.form.CheckBox");
//dojo.require("dijit.form.Button");
//
//// INHERITED
//dojo.require("plugins.core.Common");
//
//// LAYOUT WIDGETS
//dojo.require("dijit.layout.SplitContainer");
//dojo.require("dijit.layout.ContentPane");
//
//// INTERNAL MODULES
//dojo.require("plugins.workflow.Parameters");
//}
//
//dojo.declare( "plugins.workflow.Workflow",
//	[ dijit._Widget, dijit._Templated, plugins.core.Common ], {
////Path to the template of this widget. 
//templatePath: dojo.moduleUrl("plugins", "workflow/templates/workflow.html"),
//
//// Calls dijit._Templated.widgetsInTemplate
//widgetsInTemplate : true,


console.log("%cplugins/workflow/Workflow    LOADING", "color: blue;");

define([
	"dojo/_base/declare",
	"dojo/parser",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common",
	"plugins/workflow/Plugin",

	// EXPANDOPANE
	"dojox/layout/ExpandoPane",
	"dijit/layout/TabContainer",
	"dijit/layout/BorderContainer",
	
	"dojox/timing",
	
	// FILE UPLOAD
	"plugins/form/UploadDialog",
	//
	//// NOTES EDITOR
	"dijit/form/Textarea", // multipleDefined - dojo/dojo/request/iframe.js
	
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox", // multipleDefined ERROR: dojo/dojo/main.js
	
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dojo/currency",
	"dijit/Dialog", // base/unload.js ERROR
	
	//// WIDGETS AND TOOLS FOR EXPANDO PANE
	"dijit/form/ComboBox",   // *** NOT *** base/unload.js ERROR
	//"dijit/Tree",
	"dijit/layout/AccordionContainer",
	"dijit/layout/ContentPane",
	"dojox/layout/FloatingPane",
	"dojo/fx/easing",
	"dojox/rpc/Service",
	"dojo/io/script",
	"dijit/TitlePane",
	//
	//// DnD
	"dojo/dnd/Source", // Source & Target
	"dojo/dnd/Moveable",
	"dojo/dnd/Mover",
	"dojo/dnd/move",
	//
	//// Menu
	"plugins/menu/Menu",
	//
	
	//// TOOLTIP
	"dijit/Tooltip",
	//
	//// TOOLTIP DIALOGUE
	"dijit/Dialog",
	"dijit/form/Textarea",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	//
	//// INHERITED
	"plugins/core/Common",
	//
	//// LAYOUT WIDGETS
	"dijit/layout/SplitContainer",
	"dijit/layout/ContentPane",
	//
	//// INTERNAL MODULES
	"plugins/workflow/Parameters",
	"plugins/workflow/Grid"
	,"plugins/workflow/Apps/AdminPackages"
	,"plugins/workflow/Apps/AguaPackages"
	,"plugins/workflow/UserWorkflows"
	,"plugins/workflow/SharedWorkflows"
	,"plugins/workflow/History"
	,"plugins/workflow/RunStatus/Status"
],

//////}}}}}}}

function (
	declare,
	parser,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common,
	Plugin
) {

//////}}}}}}}


return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common	
], {

//////}}}}}}}

// templateString : String 
//    The template of this widget. 
templateString: dojo.cache("plugins", "workflow/templates/workflow.html"),

// CSS FILE FOR BUTTON STYLING
cssFiles : [
    require.toUrl("plugins/workflow/css/workflow.css"),
    require.toUrl("plugins/workflow/css/history.css"),
    require.toUrl("plugins/workflow/css/shared.css"),
    require.toUrl("dojox/layout/resources/ExpandoPane.css"),
    require.toUrl("dijit/themes/tundra/tundra.css")
],

// PARENT NODE, I.E., TABS NODE
attachWidget : null,

// PROJECT NAME AND WORKFLOW NAME IF AVAILABLE
project : null,
workflow : null,

// POLL SERVER FOR WORKFLOW STATUS
polling : false,

// INSERT TEXT BREAKS WIDTH, CORRESPONDS TO CSS WIDTH OF INPUT 'value' TABLE ELEMENT
textBreakWidth : 22,

// plugins.workflow.FileManager
fileManager : null,

// CORE WORKFLOW OBJECTS
core : new Object,

// LOAD PANELS
// loadPanels: array of names of panels to be loaded
loadPanels : null,

//////}}}}}}}

constructor : function(args) {
	console.log("plugins.workflow.Workflow.constructor");
	
	// LOAD CSS
	this.loadCSS();
	
	// SET ARGS
	this.attachWidget = Agua.tabs;

	if ( args != null )
	{
		this.
		project = args.project;
		this.workflow = args.workflow;
	}
	
	// SET CORE CLASSES
	this.core.workflow = this;

	// SET LOAD PANELS
	this.setLoadPanels(args);
},
postCreate: function() {
	this.startup();
},
startup : function () {
// SET UP THE ELEMENT OBJECTS AND THEIR VALUE FUNCTIONS
	console.log("plugins.workflow.Workflow.startup");

	this.inherited(arguments);

    //// ADD THIS WIDGET TO Agua
    //Agua.addWidget("workflow", this);

	// ADD THE PANE TO THE TAB CONTAINER
	console.log("%cplugins.workflow.Workflow.startup    BEFORE this.attachPane()", "color: blue");
	this.attachPane();
	console.log("%cplugins.workflow.Workflow.startup    AFTER this.attachPane()", "color: blue");

	// RESIZE TO COMPLETE LAYOUT
	this.mainTab.resize();

	// INSTANTIATE MODULES
	var modules = [
		[ "plugins/workflow/Apps/AdminPackages", "adminPackages", "leftPane" ]
		,
		[ "plugins/workflow/Apps/AguaPackages", "aguaPackages", "leftPane" ]
		,
		[ "plugins/workflow/Parameters", "parameters", "rightPane" ]
		//,
		//[ "plugins/workflow/Grid", "grid", "middlePane" ]
		,
		[ "plugins/workflow/SharedWorkflows", "sharedWorkflows", "middlePane" ]
		,
		[ "plugins/workflow/History", "historyPane", "middlePane" ]
		,
		["plugins/workflow/RunStatus/Status", "runStatus", "rightPane" ]
		,
		[ "plugins/workflow/UserWorkflows", "userWorkflows", "middlePane" ]
	];
	
	console.log("%cWorkflow.startup    this.loadPanels:", "color: red")
	console.dir({this_loadPanels:this.loadPanels});
	for ( var i = 0; i < modules.length; i++ ) {
		var module = modules[i];

		if ( this.loadPanels && ! this.loadPanels[module[1].toLowerCase()] ) {
			console.log("%cWorkflow.startup    Skipping panel for module: " + module[1], "color: red");
			continue;
		}

		this.setCoreWidget(module[0], module[1], module[2]);
	}

	// CLOSE LEFT PANE / MIDDLE PANE
	//this.leftPaneExpando.toggle();
	//this.middlePaneExpando.toggle();

	// SET PROJECT COMBO IF this.project IS DEFINED
	console.log("%cWorkflow.startup    BEFORE this.core.userWorkflows.setProjectCombo()", "color: red");
	console.log("%cWorkflow.startup    this.project: " + this.project), "color: red";
	console.log("%cWorkflow.startup    this.workflow: " + this.workflow, "color: red");
	
	if ( this.project != null && this.core.userWorkflows != null )
		this.core.userWorkflows.setProjectCombo(this.project, this.workflow);
},
setCoreWidget : function (moduleName, name, paneName) {
// INSTANTIATE A moduleName WIDGET AND SET IT AS this.core.name
	console.log("%cWorkflow.setCoreWidget    XXXXXX  moduleName: " + moduleName, "color: blue");
	console.log("%cWorkflow.setCoreWidget    XXXXXX 000000  name: " + name, "color: blue");
	console.log("%cWorkflow.setCoreWidget    XXXXXX  pane: " + pane, "color: blue");

	
	if ( this[name] != null ) return;

	var pane = this[paneName];
	var args = {
		dojoType : moduleName,
		attachPoint : pane,
		parentWidget: this,
		core: this.core
	};

	var thisObject = this;
	require([moduleName], function (Module) {
		//console.log("Workflow.setCoreWidget    XXXXX INSIDE Module: " + Module);
		//console.dir({Module:Module});

		console.log("%cWorkflow.setCoreWidget    BEFORE new Module(args)", "color: blue");
		var widget = new Module(args);
		console.log("%cWorkflow.setCoreWidget    AFTER new Module(args)", "color: blue");
		console.log("%cWorkflow.setCoreWidget    widget: " + widget, "color: blue");
		console.dir({widget:widget});

		// SET this[moduleName]
		thisObject[moduleName] = widget;
		thisObject.core[name] = widget;

		console.log("%cWorkflow.setCoreWidget    thisObject:", "color: blue");
		console.dir({thisObject:thisObject});
	});


	//var controller = Agua["controllers"][moduleName];
	////var plugin = new Plugin();
	//console.log("PluginManager.loadPlugin    controller: ");
	//console.dir({controller:controller});
	//controller.attachPoint = pane;
	//controller.parentWidget


	//var plugin = new Plugin();
	//console.log("PluginManager.loadPlugin    plugin: ");
	//console.dir({plugin:plugin});
	//
	//var args = {
	//	attachPoint : pane,
	//	parentWidget: this,
	//	core: this.core
	//};
	//plugin.load(moduleName, name, args);
	//console.log("Workflow.setCoreWidget    this[" + name + "]: " + this[name]);
	//
	//this.core[name] = this[name];
},
setParameters : function () {
// SET DATA TAB IN INFO PANE BY INSTANTIATING Parameters OBJECT
	////console.log("Workflow.setParameters    plugins.workflow.Stages.setParameters()");
	this.core.parameters = new plugins.workflow.Parameters({
		attachPoint : this.rightPane,
		parentWidget: this,
		core: this.core
	});
	////console.log("Workflow.setParameters    this.core.parameters: ");
	////console.dir({this_core_parameters:this.core.parameters});
},
destroyRecursive : function () {
	console.log("Workflow.destroyRecursive    this.mainTab: ");
	console.dir({this_mainTab:this.mainTab});

	if ( Agua && Agua.tabs )
		Agua.tabs.removeChild(this.mainTab);
	
	this.inherited(arguments);
}


}); 

}); 



console.log("%cplugins/workflow/Workflow    COMPLETED", "color: blue;");
