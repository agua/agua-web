console.log("Loading plugins/workflow/runstatus/StageStatusRow");

define( "plugins/workflow/RunStatus/StageStatusRow",
[
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"plugins/core/Common"
],

function (declare,
	lang,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common
) {

///////}}}}}}

return declare("plugins/workflow/RunStatus/StageStatusRow",
	[ _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Common ], {

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "workflow/RunStatus/templates/stagestatusrow.html"),

///////}}}}}}

constructor : function(args) {	
	// GET ARGS
	this.core = args.core;
},
postCreate : function() {
	this.startup();
},
startup : function () {
	//console.log("StageStatusRow.startup    plugins.workflow.RunStatus.StageStatusRow.startup()");

	this.inherited(arguments);

	if ( this.stderrfile != null && this.stderrfile != '' )
		this.setFileDownload("stderr");

	if ( this.stdoutfile != null && this.stdoutfile != '' )
		this.setFileDownload("stdout");

	////console.log("StageStatusRow.startup    this: " + this);
	////console.log("StageStatusRow.startup    this.domNode.innerHTML: " + this.domNode.innerHTML);
},
setFileDownload : function(filetype) {
	//console.log("StageStatusRow.setFileDownload    plugins.report.ParameterRow.setFileDownload(filetype)");
	//console.log("StageStatusRow.setFileDownload    filetype: " + filetype);
	var nodeName = filetype + "Node";
	var fileName = filetype + "file";
	this[nodeName].innerHTML = this[fileName];
	//console.log("StageStatusRow.setFileDownload    this[nodeName]: " + this[nodeName]);
	//console.log("StageStatusRow.setFileDownload    this[" + nodeName + "].innerHTML: " + this[nodeName].innerHTML);	
	
	dojo.connect(this[nodeName], "onclick", this, dojo.hitch( this, function(event)
		{
			//console.log("ParameterRow.setFileDownload    download onclick fired, this[nodeName].innerHTML: " + this[nodeName].innerHTML);
			this.downloadFile(this[nodeName].innerHTML);
		}
	));
},
handleDownload : function (response, ioArgs) {
	//console.log("ParameterRow.handleDownload     plugins.workflow.ParameterRow.handleDownload(response, ioArgs)");
	//console.log("ParameterRow.handleDownload     response: " + dojo.toJson(response));
	//console.log("ParameterRow.handleDownload     response.message: " + response.message);

	if ( response.message == "ifd.getElementsByTagName(\"textarea\")[0] is undefined" )
	{
		Agua.toastMessage({
			message: "Download failed: File is not present",
			type: "error"
		});	////console.log("ParameterRow.downloadFile     value: " + dojo.toJson(value));

	}	
}

}); //	end declare

});	//	end define

