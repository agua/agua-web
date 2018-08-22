/* DISPLAY THE USER'S PROJECT DIRECTORY AND ALLOW THE USER TO BROWSE
 
	AND MANIPULATE WORKFLOW FOLDERS AND FILES

	TO DO: DYNAMICALLY ENABLE / DISABLE MENU ITEM USING attr('disabled', bool)
	
*/

console.log("%cplugins/folders/ProjectFiles    LOADING", "color: blue");

define([
	"dojo/_base/declare",
	"plugins/folders/Files"
],

function (
	declare,
	Files
) {

/////}}}}}

return declare([
	Files
], {

/////}}}}}

// templateString : String	
//		Template of this widget. 
templateString: dojo.cache("plugins", "folders/templates/filesystem.html"),

// PROJECT NAME 
project : null,

// DEFAULT TIME (milliseconds) TO SLEEP BETWEEN FILESYSTEM LOADS
sleep : 300,

// ARRAY OF PANE NAMES TO BE LOADED IN SEQUENCE [ name1, name2, ... ]
loadingPanes : null,

// STORE FILESYSTEM fileDrag OBJECTS
fileDrags : null,

// CSS FILES
cssFiles : [
	dojo.moduleUrl("plugins", "folders/css/dialog.css"),
	dojo.moduleUrl("dojox", "widget/Dialog/Dialog.css")
],

// TYPE OR PURPOSE OF FILESYSTEM
title : "Workflow",

// open: bool
// Whether or not title pane is open on load
open : true,

// self: string
// Name used to represent this object in this.core
self : "projectfiles"


});
});

console.log("%cplugins/folders/ProjectFiles    COMPLETED", "color: blue");
