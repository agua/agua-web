//dojo.provide("plugins.apps.Apps");
//
//dojo.require("plugins.core.Common");
//
//// DISPLAY DIFFERENT PAGES TO ALLOW THE apps AND ORDINARY
//// USERS TO MODIFY THEIR SETTINGS
//
//// DnD
//dojo.require("dojo.dnd.Source"); // Source & Target
//dojo.require("dojo.dnd.Moveable");
//dojo.require("dojo.dnd.Mover");
//dojo.require("dojo.dnd.move");
//
//// DIJITS
//dojo.require("dijit.form.ComboBox");
//dojo.require("dijit.layout.ContentPane");
//
//// rightPane buttons
//dojo.require("dijit.form.Button");
//
//dojo.declare( "plugins.apps.Apps", 
//	[ dijit._Widget, dijit._Templated, plugins.core.Common ], {
////Path to the template of this widget. 
//templatePath: dojo.moduleUrl("plugins", "apps/templates/apps.html"),
//
//// Calls dijit._Templated.widgetsInTemplate
//widgetsInTemplate : true,


define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common",

	//"dojo/dnd/Source", // Source & Target
	//"dojo/dnd/Moveable",
	//"dojo/dnd/Mover",
	//"dojo/dnd/move",
	//
	//"dijit/form/ComboBox",
	//"dijit/layout/ContentPane",
	//"dijit/form/Button"

	//// INTERNAL MODULES
	"plugins/apps/Parameters",
	"plugins/apps/App",
	"plugins/apps/Packages",
],

function (
	declare,
	lang,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common
) {

/////}}}}}

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common
], {

// templateString : String	
//		Path to the template of this widget. 
templateString: dojo.cache("plugins", "apps/templates/apps.html"),

// PANE WIDGETS
paneWidgets : null,

// CORE WORKFLOW OBJECTS
core : new Object,

cssFiles : [
	dojo.moduleUrl("plugins", "apps/css/apps.css")
],

// DEBUG: LIST OF PANELS TO LOAD
// paneList: ';'-separated String
panelList: null,

// INPUTS PASSED FROM CONTROLLER
// inputs: ';'-separated String
inputs : null,

// LOAD PANELS
// loadPanels: array of names of panels to be loaded
loadPanels : null,

/////}}
constructor : function(args) {
	console.log("apps.Apps.constructor    args:");
	console.dir({args:args});

	// SET LOAD PANELS
	this.setLoadPanels(args);
	
	// LOAD CSS
	this.loadCSS();		
},
postCreate : function() {
	////console.log("Apps.postCreate    plugins.apps.Controller.postCreate()");

	this.startup();
},
startup : function () {
	//console.log("Apps.startup    plugins.apps.Controller.startup()");

    // ADD THIS WIDGET TO Agua.widgets
    Agua.addWidget("apps", this);

	// CREATE HASH TO HOLD INSTANTIATED PANE WIDGETS
	this.paneWidgets = new Object;

	// LOAD HEADINGS FOR THIS USER
	this.headings = Agua.getAppHeadings();
	console.log("Apps.startup    this.headings:");
	console.dir({this_headings:this.headings});

	this.attachPane();
	
	// LOAD PANES
	this.loadPanes();
},
attachPane : function () {
	console.log("Apps.attachPane    Agua.tabs:");
	console.dir({Agua_tabs:Agua.tabs});
	console.log("Apps.attachPane    this.mainTab:");
	console.dir({this_mainTab:this.mainTab});

	// ADD mainTab TO CONTAINER		
	Agua.tabs.addChild(this.mainTab);
	Agua.tabs.selectChild(this.mainTab);
},
reload : function (target) {
//	reload
//		RELOAD A WIDGET, WIDGETS IN A PANE OR ALL WIDGETS
//	inputs:
//		target	:	'aguaApplication' | 'adminApplications'

	console.log("Apps.reload     plugins.apps.Apps.reload(target)");
	console.log("Apps.reload     target: " + target);

	if ( target == "all" ) {
		for ( var mainPane in this.headings )
		{
			for ( var i in this.headings[mainPane] )
			{
				this.reloadWidget(this.headings[mainPane][i]);
			}
		}
	}
	else if ( target == "leftPane"
			|| target == "middlePane"
			|| target == "rightPane" )
	{
		for ( var i in this.headings[target] )
		{
			this.reloadWidget(this.headings[target][i]);
		}
	}
	
	// OTHERWISE, THE target MUST BE A PANE NAME
	else
	{
		try {
			this.reloadWidget(target);
		}
		catch (e) {}
	}		
},
reloadWidget : function (paneName) {
// REINSTANTIATE A PANE WIDGET
	////console.log("Apps.reloadWidget     Reloading pane: " + paneName);

	delete this.paneWidgets[paneName];

	var thisObject = this;
	this.paneWidgets[paneName] = new plugins.apps[paneName](
		{
			parentWidget	:	thisObject,
			attachPoint 	:	thisObject.leftTabContainer
		}
	);
},
loadPanes : function () {
	var panes = ["left", "middle", "right"];
	for ( var i = 0; i < panes.length; i++ )
	{
		this.loadPane(panes[i]);
	}
},
loadPane : function(side) {
	console.log("Apps.loadPane     side: " + side);

	console.log("Apps.loadPane     this.loadPanels: ", this.loadPanels);
	console.log("Apps.loadPane     this.headings: ", this.headings);
	
	var pane = side + "Pane";
	var tabContainer = side + "TabContainer";
	if ( this.headings == null || this.headings[pane] == null )	return;
	for ( var i = 0; i < this.headings[pane].length; i++ )
	{
		//console.log("Apps.loadLeftPane     LOADING PANE this.headings[pane][" + i + "]: " + this.headings[pane][i]);

		var tabPaneName = this.headings[pane][i];
		console.log("Apps.loadPane    dojo.require tabPaneName: " + tabPaneName);
		//if ( tabPaneName == "Parameters" ) {
		//	console.log("Apps.loadPane     Skipping tabPaneName: ", tabPaneName);
		//	continue;
		//}

		if ( this.loadPanels && ! this.loadPanels[tabPaneName.toLowerCase()] ) {
			console.log("Apps.loadPane    Skipping panel: " + tabPaneName);
			continue;
		}

		var moduleName = "plugins/apps/" + tabPaneName;

		//console.log("Apps.loadPane    BEFORE dojo.require moduleName: " + moduleName);
		//dojo["require"](moduleName);
		//console.log("Apps.loadPane    AFTER dojo.require moduleName: " + moduleName);
		
		////var tabPane = new plugins["apps"][tabPaneName](
		//var tabPane = new plugins["apps"][tabPaneName](
		//	{
		//		parentWidget	:	thisObject,
		//		attachPoint 	:	thisObject[tabContainer]
		//	}
		//);
		//
		//// REGISTER THE NEW TAB PANE IN this.paneWidgets 
		//if( this.paneWidgets[moduleName] == null )
		//	this.paneWidgets[moduleName] = new Array;
		//this.paneWidgets[moduleName].push(tabPane);

		//var pluginName = "plugins/apps/" + tabPaneName;
		//var thisObject = this;
		//require([pluginName], function (Module) {
		//	var plugin = new Module({
		//		parentWidget	:	thisObject,
		//		attachPoint 	:	thisObject[tabContainer]
		//	});
		//	console.log("Apps.loadPane    LOAD MODULE    plugin: " + plugin);
		//	
		//	// REGISTER THE NEW TAB PANE IN thisObject.paneWidgets 
		//	if( thisObject.paneWidgets[pluginName] == null )
		//		thisObject.paneWidgets[pluginName] = new Array;
		//	thisObject.paneWidgets[pluginName].push(tabPane);
		//});

		this.setCoreWidget(moduleName, tabPaneName, pane, tabContainer);

	}
},

setCoreWidget : function (moduleName, name, paneName, tabContainer) {
// INSTANTIATE A moduleName WIDGET AND SET IT AS this.core.name
	console.log("%cWorkflow.setCoreWidget    XXXXXX  moduleName: " + moduleName, "color: red");
	console.log("%cWorkflow.setCoreWidget    XXXXXX 000000  name: " + name, "color: red");
	console.log("%cWorkflow.setCoreWidget    XXXXXX  pane: " + pane, "color: red");
	console.log("%cWorkflow.setCoreWidget    XXXXXX  tabContainer: " + tabContainer, "color: red");
	
	//if ( this[name] != null ) return;

	var pane = this[paneName];
	var args = {
		parentWidget	:	this,
		attachPoint 	:	this[tabContainer]
	};

	var thisObject = this;
	require([moduleName], function (Module) {
		//console.log("Workflow.setCoreWidget    XXXXX INSIDE Module: " + Module);
		//console.dir({Module:Module});

		console.log("%cWorkflow.setCoreWidget    BEFORE new Module(args)", "color: red");
		var widget = new Module(args);
		console.log("%cWorkflow.setCoreWidget    AFTER new Module(args)", "color: red");
		console.log("%cWorkflow.setCoreWidget    widget: " + widget, "color: red");
		console.dir({widget:widget});

		// SET this[moduleName]
		thisObject[moduleName] = widget;
		thisObject.core[name] = widget;

		console.log("%cWorkflow.setCoreWidget    thisObject:", "color: red");
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

destroyRecursive : function () {
	console.log("Apps.destroyRecursive    this.mainTab: ");
	console.dir({this_mainTab:this.mainTab});

	if ( Agua && Agua.tabs )
		Agua.tabs.removeChild(this.mainTab);
	
	this.inherited(arguments);
}

});

});
