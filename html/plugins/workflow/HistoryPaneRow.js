/* DISPLAY THE STATUS OF A WORKFLOW STAGE */

console.log("%cplugins/workflow/HistoryPaneRow   LOADING", "color: blue;");

define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin"
],
function (
	declare,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin
) {

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin
], {

//////}}

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/templates/historypanerow.html"),

// CORE WORKFLOW OBJECTS
core : null,

/////}
constructor : function(args) {
	////console.log("HistoryPaneRow.constructor    plugins.workflow.HistoryPaneRowRow.constructor(args)");
	////console.log("HistoryPaneRow.constructor    args: " + dojo.toJson(args));
	this.core = args.core;
},

postCreate : function() {
	this.startup();
},

startup : function () {
	//console.log("HistoryPaneRow.startup    plugins.workflow.HistoryPaneRow.startup()");

	this.inherited(arguments);
}


});

});

console.log("%cplugins/workflow/HistoryPaneRow    COMPLETED", "color: blue");
