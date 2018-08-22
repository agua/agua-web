//dojo.provide("plugins.sharing.ProjectRow");
//
//dojo.require("dijit._Widget");
//dojo.require("dijit._Templated");
//
//dojo.declare( "plugins.sharing.ProjectRow",
//	[ dijit._Widget, dijit._Templated ],
//{
////Path to the template of this widget. 
//templatePath: dojo.moduleUrl("plugins", "sharing/templates/projectrow.html"),
//
//// Calls dijit._Templated.widgetsInTemplate
//widgetsInTemplate : true,
//
//

define([
	"dojo/_base/declare",
	"dojo/parser",
	"dojo/_base/array",
	"dojo/json",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",

	"plugins/sharing/ProjectRow"
],

function (
	declare,
	parser,
	arrayUtil,
	JSON,
	on,
	lang,
	domAttr,
	domClass,

	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin
) {

/////}}}}}

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin
], {

// templateString : String	
//		Path to the template of this widget. 
templateString: dojo.cache("plugins", "sharing/templates/projectrow.html"),


// PARENT plugins.sharing.Projects WIDGET
parentWidget : null,

////}}}

constructor : function(args) {
	//////console.log("ProjectRow.constructor    plugins.workflow.ProjectRow.constructor()");
	this.parentWidget = args.parentWidget;	
},


postCreate : function() {
	////////console.log("ProjectRow.postCreate    plugins.workflow.ProjectRow.postCreate()");
	this.formInputs = this.parentWidget.formInputs;
	this.startup();
},

startup : function () {
	//////console.log("ProjectRow.startup    plugins.workflow.ProjectRow.startup()");
	//////console.log("ProjectRow.startup    this.parentWidget: " + this.parentWidget);
	this.inherited(arguments);
	
	var thisObject = this;
	dojo.connect( this.name, "onclick", function(event) {
		thisObject.toggle();
		event.stopPropagation(); //Stop Event Bubbling 			
	});

	// DESCRIPTION
	dojo.connect(this.description, "onclick", function(event)
		{
			//////console.log("ProjectRow.startup    projectRow.description clicked");
			thisObject.parentWidget.editRow(thisObject, event.target);
		}
	);

	// NOTES
	dojo.connect(this.notes, "onclick", function(event)
		{
			//////console.log("ProjectRow.startup    projectRow.notes clicked");
			thisObject.parentWidget.editRow(thisObject, event.target);
		}
	);
},

toggle : function () {
	//////console.log("ProjectRow.toggle    plugins.workflow.ProjectRow.toggle()");
	if ( this.description.style.display == 'block' ) this.description.style.display='none';
	else this.description.style.display = 'block';
	if ( this.notes.style.display == 'block' ) this.notes.style.display='none';
	else this.notes.style.display = 'block';
}

}); //	end declare

});	//	end define
