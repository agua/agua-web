console.log("Loading plugins/workflow/RunStatus/Status");

define("plugins/workflow/RunStatus/Status",
[
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common",
	"plugins/workflow/RunStatus/ClusterStatus",
	"plugins/workflow/RunStatus/QueueStatus",
	"plugins/workflow/RunStatus/StageStatus",
	"plugins/dijit/ConfirmDialog",

	"dijit/TitlePane"
],

function (
	declare,
	lang,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common,
	ClusterStatus,
	QueueStatus,
	StageStatus,
	ConfirmDialog
) {

/////}}}}}

return declare("plugins/workflow/RunStatus/Status",
	[ _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Common ], {

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/RunStatus/templates/runstatus.html"),

// cssFiles : String
cssFiles : [
	require.toUrl("plugins/workflow/RunStatus/css/runstatus.css")
],

// core : hash
// Workflow-related objects
core : null,

/////}}}}
constructor : function(args) {

	console.log("Status.constructor    plugins.workflow.RunStatus.constructor(args)");

	// MIXIN
	lang.mixin(this, args);

	// GET ARGS
	this.core = this.core || {};
	this.core.runStatus = this;

	// LOAD CSS
	console.log("Status.constructor    DOING this.loadCSS()");
	this.loadCSS();
},
postCreate: function() {
	console.log("Status.postCreate    plugins.workflow.RunStatus.postCreate()");

	this.startup();
},
startup : function () {
	console.log("Status.startup    caller: " + this.startup.caller.nom);

	// SET UP THE ELEMENT OBJECTS AND THEIR VALUE FUNCTIONS
	this.inherited(arguments);
	
	// SET ID
	console.log("Status.constructor    DOING this.setId()");
	this.setId();

	// PANE
	this.attachPane();
	
	// START UP CONFIRM DIALOGUE
	console.log("Status.constructor    DOING this.setConfirmDialog()");
	this.setConfirmDialog();

	// SET STAGE STATUS
	console.log("Status.constructor    DOING this.setStageStatus()");
	this.setStageStatus();

	// SET CLUSTER STATUS
	console.log("Status.constructor    DOING this.setClusterStatus()");
	this.setClusterStatus();

	// SET QUEUE STATUS
	console.log("Status.constructor    DOING this.setQueueStatus()");
	this.setQueueStatus();

	// SET INPUTS AS SELECTED
	console.log("Status.constructor    DOING this.selectParameters()");
	this.selectParameters();
},
setId : function () {
	if ( this.id ) {
		console.log("Status.setId    Returning existing this.id: " + this.id);
		return this.id;
	}
	this.id 	= 	dijit.registry.getUniqueId(this.declaredClass);
	this.id 	= 	this.id.replace(/(\/|\.)/g, '-');
	
	console.log("Status.setId    this.id: " + this.id);
	console.log("Status.setId    registry: ", registry);
	dijit.registry.add(this);
	
	return this.id;
},
runAllWorkflows : function (application) {
// RUN WORKFLOW, QUIT IF ERROR, PROMPT FOR stopRun IF ALREADY RUNNING
	console.log("RunStatus.runAllWorkflows      application: ");
	console.dir({application:application});

	var project = application.project;
	var workflow= application.workflow;
	console.log("RunStatus.runAllWorkflows      project: " + project);
	console.log("RunStatus.runAllWorkflows      workflow: " + workflow);
	
	var stages = Agua.getStagesByWorkflow(project, workflow);
	var stop = stages.length + 1;
	application.stop = stop;
	console.log("RunStatus.runAllWorkflows      stop: " + stop);
	
	this.runWorkflow(application);
},
runWorkflow : function (application) {
// RUN WORKFLOW, QUIT IF ERROR, PROMPT FOR stopRun IF ALREADY RUNNING
	console.group("runStatus-" + this.id + "    runWorkflow");
	console.log("RunStatus.runWorkflow      application: ");
	console.dir({application:application});

	// SELECT THIS TAB NODE
	if ( this.attachPoint ) {
		this.attachPoint.selectChild(this.mainTab);
	}

	var project			=	application.project;
	var workflow		=	application.workflow;
	var start			=	application.number;	
	var stop			=	application.stop 
	console.log("Status.runWorkflow     stop: " + stop);
	if ( ! stop ) stop 	=	parseInt(application.number) + 1;	
	var workflownumber	=	application.workflownumber;	
	console.log("Status.runWorkflow     project: " + project);
	console.log("Status.runWorkflow     workflow: " + workflow);
	console.log("Status.runWorkflow     start: " + start);
	console.log("Status.runWorkflow     FINAL stop: " + stop);
	console.log("Status.runWorkflow     workflownumber: " + workflownumber);

	// SET MESSAGE
	this.displayWorkflowStatus("starting");

	// GET submit
	var submit = Agua.getWorkflowSubmit(application);

	// SEND QUERY
	var username			=	Agua.cookie('username');
	var cluster				=	this.setCluster(username, application.cluster);
	var cookie				=	Agua.cookie('sessionid');
	var query 				= 	new Object;

	query.username 			= 	username;
	query.sessionid	 		= 	cookie;
	query.sourceid 			= 	this.id;
	query.mode 				= 	"executeWorkflow";
	query.module 			= 	"Agua::Workflow";
	query.callback			=	"handleStatus",
	query.sendtype			= 	"request";

	query.cluster			=	cluster;
	query.project			=	project;
	query.workflow			=	workflow;
	query.workflownumber	=	workflownumber;
	query.start				=	start;
	query.stop				=	stop;
	query.submit			=	submit;

	console.log("Status.runWorkflow     query: " + dojo.toJson(query));
	Agua.exchange.send(query);
},
setCluster : function (username, cluster) {
	if ( cluster != '' ) {
		cluster = username + "-" + cluster;
	}
	
	return cluster;
},
handleStatus : function (response) {
	console.log("Status.handleRunWorkflow     response: ");
	console.dir({response:response});
	
	// QUIT IF ERROR
	if (response == null ) return;
	
	if ( response.error ) {
		Agua.toastError(response.error);
		this.displayWorkflowStatus("error");
	}
	else {
		console.group("RunStatus-" + this.id + "    handleStatus");
	
		// SET TARGET CLASSES
		console.log("Status.handleStatus    DOING this.setTargetClasses(response.stagestatus)");
		this.setTargetClasses(response.data.stagestatus);
		
		// DISPLAY STATUS
		this.displayWorkflowStatus(response.data.stagestatus.status);
	
		console.log("Status.handleStatus     BEFORE Agua.updateStagesStatus(stagestatus)");
		Agua.updateStagesStatus(response.data.stagestatus);
		console.log("Status.handleStatus     AFTER Agua.updateStagesStatus(stagestatus)");
	
		console.log("Status.handleStatus     BEFORE this.showStatus(response)");
		this.showStatus(response.data);
		console.log("Status.handleStatus     AFTER this.showStatus(response)");
	
		console.groupEnd("RunStatus-" + this.id + "    handleStatus");	
	}
},
setTargetClasses : function (stagestatus) {
	// NODES
	var childNodes = this.core.userWorkflows.dropTarget.getAllNodes();	
	if ( ! childNodes )	return;

	var status = "completed";
	for ( var i = 0; i < stagestatus.stages.length; i++ ) {
		var nodeClass = stagestatus.stages[i].status;
		console.log("Status.setTargetClasses   stagestatus.stages[" + i + "].status: " + stagestatus.stages[i].status);
		//console.log("Status.setTargetClasses    data nodeClass " + i + ": " + nodeClass);
		//console.log("Status.setTargetClasses    childNodes[" + i + "]: " + childNodes[i]);

		this.setNodeClass(childNodes[i], nodeClass);
		
		// UNSET COMPLETED FLAG IF ANY NODE IS NOT COMPLETED
		if ( nodeClass != "completed" && status == "completed" ) {
			console.log("Status.setTargetClasses    Setting this.completed = false");
			this.completed = false;
			status = nodeClass;
		}
	}
	console.log("Status.setTargetClasses    this.completed: " + this.completed);	
},
setNodeClass : function(node, nodeClass) {
	console.log("XXXXX RunStatus.setNodeClass    nodeClass: " + nodeClass);
	dojo.removeClass(node, 'stopped');
	dojo.removeClass(node, 'waiting');
	dojo.removeClass(node, 'running');
	dojo.removeClass(node, 'completed');
	dojo.addClass(node, nodeClass);	
},
// SHOW STATUS
showStatus : function (response, selectTab) {
// POPULATE THE 'STATUS' PANE WITH RUN STATUS INFO
	console.log("Status.showStatus      response: ");
	console.dir({response:response});
    if ( ! response ) return;
	
	// SHOW STAGES STATUS
	console.log("Status.showStatus      Doing this.displayStageStatus(response.stages)");
	this.displayStageStatus(response.stagestatus);

	// SHOW CLUSTER STATUS
	console.log("Status.showStatus      Doing this.displayClusterStatus(response.clusterstatus)");
	this.displayClusterStatus(response.clusterstatus);

	// SHOW QUEUE STATUS
	console.log("Status.showStatus      Doing this.displayQueueStatus(response.queuestatus)");
	this.displayQueueStatus(response.queuestatus);

	// SELECT TAB BASED ON CLUSTER STATUS
    if ( selectTab )
    	this.selectTab(response);

	// GET SELECTED TAB
	var selectedTab = this.getSelectedTab();
	console.log("Status.showStatus    -------------------------- selectedTab : " + selectedTab);
},
selectTab : function (response) {
	// SELECT THIS TAB IF CLUSTER OR BALANCER STILL STARTING
	console.log("Status.selectTab      response: ");
	console.dir({response:response});

	if ( ! response || ! response.clusterstatus ) {
		console.log("Status.selectTab      response or response.clusterstatus is null. SELECTING 'STAGE' TAB");
		this.attachPoint.selectChild(this.mainTab);
		return;
	}

	var status = response.clusterstatus.status;
	console.log("Status.selectTab      status: " + status);	
	
	if ( status == null ) {
		console.log("Status.selectTab      clusterstatus.status is null. SELECTING 'STAGE' TAB");
		this.attachPoint.selectChild(this.mainTab);	
	}
	else if ( status.match(/^cluster/)
		|| status.match(/^balancer/) ) {
		console.log("Status.selectTab      SELECTING 'CLUSTER' TAB");
		this.attachPoint.selectChild(this.clusterStatus.mainTab);	
	}
	else if ( status.match(/sge/ ) ) {
		console.log("Status.selectTab      SELECTING 'QUEUE' TAB");
		this.attachPoint.selectChild(this.queueStatus.mainTab);	
	}
	else {
		console.log("Status.selectTab      SELECTING 'STAGE' TAB");
		this.attachPoint.selectChild(this.mainTab);	
	}
},
getSelectedTab : function () {
	console.log("Status.getSelectedTab    this.attachPoint: " + this.attachPoint);
	console.dir({this_attachPoint:this.attachPoint});

	console.log("Status.getSelectedTab    this.stageTab: " + this.mainTab);
	
	console.log("Status.getSelectedTab    this.attachPoint.selectedChildWidget: " + this.attachPoint.selectedChildWidget);
	console.dir({selectedChildWidget:this.attachPoint.selectedChildWidget});
	
	if ( this.attachPoint.selectedChildWidget == this.mainTab )
		return "stageStatus";
	if ( this.attachPoint.selectedChildWidget == this.clusterStatus.mainTab)
		return "clusterStatus";
	if ( this.attachPoint.selectedChildWidget == this.queueStatus.mainTab)
		return "queueStatus";
	
	return null;
},
displayWorkflowStatus: function (status) {
	this.workflowStatus.innerHTML = status;
},
displayStageStatus : function (status) {
	console.log("Status.displayStageStatus      status:");
	console.dir({status:status});
	this.stageStatus.displayStatus(status);
},
displayClusterStatus : function (status) {
	console.log("Status.displayClusterStatus      status:");
	console.dir({status:status});
	this.clusterStatus.displayStatus(status);
},
displayQueueStatus : function (status) {
	console.log("Status.displayQueueStatus      status:");
	console.dir({status:status});
	this.queueStatus.displayStatus(status);
},
clear : function () {
	console.log("Status.clear      this.queueStatus:");
	console.dir({this_queueStatus:this.queueStatus});
	if ( this.queueStatus )
		this.queueStatus.clearStatus();
	if ( this.clusterStatus )
		this.clusterStatus.clearStatus();
	while ( this.stagesStatusContainer.firstChild ) {
		this.stagesStatusContainer.removeChild(this.stagesStatusContainer.firstChild);
	}	
},
setTime : function (stage) {
	console.log("Status.setTime    stage: "  + dojo.toJson(stage));

	this.displayWorkflowTime(stage.now);
},
displayWorkflowTime : function(time) {
	console.log("Status.displayWorkflowTime    time: " + time);
    // LATER: FINISH
	
},
// WORKFLOW CONTROLS
setConfirmDialog : function () {
	console.log("Status.setConfirmDialog");

	var yesCallback = function (){};
	var noCallback = function (){};
	var title = "Dialog title";
	var message = "Dialog message";
	
	this.confirmDialog = new ConfirmDialog(
		{
			title 				:	title,
			message 			:	message,
			parentWidget 		:	this,
			yesCallback 		:	yesCallback,
			noCallback 			:	noCallback
		}			
	);
},
loadConfirmDialog : function (title, message, yesCallback, noCallback) {
	console.log("Status.loadConfirmDialog    yesCallback.toString(): " + yesCallback.toString());
	console.log("Status.loadConfirmDialog    title: " + title);
	console.log("Status.loadConfirmDialog    message: " + message);
	console.log("Status.loadConfirmDialog    yesCallback: " + yesCallback);
	console.log("Status.loadConfirmDialog    noCallback: " + noCallback);

	this.confirmDialog.load(
		{
			title 				:	title,
			message 			:	message,
			yesCallback 		:	yesCallback,
			noCallback 			:	noCallback
		}			
	);
},
pauseWorkflow : function () {
	console.log("Status.pauseWorkflow    ");
	var project = this.core.userWorkflows.getProject();
	var workflow = this.core.userWorkflows.getWorkflow();

	this.displayWorkflowStatus("pausing");

	this.checkRunning(project, workflow, "confirmPauseWorkflow");
},
checkRunning : function (project, workflow, callback) {
	console.group("runStatus-" + this.id + "    checkRunning");

	console.log("Status.checkRunning     project: " + project);
	console.log("Status.checkRunning     workflow: " + workflow);
	console.log("Status.checkRunning     callback: " + callback);

	var stages = Agua.getStagesByWorkflow(project, workflow);
	var isRunning = false;
	for ( var i = 0; i < stages.length; i++ ) {
		if ( stages[i].status == "running" ) {
			isRunning = true;
			console.log("Status.checkRunning    stage " + i + " (" + stages[i].name + ") is running.");
			break;
		}
	}
	console.log("Status.checkRunning    Doing  callback " + callback + "(" + isRunning + ")");

	this[callback](project, workflow, isRunning);

	console.groupEnd("runStatus-" + thisObject.id + "    checkRunning");
},

stopWorkflow : function () {
	console.log("Status.stopWorkflow    ");
	var project = this.core.userWorkflows.getProject();
	var workflow = this.core.userWorkflows.getWorkflow();
    console.log("Status.stopWorkflow    project: " + project);
    console.log("Status.stopWorkflow    workflow: " + workflow);

	this.displayWorkflowStatus("stopping");

	this.checkRunning(project, workflow, "confirmStopWorkflow");
},
startWorkflow : function () {
	console.log("Status.startWorkflow    ");
	var project = this.core.userWorkflows.getProject();
	var workflow = this.core.userWorkflows.getWorkflow();

	this.displayWorkflowStatus("starting");

	this.checkRunning(project, workflow, "confirmStartWorkflow");
},
confirmPauseWorkflow : function (project, workflow, isRunning) {
	// EXIT IF NO STAGES ARE CURRENTLY RUNNING
	console.log("Status.confirmPauseWorkflow    project: " + project);
	console.log("Status.confirmPauseWorkflow    workflow: " + workflow);
	console.log("Status.confirmPauseWorkflow    isRunning: " + isRunning);
	if ( ! isRunning )	{
		this.displayWorkflowStatus("cancelled pause");
		return;
	}

	// ASK FOR CONFIRMATION TO STOP THE WORKFLOW
	var noCallback = function (){
		console.log("WorkflowMenu.confirmPauseWorkflow    noCallback()");
	};
	var yesCallback = dojo.hitch(this, function()
		{
			console.log("WorkflowMenu.confirmPauseWorkflow    yesCallback()");
			this.doPauseWorkflow();
		}								
	);

	// GET THE INDEX OF THE FIRST RUNNING STAGE
	var indexOfRunningStage = this.core.userWorkflows.indexOfRunningStage();
	console.log("Status.confirmPauseWorkflow   indexOfRunningStage: " + indexOfRunningStage);
	this.runner = this.core.runStatus.createRunner(indexOfRunningStage);	

	// SET TITLE AND MESSAGE
	var title = project + "." + workflow + " is running";
	var message = "Are you sure you want to stop it?";

	// SHOW THE DIALOG
	this.loadConfirmDialog(title, message, yesCallback, noCallback);
},
confirmStartWorkflow : function (project, workflow, isRunning) {
	console.log("Status.confirmStartWorkflow    project: " + project);
	console.log("Status.confirmStartWorkflow    workflow: " + workflow);
	console.log("Status.confirmStartWorkflow    isRunning: " + isRunning);

	// EXIT IF STAGES ARE CURRENTLY RUNNING
	if ( isRunning )	{
		this.displayWorkflowStatus("cancelled start");
		return;
	}

	// ASK FOR CONFIRMATION TO STOP THE WORKFLOW
	var noCallback = function (){
		console.log("Status.startWorkflow    noCallback()");
	};
	var yesCallback = dojo.hitch(this, function()
		{
			console.log("Status.startWorkflow    yesCallback()");
			this.doStartWorkflow();
		}								
	);

	// SET TITLE AND MESSAGE
	var title = "Run " + project + "." + workflow + " from start to finish";
	var message = "Please confirm (click Yes to run)";

	// SHOW THE DIALOG
	this.loadConfirmDialog(title, message, yesCallback, noCallback);

},
confirmStopWorkflow : function (project, workflow, isRunning) {
	console.log("Status.confirmStopWorkflow    project: " + project);
	console.log("Status.confirmStopWorkflow    workflow: " + workflow);
	console.log("Status.confirmStopWorkflow    isRunning: " + isRunning);
	
	// EXIT IF NO STAGES ARE CURRENTLY RUNNING
	if ( ! isRunning )	{
		this.displayWorkflowStatus("cancelled stop");
		return;
	}
	
	// OTHERWISE, ASK FOR CONFIRMATION TO STOP THE WORKFLOW
	var noCallback = function (){
		console.log("Status.stopWorkflow    noCallback()");
	};
	var yesCallback = dojo.hitch(this, function()
		{
			console.log("Status.stopWorkflow    yesCallback()");
			this.doStopWorkflow();
		}								
	);
	
	// SET TITLE AND MESSAGE
	var title = "Stop workflow " + project + "." + workflow + "?";
	var message = "Please confirm (click Yes to run)";

	// SHOW THE DIALOG
	this.loadConfirmDialog(title, message, yesCallback, noCallback);
},
doPauseWorkflow : function () {
	console.log("Status.doPauseWorkflow    plugins.workflow.RunStatus.pauseWorkflow");
	this.pauseRun();	
},
doStartWorkflow : function () {
	console.log("Status.doStartWorkflow    plugins.workflow.RunStatus.startWorkflow");
	this.runner = this.core.runStatus.createRunner(1);	
	this.runWorkflow(this.runner);		
},
doStopWorkflow : function () {
	console.log("Status.doStopWorkflow    plugins.workflow.RunStatus.doStopWorkflow()");	
	var project		=	this.runner.project;
	var workflow	=	this.runner.workflow;
	var cluster		=	this.runner.cluster;
	var start		=	this.runner.start;

	var username = Agua.cookie('username');
	var sessionid = Agua.cookie('sessionid');

	// SET TIMER CSS 
	dojo.removeClass(this.toggle, 'pollingStopped');
	dojo.addClass(this.toggle, 'pollingStarted');

	// SET MESSAGE
	this.displayWorkflowStatus("stopping");

	// GET URL 
	var url = Agua.cgiUrl + "agua.cgi";
	console.log("Status.doStopWorkflow      url: " + url);		
	
	// GENERATE QUERY JSON FOR THIS WORKFLOW IN THIS PROJECT
	var query 			= 	new Object;
	query.username 		= 	username;
	query.sessionid 	= 	sessionid;
	query.project 		= 	project;
	query.workflow 		= 	workflow;
	query.cluster 		= 	username + "-" + cluster;
	query.mode 			= 	"stopWorkflow";
	query.module 		= 	"Agua::Workflow";
	query.start 		= 	start;
	console.log("Status.doStopWorkflow     query: " + dojo.toJson(query));
	
	var deferred = dojo.xhrPut(
		{
			url: url,
			putData: dojo.toJson(query),
			handleAs: "json",
			sync: false,
			load: function(response){
				Agua.toast(response);
			}
		}
	);
	
	// DO DELAYED SINGLE POLL WORKFLOW STATUS
	var singleton = true;
	var magicNumber = 2000;
	var selectTab = true;
	var thisObject = this;

	this.delayCountdownTimeout = setTimeout( function() {
			thisObject.queryStatus(thisObject.runner, singleton, selectTab);
		},
		magicNumber,
		this
	);

	this.deferreds.push(deferred);
},
stopRun : function () {
	// STOP POLLING
	console.log("Status.stopRun    DOING this.stopPolling()");
	this.stopPolling();

	if ( ! this.core.userWorkflows.dropTarget ) {
		console.log("workflow.RunStatus.stopRun    Returning because this.core.userWorkflows.dropTarget is null");
		return;
	}

	console.log("Status.stopRun      this.stageStatus: " + this.stageStatus);
	console.dir({stageStatus: this.stageStatus});

	if ( this.stageStatus == null
		|| this.stageStatus.rows == null
		|| this.stageStatus.rows.length == 0 )	return;

	// SET ROWS IN STAGE TABLE
	for ( var i = 0; i < this.stageStatus.rows; i++ )
	{
		var row  = this.stageStatus.rows[i];
		console.log("Status.stopRun    row.status " + i + ": " + row.status);
		if ( row.status == 'running' )
			row.status = "stopped";
	}

	// SET CSS IN STAGES dropTarget
	var stageNodes = this.core.userWorkflows.dropTarget.getAllNodes();
	for ( var i = 0; i < this.stageNodes; i++ )
	{
		var node = this.stageNodes[i];
		console.log("Status.stopRun    node " + i + ": " + node);
		if ( dojo.hasClass(node, 'running') )
		{
			dojo.removeClass(node, 'running');
			dojo.addClass(node, 'stopped');
		}
	}

	// SEND STOP SIGNAL TO SERVER
	this.stopWorkflow();	
},	
pauseRun : function () {
// STOP AT THE CURRENT STAGE. TO RESTART FROM  STAGE, HIT 'START' BUTTON
	// STOP POLLING
	console.log("Status.pauseRun      DOING this.stopPolling()");
	this.stopPolling();

	// SEND STOP SIGNAL TO SERVER
	this.stopWorkflow();	

	if ( this.response == null )	return;
	
	// SET THE NODE CLASSES BASED ON STATUS
	console.log("Status.pauseRun    Checking " + this.response.length  + " stage nodes");
	for ( var i = 0; i < this.response.length; i++ )
	{
		// SET this.runner.start TO FIRST RUNNING OR WAITING STAGE
		// SO THAT IF 'RUN' BUTTON IS HIT, WORKFLOW WILL RESTART FROM
		// THAT STAGE (I.E., IT WON'T START OVER FROM THE BE)
		if ( this.response[i].status == "completed" )	continue;
		this.runner.start = (startIndex + 1);

		dojo.removeClass(childNodes[i], 'waiting');
		dojo.removeClass(childNodes[i], 'running');
		dojo.removeClass(childNodes[i], 'completed');
		dojo.addClass(childNodes[i], 'waiting');
		break;
	}
},
// SETTERS
setStageStatus : function () {
	console.log("Status.setStageStatus    DOING new plugins.workflow.RunStatus.StageStatus()");
	this.stageStatus = new StageStatus({
		core		: this.core,
		attachPoint	: this.stagesStatusContainer
	});	
},
setClusterStatus : function () {
	console.log("Status.setClusterStatus    DOING new plugins.workflow.RunStatus.ClusterStatus()");
	this.clusterStatus = new ClusterStatus({
		core: this.core,
		attachPoint	: this.attachPoint
	});	
},
setQueueStatus : function () {
	console.log("Status.setQueueStatus    DOING new plugins.workflow.RunStatus.QueueStatus()");
	this.queueStatus = new QueueStatus({
		core: this.core,
		attachPoint	: this.attachPoint
	});	
},
selectParameters : function () {
	if ( this.attachPoint && this.attachPoint.selectChild ) {
		this.attachPoint.selectChild(this.core.parameters);
	}
},



// POLLING
clearCountdown : function () {
	if ( this.delayCountdownTimeout )
		clearTimeout(this.delayCountdownTimeout);
	this.pollCountdown.innerHTML = "";
},
delayCountdown : function (countdown, project, workflow) {
	//console.log("Status.delayCountdown    countdown: " + countdown);
	if ( countdown == 1 ) {
		// DOING POLL
		this.displayWorkflowStatus("loading...");
		this.displayActive();
	}
	
	countdown -= 1;
	//console.log("Status.delayCountdown    countdown: " + countdown);

	this.pollCountdown.innerHTML = countdown;
	if ( countdown < 1 )	return;
	
	var magicNumber = 850; // 1 sec. ADJUSTED FOR RUN DELAY
	var thisObject = this;
	this.delayCountdownTimeout = setTimeout( function() {
			thisObject.displayPolling();
			thisObject.delayCountdown(countdown, project, workflow);
		},
		magicNumber,
		this
	);
},
togglePoller : function () {
// START TIME IF STOPPED OR STOP IT IF ITS RUNNING 
	console.log("Status.togglePoller      plugins.workflow.RunStatus.togglePoller()");
	console.log("Status.togglePoller      this.polling: " + this.polling);

	if ( this.polling )
	{
		console.log("Status.togglePoller      Setting this.polling to FALSE and this.completed to FALSE");
		this.polling = false;
		this.completed = false;
		this.stopPolling();
	}
	else {
		console.log("Status.togglePoller      Setting this.polling to TRUE and this.completed to TRUE");
		this.polling = true;
		this.completed = true;
		if ( ! this.runner ) {
			this.runner = this.createRunner(1, null);
		}
		this.startPolling();
	}
},
displayActive : function () {
	console.log("Status.displayActive");
	dojo.removeClass(this.toggle, 'pollingStopped');
	dojo.removeClass(this.toggle, 'pollingStarted');
	dojo.addClass(this.toggle, 'pollingActive');
},
displayPolling : function () {
	//console.log("Status.displayPolling    caller: " + this.displayPolling.caller.nom);
	dojo.removeClass(this.toggle, 'pollingStopped');
	dojo.removeClass(this.toggle, 'pollingActive');
	dojo.addClass(this.toggle, 'pollingStarted');
},
displayNotPolling : function () {
	console.log("Status.displayStarted");
	dojo.removeClass(this.toggle, 'pollingStarted');
	dojo.removeClass(this.toggle, 'pollingActive');
	dojo.addClass(this.toggle, 'pollingStopped');
},
stopPolling : function () {
// STOP POLLING THE SERVER FOR RUN STATUS
	console.log("Status.stopPolling      plugins.workflow.RunStatus.stopPolling()");

	console.log("Status.stopPolling      Setting this.polling to FALSE");
	this.polling = false;

	// CLEAR COUNTDOWN
	this.clearCountdown();
	this.clearDeferreds();
	
	// UPDATE DISPLAY
	this.displayNotPolling();
},
startPolling : function () {
// RESTART POLLING THE SERVER FOR RUN STATUS
	console.log("Status.startPolling      plugins.workflow.RunStatus.startPolling()");
	console.log("Status.startPolling      this.polling: " + this.polling);
	console.log("Status.togglePoller      Setting this.polling to FALSE (ahead of check this.polling in getStatus)");
    this.polling = false;

	if ( ! this.runner ) {
		console.log("Status.startPolling      this.runner is null. Returning");
		this.polling = false;
		return;
	}

	// UPDATE DISPLAY
	this.displayPolling();

	console.log("Status.togglePoller      Doing this.getStatus(null, false)");
	this.getStatus(null, false);
}

}); //	end declare

});	//	end define



/* DISPLAY STATUS INFORMATION FOR WORKFLOW AND CLUSTER

	//INPUT DATA FORMAT:
	//
	//{
	//	stagestatus 	=> 	{
	//		project		=>	String,
	//		workflow	=>	String,
	//		stages		=>	HashArray,
	//		status		=>	String
	//	},
	//	clusterstatus	=>	{
	//		project		=>	String,
	//		workflow	=>	String,
	//		list		=>	String,
	//		log			=> 	String,
	//		status		=>	String
	//	},
	//	queuestatus		=>	{
	//		queue		=>	String,
	//		status		=>	String			
	//	}
	//}

*/
