//dojo.provide("plugins.cloud.Aws");
//
//// ADD USER'S AWS INFORMATION
//
////dojo.require("dijit.dijit"); // optimize: load dijit layer
//dojo.require("dijit.form.Button");
////dojo.require("dijit.form.TextBox");
////dojo.require("dijit.form.NumberTextBox");
////dojo.require("dijit.form.Textarea");
//dojo.require("dojo.parser");
//dojo.require("dijit.form.ValidationTextBox");
//dojo.require("plugins.core.Common");
//
//dojo.declare("plugins.cloud.Aws",
//	[ dijit._Widget, dijit._Templated, plugins.core.Common ], {
//
////Path to the template of this widget. 
//templatePath: dojo.moduleUrl("plugins", "cloud/templates/aws.html"),
//
//// Calls dijit._Templated.widgetsInTemplate
//widgetsInTemplate : true,
//

console.log("%cplugins/cloud/Aws    LOADING", "color: blue");

define([
	"dojo/_base/declare",
//	"dojo/parser",

	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",

	"plugins/core/Common",

	"plugins/dijit/form/ValidationTextBox",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/Textarea",
	"plugins/dnd/Source",
	
	"dijit/layout/ContentPane"
],

function (
	declare,

	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,

	Common
) {

////}}}}}

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common	
], {

// templateString : String	
//		Template of this widget. 
templateString: dojo.cache("plugins", "cloud/templates/aws.html"),

//addingUser STATE
addingUser : false,

// OR USE @import IN HTML TEMPLATE
cssFiles : [
	dojo.moduleUrl("plugins", "cloud/css/aws.css"),
	//dojo.moduleUrl("dojo", "/tests/dnd/dndDefault.css")
],

requiredInputs : {
	amazonuserid 		: 1,
	awsaccesskeyid 		: 1,
	awssecretaccesskey 	: 1,
	ec2privatekey 		: 1,
	ec2publiccert 		: 1
},

// PARENT WIDGET
parentWidget : null,

/////}}}

constructor : function(args)  {
	// GET INFO FROM ARGS
	if ( args.parentWidget ) {
		this.parentWidget = args.parentWidget;
		this.core = args.parentWidget.core;
	}

	// LOAD CSS
	this.loadCSS();
},
postCreate : function() {
	this.startup();
},
startup : function () {
	//console.log("Aws.startup    plugins.cloud.GroupAws.startup()");

	// COMPLETE CONSTRUCTION OF OBJECT
	this.inherited(arguments);

	// ATTACH PANE
	this.attachPane();

	// SET DRAG SOURCE - LIST OF USERS
	this.initialiseAws();
},
// ACCESSORS
setElement : function (element, value) {
    console.log("Aws.setElement    element", element);
    console.log("Aws.setElement    value", value);

    console.log("Aws.setElement    this", this);
    console.log("Aws.setElement    this[element]", this[element]);

	if ( this[element].textbox ) {
	    this[element].textbox.value = value;    
	}
	else if ( this[element].set ) {
	    this[element].set('value', value);    
	}
	else {
	    this[element].value = value;    
	}
},
getElement : function (element) {
    console.log("Aws.getElement    element", element);
    console.log("Aws.getElement    this[element].toString()", this[element].toString());
    console.log("Aws.getElement    this[element]", this[element]);

	var isTextArea = element.toString().match("^<textarea");
	console.log("Aws.getElement    isTextArea", isTextArea);
	
	if ( this[element].textarea ) {
	    console.log("Aws.getElement    TEXTAREA");
		
	    return this[element].textarea.value;    
	}
	if ( this[element].textbox ) {
	    console.log("Aws.getElement    TEXTBOX");

	    return this[element].textbox.value;    
	}
	else if ( this[element].get ) {
	    console.log("Aws.getElement    GET");

	    return this[element].get('value');    
	}
	else {
	    console.log("Aws.getElement    DEFAULT");

	    return this[element].value;    
	}
},
// SAVE TO REMOTE
addAws : function (event) {

console.clear();

	console.log("Aws.addAws    plugins.cloud.Aws.addAws(event)");
	console.log("Aws.addAws    event", event);
	console.log("Aws.addAws    this.id", this.id);
	
	if ( this.savingAws == true ) {
		console.log("Aws.addAws    this.savingAws: " + this.savingAws + ". Returning.");
		return;
	}
	this.savingAws = true;
	
	// VALIDATE INPUTS
	var data = this.validateInputs();
	console.log("Aws.addAws    data", data);
	if ( ! data ) {
		this.savingAws = false;
		return;
	}
	
	// SEND REQUEST
	Agua.sendRequest({
			data        :   data,
			mode        :   "addAws",
			module      :   "Agua::Workflow",
			sourceid    :   this.id,
			callback    :   "handleAddAws"
	});

	this.savingAws = false;
},
handleAddAws : function (response) {
	console.log("Aws.handleAddAws    response", response);
		
	if ( response.error ) {
		Agua.toast({error: response.error});
		return;
	}
	console.log("Aws.handleAddAWS    DOING Agua.setAws(inputs)");
	
	var data = response.data;
	console.log("Aws.handleAddAws    data", data);

	Agua.setAws(data);
	
	this.setElement("amazonuserid", data.amazonuserid)
	this.setElement("awsaccesskeyid", data.awsaccesskeyid)
	this.setElement("awssecretaccesskey", data.awssecretaccesskey)
	this.setElement("ec2privatekey", data.ec2privatekey)
	this.setElement("ec2publiccert", data.ec2publiccert)
	
	if ( Agua.toast ) {
		Agua.toast(response);
	}
},
validateInputs : function () {
	var inputs = new Object;
	this.isValid = true;
	for ( var input in this.requiredInputs ) {
		inputs[input] = this.verifyInput(input);
	}
	console.log("Aws.validateInputs    inputs: ");
	console.dir({inputs:inputs});

	if ( ! this.isValid ) 	return null;	
	return inputs;
},
verifyInput : function (input) {
	console.log("Aws.verifyInput    input", input);

	var value = this.getWidgetValue(this[input]);
	value = this.cleanEdges(value);
	console.log("Aws.verifyInput    value: " + value);

	var className = this.getClassName(this[input]);
	console.log("Aws.verifyInput    className: " + className);
	console.log("Aws.verifyInput    this[input]: " + this[input]);
	if ( className ) {
		console.log("Aws.verifyInput    className IS DEFINED", className);
		console.log("Aws.verifyInput    this[input].isValid: " + this[input].isValid);

		if ( ! value || (this[input] && this[input].isValid && ! this[input].isValid()) ) {
			console.log("Aws.verifyInput    value is empty. Adding class 'invalid'");
			if ( this[input].domNode ) {
				dojo.addClass(this[input].domNode, 'invalid');
			}
			this.isValid = false;
		}
		else {
			console.log("Aws.verifyInput    value is NOT empty. Removing class 'invalid'");
			if ( this[input].domNode ) {
				dojo.removeClass(this[input].domNode, 'invalid');
			}
			return value;
		}
	}
	else {
		console.log("Aws.verifyInput    className NOT DEFINED", className);
		if ( ! value ) {
			console.log("Aws.verifyInput    input " + input + " value is EMPTY. Adding class 'invalid'");
			dojo.addClass(this[input], 'invalid');
			this.isValid = false;
			return null;
		}
		else if ( input == "ec2privatekey" ) {
			if ( ! value.match(/^\s*-----BEGIN PRIVATE KEY-----[\s\S]+-----END PRIVATE KEY-----\S*$/) ) {
				console.log("Aws.verifyInput    value is INVALID. Adding class 'invalid'");
				dojo.addClass(this[input], 'invalid');
				this.isValid = false;
				return null;
			}
			
			console.log("Aws.verifyInput    value is VALID. Removing class 'invalid'");
			dojo.removeClass(this[input], 'invalid');
			return value;
		}
		else if ( input == "ec2publiccert" ) {
			if ( ! value.match(/^\s*-----BEGIN CERTIFICATE-----[\s\S]+-----END CERTIFICATE-----\S*$/) ) {
				console.log("Aws.verifyInput    value is INVALID. Adding class 'invalid'");
				dojo.addClass(this[input], 'invalid');
				this.isValid = false;
				return null;
			}
			
				console.log("Aws.verifyInput    value is VALID. Removing class 'invalid'");
			dojo.removeClass(this[input], 'invalid');
			return value;
		}
	}
	
	return null;
},
getWidgetValue : function (widget) {
	var value;
	////////console.log("Aws.getWidgetValue    (widget: " + widget);
	////////console.log("Aws.getWidgetValue    widget: ");
	//////console.dir({widget:widget});
	if ( ! widget )	return;
	
	// NUMBER TEXT BOX
	if ( widget.id != null && widget.id.match(/^dijit_form_NumberTextBox/) )
	{
		////////console.log("Aws.getWidgetValue    DOING NumberTextBox widget");
		value = String(widget);
		//value = String(widget.getValue());
	}
	// WIDGET COMBO BOX
	else if ( widget.get && widget.get('value') )
	{
		////////console.log("Aws.getWidgetValue    DOING widget.get('value')");
		value = widget.get('value');
	}
	else if ( widget.getValue )
	{
		value = widget.getValue();
	}
	// HTML TEXT INPUT OR HTML COMBO BOX
	else if ( widget.value )
	{
		////////console.log("Aws.getWidgetValue    DOING widget.value");
		value = String(widget.value.toString());
	}
	// HTML DIV	
	else if ( widget.innerHTML )
	{
	    ////////console.log("Aws.getWidgetValue    DOING widget.innerHTML");

	    // CHECKBOX
		if ( widget.innerHTML == "<input type=\"checkbox\">" )
	    {
			////////console.log("Aws.getWidgetValue    CHECKBOX - GETTING VALUE");
			value = widget.childNodes[0].checked;
			////////console.log("Aws.getWidgetValue    value: " + value);
	    }
		else {
			value = widget.innerHTML;
		}
	}
	////////console.log("Aws.getWidgetValue    XXXX value: " + dojo.toJson(value));
	if ( value == null )    value = '';
	return value;
},
initialiseAws : function () {
	// INITIALISE AWS SETTINGS
	var aws = Agua.getAws();
	console.log("Aws.initialiseAws     aws: ");
	console.dir({aws:aws});

	this.amazonuserid.set('value', aws.amazonuserid);
	this.awsaccesskeyid.set('value', aws.awsaccesskeyid);
	this.awssecretaccesskey.set('value', aws.awssecretaccesskey);
	this.ec2privatekey.value = aws.ec2privatekey || "";
	this.ec2publiccert.value = aws.ec2publiccert || "";
},
cleanEdges : function (string ) {
// REMOVE WHITESPACE FROM EDGES OF TEXT
	console.log("Aws.cleanEdges    caller: " + this.cleanEdges.caller.nom);

	console.log("Aws.cleanEdges    string: " + string);
	if ( ! string.toString ) {
		return string;
	}
	
	string = string.toString();
	if ( string == null || ! string.replace)
		return null;
	string = string.replace(/^\s+/, '');
	string = string.replace(/\s+$/, '');

	return string;
}

});

});

console.log("%cplugins/cloud/Aws    COMPLETED", "color: blue");


