console.log("Loading plugins/workflow/runstatus/QueueStatus");

define( "plugins/workflow/RunStatus/QueueStatus",
[
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common",
	"plugins/dijit/ConfirmDialog",
	
	"dijit/TitlePane"
],

function (declare,
	lang,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common,
	ConfirmDialog
) {

return declare("plugins/workflow/RunStatus/QueueStatus",
	[ _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Common ], {
	
/////}}}}

// Path to the template of this widget. 
templatePath: dojo.moduleUrl("plugins", "workflow/RunStatus/templates/queuestatus.html"),

// OR USE @import IN HTML TEMPLATE
cssFiles : [
	require.toUrl("plugins/workflow/RunStatus/css/queuestatus.css")
],

// CORE WORKFLOW OBJECTS
core : null,

// status: string
// Queue status ('', 'starting', 'running', 'pausing', 'paused', 'stopping', 'stopped')
status : '',

// runner: object
// RUNNER OBJECT SET IN RunStatus
runner : null,

// ATTACH TO DIV OR WIDGET NODE
attachPoint : null,

/////}}}}}

constructor : function(args) {
	console.log("QueueStatus.constructor    args:");
	console.dir({args:args});

	// MIXIN
	lang.mixin(this, args);
	
	// LOAD CSS
	this.loadCSS();

	console.log("QueueStatus.postCreate    END postCreate");
},
postCreate: function() {
	console.log("QueueStatus.postCreate    plugins.workflow.RunStatus.QueueStatus.postCreate()");

	this.startup();
},
startup : function () {
	console.log("QueueStatus.startup    plugins.workflow.RunStatus.QueueStatus.startup()");

	// SET UP THE ELEMENT OBJECTS AND THEIR VALUE FUNCTIONS
	this.inherited(arguments);
	
	// ATTACH PANE
	console.log("QueueStatus.startup    DOING this.attachPane()");
	this.attachPane();
},
displayStatus : function (queuestatus) {
	console.log("QueueStatus.displayStatus      queuestatus:");
	console.dir({queuestatus:queuestatus});
	
	// REMOVE EXISTING STATUS 	
	this.clearStatus();

	// LEAVE EMPTY AND RETURN IF NO STATUS
	if ( ! queuestatus || ! queuestatus.status ) {
		this.statusList.innerHTML = "No queue information available";
		return;
	}
	
	// DISPLAY STATUS
	this.statusList.innerHTML = "<PRE>" + queuestatus.status + "</PRE>";
},
clearStatus : function () {
	console.log("QueueStatus.clearStatus      clearing this.statusList");
	this.statusList.innerHTML = "";
	
	while ( this.statusList.firstChild )
		this.statusList.removeChild(this.statusList.firstChild);

}

});
	
});
