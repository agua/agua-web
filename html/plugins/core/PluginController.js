/* 	GENERIC PLUGIN CONTROLLER */

//dojo.provide("plugins.core.PluginController");
//
//// INHERITS
//dojo.require("plugins.core.Common");
//
//dojo.declare( "plugins.core.PluginController",
//	[ dijit._Widget, dijit._Templated, plugins.core.Common ], {


define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common"
],

function (
	declare,
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

// PANE ID 
paneId : null,

//Path to the template of this widget. 
templatePath: null,

// Calls dijit._Templated.widgetsInTemplate
widgetsInTemplate : true,

// CSS FILES
cssFiles : [],

// ARRAY OF TAB PANES
tabPanes : [],

// moduleName : String
// Name of tab pane class, e.g., "plugins.folders.Folders"
tabClass : null,

////}}}}

// CONSTRUCTOR	
constructor : function(args) {
	this.loadCSS();
},
postCreate : function() {
	//this.startup();
},
startup : function () {
	//console.log("core.Controller.startup    plugins.core.Controller.startup()");
	this.inherited(arguments);

	// ADD MENU BUTTON TO TOOLBAR
	Agua.toolbar.addChild(this.menuButton);
	
	// SET BUTTON PARENT WIDGET
	this.menuButton.parentWidget = this;
	
	// SET ADMIN BUTTON LISTENER
	var listener = dojo.connect(this.menuButton, "onClick", this, "createTab", {});
},
createTab : function (args) {
	console.log("PluginController.createTab    args: ", args);

	// CLEAR ANNOYING ALL-SELECTED
	window.getSelection().removeAllRanges();

	// SET DEFAULT ARGS
	if ( ! args )	args = {};
	args.attachPoint = Agua.tabs;

	var thisObject = this;
	require([this.tabClass], function (Module) {
		console.log("PluginController.createTab    XXXXX INSIDE Module");
		console.dir({Module:Module});

		var widget = new Module(args);
		console.log("PluginController.createTab    XXXXX INSIDE widget: ", widget);
		console.dir({widget:widget});

		// PUSH TO this.tabPanes
		thisObject.tabPanes.push(widget);

		// ADD TO _supportingWidgets FOR INCLUSION IN DESTROY	
		thisObject._supportingWidgets.push(widget);

		console.log("PluginController.createTab    thisObject:", thisObject);
	});
}

});
});
