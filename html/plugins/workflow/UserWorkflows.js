/* DISPLAY PROJECTS AND WORKFLOWS OWNED BY THE USER

	USE CASE SCENARIO 1: INPUT VALIDITY CHECKING WHEN USER LOADS NEW WORKFLOW 

	1. updateDropTarget: load stages

	2. updateDropTarget: CALL -> first stage)

		   load multiple ParameterRows, each checks isValid (async xhr request for each file)
			   CALL -> Agua.setParameterValidity(boolean) to set stageParameter.isValid
	
	3. updateDropTarget: (concurrently with 2.) CALL -> updateRunButton()

		   check isValid for each StageRow:

				CALL-> checkValidParameters (async batch xhr request for multiple files)

				   CALL -> Agua.getParameterValidity(), and if empty check input and then

						CALL -> Agua.setParameterValidity(boolean) to set stageParameter.isValid


	USE CASE SCENARIO 2: USER CREATES NEW WORKFLOW BY TYPING IN WORKFLOW COMBO
	
	Stages.setWorkflowListeners:
	
	this.workflowCombo._onKey LISTENER FIRES
		
		--> Agua.isWorkflow (returns TRUE/FALSE)

			FALSE 	--> Agua.addWorkflow
						
						--> Agua.getMaxWorkflowNumber
						--> Agua._addWorkflow

					-->  Stages.setWorkflowCombo
		

	USE CASE SCENARIO 3: USER CLICKS 'Copy Workflow' BUTTON
	
	copyWorkflow
	
		-->	Agua.isWorkflow (returns TRUE/FALSE)
		
			TRUE 	-->	Message to dialogWidget and quit
		
			FALSE	-->	Message to dialogWidget and copy
			
				--> Stages._copyWorkflow

					-->	Agua.copyWorkflow (returns TRUE/FALSE)
					
						TRUE	--> Stages.setProjectCombo with new workflow

*/

console.log("Loading plugins/workflow/UserWorkflows");

define([
	"dojo/_base/declare",
	"plugins/workflow/Workflows",
	"plugins/dijit/SyncDialog"
],

function (
	declare,
	Workflows,
	SyncDialog
) {

	/////}}}}}

return declare([
	Workflows
], {

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/templates/userworkflows.html"),

// CONTEXT MENU
contextMenu : null,

// workflowType : string
// E.g., 'userWorkflows', 'sharedWorkflows'
workflowType : 'userWorkflows',

// syncDialog : plugins.dijit.SyncDialog
syncDialog : null,

/////}}}}
constructor : function (args) {
	console.log("UserWorkflows.constructor     plugins.workflow.UserWorkflows.constructor");			
	console.log("UserWorkflows.constructor     args:");			
	console.dir({args:args});
	
	this.id = dijit.getUniqueId("plugins_workflow_UserWorkflows");

	
	//// MIXIN
	//lang.mixin(this, args);

	// GET INFO FROM ARGS
	this.core 						= args.core;
	this.core[this.workflowType]	= this;
	this.parentWidget 				= args.parentWidget;
	this.attachPoint 				= args.attachPoint;

	console.log("UserWorkflows.constructor     this.core:");
	console.dir({this_core:this.core});

	// LOAD CSS
	this.loadCSS();		
},
postCreate : function () {
	console.log("Workflows.postCreate     plugins.workflow.Workflows.postCreate");			
	// PRE STARTUP
	if ( this.preStartup )	this.preStartup();
	
	this.startup();

	// POST STARTUP
	if ( this.postStartup )	this.postStartup();
},
preStartup : function () {
	console.group("UserWorkflows-" + this.id + "    preStartup");
	console.log("HERE");
	console.log("UserWorkflows.preStartup    END");
	console.groupEnd("UserWorkflows-" + this.id + "    preStartup");
},
postStartup : function () {
	console.group("UserWorkflows-" + this.id + "    postStartup");

	// SET SYNC WORKFLOWS BUTTON
	this.setSyncWorkflows();
	
	// SUBSCRIBE TO UPDATES
	console.log("UserWorkflows.postStartup    BEFORE Agua.updater.subscribe()");
	Agua.updater.subscribe(this, "updateSyncWorkflows");
	console.log("UserWorkflows.postStartup    AFTER Agua.updater.subscribe()");

	// SET SYNC DIALOG
	this.setSyncDialog();
	
	console.groupEnd("UserWorkflows-" + this.id + "    postStartup");
},
updateSyncWorkflows : function (args) {
	console.warn("UserWorkflows.updateSyncWorkflows    args:");
	console.dir({args:args});

	this.setSyncWorkflows();
},
// DISABLE SYNC WORKFLOWS BUTTON IF NO HUB LOGIN
setSyncWorkflows : function () {
	var hub = Agua.getHub();
	console.log("UserWorkflows.setSyncWorkflows    hub:")
	console.dir({hub:hub});

	if ( ! hub.login || ! hub.token ) {
		this.disableSyncWorkflows();
	}
	else {
		this.enableSyncWorkflows();
	}
},
setSyncDialog : function () {
	console.log("UserWorkflows.loadSyncDialog    plugins.workflows.UserWorkflows.setSyncDialog()");
	
	var enterCallback = function (){};
	var cancelCallback = function (){};
	var title = "Sync";
	var header = "Sync Workflows";
	
	this.syncDialog = new SyncDialog(
		{
			title 				:	title,
			header 				:	header,
			parentWidget 		:	this,
			enterCallback 		:	enterCallback
		}			
	);

	console.log("UserWorkflows.loadSyncDialog    this.syncDialog:");
	console.dir({this_syncDialog:this.syncDialog});

},
showSyncDialog : function () {
	var disabled = dojo.hasClass(this.syncWorkflowsButton, "disabled");
	console.log("UserWorkflows.loadSyncDialog    disabled: " + disabled);
	
	if ( disabled ) {
		console.log("UserWorkflows.loadSyncDialog    SyncWorkflows is disabled. Returning");
		return;
	}
	
	var title = "Sync Workflows";
	var header = "";
	var message = "";
	var details = "";
	var enterCallback = dojo.hitch(this, "syncWorkflows");
	this.loadSyncDialog(title, header, message, details, enterCallback)
},
loadSyncDialog : function (title, header, message, details, enterCallback) {
	console.log("UserWorkflows.loadSyncDialog    title: " + title);
	console.log("UserWorkflows.loadSyncDialog    header: " + header);
	console.log("UserWorkflows.loadSyncDialog    message: " + message);
	console.log("UserWorkflows.loadSyncDialog    details: " + details);
	console.log("UserWorkflows.loadSyncDialog    enterCallback: " + enterCallback);

	this.syncDialog.load(
		{
			title 			:	title,
			header 			:	header,
			message 		:	message,
			details 		:	details,
			enterCallback 	:	enterCallback
		}			
	);
},
disableSyncWorkflows : function () {
	dojo.addClass(this.syncWorkflowsButton, "disabled");
	dojo.attr(this.syncWorkflowsButton, "title", "Input AWS private key and public certificate to enable Sync");
},
enableSyncWorkflows : function () {
	dojo.removeClass(this.syncWorkflowsButton, "disabled");
	dojo.attr(this.syncWorkflowsButton, "title", "Click to sync workflows to biorepository");
},
// SYNC WORKFLOWS
syncWorkflows : function (inputs) {
	console.log("UserWorkflows.syncWorkflows    inputs: ");
	console.dir({inputs:inputs});
	
	if ( this.syncingWorkflows == true ) {
		console.log("UserWorkflows.syncWorkflows    this.syncingWorkflows: " + this.syncingWorkflows + ". Returning.");
		return;
	}
	this.syncingWorkflows = true;
	
	var query = new Object;
	query.username 			= 	Agua.cookie('username');
	query.sessionid 		= 	Agua.cookie('sessionid');
	query.message			= 	inputs.message;
	query.details			= 	inputs.details;
	query.hubtype			= 	"github";
	query.mode 				= 	"syncWorkflows";
	query.module 		= 	"Agua::Workflow";
	console.log("UserWorkflows.syncWorkflows    query: ");
	console.dir({query:query});
	
	// SEND TO SERVER
	var url = Agua.cgiUrl + "agua.cgi?";
	var thisObj = this;
	dojo.xhrPut(
		{
			url: url,
			contentType: "json",
			putData: dojo.toJson(query),
			load: function(response, ioArgs) {
				thisObj.syncingWorkflows = false;

				console.log("Workflows.syncWorkflows    OK. response:")
				console.dir({response:response});

				Agua.toast(response);
			},
			error: function(response, ioArgs) {
				thisObj.syncingWorkflows = false;

				console.log("Workflows.syncWorkflows    ERROR. response:")
				console.dir({response:response});
				Agua.toast(response);
			}
		}
	);
}

}); //	end declare

});	//	end define
