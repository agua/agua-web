console.log("Loading plugins.dnd.Target");


define([
	"dojo/_base/declare",
	"dojo/dnd/Target",
	"plugins/workflow/StageRow"
],

function (
	declare,
	Target,
	StageRow
) {

/////}}}}}

return declare([
	Target
], {

// contextMenu: dijit.Menu OBJECT. CONTEXT MENU FOR ALL NODES
contextMenu : null,

// parentWidget: plugins.workflow.Workflows OBJECT.	
parentWidget : null,

// droppingApp : string
// Flag to prevent multiple drops
droppingApp : null,

// dragType: array
// List of permitted dragged items allowed to be dropped
dragTypes : ["draggableItem"],

/////}}}

constructor: function(node, params) {
	console.log("Target.constructor    params: " + params);
	console.log("Target.constructor    params.contextMenu: " + params.contextMenu);
	console.log("Target.constructor    params.this.parentWidget: " + params.parentWidget);

	console.log("Target.constructor    DOING this.setId()");
	this.setId();
	console.dir({this:this});
	
	this.contextMenu = params.contextMenu;
	this.parentWidget = params.parentWidget;
	this.core = params.core;
	if ( params && params.dragTypes )
		this.dragTypes = params.dragTypes
	
	// summary:
	//		a constructor of the Target --- see the `dojo.dnd.Source.constructor` for details
	this.isSource = false;
	dojo.removeClass(this.node, "dojoDndSource");
},

setId : function () {
	if ( this.id ) {
		console.log("dnd.Target.setId    Returning existing this.id: " + this.id);
		return this.id;
	}
	this.id 	= 	dijit.registry.getUniqueId(this.declaredClass);
	this.id 	= 	this.id.replace(/(\/|\.)/g, '-');
	
	console.log("dnd.Target.setId    this.id: " + this.id);
	console.log("dnd.Target.setId    registry: ");
	console.dir({dijit_registry:dijit.registry});
	dijit.registry.add(this);
	
	return this.id;
},

resetDropping : function () {
// RESET this.droppingApp TO FALSE
	this.droppingApp = false;
},

onDndDrop : function(source, nodes, copy) {
// USE dojo.connect TO ADD EVENT TO NEW ITEM
// NB: DROPPED NODES MUST HAVE AN application SLOT

	// RETURN IF DROP FLAG IS SET
	console.log("Target.onDndDrop    XXXXXXXXXXXXXXXXXXXXXXXX this.droppingApp: " + this.droppingApp);
	console.log("Target.onDndDrop    source: " + source);
	console.dir({source:source});
	console.log("Target.onDndDrop    nodes: " + nodes);
	console.dir({nodes:nodes});

	var acceptance = this.checkAcceptance(source, nodes);
	console.log("Target.onDndDrop    XXXXXXXXXXXXXXXXXXXXXXXX acceptance: " + acceptance);
	if ( ! acceptance ) {
		console.log("Target.onDndDrop    acceptance is FALSE. Returning");
		return;
	}
	
	if ( ! this.accept || this.accept.length < 1 ) {
		console.log("Target.onDndDrop    this.accept is empty. Returning");
		return;
	}
	
	if ( this.droppingApp ) {
		console.log("Target.onDndDrop    this.droppingApp is true. Returning");
		return;
	}
	else {
		this.droppingApp = true;
	}

	// SET DROP FLAG
	console.log("Target.onDndDrop    Set this.droppingApp: " + this.droppingApp);
	console.log("Target.onDndDrop    this: " + this);
	console.log("Target.onDndDrop    source: ");
	console.dir({source:source});

	var thisObject = this;

	// SANITY
	if ( nodes[0].data == null )	return;
	
	// summary: topic event processor for /dnd/drop,
	// called to finish the DnD operation break box
	var newNode;
	do
	{ 
		if ( this.containerState != "Over" ) {
			break;
		}

		var oldCreator = this._normalizedCreator;

		// transferring nodes from the source to the target
		if ( this != source ) {
			// CLONE THE DROPPED NODE AND ADD THE
			// CLONE TO THE DROP TARGET
			this._normalizedCreator = function(node, hint) {
				var t = source.getItem(node.id);
				var n = node.cloneNode(true);
				n.parentWidget = node.parentWidget;
				n.id = dojo.dnd.getUniqueId();
				return {node: n, data: t.data, type: t.type};
			};
		}  
		
		// CLEAN UP - REMOVE SELECTION AND ANCHOR STYLE
		this._removeSelection();
		if ( this != source ) {
			this._removeAnchor();
		}

		if ( this != source && !copy && !this.creator ) {
			source.selectNone();
		}

		// INSERT DROPPED NODE INTO DROP TARGET
		this.insertNodes(true, nodes, this.before, this.current);
		this.sync();

		// COMPLETE THE NODE COPY:
		//
		// 1. TRANSFER THE METADATA FROM THE DROPPED NODE TO
		// THE CLONED NODE.
		// 
		// 2. INCREMENT BY ONE THE number OF THE NODES AFTER
		// THE INSERTION POINT OF THE NEW NODE.
		var belowInsertedNode = false;
		var allNodes = this.getAllNodes();
		console.log("Target.onDndDrop    allNodes: " + allNodes);
		console.log("Target.onDndDrop    allNodes.length: " + allNodes.length);

		dojo.forEach(allNodes, function(node, i) {
			if ( node.application == null ) {
				// CLONE THIS OTHERWISE GET AN INTERESTING ERROR
				// WHEN DUPLICATE COPIES OF THE SAME APPLICATION
				// ARE DROPPED (SHARING THE SAME application OBJECT)

				var application = dojo.clone(nodes[0].data)
				console.log("Target.onDndDrop    application: " + dojo.toJson(application));
				console.dir({application:application});

				node.application = application;
				console.log("Target.onDndDrop    Setting node.application: ");
				console.dir({node_application:node.application});

				// ADD appname TO APPLICATION
				node.application.appname = node.application.name;
				
				// ADD NUMBER TO APPLICATION
				// CAST number TO STRING FOR LATER SORTING
				node.application.appnumber = (i + 1).toString();
				node.application.number = (i + 1).toString();
				node.number = (i + 1).toString();

				// SET DEFAULT CLUSTER IS EMPTY
				if ( node.application["cluster"] == null )	node.application["cluster"] = '';
				
				// ADD PROJECT AND WORKFLOW TO node's APPLICATION
				var project = thisObject.core.userWorkflows.getProject();
				var workflow = thisObject.core.userWorkflows.getWorkflow();
				node.application.project = project;
				node.application.workflow = workflow;
				
				// SET WORKFLOWNUMBER
				var workflowobject = Agua._getWorkflow({name:workflow,project:project});
				console.log("Target.onDndDrop    workflowobject: ");
				console.dir({workflowobject:workflowobject});
				var workflownumber = workflowobject.number;
				console.log("Target.onDndDrop    workflownumber: " + workflownumber);
				node.application.workflownumber = dojo.clone(workflownumber);
				
				// SET USERNAME
				node.application.username = Agua.cookie('username');
				console.log("Target.onDndDrop    node.application: ");
				console.dir({application:node.application});
				
				// INSTANTIATE SOURCE ROW 
				var args = node.application;
				var stageRow = new StageRow(node.application);
				console.log("Target.onDndDrop    stageRow: " + stageRow);
				console.log("Target.onDndDrop    stageRow.domNode: " + stageRow.domNode);
				console.log("Target.onDndDrop    stageRow.application: " + dojo.toJson(stageRow.application));

				// SET CORE WORKFLOW OBJECTS
				stageRow.core = thisObject.core;
	
				// ADD WORKFLOW WIDGET
				stageRow.workflowWidget = thisObject.core.userWorkflows.parentWidget;
	
				// CLEAR NODE CONTENT
				node.innerHTML = '';
	
				// APPEND stageRow WIDGET TO NODE
				node.appendChild(stageRow.domNode);
				
				// ADD CONTEXT MENU TO NODE
				thisObject.contextMenu.bind(node);

				// SET stageRow AS node.parentWidget ATTRIBUTE FOR ACCESS LATER:
				// --- (ALSO ADDED this.name.parentWidget = this IN StageRow.startup())
				//
				// 1. WHEN CALLING Workflow.loadParametersPane SO THAT THE CORRECT
				// StageRow HAS ITS validInputs SET ACCORDING TO THE OUTCOME
				// OF Workflow.loadParametersPane
				//
				// 2. FOR RESETTING OF number ON REMOVAL OR INSERTION OF NODES
				//
				// REM: remove ONCLICK BUBBLES ON stageRow.name NODE RATHER THAN ON node. 
				// I.E., CONTRARY TO DESIRED, thisObject.name IS THE TARGET INSTEAD OF THE node.
				node.parentWidget = stageRow;

				//NB: NOT THIS: node.parentWidget = dojo.clone(nodes[0].parentWidget);
				console.log("Target.onDndDrop    node.id: " + node.id);
				console.log("Target.onDndDrop    Set node.parentWidget: " + node.parentWidget);	

				// INSERT STAGE INTO thisObject.stage AND ITS STAGE PARAMETERS
				// INTO Agua.stages AND Agua.stageparameters
				console.log("Target.onDndDrop    BEFORE    Agua.insertStage(node.application)");
			
				// SET THE APPLICATION.NUMBER AND .APPNUMBER FOR EACH NODE AND ITS WIDGET
				//var thisObject 	=	this;
				//setTimeout(function() {
				console.log("Target.onDndDrop    Doing thisObject.core.userWorkflows.resetNumbers()");
				thisObject.core.userWorkflows.resetNumbers();
			
				// SET INFO PANE FOR DROPPED NODE
				console.log("Target.onDndDrop    BEFORE thisObject.core.userWorkflows.loadParametersPane(application)");
				console.dir({application:application});
			
				// ADD ONCLICK TO LOAD APPLICATION INFO
				node.onclick = function(e) {
					console.group("Target-" + thisObject.id + "    onDndDrop    node.onclick");

					console.log("Target.onDndDrop    node.onclick    application:");
					console.dir({application:application});

					console.log("Target.onDndDrop    node.onclick    DOING thisObject.core.userWorkflows.loadParametersPane(application)");

					thisObject.core.parameters.load(application);

					console.groupEnd("Target-" + thisObject.id + "    onDndDrop    node.onclick");
				}

				this.node		=	node;

				// SEND QUERY
				var query = new Object;
				query.username		=	Agua.cookie("username");
				query.sessionid		=	Agua.cookie("sessionid");
				query.mode 			= 	"insertStage";
				query.module 		= 	"Agua::Workflow";
				query.sourceid 		= 	thisObject.id;
				query.callback		=	"handleDrop",
				query.data			=	node.application;
				console.log("Target.onDndDrop    query: ");
				console.dir({query:query});
			
				console.log("Target.onDndDrop    DOING Agua.exchange.send(query)");
				Agua.exchange.send(query);
				return;
			}
		});

		// UNSET droppingApp FLAG
		console.log("Target.onDndDrop    BEFORE thisObject.droppingApp = false");
		console.log("Target.onDndDrop    thisObject.core.userWorkflows: " + thisObject.core.userWorkflows);
		thisObject.droppingApp = false;

		thisObject._normalizedCreator = oldCreator;
	}
	while(false);
	// end of 'do'

// ******************* DISABLE BELOW FOR DEBUGGING ***********************
// ******************* DISABLE BELOW FOR DEBUGGING ***********************
	console.log("Target.onDndDrop    BEFORE this.onDndCancel");
	this.onDndCancel();

	console.log("Target.onDndDrop    END OF this.onDndCancel");
},	// OVERRIDE onDndDrop TO USE dojo.connect TO ADD EVENT TO NEW ITEM

handleDrop : function (response) {
	console.log("Target.handleDrop    response: ");
	console.dir({response:response});

	var data 	=	response.data;
	console.log("Target.handleDrop    data: ");
	console.dir({data:data});
	
	var node	=	this.node;
	console.log("Target.handleDrop    node: ");
	console.dir({node:node});
	
	if ( response.error && response.error != '' ) {
		console.log("Target.handleDrop    Failed to add stage to Agua data");
		// UNSET droppingApp FLAG
		console.log("Target.handleDrop    Setting this.droppingApp to false and returning");
		//this.droppingApp = false;
		setTimeout(this.resetDropping, 1000);
		return;
	}

	console.log("Target.handleDrop    BEFORE    Agua.insertStage(data)");
	Agua.insertStage(data);
	console.log("Target.handleDrop    AFTER    Agua.insertStage(data)");

	// ADD CONTEXT MENU
	this.contextMenu.bind(node);
	
	// SET THE DEFAULT CHAINED VALUES FOR INPUTS AND OUTPUTS FOR THE
	// APPLICATION BASED ON THOSE OF THE PREVIOUS APPLICATIONS
	this.core.userWorkflows.getChainedValues(node);

	// SET belowInsertedNode FLAG TO TRUE
	belowInsertedNode = true;
	
	// UNSET droppingApp FLAG
	console.log("Target.handleDrop    Setting this.droppingApp = false");
	this.droppingApp = false;

	// CHAIN STAGE
	console.log("Target.handleDrop    this.core.userWorkflows: " + this.core.userWorkflows);
	var force = true;
	console.log("Target.handleDrop    BEFORE this.core.io.chainStage(data, force)");
	this.core.io.chainStage(data, force);	

	this.core.userWorkflows.loadParametersPane(data);
}


});
});
