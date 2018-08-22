console.log("%cplugins/files/_FileInfoPane    LOADING", "color: blue");
	
define([
	"dojo/_base/declare",
	"plugins/dojox/widget/_RollingListPane"
],

function (
	declare,
	_RollingListPane
) {

//////}}}}}}}

return declare([
	_RollingListPane
], {

//////}}}}}}}

////Path to the template of this widget. 
//templatePath: dojo.moduleUrl("plugins", "files/templates/infopane.html"),

// templateString : String
//		The template of this widget. 
templateString: dojo.cache("plugins", "files/templates/infopane.html"),

//// templatePath: String. Our template path
//templateString:"<div class=\"dojoxFileInfoPane\">\r\n\t<table>\r\n\t\t<tbody>\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"dojoxFileInfoLabel dojoxFileInfoNameLabel\">Filename </td>\r\n\t\t\t\t<td class=\"dojoxFileInfoName\" dojoAttachPoint=\"nameNode\"></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"dojoxFileInfoLabel dojoxFileInfoSizeLabel\">Size (bytes) </td>\r\n\t\t\t\t<td class=\"dojoxFileInfoSize\" dojoAttachPoint=\"sizeNode\"></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"dojoxFileInfoLabel dojoxFileInfoPathLabel\">Sample </td>\r\n\t\t\t\t<td class=\"dojoxFileInfoPath\" dojoAttachPoint=\"sampleNode\"></td>\r\n\t\t\t</tr>\r\n\t\t</tbody>\r\n\t</table>\r\n</div>\r\n",
	

postMixInProperties: function(){
//	    ////////console.log("FileDrag.postMixInProperties	plugins.files.FileDrag.postMixInProperties()");
	//this._messages = dojo.i18n.getLocalization("dojox.widget", "FileDrag", this.lang);
	this.inherited(arguments);
},
onItems: function() {
	console.log("files._FileInfoPane.onItems	this: ", this);

	// summary:
	//	called after a fetch or load - at this point, this.items should be
	//  set and loaded.
	var store = this.store, item = this.items[0];
    //////console.log("files._FileInfoPane.onItems	////console.dir(this.store): ", store);
	////console.log("files._FileInfoPane.onItems	////console.dir(item): ", item);

	
	if(!item){
		this._onError("Load", new Error("No item defined"));
	}
	else
	{
		console.log("files._FileInfoPane.onItems	item", item);
		//this.nameNode.innerHTML = store.getLabel(item);
		this.nameNode.innerHTML = store.getValue(item, "name");
		this.sampleNode.innerHTML = store.getValue(item, "sample");
		this.sizeNode.innerHTML = store.getValue(item, "size");			
		this.bytesNode.innerHTML = store.getValue(item, "bytes");			
		this.parentWidget.scrollIntoView(this);

	    ////console.log("files._FileInfoPane.onItems	////console.dir(this.containerNode): ");
		//////console.dir(this.containerNode);

		//////console.log("files._FileInfoPane.onItems	BEFORE this.inherited(arguments)");
		this.inherited(arguments);
		//////console.log("files._FileInfoPane.onItems	AFTER this.inherited(arguments)");

		//this._setContent(this.domNode, true);

		//this._setContentAndScroll(this.containerNode, false);

		//this.refresh();
		//this.parentWidget.scrollIntoView(this);

	}
},
_setContentAndScroll: function(/*String|DomNode|Nodelist*/cont, /*Boolean?*/isFakeContent){
// OVERRIDE TO AVOID this._setContent

// summary: sets the value of the content and scrolls it into view

	//////console.log("files._FileInfoPane._setContentAndScroll    files._FileInfoPane._setContentAndScroll(cont, isFakeContent)");
	//////console.log("files._FileInfoPane._setContentAndScroll    BEFORE this._setContent");

return;

	this._setContent(cont, isFakeContent);
	//////console.log("files._FileInfoPane._setContentAndScroll    AFTER this._setContent");

	this.parentWidget.scrollIntoView(this);
}

});

});
