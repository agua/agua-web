//
//
//
//dojo.provide("plugins.workflow.HistoryPane");
//
//// DISPLAY THE STATUS OF A WORKFLOW STAGE
//
//dojo.declare( "plugins.workflow.HistoryPane",
//	[ dijit._Widget, dijit._Templated ], {
//
console.log("%cplugins/workflow/HistoryPane   LOADING", "color: blue;");

define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/workflow/HistoryPaneRow"
]
,
function (
	declare,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	HistoryPaneRow
) {

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin
], {

//////}}

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/templates/historypane.html"),

// ROWS OF ENTRIES
rows : null,

// CORE WORKFLOW OBJECTS
core : null,

/////}
constructor : function(args) { 	
	//console.log("HistoryPane.constructor    plugins.workflow.HistoryPane.constructor(args)");
	//console.log("HistoryPane.constructor    args: " + dojo.toJson(args));
	//this.project = rows[0].project;
	//this.workflow = rows[0].workflow;
	this.rows = args.rows;

	this.core = args.core;

},

postMixInProperties: function() {
	////console.log("HistoryPane.postMixInProperties    plugins.workflow.HistoryPane.postMixInProperties()");
	////console.log("HistoryPane.postMixInProperties    this.containerNode: " + this.containerNode);
},

postCreate: function() {
	////console.log("HistoryPane.postCreate    plugins.workflow.HistoryPane.postCreate()");
	////console.log("HistoryPane.postCreate    this.domNode: " + this.domNode);

	this.startup();		
},

startup : function () {
	//console.log("HistoryPane.startup    plugins.workflow.HistoryPane.startup()");

	// SET UP THE ELEMENT OBJECTS AND THEIR VALUE FUNCTIONS
	this.inherited(arguments);

	for ( var i = 0; i < this.rows.length; i++ )
	{
		////console.log("HistoryPane.startup    dojo.toJson(this.rows[" + i + "]): " + dojo.toJson(this.rows[i]));
		var historyPaneRow = new HistoryPaneRow(this.rows[i]);
		////console.log("HistoryPane.startup    historyPaneRow: " + historyPaneRow);
		////console.log("HistoryPane.startup    this.rowsNode: " + this.rowsNode);

		this.rowsNode.innerHTML += historyPaneRow.domNode.innerHTML;

	}
},

openWorkflow : function () {
	var projectName = this.project;
	var workflowName = this.workflow;
	console.log("HistoryPane.openWorkflow    projectName: " + projectName);
	console.log("HistoryPane.openWorkflow    workflowName: " + workflowName);
	
	// OPEN WORKFLOW TAB
	if ( Agua.controllers["workflow"] ) 
		Agua.controllers["workflow"].createTab({project: projectName, workflow: workflowName});
}

});

});

console.log("%cplugins/workflow/HistoryPane    COMPLETED", "color: blue");
