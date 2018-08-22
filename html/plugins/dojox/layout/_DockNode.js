define([
	"dojo/_base/declare",
	"dojox/layout/Dock"
],

/////}}}}}

function (
	declare,
	DockNode
) {

/////}}}}}

return declare([
	DockNode
], {

// summary:
//		dojox.layout._DockNode is a private widget used to keep track of
//		which pane is docked.
//

templateString:
	'<li dojoAttachEvent="onclick: restore" class="dojoxDockNode">'+
		'<span dojoAttachPoint="restoreNode" class="dojoxDockRestoreButton" dojoAttachEvent="onclick: restore"></span>'+
		'<span class="dojoxDockTitleNode" dojoAttachPoint="titleNode">${title}</span>'+
	'</li>',

// CSS class of dock node. Default is 'dojoxDockNode' 
// dockClass: string
dockClass: null,

/////}}}}

postCreate: function(){
	//console.log("DockNode.postCreate    this.dockClass: " + this.dockClass)
	//console.log("DockNode.postCreate    this.templateString: " + this.templateString)
	var dockClass = this.dockClass;
	if ( dockClass ) {
		//console.log("DockNode.postCreate    DOING dojo.addClass(this.domNode, dockClass)");
		dojo.attr(this.domNode, 'class', dockClass);
	}
	
	if ( this.dockClass ) {
		this.templateString = '<li dojoAttachEvent="onclick: restore" class="dojoxDockNode ' + this.dockClass + '">'+
			'<span dojoAttachPoint="restoreNode" class="dojoxDockRestoreButton" dojoAttachEvent="onclick: restore"></span>'+
			'<span class="dojoxDockTitleNode" dojoAttachPoint="titleNode">${title}</span>'+
		'</li>'
	}

	//console.log("DockNode.postCreate    this.templateString: " + this.templateString)

},
restore: function(){
	// summary: remove this dock item from parent dock, and call show() on reffed floatingpane
	this.paneRef.show();
	this.paneRef.bringToTop();
	this.destroy();
}

});
});

