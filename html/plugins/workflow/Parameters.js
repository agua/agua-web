console.log("Loading plugins.workflow.Parameters");

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common",
	"plugins/form/UploadDialog",
	"plugins/workflow/ParameterRow",

	"dijit/TitlePane"
],

function (
	declare,
	lang,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common,
	UploadDialog,
	ParameterRow
) {

/////}}}}}

/////}}}}}}}}

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common
], {

/////}}}}}}}}

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/templates/parameters.html"),

// OR USE @import IN HTML TEMPLATE
cssFiles : [
	require.toUrl("plugins/workflow/css/parameters.css")
],

// PARENT WIDGET
parentWidget : null,

// ARRAY OF CHILD WIDGETS
childWidgets : null,

// isVALID BOOLEAN: ALL PARAMETERS ARE VALID
isValid : null,
// CORE WORKFLOW OBJECTS
core : null,

/////}}}}}}}}

constructor : function(args) {
	console.log("Parameters.constructor     plugins.workflow.Parameters.constructor");			
	this.core = args.core;

	// LOAD CSS
	this.loadCSS();		
},
postCreate : function() {
	//////console.log("Controller.postCreate    plugins.workflow.Controller.postCreate()");

	this.startup();
},
startup : function () {
// DO inherited, LOAD ARGUMENTS AND ATTACH THE MAIN TAB TO THE ATTACH NODE
	console.log("Parameters.startup    plugins.workflow.Parameters.startup()");

	// COMPLETE CONSTRUCTION OF OBJECT
	this.inherited(arguments);	 

	console.log("Parameters.startup    this.application: " + this.application);
	console.log("Parameters.startup    this.attachPoint: " + this.attachPoint);

	this.setUploader();

	// ADD TO TAB CONTAINER		
	console.log("Parameters.startup    DOING this.attachPane");
	this.attachPane();
},
setUploader : function () {

	var uploaderId = dijit.getUniqueId("plugins_form_Uploader");
	console.log("Parameters.setUploader     uploaderId: " + uploaderId);
	var username = Agua.cookie('username');
	var sessionid = Agua.cookie('sessionid');

	console.log("Parameters.setUploader     BEFORE new UploadDialog()");
	this.uploader = new UploadDialog({
		uploaderId: uploaderId,
		username: 	username,
		sessionid: 	sessionid
	});
	console.log("Parameters.setUploader     AFTER new UploadDialog()");
},
clear : function () {
	console.log("Parameters.clear    plugins.workflow.Parameters.clear()");
	this.mainTab.style.visibility = "hidden";	

	this.appNameNode.innerHTML = '';

	while ( this["inputRows"].firstChild ) {
		this["inputRows"].removeChild(this["inputRows"].firstChild);
	}
	while ( this["outputRows"].firstChild ) {
		this["outputRows"].removeChild(this["outputRows"].firstChild);
	}
},

resetChainedOutputs : function (chainedOutputs) {
	//console.log("xxx Parameters.resetChainedOutputs    chainedOutputs.length: " + chainedOutputs.length);
	//console.log("Parameters.resetChainedOutputs    this.childWidgets.length: " + this.childWidgets.length);

	var thisObject = this;
	dojo.forEach(chainedOutputs, function(chainedOutput, i) {
		//console.log("Parameters.resetChainedOutputs    chainedOutput " + i + ": " + chainedOutputs[i]);
		if ( chainedOutput == null )
		{
			//console.log("Parameters.resetChainedOutputs    chainedOutput is null. NEXT");
			return;
		}
        var chainedValue = chainedOutput.value;
		//console.log("Parameters.resetChainedOutputs    chainedValue " + i + ": " + chainedValue);
		thisObject.setOutputValue(chainedValue)
	});
},
setOutputValue : function (chainedValue) {
	//console.log("Parameters.setOutputValue    chainedValue: " + chainedValue);
	//console.log("Parameters.setOutputValue    this.childWidgets.length: " + this.childWidgets.length);
	//console.log("Parameters.setOutputValue    //console.dir(this): " + this.childWidgets.length);

	var thisObject = this;
	dojo.forEach(thisObject.childWidgets, function(parameterRow, j) { 
		//console.log("Parameters.setOutputValue    parameterRow" + j + " '" + parameterRow.name + "'" + "[" + parameterRow.paramtype + "]: " + parameterRow.value);
		if ( parameterRow.paramtype == "input" )    return;
//console.log("HERE");
		if ( chainedValue == null || chainedValue == '')   return;
		if ( chainedValue != parameterRow.value )
		{
			//console.log("Parameters.setOutputValue    Setting parameterRow.value: " + chainedValue);
			parameterRow.value = chainedValue;
			parameterRow.valueNode.innerHTML = chainedValue;
			return;
		}
    });
},
load : function (stageHash, shared, force) {
// LOAD APPLICATION DATA INTO INPUT AND OUTPUT TITLE PANES

	console.group("Parameters-" + this.id + "    load");
	console.log("Parameters.load    caller: " + this.load.caller.nom);
	console.log("Parameters.load    stageHash: " + stageHash);
	console.dir({stageHash:stageHash});

	this.application = stageHash;

//	console.log("Parameters.load    shared: " + shared);
//	console.log("Parameters.load    force: " + force);
//	console.log("Parameters.load    node.parentWidget: " + node.parentWidget);
//	console.log("Parameters.load    node.stageRow: " + node.stageRow);
//
//	console.log("Parameters.load    PASSED node.application:");
//	console.dir({node_application:node.application});	
//
//	// SET DEFAULT force = FALSE
//	if ( force == null)	force = false;
//
//	// SET this.shared
//	this.shared = shared;
//
//	// SET this.parentNode
//	this.parentNode = node;
//	this.parentWidget = node.parentWidget;
//	console.log("Parameters.load    this.parentWidget: " + this.parentWidget);
//
//	// SET this.stageRow
//	if ( node.stageRow ) this.stageRow = node.stageRow;
//	else this.stageRow = node.parentWidget;
//	if ( this.stageRow == null && node.childNodes ) {
//		this.stageRow = dijit.byNode(node.childNodes[0]);
//	}
//	console.log("Parameters.load    node.stageRow: " + node.stageRow);
//	console.log("Parameters.load    node.parentWidget: " + node.parentWidget);
//	console.log("Parameters.load    node.childNodes[0]: " + node.childNodes[0]);
//	console.log("Parameters.load    this.stageRow: " + this.stageRow);
//	console.log("Parameters.load    dijit.getEnclosingWidget(node.childNodes[0]: " + dijit.getEnclosingWidget(node.childNodes[0]));
//
//	// SET this.application
//	this.application = node.application;
//	if ( node.application == null ) {
//		console.log("Parameters.load     node.application is null. Using node.parentWidget.application");
//		this.application = node.parentWidget.application;
//	}
//
//	console.log("Parameters.load    AFTER node.application:");
//	console.dir({node_application:node.application});
//	//
//	console.log("Parameters.load     this.application: " + dojo.toJson(this.application, true));
//	console.log("Parameters.load     console.dir(this):");
//	console.dir(this);
//	console.log("Parameters.load     this.childWidgets: " + this.childWidgets);
////

	// CLEAR STATUS PANE
	this.clearStatus();
	
	// SET PROJECT.WORKFLOW NAME
	this.workflowNameNode.innerHTML = stageHash.project + ". " + stageHash.workflow;	
	
	// SET APPLICATION NAME AND NUMBER
	this.appNameNode.innerHTML = stageHash.number + ". " + stageHash.name;

	// LOAD INPUT TITLE PANE
	console.log("Parameters.load     BEFORE this.loadTitlePane(****************** input ******************)");
	this.loadTitlePane("input");

	// LOAD OUTPUT TITLE PANE
	console.log("Parameters.load     BEFORE this.loadTitlePane(****************** output ******************)");
	this.loadTitlePane("output");

	
	// SELECT THIS TAB PANE
	if ( this.attachPoint.selectChild ) {
		this.attachPoint.selectChild(this.mainTab);
	}


//// LATER: USE STAGE NUMBER TO FIND stageRow AND RUN checkValidParameters
//	
//	// CALL StageRow.checkValidParameters TO CHECK THAT ALL
//	// REQUIRED PARAMETER INPUTS ARE SATISFIED
//	var stageRow = node.parentWidget;
//	console.log("Parameters.load     stageRow: " + stageRow);
//	console.dir({stageRow:stageRow});
//	console.log("Parameters.load     node: " + node);
//	console.dir(node);
//	
//	// DON'T IGNORE STORED Agua.getParameterValidity DATA
//	// USE THE UPDATED Agua.getParameterValidity DATA TO SET CSS 
//	// CLASSES OF PARAMETER ROWS
//	console.log("Parameters.load     BEFORE stageRow.checkValidParameters()");
//	if ( ! shared )
//		stageRow.checkValidParameters(force);
//	console.log("Parameters.load     AFTER stageRow.checkValidParameters()");
//
//	//////// USE THE UPDATED Agua.getParameterValidity DATA TO SET CSS 
//	//////// CLASSES OF PARAMETER ROWS
//	////////this.setParameterRowStyles();

	console.groupEnd("Parameters-" + this.id + "    load");
},
clearStatus : function () {
	console.log("Parameters.clearStatus");
	// INITIALISE this.childWidgets
	if ( this.childWidgets == null ) this.childWidgets = new Array;

	// DESTROY ANY EXISTING ParameterRow CHILD WIDGETS
	while ( this.childWidgets.length > 0 ) {
		var widget = this.childWidgets.splice(0,1)[0];
		if ( widget.destroy )	widget.destroy();
	}
},
setParameterRowStyles : function () {
	console.group("Parameters-" + this.id + "    setParameterRowStyles");
	console.log("Parameters.setParameterRowStyles    caller: " + this.setParameterRowStyles.caller.nom);
	
	console.log("Parameters.setParameterRowStyles     this:");
	console.dir({this:this});

	var parameterRows = this.childWidgets;
	console.log("Parameters.setParameterRowStyles     parameterRows:");
	console.dir({parameterRows:parameterRows});

	var parameterHash = new Object;
	for ( var i = 0; i < parameterRows.length; i++ ) {
		//console.log("Parameters.setParameterRowStyles     parameterRows[" + i + "]: "+ parameterRows[i]);
		////console.log("Parameters.setParameterRowStyles     " + parameterRows[i].name + ", parameterRows[" + i + "].paramtype: " + parameterRows[i].paramtype);
		if ( parameterRows[i].paramtype == "input" ) 
			parameterHash[parameterRows[i].name] = parameterRows[i];
	}
	console.log("Parameters.setParameterRowStyles     parameterHash:");
	console.dir({parameterHash:parameterHash});

	//////console.log("Parameters.setParameterRowStyles     this.application: " + dojo.toJson(this.application, true));
	var stageParameters = Agua.getStageParameters(this.application);
	//////console.log("Parameters.setParameterRowStyles     stageParameters: " + dojo.toJson(stageParameters, true));
	////console.log("Parameters.setParameterRowStyles     stageParameters.length: " + stageParameters.length);
	for ( var i = 0; i < stageParameters.length; i++ )
	{
		if ( stageParameters[i].paramtype != "input" ) continue;

		var parameterRow = parameterHash[stageParameters[i].name];
		//console.log("Parameters.setParameterRowStyles    stageParameters[i] " + stageParameters[i].name + " (paramtype: " + stageParameters[i].paramtype + ") parameterRow: " + parameterRow);

		var isValid = Agua.getParameterValidity(stageParameters[i]);
		////console.log("Parameters.setParameterRowStyles     stageParameters[" + i + "] '" + stageParameters[i].name + "' isValid: " + isValid);
		if ( isValid == true || isValid == null )
		{
			////console.log("Parameters.setParameterRowStyles     Doing parameterRows[" + i +  "].setValid()");
			parameterRow.setValid(parameterRow.domNode);
		}
		else
		{
			parameterRow.setInvalid(parameterRow.domNode);
		}
	}	

	console.groupEnd("Parameters-" + this.id + "    setParameterRowStyles");
},
loadTitlePane : function (paneType, shared) {
	console.group("Parameters-" + this.id + "    loadTitlePane");
	console.log("Parameters.loadTitlePane    plugins.workflow.Parameters.loadTitlePane(paneType)");
	console.log("Parameters.loadTitlePane    paneType: " + paneType);
	console.log("Parameters.loadTitlePane    this.shared: " + this.shared);

	var paneRows = paneType + "Rows";

	// CLEAR PANE
	console.log("Parameters.loadTitlePane    BEFORE clear()");
	while ( this[paneRows].firstChild )
		this[paneRows].removeChild(this[paneRows].firstChild);
	console.log("Parameters.loadTitlePane    AFTER clear()");

	console.log("Parameters.loadTitlePane    this.application:");
	console.dir({this_application:this.application});
	
	var stageObject = dojo.clone(this.application);

	//if ( paneType == "input" ) {
	//	console.log("Parameters.loadTitlePane    DOING this.addSubmit()");
	//	this.addSubmit(dojo.clone(stageObject), paneRows);
	//}
	//console.log("Parameters.loadTitlePane    AFTER MAYBE this.addSubmit()");

	// GET OUTPUTS FROM Agua.stageparameters	
	var parameters;
	if ( this.shared == true ) {
		console.log("Parameters.loadTitlePane     DOING parameters = Agua.getSharedStageParameters(stageObject)");
		parameters = Agua.getSharedStageParameters(stageObject);
	}
	else {
		console.log("Parameters.loadTitlePane     DOING parameters = Agua.getStageParameters(stageObject)");
		parameters = Agua.getStageParameters(stageObject);
	}
    console.log("Parameters.loadTitlePane    parameters:");
    console.dir({parameters:parameters});

	//// DEBUG
	//stageParameters = Agua._getStageParameters();
	//console.log("Parameters.loadTitlePane    MIDDLE stageParameters.length:" + stageParameters.length);
	//console.log("Parameters.loadTitlePane    BEFORE filter parameters:" + dojo.toJson(parameters));
	//console.log("Parameters.loadTitlePane    BEFORE filter, parameters.length:" + parameters.length);
	console.log("Parameters.loadTitlePane    filter by paramtype:" + paneType);
	parameters = this.filterByKeyValues(parameters, ["paramtype"], [paneType]);
	parameters = this.sortHasharrayByKeys(parameters, ["ordinal","name"]);
	console.log("Parameters.loadTitlePane    AFTER filter, parameters.length:" + parameters.length);

	if ( parameters == null ) {
		console.log("Parameters.loadTitlePane     parameters == null. Returning.");
		return;
	}
	
	for ( var i = 0; i < parameters.length; i++ ) {
		console.log("Parameters.loadTitlePane    loading parameter " + i + ": " + dojo.toJson(parameters[i]));

		// SET parameter KEY:VALUE PAIRS
		var parameter = new Object;
		for ( var key in parameters[i] ) {
			// CONVERT '\\\\' INTO '\\'
			if ( parameters[i] && parameters[i][key] && parameters[i][key].replace )
			//if ( parameters[i][key].replace )
				parameter[key] = parameters[i][key].replace(/\\\\/g, '\\');
			else
				parameter[key] = parameters[i][key];
		}
		console.log("Parameters.loadTitlePane    parameter: ");
		console.dir({parameter:parameter});
		
		// CONVERT PROJECT AND WORKFLOW VALUES
		var username = Agua.cookie('username');
		if ( parameter.value == null ){
			parameter.value = '';
		}
		else {
			parameter.value = String(parameter.value);
			parameter.value = parameter.value.replace(/%username%/, username);
			parameter.value = parameter.value.replace(/%project%/, parameter.project);
			parameter.value = parameter.value.replace(/%workflow%/, parameter.workflow);
			parameter.value = parameter.value.replace(/%username%/, Agua.cookie('username'));
		}

		// ADD CORE LIST
		parameter.core = this.core;
		parameter.uploader = this.uploader;
		
		// INSTANTIATE plugins.workflow.ParameterRow
		console.log("Parameters.loadTitlePane    Doing new ParameterRow(parameter)");
		var parameterRow = new ParameterRow(parameter);
		console.log("Parameters.loadTitlePane    parameterRow: " + parameterRow);
		
		this[paneRows].appendChild(parameterRow.domNode);
		console.log("Parameters.loadTitlePane    AFTER new ParameterRow(parameter)");

		// PUSH ONTO ARRAY OF CHILD WIDGETS
		this.childWidgets.push(parameterRow);
	}	

	console.groupEnd("Parameters-" + this.id + "    loadTitlePane");
},
setStageSubmitStyle : function (stageRow, submit) {
	console.group("Parameters-" + this.id + "    setStageSubmitStyle")
	console.group("Parameters.setStageSubmitStyle     stageRow: " + stageRow)
	console.dir({stageRow:stageRow});
	console.group("Parameters.setStageSubmitStyle     submit: " + submit)

	stageRow.setSubmitStyle(submit);

	console.groupEnd("Parameters-" + this.id + "    setStageSubmitStyle")
},
checkValidInputs : function () {
/* 	1. CHECK VALIDITY OF ALL PARAMETERS, STORE AS this.isValid
	2. CHANGE StageRow Style ACCORDINGLY	SET stageRow.isValid
	3. stageRow CALLS Stages.updateRunButton AND TOGGLES runWorkflow BUTTON
*/

	//////console.log("Parameters.checkValidInputs     this: " + this);
	//////console.log("Parameters.checkValidInputs     this.childWidgets.length: " + this.childWidgets.length);

	this.isValid = true;
	for ( var i = 0; i < this.childWidgets.length; i++ )
	{
		if ( this.childWidgets[i].paramtype != "input" )	continue;
		//////console.log("Parameters.checkValidInputs     this.childWidgets[" + i + "] '" + this.childWidgets[i].name + "' * " + this.childWidgets[i].value + " * validInput: " + this.childWidgets[i].validInput);

		if ( this.childWidgets[i].validInput == false )
		{
			//////console.log("Parameters.checkValidInputs     Setting this.isValid to false");
			this.isValid = false;
		
			break;
		}
	}	
	//////console.log("Parameters.checkValidInputs     this.isValid: " + this.isValid);

	// CALL StageRow.checkValidParameters TO CHECK THAT ALL
	// REQUIRED PARAMETER INPUTS ARE SATISFIED
	var stageRow = this.stageRow;
	//////console.log("Parameters.load     stageRow: " + stageRow);
	//////console.log("Parameters.load     Calling stageRow.checkValidParameters()");
	if ( this.stageRow == null )	return;
	
	//////console.log("Parameters.checkValidInputs     FINAL this.isValid: " + this.isValid);
	if ( this.isValid == true ) this.stageRow.setValid();
	else this.stageRow.setInvalid();
},
isCurrentApplication : function (application) {
// RETURN true IF THE application IS IDENTICAL TO THE CURRENT APPLICATION
	var keys = ["project", "workflow", "workflownumber", "name", "number"];
	return ( this._objectsMatchByKey(application,
		this.core.parameters.application, keys) );
}


}); //	end declare

});	//	end define


//addSubmit : function (stageObject, paneRows) {
//	console.group("Parameters-" + this.id + "    addSubmit")
//	console.log("Parameters.addSubmit    workflow.Parameters.addSubmit(stageObject, paneRows)");
//	console.dir({stageObject:stageObject});
//	var stageRow = this.stageRow;
//	console.log("Parameters.addSubmit    stageRow: " + stageRow);
//	console.dir({stageRow:stageRow});
//	console.dir({thisApplication:this.application});
//	console.log("Parameters.addSubmit    paneRows.length: " + paneRows.length);
//	
//	var submitParameter = stageObject;
//	submitParameter.description = "Submit this stage to the cluster (if cluster is defined)"
//	submitParameter.discretion = "optional";
//	submitParameter.name = "SUBMIT"
//	submitParameter.value = this.application.submit;
//	submitParameter.paramtype = "input";
//	submitParameter.valuetype = "flag";
//	if ( ! submitParameter.value )	submitParameter.value = '';
//	console.dir({submitParameter:submitParameter});
//
//	var parameterRow = new ParameterRow(submitParameter);
//
//	var thisObject = this;
//	parameterRow.handleCheckboxOnChange = dojo.hitch(thisObject, function (event) {
//		console.log("Parameters.addSubmit    ParameterRow.handleCheckboxOnChange    event.target: " + event.target);
//		console.log("Parameters.addSubmit    ParameterRow.handleCheckboxOnChange    event.target.checked: " + dojo.toJson(event.target.checked));
//		event.stopPropagation(); 
//		console.log("Parameters.addSubmit    ParameterRow.handleCheckboxOnChange    Doing thisObject.updateSubmit()");
//		stageObject.submit = 0;
//		if ( event.target.checked == true )
//			stageObject.submit = 1;
//		console.log("Parameters.addSubmit    ParameterRow.handleCheckboxOnChange    stageObject.submit: " + stageObject.submit);
//
//		this.application.submit = stageObject.submit;
//		console.log("Parameters.addSubmit    this:");
//
//		console.log("Parameters.addSubmit    DOING Agua.updateStageSubmit(stageObject)");
// 
//		this.setStageSubmitStyle(stageRow, stageObject.submit);
//
//		Agua.updateStageSubmit(stageObject)
//	
//	});
//
//	this[paneRows].appendChild(parameterRow.domNode);
//
//	console.groupEnd("Parameters-" + this.id + "    addSubmit")
//},
