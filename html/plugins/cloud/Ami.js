console.log("%cplugins/cloud/Ami    LOADING", "color: blue");

define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",

	"plugins/core/Common",
	"plugins/form/EditForm",
	"plugins/cloud/AmiRow",

	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/Textarea",

	"plugins/dnd/Source",
	"plugins/form/TextArea",
	"dijit/form/ComboBox",
],

function (
	declare,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,

	Common,
	EditForm,
	AmiRow
) {

////}}}}}

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,

	Common,
	EditForm
], {

// templateString : String	
//		Template of this widget. 
templateString: dojo.cache("plugins", "cloud/templates/ami.html"),


//addingUser STATE
addingUser : false,

// OR USE @import IN HTML TEMPLATE
cssFiles : [
	require.toUrl("plugins/cloud/css/ami.css")
],

// PARENT WIDGET
parentWidget : null,

// PARENT WIDGET
ami : "",

// formInputs : Hash
//    Form inputs and types (word|phrase)
formInputs : {
	aminame		:	"word",
	amiid		:	"word",
	amitype		:	"word",
	description	:	"phrase"
},

defaultInputs : {
// DEFAULT INPUTS
	aminame 	: 	"amiName",
	amiid		:	"AMI ID",
	description	:	"Description"
},

requiredInputs : {
// REQUIRED INPUTS CANNOT BE ''
// combo INPUTS ARE AUTOMATICALLY NOT ''
	aminame 	: 1,
	amiid		: 1
},

invalidInputs : {
// THESE INPUTS ARE INVALID
	aminame 	: 	"amiName",
	amiid		:	"AMI ID",
	description	:	"Description"
},

dataFields : [
	"amiid",
	"aminame"
],

rowClass : "plugins/cloud/AmiRow",

avatarType : "parameters",

avatarItems: [ "aminame", "amiid", "amitype", "description"],

/////}}}

// STARTUP METHODS
constructor : function(args) {
	console.log("Ami.constructor     args", args);			
	console.log("Ami.constructor     this", this);			

	// GoET INFO FROM ARGS
	this.parentWidget = args.parentWidget;
	if ( args.parentWidget) {
		this.ami = args.parentWidget.ami;
	}

	// LOAD CSS
	this.loadCSS();		
},
postCreate : function() {
	//console.log("Controller.postCreate    plugins.cloud.Controller.postCreate()");

	this.startup();
},
startup : function () {
	console.log("Ami.startup    plugins.cloud.Ami.startup()");

	// COMPLETE CONSTRUCTION OF OBJECT
	this.inherited(arguments);	 

	// ATTACH PANE
	this.attachPane();

	// SET NEW PARAMETER FORM
	this.setForm();

	// SET CLEAR VALUES
	this.setClearValues();

	// SET DRAG SOURCE - LIST OF CLUSTERS
	this.setDragSource();

	console.log("Ami.startup    BEFORE this.setTrash(this.dataFields), I.E., plugins.form.DndTrash.startup()");
	this.setTrash(this.dataFields);	
	console.log("Ami.startup    AFTER this.setTrash(this.dataFields), I.E., plugins.form.DndTrash.startup()");

	// SUBSCRIBE TO UPDATES
	Agua.updater.subscribe(this, "updateAmis");
},
updateAmis : function (args) {
// RELOAD THE COMBO AND DRAG SOURCE AFTER CHANGES
// TO DATA IN OTHER TABS
	console.log("Ami.updateAmis(args)");
	console.log("Ami.updateAmis    args: " );
	console.dir(args);
	
	if ( args.originator == this ) {
		if ( args.reload == false )	return;
	}
	console.log("Ami.updateAmis    Calling setDragSource()");
	this.setDragSource();
},
setForm : function () {
// SET LISTENERS TO ACTIVATED SAVE BUTTON AND TO CLEAR DEFAULT TEXT
// WHEN INPUTS ARE CLICKED ON
	console.log("Ami.setForm    plugins.cloud.Ami.setForm()");

	// SET ADD PARAMETER ONCLICK
	dojo.connect(this.addAmiButton, "onclick", dojo.hitch(this, "saveInputs", null, null));	
	// SET CLEARVALUE ON CLUSTER VALIDATION TEXT BOX
	dojo.connect(this.aminame, "onFocus", dojo.hitch(this, "clearValue", this.aminame, this.invalidInputs["aminame"]));

	// SET TRASH, ETC.
	this.inherited(arguments);
},
getItemArray : function () {
// GET A LIST OF DATA ITEMS - ONE FOR EACH ROW
	return Agua.getAmis();
},
setDragSource : function () {
// SET THE DRAG SOURCE WITH PARAMETER OBJECTS
	console.log("Ami.setDragSource     plugins.cloud.Ami.setDragSource()");

	// GENERATE DND GROUP
	if ( this.dragSource == null ) {
		this.initialiseDragSource();
		this.setDragSourceCreator();
	}

	// DELETE EXISTING CONTENT
	this.clearDragSource();

	// INITIALISE USER INFO
	var itemArray = this.getItemArray();
	
	itemArray = this.sortHasharray(itemArray, 'aminame');
	
	// CHECK IF itemArray IS NULL
	if ( itemArray == null ) {
		console.log("Ami.setDragSource     itemArray is null or empty. Returning.");
		return;
	}

	this.loadDragItems(itemArray);
},
saveInputs : function (inputs, reload) {
//	SAVE A PARAMETER TO Agua.parameters AND TO REMOTE DATABASE
	console.log("Ami.saveInputs    inputs: ",inputs);
	console.log("Ami.saveInputs    reload: ", reload);
	
	if ( this.saving == true )	return;
	this.saving = true;

	if ( inputs == null ) {
		inputs = this.getFormInputs(this);
		console.log("Ami.saveInputs    inputs: ");
		console.dir({inputs:inputs});
		
		// RETURN IF INPUTS ARE NULL OR INVALID		
		if ( inputs == null ) {
			this.saving = false;
			return;
		}
	}
	console.log("Ami.saveInputs    inputs: ", inputs);
	Agua.addAmi(inputs);
	
	this.saving = false;
},
deleteItem : function (data) {
	console.log("Ami.deleteItem    plugins.cloud.Ami.deleteItem(name)");
	console.log("Ami.deleteItem    data: " + dojo.toJson(data));

	Agua.removeAmi(data);
},
checkEnter : function (event) {
	console.log("Ami.checkEnter    event.keyCode: " + event.keyCode);

	if (event.keyCode == dojo.keys.ENTER)
	{
		this.saveInputs();
		dojo.stopEvent(event);
	}
},
checkEnterNodes : function (event) {
	console.log("Ami.checkEnterNodes    event.keyCode: " + event.keyCode);

	if (event.keyCode == dojo.keys.ENTER)
	{
		dojo.stopEvent(event);

		console.log("Ami.checkEnterNodes    setting document.body.focus()");
		document.body.focus();

		this.checkNodeNumbers();

		this.saveInputs();
	}
},
checkNodeNumbers : function () {
// SET MIN NODES VALUE TO SENSIBLE NUMBER 
	console.log("Ami.checkNodeNumbers     plugins.cloud.Ami.checkNodeNumbers()");
	console.log("Ami.checkNodeNumbers     this.minnodes.get('value'): " + this.minnodes.get('value'));
	console.log("Ami.checkNodeNumbers     this.maxnodes.get('value'): " + this.maxnodes.get('value'));
	
	if (this.minnodes.value > this.maxnodes.value )
	{
		console.log("Ami.checkNodeNumbers     this.minnodes.value > this.maxnodes.value");
		this.minnodes.set('value', this.maxnodes.value);
	}
}

});

});

console.log("%cplugins/cloud/Ami    COMPLETED", "color: blue");
