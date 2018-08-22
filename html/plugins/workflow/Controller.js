console.log("%cplugins.workflow.Controller    LOADING", "color: blue; font-size: large");

define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common",
	"plugins/workflow/Workflow",
	"dijit/form/Button"
],

function (
	declare,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common,
	Workflow
) {

////}}}}}

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common	
], {

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/templates/controller.html"),

// MODULE INFO
name: "plugins.workflow.Controller",
version : "0.01",
url : '',
description : "",
dependencies : [
	{	name: "plugins.core.Agua", version: 0.01	}
],

// CSS
cssFiles : [
	require.toUrl("plugins/workflow/css/controller.css"),
	require.toUrl("plugins/workflow/css/workflow.css")
],

// ARRAY OF TAB PANES
tabPanes : [],

////}}}
constructor : function(args) {
	console.log("workflow.Controller.constructor    args:");
	console.dir({args:args});

	// SET INPUTS IF PRESENT
	if ( args.inputs ) this.inputs = args.inputs;
	
	// LOAD CSS FOR BUTTON
	console.log("workflow.Controller.constructor    DOING this.loadCSS()");
	this.loadCSS();
},
postCreate : function() {
	//this.startup();
},
startup : function () {
	console.log("Controller.startup    plugins.workflow.Controller.startup()");
	console.log("Controller.startup    Agua: " + Agua);

	this.inherited(arguments);

	// ADD MENU BUTTON TO TOOLBAR
	Agua.toolbar.addChild(this.menuButton);
	
	// SET BUTTON PARENT WIDGET
	this.menuButton.parentWidget = this;
	
	// SET ADMIN BUTTON LISTENER
	var listener = dojo.connect(this.menuButton, "onClick", this, "createTab");
},
createTab : function (args) {
	console.log("Controller.createTab    plugins.workflow.Controller.createTab");
	console.log("Controller.createTab    args: ");
	console.dir({args:args});

	// CLEAR ANNOYING ALL-SELECTED
	window.getSelection().removeAllRanges();

	// ADD attachPoint
	if ( args == null ) args = new Object;
	args.attachPoint = Agua.tabs;

	// GET INPUTS
	var inputs = this.inputs;
	args.inputs=	inputs;
	
	// CREATE WIDGET	
	var widget = new Workflow(args);

	// PUSH TO tabPanes
	this.tabPanes.push(widget);

	// ADD TO _supportingWidgets FOR INCLUSION IN DESTROY	
	this._supportingWidgets.push(widget);
},
refreshTabs : function () {
    console.log("workflow.Controller.refreshTabs    Populating this.tabPanes");
    console.log("workflow.Controller.refreshTabs    BEFORE this.tabPanes: ");
    console.dir({this_tabPanes:this.tabPanes});

	var thisObject = this;
	dijit.registry.byClass("plugins.workflow.Workflow").forEach(function(workflow) {
		console.log("workflow: " + workflow);
		console.dir({workflow:workflow});
		thisObject.tabPanes.push(workflow);    
	});
    
    console.log("workflow.Controller.refreshTabs    AFTER this.tabPanes: ");
    console.dir({this_tabPanes:this.tabPanes});
}


}); 

}); 


console.log("%cplugins.workflow.Controller    COMPLETED", "color: blue; font-size: large");
