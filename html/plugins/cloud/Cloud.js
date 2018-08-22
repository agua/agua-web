console.log("%cplugins/cloud/Cloud    LOADING", "color: blue");

define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common",
	
	"plugins/cloud/Ami",
	"plugins/cloud/Aws",
	"plugins/cloud/Clusters",
	"plugins/cloud/Hub",
	"plugins/cloud/Settings",
	
	// DnD
	"dojo/dnd/Source", // Source & Target
	"dojo/dnd/Moveable",
	"dojo/dnd/Mover",
	"dojo/dnd/move",
	
	// comboBox data store
	"dijit/form/ComboBox",
	"dijit/layout/ContentPane",
],

function (
	declare,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common,
	Ami
) {

////}}}}}

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common	
], {

// templateString : String	
//		Template of this widget. 
templateString: dojo.cache("plugins", "cloud/templates/cloud.html"),

// CORE WORKFLOW OBJECTS
core : new Object,

cssFiles : [
	dojo.moduleUrl("plugins", "cloud/css/cloud.css")
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

// PANE WIDGETS
// paneWidgets: hash 
//	  Hash of tab pane widgets  
paneWidgets: {},

/////}}}}}
constructor : function(args) {
	console.log("cloud.Cloud.constructor    args", args);

	// SET LOAD PANELS
	if ( args && args.inputs ) {
		this.setLoadPanels(args);
	}
	
	// LOAD CSS
	this.loadCSS();		
},
postCreate : function() {
	////console.log("Cloud.postCreate    plugins.cloud.Controller.postCreate()");

	this.startup();
},
startup : function () {
	//console.log("Cloud.startup    plugins.cloud.Controller.startup()");

    // ADD THIS WIDGET TO Agua.widgets
    Agua.addWidget("admin", this);

	// ADD ADMIN TAB TO TAB CONTAINER		
	Agua.tabs.addChild(this.mainTab);
	Agua.tabs.selectChild(this.mainTab);

	// CREATE HASH TO HOLD INSTANTIATED PANE WIDGETS
	this.paneWidgets = new Object;

	// LOAD HEADINGS FOR THIS USER
	this.headings = Agua.getCloudHeadings();
	console.log("Cloud.startup    this.headings:");
	console.dir({this_headings:this.headings});
	
	// LOAD PANES
	this.loadPanes();
},
reload : function (target) {
// RELOAD A WIDGET, WIDGETS IN A PANE OR ALL WIDGETS
	////console.log("Cloud.reload     plugins.cloud.Cloud.reload(target)");
	////console.log("Cloud.reload     target: " + target);

	if ( target == "all" )
	{
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
	////console.log("Cloud.reloadWidget     Reloading pane: " + paneName);

	delete this.paneWidgets[paneName];

	var adminObject = this;
	this.paneWidgets[paneName] = new plugins.cloud[paneName](
		{
			parentWidget: adminObject,
			attachPoint : adminObject.leftTabContainer
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
	console.log("Cloud.loadPane     side: " + side);
	console.log("Cloud.loadPane     this.loadPanels: ");
	console.dir({this_loadPanels:this.loadPanels});
	
	//console.log("Cloud.loadPane     side: " + dojo.toJson(side));
	var pane = side + "Pane";
	var tabContainer = side + "TabContainer";
	if ( this.headings == null || this.headings[pane] == null )	return;
	for ( var i = 0; i < this.headings[pane].length; i++ )
	{
		//console.log("Cloud.loadLeftPane     LOADING PANE this.headings[pane][" + i + "]: " + this.headings[pane][i]);

		var tabPaneName = this.headings[pane][i];
		console.log("Cloud.loadPane    dojo.require tabPaneName: " + tabPaneName);

		if ( this.loadPanels && ! this.loadPanels[tabPaneName.toLowerCase()] ) {
			console.log("Cloud.loadPane    Skipping panel: " + tabPaneName);
			continue;
		}
		
		var moduleName = "plugins/cloud/" + tabPaneName;
		console.log("Cloud.loadPane    moduleName: " + moduleName);
		var args = {
			parentWidget: this,
			attachPoint : this[tabContainer]
		};
		var thisObject = this;
		require([moduleName], function (Module) {
			console.log("Workflow.setCoreWidget    XXXXX INSIDE require(moduleName)");
	
			var widget = new Module(args);
			console.log("Workflow.setCoreWidget    XXXXX INSIDE widget: " + widget);
			console.dir({widget:widget});
	
			// PUSH TO this.paneWidgets
			if( thisObject.paneWidgets[moduleName] == null )
				thisObject.paneWidgets[moduleName] = new Array;
			thisObject.paneWidgets[moduleName].push(widget);
		
			console.log("Workflow.setCoreWidget    thisObject:");
			console.dir({thisObject:thisObject});
		});


		//var moduleName = "plugins.cloud." + tabPaneName;
		//console.log("Cloud.loadPane    BEFORE dojo.require moduleName: " + moduleName);
		//
		//dojo["require"](moduleName);
		//console.log("Cloud.loadPane    AFTER dojo.require moduleName: " + moduleName);

		//var adminObject = this;
		//var tabPane = new plugins["cloud"][tabPaneName](
		//	{
		//		parentWidget: adminObject,
		//		attachPoint : adminObject[tabContainer]
		//	}
		//);
		//
		//// REGISTER THE NEW TAB PANE IN this.paneWidgets 
		//if( this.paneWidgets[moduleName] == null )
		//	this.paneWidgets[moduleName] = new Array;
		//this.paneWidgets[moduleName].push(tabPane);
	}
},
destroyRecursive : function () {
	console.log("Cloud.destroyRecursive    this.mainTab: ");
	console.dir({this_mainTab:this.mainTab});

	if ( Agua && Agua.tabs )
		Agua.tabs.removeChild(this.mainTab);
	
	this.inherited(arguments);
}

});
});
