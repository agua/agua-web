console.log("%cplugins/workflow/History    LOADING", "color: blue");

define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common",
	"plugins/workflow/HistoryPane",

	"dijit/layout/ContentPane"
	//,
	//"dojo/parser"
]
,
function (
	declare,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common,
	HistoryPane
) {

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common
], {

//////}}

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/templates/history.html"),

// OR USE @import IN HTML TEMPLATE
cssFiles : [ dojo.moduleUrl("plugins", "workflow/css/history.css") ],

// PARENT WIDGET
parentWidget : null,

// ARRAY OF CHILD WIDGETS
childWidgets : null,

// isVALID BOOLEAN: ALL PARAMETERS ARE VALID
isValid : null,

// CORE WORKFLOW OBJECTS
core : null,

/////}

constructor : function(args) {
	console.log("History.constructor     plugins.workflow.History.constructor");			
	this.core = args.core;

	// LOAD CSS
	this.loadCSS();		
},
postCreate : function() {
	console.log("Controller.postCreate    plugins.workflow.Controller.postCreate()");

	this.startup();
},
// DO inherited, LOAD ARGUMENTS AND ATTACH THE MAIN TAB TO THE ATTACH NODE
startup : function () {
	console.log("History.startup    plugins.workflow.History.startup()");

	// COMPLETE CONSTRUCTION OF OBJECT
	this.inherited(arguments);	 

	console.log("History.startup    this.application: " + this.application);
	console.log("History.startup    this.attachPoint: " + this.attachPoint);

	// ADD TO TAB CONTAINER		
	this.attachPane();
	
	// GET WORKFLOW HISTORY AND DISPLAY IN HISTORY TAB
	this.showHistory();
},
// GET WORKFLOW HISTORY AND DISPLAY IN HISTORY TAB
showHistory : function () {
	console.log("History.showHistory    plugins.workflow.Workflow.showHistory()");

	// SELECT HISTORY TAB IN TAB CONTAINER
	//this.controlPane.selectChild(this.history);

	// EMPTY CURRENT TABLE IF PRESENT
	while ( this.historyTable.firstChild ) {
		this.historyTable.removeChild(this.historyTable.firstChild);
	}

	// SEND QUERY
	var query = new Object;
	query.mode 			= 	"getHistory";
	query.callback		=	"handleHistory",
	query.module 		= 	"Agua::Workflow";
	query.sourceid 		= 	this.id;
	Agua.exchange.send(query);
},
handleHistory : function (response) {
	var data 	=	response.data;
	console.log("History.handleHistory    data: " + data);
	console.dir({data:data});

	var history = data.history;
	console.log("History.handleHistory    history: " + history);
	console.dir({history:history});

	// EMPTY CURRENT TABLE IF PRESENT
	while ( this.historyTable.firstChild ) {
		this.historyTable.removeChild(this.historyTable.firstChild);
	}

	// BUILD TABLE
	var table = document.createElement('table');
	this.historyTable.appendChild(table);
	dojo.addClass(table, 'historyTable');

	// SET THE NODE CLASSES BASED ON STATUS
	console.log("History.handleHistory    history.length: " + history.length);
	for ( var i = 0; i < history.length; i++ ) {
		var tr = document.createElement('tr');
		table.appendChild(tr);

		var td = document.createElement('td');
		tr.appendChild(td);

		var project = history[i][0].project;
		var workflow = history[i][0].workflow;
		console.log("History.handleHistory    project: " + project);
		console.log("History.handleHistory    workflow: " + workflow);

		var historyPane = new HistoryPane(
			{
				project: project,
				workflow : workflow,
				rows: history[i]
			}
		);
		td.appendChild(historyPane.domNode); 
	}	
},
downloadHistory: function (event) {
	// STOP EVENT
	event.stopPropagation();
	
	// GENERATE HISTORY QUERY AND SEND TO SERVER
	var query = "?username=" + Agua.cookie('username');
	query += "&sessionid=" + Agua.cookie('sessionid');
	query += "&mode=downloadHistory";
	var url = Agua.cgiUrl + "download.cgi";
	console.log("History.setHistoryButtons     downloadHistoryButton.onclick    query: " + query);
	console.log("History.setHistoryButtons     downloadHistoryButton.onclick    url: " + url);

	// DO AN IFrame REQUEST TO DOWNLOAD THE FILE
	/* NB: dojo.io.iframe.send SUPPORTS ONLY 'GET' OR 'POST */
	var args = {
		method: "POST",
		url: url + query,
		handleAs: "html",
		//timeout: 10000
		//load: dojo.hitch(this, "onDownloadComplete"),
		//error: dojo.hitch(this, "onDownloadError")
	};
	dojo.io.iframe.send(args);
}

	
});

});


console.log("%cplugins/workflow/History    COMPLETED", "color: blue");
