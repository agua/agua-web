/* PROVIDE A POPUP CONTEXT MENU AND IMPLEMENT ITS ONCLICK FUNCTIONS

	KEYBOARD SHORTCUTS:
	
		Open a context menu	On Windows: shift-f10 or the Windows context menu key On Firefox on the Macintosh: ctrl-space. On Safari 4 on Mac: VO+shift+m (VO is usually control+opton)
		Navigate menu items	Up and down arrow keys
		Activate a menu item	Spacebar or enter
		Open a submenu	Spacebar, enter, or right arrow
		Close a context menu or submenu	Esc or left arrow
		Close a context menu and all open submenus	Tab

*/

//dojo.provide("plugins.workflow.StageMenu");
////dojo.require("dijit.dijit"); // optimize: load dijit layer
//dojo.require("dojo.parser");
//
//// HAS A
//dojo.require("plugins.menu.Menu");
//
//// INHERITS
//dojo.require("plugins.core.Common");
//
//
//dojo.declare("plugins.workflow.StageMenu",
//	[ dijit._Widget, dijit._Templated, plugins.core.Common ],
//{
//

console.log("Loading plugins/workflow/StageMenu");

define([
	"dojo/_base/declare",
	"dijit/registry",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common",

	"plugins/menu/Menu"
],

function (
	declare,
	registry,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common
) {

/////}}}}}

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common
], {

/////}}}}}

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/templates/stagemenu.html"),
	
// Calls dijit._Templated.widgetsInTemplate
widgetsInTemplate : true,

//addingApp STATE2
addingApp : false,

// OR USE @import IN HTML TEMPLATE
cssFiles : [
	dojo.moduleUrl("plugins") + "/workflow/css/stagemenu.css"
],

// PARENT WIDGET
parentWidget : null,

// CORE WORKFLOW OBJECTS
core : null,

////////}

constructor : function(args) {
	console.log("StageMenu.constructor     args");
	console.dir({args:args});
	
	this.core = args.core;
	console.log("StageMenu.constructor     this.core: " + this.core);
	
	// GET INFO FROM ARGS
	this.parentWidget = args.parentWidget;

	// LOAD CSS
	console.log("StageMenu.constructor     BEFORE this.loadCSS");
	this.loadCSS();		
	console.log("StageMenu.constructor     AFTER this.loadCSS");
},
postCreate : function() {
	this.startup();
},
startup : function () {
	console.log("StageMenu.startup    plugins.workflow.StageMenu.startup()");

	// COMPLETE CONSTRUCTION OF OBJECT
	this.inherited(arguments);	 

	// SET DRAG APP - LIST OF APPS
	console.log("StageMenu.startup    BEFORE this.setMenu()");
	this.setMenu();
	console.log("StageMenu.startup    AFTER this.setMenu()");
},
setMenu : function () {
// CONNECT LISTENERS FOR MENU
	////console.log("StageMenu.setMenu     plugins.workflow.StageMenu.setMenu()");
	
	//dojo.connect(this.deleteNode, "onClick", dojo.hitch(this, function(event)
	//{
	//	////console.log("StageMenu.setMenu     onClick delete");
	//	this.delete(event);
	//	event.stopPropagation();
	//}));
	//
	//dojo.connect(this.runNode, "onClick", dojo.hitch(this, function(event)
	//{
	//	////console.log("StageMenu.setMenu     onClick run");
	//	this.run(event);
	//}));
},
bind : function (node) {
// BIND THE MENU TO A NODE
	////console.log("StageMenu.bind     plugins.workflow.StageMenu.bind(node)");
	////console.log("StageMenu.bind     node: " + node);

	if ( node == null )
	{
		////console.log("StageMenu.bind     node is null. Returning...");
	}
	return this.menu.bindDomNode(node);	
},
delete : function (event) {
// REMOVE THE STAGE FROM THE WORKFLOW
	console.log("StageMenu.delete     this:" + this);
	console.dir({this:this});

	// REM: WE ARE NOT INTERESTED IN event.target 
	// BECAUSE ITS THE CLICKED MENU NODE. WE WANT
	// THE NODE UNDERNEATH
	var node = this.menu.currentTarget;
	console.log("StageMenu.delete     node: ");
	console.dir({node:node});
	var application = this.getApplication(node);
	console.log("StageMenu.delete     application: ");
	console.dir({application:application});
	
	//console.log("StageMenu.delete     DOING this.parentWidget.dropTarget.delItem(widget.containerNode.id)");
	//
	//this.parentWidget.dropTarget.delItem(widget.containerNode.id);

	//console.log("StageMenu.delete     DOING dojo.destroy(widget.)");
	//dojo.destroy(node);

	// SEND QUERY
	var query = new Object;
	query.username		=	Agua.cookie("username");
	query.sessionid		=	Agua.cookie("sessionid");
	query.mode 			= 	"deleteStage";
	query.module 		= 	"Agua::Workflow";
	query.sourceid 		= 	this.id;
	query.callback		=	"handleDelete",
	query.data			=	application;
	console.log("StageMenu.delete    query:");
	console.dir({query:query});


//// DEBUG
//	console.log("StageMenu.delete    ***DEBUG*** DOING this.handleDelete()");
//	this.handleDelete(query);

// UNCOMMENT THIS
	console.log("StageMenu.delete    BEFORE Agua.exchange.send(query)");
	Agua.exchange.send(query);
	console.log("StageMenu.delete    AFTER Agua.exchange.send(query)");
},

handleDelete : function (response) {
	var data = response.data;
	console.log("StageMenu.handleDelete    data:");
	console.dir({data:data});
	console.log("StageMenu.handleDelete    this:");
	console.dir({this:this});
	
	if ( response.error ) {
		Agua.toastError(error);
		return;
	}

	// REMOVE STAGE IN AGUA ON CLIENT AND ON REMOTE SERVER
	Agua.spliceStage(data);

	// DELETE ROW
	this.deleteRow(data);

	// UPDATE NODE NUMBERS	
	var childNodes = this.parentWidget.dropTarget.getAllNodes();
	this.updateNodes(data, childNodes);
	
	// DO INFOPANE
	if ( childNodes.length ) {
		this.parentWidget.loadParametersPane(childNodes[0].application);
	}
	else {
		this.parentWidget.clearParameters();
	}
	
	// CALL Stages TO CHECK VALID STAGES		
	this.parentWidget.updateRunButton();
	
	// UPDATE RUN STATUS
	console.log("StageMenu.handleDelete    Doing this.core.userWorkflows.checkRunStatus()");
	this.core.runStatus.polling = false;
	this.core.userWorkflows.checkRunStatus();	
	
},
updateNodes : function (data, childNodes) {	
	// UPDATE number IN NODES AFTER NODE WITH data
	for ( var i = data.number; i < childNodes.length; i++ ) {
		if ( ! childNodes[i].data )	childNodes[i].data	= new Object;
		childNodes[i].data.number = (i + 1).toString();
	}
	
	// RESETTING number IN ALL CHILDNODES
	console.log("StageMenu.updateNodes    Resetting number in all childNodes. childNodes.length: " + childNodes.length);
	for ( var i = 0; i < childNodes.length; i++ ) {
		var node = childNodes[i];

		// GET WIDGET
		var widget = dijit.byNode(node.firstChild);
		////console.log("StageMenu.delete     childNodes[" + i + "].widget: " + widget);			
		if ( widget == null ) {
			widget = dijit.getEnclosingWidget(childNodes[i]);
		}
		////console.log("StageMenu.delete     Resetting stageRow number to: " + (i + 1));
		node.application.number = (i + 1).toString();
		node.application.appnumber = (i + 1).toString();

		widget.setNumber(node.application.number);

		console.log("StageMenu.handleDelete     Reset widget childNodes[" + i + "], node.application.number: " + node.application.number);
	}	
},
deleteRow : function (data) {
	console.log("StageMenu.deleteNode    data:");
	console.dir({data:data});
	
	var childNodes = this.parentWidget.dropTarget.getAllNodes();
	var index	=	parseInt(data.appnumber) - 1;
	console.log("StageMenu.deleteNode     index: " + index);
	
	var node = childNodes[index];
	console.log("StageMenu.deleteNode     node:");
	console.dir({node:node});

	// REMOVE FROM TARGET ITEMS
	console.log("StageMenu.deleteNode     DOING this.parentWidget.dropTarget.delItem(node.id)");	
	this.parentWidget.dropTarget.delItem(node.id);

	// GET WIDGET
	var widget = registry.byNode(node.firstChild);
	console.log("StageMenu.deleteNode     widget:");
	console.dir({widget:widget});

	// DESTROY NODE
	console.log("StageMenu.deleteNode     BEFORE dojo.destroy(node)");
	dojo.destroy(node);
	console.log("StageMenu.deleteNode     AFTER dojo.destroy(node)");

	// DESTROY WIDGET	
	console.log("StageMenu.deleteNode     BEFORE widget.destroy()");
	widget.destroyRecursive();
	console.log("StageMenu.deleteNode     AFTER widget.destroy()");

	console.log("StageMenu.deleteNode     widget:");
	console.dir({widget:widget});

	
	//// REMOVE THE CLICKED NODE
	//var widget = registry.byNode(node.firstChild);
	//console.log("StageMenu.deleteNode     widget:");
	//console.dir({widget:widget});
	////console.log("StageMenu.deleteNode     DOING widget.destroy()");
	////widget.destroy();
	//
	//console.log("StageMenu.deleteNode     DOING this.parentWidget.dropTarget.delItem(widget.id)");
	//this.parentWidget.dropTarget.delItem(widget.containerNode.id);
	
	//console.log("StageMenu.delete     DOING dojo.destroy(node)");
	//dojo.destroy(node);
},
run : function () {
// RUN STAGE
	console.log("StageMenu.run     plugins.workflow.StageMenu.run()");
	var node = this.menu.currentTarget;
	var application = this.getApplication(node);
	console.log("StageMenu.run     application:");	
	console.dir({application:application});
	
	// START RUN
	console.log("StageMenu.run     this:");
	console.dir({this:this});
	console.log("StageMenu.run     BEFORE this.core.runStatus.runWorkflow()");
	this.core.runStatus.runWorkflow(application);
	console.log("StageMenu.run     AFTER this.core.runStatus.runWorkflow()");
},
stop : function () {
// STOP STAGE
	console.log("StageMenu.stop     plugins.workflow.StageMenu.stop()");
	var node = this.menu.currentTarget;
	var application = this.getApplication(node);
	console.log("StageMenu.stop     application: " + dojo.toJson(application));

	// START RUN
	this.core.runStatus.confirmStopWorkflow(application.project, application.workflow, true);
},
runAll : function () {
// ADD PROGRAMMATIC CONTEXT MENU
	console.log("StageMenu.runAll     plugins.workflow.StageMenu.runAll()");
	var node = this.menu.currentTarget;
	var application = this.getApplication(node);
	console.log("StageMenu.runAll     application: " + dojo.toJson(application));

	// START run
	console.log("StageMenu.runAll     this:");
	console.dir({this:this});
	console.log("StageMenu.runAll     BEFORE this.core.runStatus.runWorkflow(application)");
	this.core.runStatus.runAllWorkflows(application);
	console.log("StageMenu.runAll     AFTER this.core.runStatus.runWorkflow(application)");
},
chain : function () {
// CHAIN THE INPUTS AND OUTPUTS OF THIS STAGE TO THE PARAMETER VALUES
// OF THE PRECEDING STAGE
	////console.log("StageMenu.chain     plugins.workflow.StageMenu.chain()");

	// REM: WE ARE NOT INTERESTED IN event.target 
	// BECAUSE ITS THE CLICKED MENU NODE. WE WANT
	// THE NODE UNDERNEATH
	var node = this.menu.currentTarget;
	console.log("StageMenu.chain    node: ");
	console.dir({node:node});
	var application = this.getApplication(node);
	////console.log("StageMenu.chain     application: " + dojo.toJson(application));

	// PREPARE STAGE OBJECT
	var stageObject = {
		project: this.parentWidget.projectCombo.getValue(),
		workflow: this.parentWidget.workflowCombo.getValue(),
		owner: application.owner,
		appname: application.name,
		appnumber: application.number,
		name: application.name,
		number: application.number
	};
	////console.log("StageMenu.chain     stageObject: " + dojo.toJson(stageObject));

	// CHANGE THE STAGE PARAMETERS FOR THIS APPLICATION
	// IF THE args FIELD IS NOT NULL (ALSO params AND paramFunction)
	console.log("StageMenu.chain     DOING this.parentWidget.core.io.chainstage()");
	console.log("StageMenu.chain     this.parentWidget.core.io: " + this.parentWidget.core.io);
	var force = true;
	this.core.io.chainStage(stageObject, force);
	
	// SET INFO PANE FOR DROPPED NODE
	this.core.userWorkflows.loadParametersPane(application);
},
refresh : function () {
// REFRESH VALIDATION OF STAGE PARAMETERS
	console.log("StageMenu.refresh     plugins.workflow.StageMenu.refresh()");
	var node = this.menu.currentTarget;
	var application = this.getApplication(node);

	var username = Agua.cookie('username');
	var shared = false;
	if ( application.username != username )
		shared = true;
	var force = true;
	this.core.parameters.load(node, shared, force);
},
// UTILS
getApplication : function (node) {
	var widget = registry.getEnclosingWidget(node);
	console.log("StageMenu.getApplication    widget:");
	console.dir({widget:widget});
	
	var application = this.copyData(widget.application);
	delete application.core;
	delete application.parentWidget;
	
	return application;
},
copyData : function (data) {
	console.log("StageMenu.copyData    data:");
	console.dir({data:data});

	var newData = new Object;
	
	for ( var key in data ) {
		if (typeof data[key] == "string" ) {
			newData[key] = data[key];
		}
	}
	console.log("StageMenu.copyData    newData:");
	console.dir({newData:newData});
	
	return newData;
}



}); //	end declare

});	//	end define
