/* DISPLAY PROJECTS AND WORKFLOWS SHARED WITH THE USER
   
   ALLOW THE USER TO:
   
		-	VIEW THE PARAMETERS OF SHARED WORKFLOWS 

		-	VIEW THE OUTPUT FILES OF SHARED WORKFLOWS

		-	COPY SHARED WORKFLOWS TO USER'S OWN PROJECTS
		
   TO DO:

	copyProject
	sharedStatus

*/

console.log("Loading plugins/workflow/SharedWorkflows");

define([
	"dojo/_base/declare",
	"plugins/workflow/Workflows",
	"plugins/dijit/SyncDialog",
	"plugins/dnd/Target"
],

function (
	declare,
	Workflows,
	SyncDialog,
	Target
) {

	/////}}}}}

return declare([
	Workflows
], {

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/templates/sharedworkflows.html"),

shared : true,

// PARENT WIDGET
parentWidget : null,

// ARRAY OF CHILD WIDGETS
childWidgets : null,

// isVALID BOOLEAN: ALL PARAMETERS ARE VALID
isValid : null,

// CORE WORKFLOW OBJECTS
core : null,

// workflowType : string
// E.g., 'userWorkflows', 'sharedWorkflows'
workflowType : 'sharedWorkflows',

/////}}}}}

postCreate : function () {
	console.log("SharedWorkflows.postCreate     plugins.workflow.SharedWorkflows.postCreate");

	// PRE STARTUP
	if ( this.preStartup )	this.preStartup();
	
	this.startup();

	// POST STARTUP
	if ( this.postStartup )	this.postStartup();
},
startup : function () {
// DO inherited, LOAD ARGUMENTS AND ATTACH THE MAIN TAB TO THE ATTACH NODE
	console.log("SharedWorkflows.startup    START");
	//console.log("SharedWorkflows.startup    this.shared: " + this.shared);

	//console.log("SharedWorkflows.startup    Setting this.ready = false");
	this.ready = false;

	// ADD TO TAB CONTAINER		
	this.attachPane();

	// SET SELECTIVE DIALOG FOR copyWorkflow	
	console.log("SharedWorkflows.startup    DOING this.setSelectiveDialog()");
	this.setSelectiveDialog();

	// SET INTERACTIVE DIALOG FOR copyProject
	console.log("SharedWorkflows.startup    DOING this.setInteractiveDialog()");
	this.setInteractiveDialog();
	
	// CREATE SOURCE MENU
	console.log("SharedWorkflows.startup    DOING this.setContextMenu()");
	this.setContextMenu();
	
	// CREATE DROP TARGET
	console.log("SharedWorkflows.startup    DOING this.setDropTarget()");
	this.setDropTarget();

	// SET SHARING USER NAMES COMBO
	console.log("SharedWorkflows.startup    DOING this.setUsernameCombo()");
	this.setUsernameCombo();
	
	// SET ONCLICK LISTENERS
	console.log("SharedWorkflows.startup    DOING this.setListeners()");
	this.setListeners();
	
	// SUBSCRIBE TO UPDATES
	Agua.updater.subscribe(this, "updateProjects");

	console.log("SharedWorkflows.startup    END");

	this.ready = true;
},
updateProjects : function (args) {
// DO NOTHING
},
setListeners : function () {

	// USERNAME COMBO
	var thisObject = this;
	dojo.connect(this.usernameCombo, "onChange", dojo.hitch(function(event) {
		//console.log("SharedWorkflows.setUsernameCombo    dojo.connect event: " + event);
		thisObject.setProjectCombo(event);
	}));

	// PROJECT COMBO
	dojo.connect(this.projectCombo, "onChange", dojo.hitch(function(event) {
		//console.log("SharedWorkflows.setProjectCombo    dojo.connect event: " + event);
		var username = thisObject.usernameCombo.get('value');
		var projectName = thisObject.projectCombo.get('value');
		
		thisObject.setWorkflowCombo(username, projectName);
	}));
	
	// WORKFLOW COMBO
	var thisObject = this;
	dojo.connect(this.workflowCombo, "onChange", dojo.hitch(function(event) {
		//console.log("SharedWorkflows.setWorkflowCombo    dojo.connect event: " + event);

		var username = thisObject.usernameCombo.get('value');
		var projectName = thisObject.projectCombo.get('value');
		var workflowName = thisObject.workflowCombo.get('value');
		thisObject.updateDropTarget(username, projectName, workflowName);
	}));

},
enableRunButton : function () {
	//console.log("SharedWorkflows.enableRunButton()  EMPTY PLACEHOLDER");
},
disableRunButton : function () {
	//console.log("SharedWorkflows.disableRunButton()  EMPTY PLACEHOLDER");
},
setUsernameCombo : function () {
	//console.log("SharedWorkflows.setUsernameCombo    plugins.workflow.Common.setUsernameCombo()");
	
	//console.log("SharedWorkflows.setUsernameCombo    BEFORE this.inherited(arguments)");
	this.inherited(arguments);
	//console.log("SharedWorkflows.setUsernameCombo    AFTER this.inherited(arguments)");

	var username = this.usernameCombo.get('value');
	//console.log("SharedWorkflows.setUsernameCombo    username: " + username);

	// SET THE PROJECT COMBO
	this.setProjectCombo(username);
},
setProjectCombo : function (username, projectName, workflowName) {
	//console.log("SharedWorkflows.setProjectCombo    plugins.report.Workflow.setProjectCombo(username, project, workflow)");
	
	//console.log("SharedWorkflows.setProjectCombo    username: " + username);
	//console.log("SharedWorkflows.setProjectCombo    projectName: " + projectName);
	//console.log("SharedWorkflows.setProjectCombo    workflowName: " + workflowName);
	//console.log("SharedWorkflows.setProjectCombo    BEFORE this.inherited(arguments)");

	this.setSharedProjectCombo(username, projectName, workflowName);
	//console.log("SharedWorkflows.setProjectCombo    AFTER this.inherited(arguments)");

	if ( projectName == null || ! projectName ) {
		projectName = this.projectCombo.get('value');
	}
	//console.log("SharedWorkflows.setProjectCombo    projectName: " + projectName);

	// SET THE PROJECT COMBO
	this.setWorkflowCombo(username, projectName);
},
setWorkflowCombo : function (username, projectName, workflowName) {
	//console.log("SharedWorkflows.setWorkflowCombo    workflow.SharedWorkflows.setWorkflowCombo(username, project, workflow)");
	//console.log("SharedWorkflows.setWorkflowCombo    username: " + username);
	//console.log("SharedWorkflows.setWorkflowCombo    projectName: " + projectName);
	//console.log("SharedWorkflows.setWorkflowCombo    workflowName: " + workflowName);

	//console.log("SharedWorkflows.setWorkflowCombo    BEFORE this.inherited(arguments)");
	this.setSharedWorkflowCombo(username, projectName, workflowName);
	//console.log("SharedWorkflows.setWorkflowCombo    AFTER this.inherited(arguments)");

	if ( projectName == null || ! projectName )
		projectName = this.projectCombo.get('value');
	//console.log("SharedWorkflows.setWorkflowCombo    projectName: " + projectName);

	if ( workflowName == null || ! workflowName )
		workflowName = this.workflowCombo.get('value');
	//console.log("SharedWorkflows.setWorkflowCombo    workflowName: " + workflowName);

	this.updateDropTarget(username, projectName, workflowName);
},
setDropTarget : function () {
// CREATE DROP TARGET
	console.log("SharedWorkflows.setDropTarget    this.dropTargetContainer: " + this.dropTargetContainer);
	console.log("SharedWorkflows.setDropTarget    this.contextMenu: " + this.contextMenu);

	this.dropTarget = new Target(
		this.dropTargetContainer,
		{
			accept: [],
			contextMenu : this.contextMenu,
			parentWidget : this,
			core: this.core
		}
	);

	if ( this.dropTarget == null ) {
		//console.log("Workflows._setDropTargetNodes    this.dropTarget is null. Returning");
		return;
	}	
},
updateDropTarget : function (username, projectName, workflowName) {
	//console.log("SharedWorkflows.updateDropTarget     plugins.workflow.SharedWorkflows.updateDropTarget(username, projectName, workflowName)");

	//console.log("SharedWorkflows.updateDropTarget     this.ready: " + this.ready);
	if ( ! this.ready )	return;

	//console.log("SharedWorkflows.updateDropTarget     username: " + username);
	//console.log("SharedWorkflows.updateDropTarget     projectName: " + projectName);
	//console.log("SharedWorkflows.updateDropTarget     workflowName: " + workflowName);
	if ( ! username )	return;
	if ( ! projectName )	return;
	if ( ! workflowName )	return;
	
	// SET THE DROP TARGET
	var sharedStages  = Agua.getSharedStagesByWorkflow(username, projectName, workflowName);
	//console.log("SharedWorkflows.updateDropTarget    sharedStages: ");
	//console.dir({sharedStages:sharedStages});
	
	if ( sharedStages == null )
	{
		//console.log("SharedWorkflows.updateDropTarget    sharedStages == null. Returning");
		return;
	}

	this._updateDropTarget(sharedStages);
},
assumeFocus : function () {
	//console.log("SharedWorkflows.assumeFocus    plugins.workflow.SharedWorkflows.assumeFocus()");

	var username = thisObject.usernameCombo.get('value');
	var projectName = thisObject.projectCombo.get('value');
	var workflowName = thisObject.workflowCombo.get('value');
	this.updateDropTarget(username, projectName, workflowName);
},
loadParametersPane : function (node) {
// LOAD DATA INTO INFO PANE FROM THE APPLICATION ASSOCIATED WITH THIS NODE
// OVERLOAD THIS TO PASS ADDITIONAL ARGUMENTS TO Parameters.load()
	//console.log("SharedWorkflows.loadParametersPane    plugins.workflow.SharedWorkflows.loadParametersPane(node)");
	console.log("SharedWorkflows.loadParametersPane    node: " + node);
	//console.log("SharedWorkflows.loadParametersPane    this.shared: " + this.shared);
	//console.log("sharedProjects.loadParametersPane    this.core.parameters: " + this.core.parameters);
	
	// WARN AND QUIT IF NO NODE PASSED, E.G., IF WORKFLOW HAS NO STAGES
	if ( node == null ) {
		//console.log("SharedWorkflows.loadParametersPane    node is null (no applications in dropTarget). Returning.");
		return;
	}
	console.log("SharedWorkflows.loadParametersPane    node.application: ");
	console.dir({node_application:node.application});

	if ( this.core.parameters != null ) {
		this.core.parameters.load(node.application, this.shared);
	}
	
	this.ready = true;
},
_copyWorkflow : function (sourceProject, sourceWorkflow, targetProject, targetWorkflow, copyFiles) {
	//console.log("SharedWorkflows._copyWorkflow    SharedWorkflows._copyWorkflow(sourceProject, sourceWorkflow, targetProject, targetWorkflow, copyFiles)");
	
	var sourceUser = this.usernameCombo.get('value');
	var targetUser = Agua.cookie('username');

	//console.log("SharedWorkflows._copyWorkflow    sourceUser: " + sourceUser);
	//console.log("SharedWorkflows._copyWorkflow    targetUser: " + targetUser);

	// ADD PROJECT
	Agua.copyWorkflow(sourceUser, sourceProject, sourceWorkflow, targetUser, targetProject, targetWorkflow, copyFiles);

	// RELOAD RELEVANT DISPLAYS
	Agua.updater.update("updateProjects");
},
_copyProject : function (sourceProject, targetProject, copyFiles) {
//console.log("SharedWorkflows._copyProject    Stages._copyProject(sourceProject, targetProject, copyFiles)");

	var targetUser = Agua.cookie('username');
	var sourceUser =  this.usernameCombo.get('value');
	
	// ADD PROJECT
	Agua.copyProject(sourceUser, sourceProject, targetUser, targetProject, copyFiles);

	// RELOAD RELEVANT DISPLAYS
	Agua.updater.update("updateProjects");
}


}); //	end declare

});	//	end define
