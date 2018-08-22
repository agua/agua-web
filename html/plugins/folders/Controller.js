//dojo.provide("plugins.folders.Controller");
//
//// OBJECT:  plugins.folders.Controller
//// PURPOSE: GENERATE AND MANAGE Project PANES
//
//// INHERITS
//dojo.require("plugins.core.PluginController");
//
//// HAS
//dojo.require("plugins.folders.Folders");
//
//dojo.declare( "plugins.folders.Controller",
//	[ plugins.core.PluginController ],
//{

console.log("%cplugins.folder.Controller    LOADING", "color: blue");

define([
	"dojo/_base/declare",
	"plugins/core/PluginController",
	"plugins/folders/Folders"
],

function(
	declare,
	PluginController,
	Folders
) {

return declare([
	PluginController
], {

// PANE ID 
paneId : null,

// templateString : String	
//		The template of this widget. 
templateString: dojo.cache("plugins", "folders/templates/controller.html"),

// CSS FILES
cssFiles : [ dojo.moduleUrl("plugins") + "/folders/css/controller.css" ],

// ARRAY OF TAB PANES
tabPanes : [],

// TAB CLASS
tabClass : "plugins/folders/Folders"

});

});

console.log("%cplugins.folder.Controller    COMPLETED", "color: blue");
