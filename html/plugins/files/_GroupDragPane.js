/* A PANE THAT DISPLAYS GROUPS AS MENU ITEMS AND HAS THESE FEATURES:
  
	- HANDLE GETTING SELECTED OBJECT IN DND LIST

	- OVERRIDE onDropInternal(), onDropExternal() AND onDrop() TO COVER
	
	BOTH ON THE source/target OBJECT.

*/

console.log("%c%cplugins/files/_GroupDragPane    LOADING", "color: blue", "color: darkorange");

define([
	"dojo/_base/declare",
	"dojo/dom-construct",

	"plugins/dojox/widget/_RollingListPane",
	"plugins/dijit/Confirm",
	"dojox/widget/Standby",
	"dojo/dnd/Source",
	"dojox/timing/Sequence",
	
	"dijit/Menu",
	"dijit/InlineEditBox",
	
	// HAS A
	"plugins/dojox/Timer",
	"plugins/files/Dialog",
],

function (
	declare,
	domConstruct,
	
	RollingListPane,
	Confirm,
	Standby,
	Source,
	Sequence
) {

/////}}}}}

return declare([
	RollingListPane
], {

// templateString: string
//	our template
templateString: '<div><div dojoAttachPoint="containerNode"></div>' +
				'<div dojoAttachPoint="menuContainer">' +
					'<div dojoAttachPoint="menuNode"></div>' +
				'</div></div>',

// _dragSource: dijit.Menu
//  The menu that we will call addChild() on for adding items
_dragSource: null,

// dialog box to show copying
_copyBox : null,

// OBJECT-WIDE DEBUG STATUS
debug : false,

// polling : bool
// Whether or not the object is polling for completion 
polling : false,

// polling : bool
// Whether or not dragPane is loading
loading : false,

// core: object
// Contains refs to higher objects in hierarchy
// e.g., { folders: Folders.js object, files: XxxxxFiles.js object, ... }
core : null,

/////}}}}

constructor: function (args){
	this.inherited(arguments);
	
	console.log("%c_GroupDragPane.constructor    ------------------ args:", "color: darkorange");
	console.dir({args:args});
	this.core 		= args.core;
	this.path		=	args.path;
	this.parentPath	=	args.parentPath;
},
startup: function (){
	this.inherited(arguments);
	// 	RETURN IF THIS.LOADING == TRUE
	if ( this.loading )	{
		console.log("%c_GroupDragPane.startup    Returning because this.loading == true", "color: darkorange");
		return;
	}
	
	// SET THIS.LOADING = FALSE
	console.log("%c_GroupDragPane.startup    Setting this.loading = true", "color: darkorange");
	this.loading = true;

	// SET SEQUENCE AND STANDBY
	this.setSequence();
	this.setStandby();

	console.groupEnd("_GroupDragPane-" + this.id + "    startup");
},
_doQuery: function () {
// summary: either runs the query or loads potentially not-yet-loaded items.
	console.log("%c_GroupDragPane._doQuery    START", "color: darkorange");

	this.isLoaded = false;

	console.log("%c_GroupDragPane._doQuery    BEFORE this._setContentAndScroll()", "color: darkorange");
	this._setContentAndScroll(this.onFetchStart());
	console.log("%c_GroupDragPane._doQuery    AFTER this._setContentAndScroll()", "color: darkorange");

	console.log("%c_GroupDragPane._doQuery    this.store:" + this.store, "color: darkorange");
	console.dir({this_store:this.store});

	var thisObject = this;	
	this.store.fetch({
		query: this.path, 
		onComplete: function(items){
			thisObject.items = items;
			console.log("%c_GroupDragPane._doQuery.onComplete    BEFORE   this.onItems()", "color: darkorange");
			thisObject.onItems();
			console.log("%c_GroupDragPane._doQuery.onComplete    AFTER   this.onItems()", "color: darkorange");
		}, 
		onError: function(e) {
			this._onError("Fetch", e);
		},
		scope: this
	});

	console.log("%c_GroupDragPane._doQuery    END", "color: darkorange");
},
onLoad : function (data) {
	
	// THIS.INHERITED
	console.log("%c_GroupDragPane.onLoad    Doing this.inherited(arguments)", "color: darkorange");
	this.inherited(arguments);
	
	// SET THIS LOADING = FALSE
	console.log("%c_GroupDragPane.onLoad    Setting this.loading = false", "color: darkorange");
	this.loading = false;

	console.log("%c_GroupDragPane.onLoad    END", "color: darkorange");
},
_onLoadHandler: function(data){
// OVERRIDE TO AVOID THIS ERROR:
// Error undefined running custom onLoad code: This deferred has already been resolved

	// summary:
	//		This is called whenever new content is being loaded
	this.isLoaded = true;
	try{
		//this.onLoadDeferred.callback(data);
		console.log("%c_GroupDragPane._onLoadHandler    Doing this.onLoad(data)", "color: darkorange");
		this.onLoad(data);
	}
	catch(e) {
		////console.error('Error '+this.widgetId+' running custom onLoad code: ' + e.message);
	}


    console.log("%c_GroupDragPane._onLoadHandler    END", "color: darkorange");
	
	console.groupEnd("FileManager-" + this.id + "    roundRobin");
	console.log("%c_GroupDragPane._onLoadHandler    Doing this.core.folders.roundRobin()", "color: darkorange");
	this.core.folders.roundRobin();
},
_loadCheck: function(/* Boolean? */ forceLoad){
// summary: checks that the store is loaded
	var displayState = this._isShown();
	if((this.store || this.items) && (forceLoad || (this.refreshOnShow && displayState) || (!this.isLoaded && displayState))){
		
		this.query = this.path;
		console.log("%c_GroupDragPane._loadCheck    this.query: " + this.query, "color: darkorange");

		this._doQuery();
	}
},
_setContent: function(/*String|DomNode|Nodelist*/cont){
	if(!this._dragSource){
		// Only set the content if we don't already have a menu
		//this.inherited(arguments);
	}
},
createMenu : function (type) {
// ADD PROGRAMMATIC CONTEXT MENU
	console.log("%c_GroupDragPane.createMenu     type: " + type, "color: darkorange");
	
	if ( type == "workflow" ) {
		if ( this.workflowMenu ) return this.workflowMenu.menu;
	}
	else if ( type == "folder" ) {
		if ( this.folderMenu ) return this.folderMenu.menu;
	}
	else {
		if ( this.fileMenu ) return this.fileMenu.menu;
	}
},
addItem : function (name, type, username, location) {
	// REMOVE EMPTY ITEM IF PRESENT
	this.removeEmptyItem();
	
	// INSERT NEW CHILD
	var item = new Object;
	item.name = name;
	item.type = [type];
	item.directory = true;
	item.parentPath = this.path;
	item.path = name;
	item.children = [];
	console.log("%c_GroupDragPane.addItem    item: ", "color: darkorange");
	console.dir({item:item});
	this.items.push(item);

	// SET FILECACHE
	var cacheItem = dojo.clone(item);
	Agua.setFileCache(username, location, cacheItem);

	// GENERATE CHILD
	var newChild = this.parentWidget._getMenuItemForItem(item, this);
	console.log("%c_GroupDragPane.addItem    newChild: ", "color: darkorange");
	console.dir({newChild:newChild});

	// INSERT CHILD
	this._dragSource.insertNodes(false, [ newChild ]);

	// ADD 'directory' CLASS TO NEW CHILD
	var allNodes = this._dragSource.getAllNodes();
	var node = allNodes[allNodes.length - 1];
	node.setAttribute("dndType", "file");
	dojo.addClass(node, "directory");
	
	// ADD item ATTRIBUTE ON NODE
	node.item = item;
	node.item._S = newChild.store;

	// ADD MENU
	var dynamicMenu = this.createMenu(type);
	console.log("%c_GroupDragPane.addItem   dynamicMenu: ", "color: darkorange");
	console.dir({dynamicMenu:dynamicMenu});
	
	// BIND THE MENU TO THE DND NODE
	dynamicMenu.bindDomNode(node);
	
	// CONNECT ONCLICK
	dojo.connect(node, "onclick", this, "onclickHandler");
},	
renameItem : function (dndItem, newItemName) {
	console.log("%cWorkflowMenu.renameWorkflow     dndItem: ", "color: darkorange");
	console.dir({dndItem:dndItem});
	var itemName = dndItem.item.name;
	console.log("%c_GroupDragPane.renameItem    itemName: " + itemName, "color: darkorange");
	console.log("%c_GroupDragPane.renameItem    newItemName: " + newItemName, "color: darkorange");

	// RENAME DND ITEM
	dndItem.innerHTML = newItemName;
	
	for ( i = 0; i < this.items.length; i++ ) {
		var itemObject = this.items[i];
		if ( itemObject.name == itemName ) {
			console.log("%c_GroupDragPane.renameItem    Renaming item: " + i + ":", "color: darkorange");
			console.log("%c_GroupDragPane.renameItem    itemObject: ", "color: darkorange");
			console.dir({itemObject:itemObject});

			// REPLACE name AND path VALUES
			itemObject.name = newItemName;
			itemObject.path = newItemName;
			
			// REPLACE parentPath IN CHILDREN
				if ( itemObject.children.length ) {
					for ( var i = 0; i < itemObject.children.length; i++ ) {
						var parentPath = itemObject.children[i].parentPath;
						console.log("%c_GroupDragPane.renameItem    child " + i + " parentPath: " + parentPath, "color: darkorange");
						var re = new RegExp(itemName + "$");
						parentPath = parentPath.replace(re, newItemName);
						console.log("%c_GroupDragPane.renameItem    child " + i + " NEW parentPath: " + parentPath, "color: darkorange");
						itemObject.children[i].parentPath = parentPath;
					}
				}
			
			break;
		}
	}
},
deleteItem : function (dndItem) {
	console.log("%c_GroupDragPane.deleteItem    dndItem: ", "color: darkorange");
	console.dir({dndItem:dndItem});

	for ( i = 0; i < this.items.length; i++ ) {
		var itemObject = this.items[i];
		console.log("%c_GroupDragPane.deleteItem    itemObject: ", "color: darkorange");
		console.dir({itemObject:itemObject});
		if ( itemObject.name == dndItem.item.name ) {
			this.items.splice(i, 1);
			break;
		}
	}
	
	// DESTROY DND ITEM
	dojo.destroy(dndItem);

	// ADD 'EMPTY' ITEM IF NEEDED
	if ( ! this.items.length )	{
		this.addEmptyItem();
		console.log("%c_GroupDragPane.deleteItem    Doing this.onItems()", "color: darkorange");
		this.onItems();
	}
	
	// REMOVE ALL DOWNSTREAM DRAG PANES
	var fileDrag = this.parentWidget;
	var children = fileDrag.getChildren();
	var index = children.length;
	for ( var i = 0; i < children.length; i++ ) {
		console.log("%c_GroupDragPane.deleteItem    child " + i, "color: darkorange");
		console.dir({child:children[i]});
		if ( children[i] == this ) {
			index  = i;
			break;
		}
	}
	console.log("%c_GroupDragPane.deleteItem    children.length: " + children.length, "color: darkorange");
	console.log("%c_GroupDragPane.deleteItem    index: " + index, "color: darkorange");
	
	// QUIT IF THIS IS THE LAST PANE
	if ( index == children.length )	return;
	
	// OTHERWISE, REMOVE ALL DOWNSTREAM PANES
	console.log("%c_GroupDragPane.deleteItem    Doing fileDrag._removAfter(" + index + ")", "color: darkorange");
	fileDrag._removeAfter(index);
},
removeEmptyItem : function () {
    var nodes = this._dragSource.getAllNodes();
    console.log("%c_GroupDragPane.removeEmptyItem    nodes:", "color: darkorange");
    console.dir({nodes:nodes});
    var nodesCopy = dojo.clone(this._dragSource.getAllNodes());
    console.dir({nodesCopy:nodesCopy});

    console.log("%c_GroupDragPane.removeEmptyItem    nodes[0].item.name:", "color: darkorange");
    console.dir({item:nodes[0].item.name});

    if ( nodes[0].item.name != "<EMPTY>" ) return;

	console.log("%c_GroupDragPane.removeEmptyItem    Doing dndItems.splice(0, 1)", "color: darkorange");

	this.items.splice(0, 1);
	dojo.destroy(nodes[0]);
},
addEmptyItem : function () {
// INSERT A FAKE ITEM WITH NAME <EMPTY>
	console.log("%c_GroupDragPane.addEmptyItem    this.parentPath: " + this.parentPath, "color: darkorange");
	console.log("%c_GroupDragPane.addEmptyItem    this.path: " + this.path, "color: darkorange");

	if ( this.items.length ) return;

	var item = new Object;
	item.name = "<EMPTY>";
	item.parentPath = this.path;
	console.log("%c_GroupDragPane.addEmptyItem    item: ", "color: darkorange");
	console.dir({item:item});

	this.items.push(item);
},
inItems : function (itemName) {
// RETURN TRUE IF FILE NAME EXISTS IN THIS GROUP DRAG PANE, ELSE RETURN FALSE
	console.log("%c_GroupDragPane.inItems    itemName: " + itemName, "color: darkorange");
	if ( itemName == null )	return;
	
	var dndItems = this._dragSource.getAllNodes();
	console.log("%c_GroupDragPane.inItems    dndItems: ", "color: darkorange");
	console.dir({dndItems:dndItems});
	
	for ( var i = 0; i < dndItems.length; i++ )
	{
		console.log("%c_GroupDragPane.inItems    dndItems[i].innerHTML: " + dndItems[i].innerHTML, "color: darkorange");
		if ( itemName == dndItems[i].innerHTML )	return true;
	}
	
	return false;
},
onItems : function() {
//	called after a fetch or load - at this point, this.items should be set and loaded.
	console.log("%c_GroupDragPane.onItems    this.items.length: " + this.items.length, "color: darkorange");
	console.log("%c_GroupDragPane.onItems    this.items: ", "color: darkorange");	
	console.dir({this_items:this.items});
	
	var thisObject = this;
	for ( var i = 0; i < this.items.length; i++) {			
		this.items[i].path = this.items[i].name;
	}	
	
	var selectItem, hadChildren = false;
	
	console.log("%c_GroupDragPane.onItems    BEFORE this._getDragSource", "color: darkorange");	
	this._dragSource = this._getDragSource({
		path: this.path,
		parentPath: this.parentPath
	});
	console.log("%c_GroupDragPane.onItems    AFTER this._getDragSource", "color: darkorange");	
	console.log("%c_GroupDragPane.onItems    this._dragSource: ", "color: darkorange");	
	console.dir({this__dragSource:this._dragSource});

	// ADD THE STORE'S parentPath TO THE MENU
	this._dragSource.store = this.store;

	// IF THERE ARE NO ITEMS FOR THIS DIRECTORY,
	// INSERT A FAKE ITEM WITH NAME <EMPTY> 
	if ( ! this.items.length )	this.addEmptyItem()

	var child, selectMenuItem;
	if ( this.items.length ) {
		dojo.forEach(
			this.items,
			function(item)
		{
			child = this.parentWidget._getMenuItemForItem(item, this);
			if ( child )
			{
				this._dragSource.insertNodes(false, [child]);
				var insertedNodes = this._dragSource.getAllNodes();
				var lastNode = insertedNodes[insertedNodes.length - 1];
				
				// ADD DATA STORE TO ITEM'S CHILDREN
				if ( item.children )
				{
					for ( var i = 0; i < item.children.length; i++ )
					{
						item.children[i]._S = item._S;
						var childParentPath;
						var fullPath = '';
						if ( item.parentPath )	fullPath = item.parentPath;
						if ( item.path )	{
							if ( fullPath )
								fullPath += "/" + item.path;
							else
								fullPath = item.path;
						}
						if ( fullPath )
							item.children[i].parentPath = fullPath;
					}
					console.log("%c_GroupDragPane.onItems    [] []  [] [] [] [] [] [] [] [] [] [] Setting item.directory = true", "color: darkorange");
					item.directory = true;
				}

				// ADD ITEM TO THIS NODE
				lastNode.item = item;
				
				// SET CLASS
				dojo.hasClass(lastNode, "dojoxRollingListItemSelected");

				var applicationName = lastNode.innerHTML;
	
				// GET indexInParent - THE LEVEL OF THIS MENU IN THE PARENT
				var indexInParent = this.getIndexInParent();
	
				// SET nodeType BASED ON THE indexInParent TO COINCIDE WITH accept PARAMETER
				// OF DND SOURCE OF SAME LEVEL (E.G., Workflows CAN BE DRAGGED NEXT TO OTHER
				// WORKFLOWS BUT NOT INTO THE LOWER FILE DIRECTORIES)
				var nodeType;
				if ( indexInParent == 0 )
				{
					nodeType = 'workflow';
				}
				else
				{
					if ( item.directory == false || item.directory == "false" )
						nodeType = "file";
					else
						nodeType = "folder";
				}
				console.log("%c_GroupDragPane.onItems    [] [] [] [] [] [] [] [] [] [] [] item: ", "color: darkorange");
				console.dir({item:item});
				console.log("%c_GroupDragPane.onItems    [] [] [] [] [] [] [] [] [] [] [] nodeType: " + nodeType, "color: darkorange");

				// GENERATE DYNAMIC DHTML MENU
				// AND BIND MENU TO THE DND NODE
				var dynamicMenu = thisObject.createMenu(nodeType);
				console.log("%c_GroupDragPane.onItems    dynamicMenu: " + dynamicMenu, "color: darkorange");
				if ( dynamicMenu != null )
				{
					dynamicMenu.bindDomNode( lastNode );
				}
				lastNode.setAttribute("dndType", nodeType);					

				// CONNECT ONCLICK
				dojo.connect(lastNode, "onclick", this, "onclickHandler");

				var _dragSource = this._dragSource;
				this._dragSource.onDropExternal = function(source, nodes, copy) {
					thisObject.onDropExternal(source, nodes, copy, _dragSource, item, lastNode);
				};
				
			} // if(child)
			
		}, this); // dojo.forEach(this.items, function(item)

	} // if ( this.items.length )
	
	// ADD dojo.connect TO DND SOURCE NODES
	console.log("%c_GroupDragPane.onItems    Adding dojo.connect to DND source nodes", "color: darkorange");
	var allNodes = this._dragSource.getAllNodes();
	console.log("%c_GroupDragPane.onItems    allNodes.length: " + allNodes.length, "color: darkorange");
	for ( var i = 0; i < allNodes.length; i++ ) {
		var node = allNodes[i];
		dojo.addClass(node, "fileDrag");

		if ( ! node.item.directory || node.item.directory == "false" )
		{
			dojo.addClass(node, "file");
			dojo.addClass(node, "fileClosed");
		}
		else
		{
			dojo.addClass(node, "directory");
			dojo.addClass(node, "directoryClosed");
		}
		
		var applicationName = node.innerHTML;

		// GET indexInParent - THE LEVEL OF THIS MENU IN THE PARENT
		var indexInParent = this.getIndexInParent();

		// SET nodeType BASED ON THE indexInParent TO COINCIDE WITH accept PARAMETER
		// OF DND SOURCE OF SAME LEVEL (E.G., Workflows CAN BE DRAGGED NEXT TO OTHER
		// WORKFLOWS BUT NOT INTO THE LOWER FILE DIRECTORIES)
		var nodeType;
		if ( indexInParent == 0 )
		{
			nodeType = 'workflow';
		}
		else
		{
			nodeType = "file";
		}
		node.setAttribute("dndType", nodeType);
	}	

	this.containerNode.innerHTML = "";		
	this.containerNode.appendChild(this.menuNode);
	this.parentWidget.scrollIntoView(this);
	
	console.log("%c_GroupDragPane.onItems    END", "color: darkorange");
	
	console.log("%c_GroupDragPane.onItems    BEFORE this.inherited(arguments)", "color: darkorange");
	this.inherited(arguments);
	console.log("%c_GroupDragPane.onItems    AFTER this.inherited(arguments)", "color: darkorange");

	console.log("%c_GroupDragPane.onItems    END OF SUB", "color: darkorange");
},
onDropExternal : function (source, nodes, copy, _dragSource, item, lastNode) {
/*
	OVERRIDE dojo.dnd.Source.onDropExternal TO NOTIFY SERVER OF CHANGES.

	COMPLETE THE COPY ON THE REMOTE FILESYSTEM AS FOLLOWS:
	
		1. CARRY OUT DND COPY
	   
		2. CHECK IF FILENAME ALREADY EXISTS, IF SO
			   DO POPUP TO CONFIRM OVERWRITE	
	   
		3. MESSAGE SERVER TO COPY FILES
	   
		4. SHOW ANIMATED 'COPYING' DIALOGUE
	   
		5. POLL SERVER FOR STATUS AND WAIT UNTIL COMPLETE
	   
		6. RELOAD THE PANE TO SHOW THE NEW FILE SYSTEM
*/

	console.log("%c_GroupDragPane.onDropExternal    plugins.files._GroupDragPane.onDropExternal(source, nodes, copy, _dragSource, item, lastNode, childScope)", "color: darkorange");
	console.log("%c_GroupDragPane.onDropExternal     source: " + source, "color: darkorange");
	console.dir({node:nodes});
	console.dir({_dragSource:_dragSource});
	console.dir({item:item});
	console.log("%c_GroupDragPane.onDropExternal     copy: " + copy, "color: darkorange");

	// SET this.lastNode
	this.lastNode = lastNode;
	this._dragSource = _dragSource;

	// RESET URL
	var location	=	this.store.putData.location;
	console.log("%c_GroupDragPane.onDropExternal     location: " + location, "color: darkorange");
	
	var file = nodes[0].item.parentPath + "/" + nodes[0].item.path;
	var destination = this.path;
	if ( location && ! destination.match(/^\//) )
		destination = location + "/" + this.path;
	
	// DO copyFile
	console.log("%c_GroupDragPane.onDropExternal     Doing this.checkFilePresent(file, destination)", "color: darkorange");
	this.checkFilePresent(file, destination);
},
checkFilePresent : function (file, destination) {
	console.log("%c_GroupDragPane.checkFilePresent     file: " + file, "color: darkorange");
	console.log("%c_GroupDragPane.checkFilePresent     destination: " + destination, "color: darkorange");

	// CHECK IF A FILE OR FOLDER WITH THE SAME NAME AS THE DROPPED 
	// FILE/FOLDER ALREADY EXISTS IN THIS FOLDER
	if ( this.inItems(file) ) {
		console.log("%c_GroupDragPane.checkFilePresent     file ALREADY EXISTS: " + file, "color: darkorange");
		thisObject.confirmOverwrite(file, destination);
	}
	else {
		this.prepareCopy(file, destination);
		this.copyFile();
		this.delayedPollCopy();
	}
},
prepareCopy : function (file, destination) {
	// SET this.putData
	var putData = this.store.putData;
	console.log("%c_GroupDragPane.prepareCopy     BEFORE putData: ", "color: darkorange");
	console.dir({putData:putData});
	putData.mode 			=	"copyFile";
	putData.module 			=	"Folders";
	putData.sessionid		=	Agua.cookie('sessionid');
	putData.username		=	Agua.cookie('username');
	putData.file			=	file;
	putData.destination		=	destination;
	this.putData 	= 	putData;
	console.log("%c_GroupDragPane.prepareCopy     this.putData: ", "color: darkorange");
	console.dir({this_putData:this.putData});
},
confirmOverwrite : function(file, destination) {
	console.log("%c_GroupDragPane.confirmOverwrite    file: " + file, "color: darkorange");
	console.log("%c_GroupDragPane.confirmOverwrite    destination: " + destination, "color: darkorange");
	
	// SET CALLBACKS
	var thisObject = this;
	var yesCallback = function() {
		thisObject.prepareCopy(file, destination);
		thisObject.copyFile();
		thisObject.delayedPollCopy();
	};
	var noCallback = function() {};
	var title = "Delete file: " + file + "?";
	var message = "File already exists<br>Do you want to overwrite it?<br><span style='color: #222;'>Click 'Yes' to delete or 'No' to cancel</span>";
	console.log("%c_GroupDragPane.confirmOverwrite    title: " + title, "color: darkorange");
	console.log("%c_GroupDragPane.confirmOverwrite    message: " + message, "color: darkorange");

	// REFRESH CONFIRM WIDGET
	if ( this.confirm != null ) 	this.confirm.destroy();

	// SHOW DIALOGUE
	this.confirm = new Confirm({
		parentWidget : this,
		title: title,
		message : message,
		yesCallback : yesCallback,
		noCallback : noCallback
	});
	this.confirm.show();
},
copyFile : function () {
//	2. CHECK IF FILENAME ALREADY EXISTS AND IF SO CONFIRM OVERWRITE
	var putData = this.putData;
	console.log("%c_GroupDragPane.copyFile    putData: ", "color: darkorange");
	console.dir({putData:putData});

	var url = Agua.cgiUrl + "agua.cgi?";
	console.log("%c_GroupDragPane.copyFile    url: " + url, "color: darkorange");

	// SHOW STANDBY
	this.standby.show();

	var thisObject = this;
	dojo.xhrPut({
		url: url,
		handleAs: "json-comment-optional",
		sync: false,
		putData: dojo.toJson(putData),
		handle: function(response){
			console.log("%c_GroupDragPane.copyFile    response: ", "color: darkorange");
			console.dir({response:response});
			if ( ! response || ! response.error ) {
				console.log("%c_GroupDragPane.copyFile    Doing startPollCopy", "color: darkorange");
				thisObject.pollCopy();
			}
			else if ( response.error ) {
				// HIDE STANDBY
				thisObject.standby.hide();
	
				Agua.toastMessage({
					message: response.error,
					type: "error"
				});
			}
		}
	});
},
delayedPollCopy : function (delay) {
	console.log("%c_GroupDragPane.delayedPollCopy    Doing this.sequence.go(commands, ...)", "color: darkorange");
	if ( ! delay ) delay = 6000;
	var commands = [
		{ func: [this.showMessage, this, "_GroupDragPane.delayedPollCopy"], pauseAfter: delay },
		{ func: this.pollCopy } // no array, just a function to call 
	];
	console.log("%c_GroupDragPane.delayedPollCopy    commands: " + commands, "color: darkorange");
	console.dir({commands:commands});
	
	this.sequence.go(commands, function(){ });	
},
showMessage : function (message)  {
	console.log(message, "color: darkorange");
},
pollCopy : function() {
// 5. POLL SERVER FOR STATUS AND WAIT UNTIL COMPLETE
	if ( ! this.putData ) {
		if ( this.standby )
			this.standby.hide();
		return;
	}
	
	this.putData.modifier = "status";
	console.log("%c_GroupDragPane.pollCopy    this.putData: ", "color: darkorange");
	console.dir({this_putData:this.putData});

	var url = Agua.cgiUrl + "agua.cgi?";
	console.log("%c_GroupDragPane.copyFile    url: " + url, "color: darkorange");

	var thisObject = this;
	var completed = false;
	dojo.xhrPut({
		url			: 	url,
		handleAs	: 	"json-comment-optional",
		sync		: 	false,
		putData		:	dojo.toJson(this.putData),
		handle		: 	function (response) {
			console.log("%c_GroupDragPane.pollCopy    this.response: ", "color: darkorange");
			console.dir({response:response});
			
			if ( response.status == 'completed' ) {
				thisObject.polling = false;
				thisObject.standby.hide();
				
				// DELETE EXISTING FILECACHE
				Agua.setFileCache(thisObject.putData.username, thisObject.putData.destination, null);
				
				// RELOAD PANE
				var putData = new Object;
				putData.mode 			=	"fileSystem";
				putData.module 			=	"Folders";
				putData.sessionid		=	Agua.cookie('sessionid');
				putData.username		=	thisObject.putData.username;
				putData.url				=	Agua.cgiUrl + "agua.cgi?";
				putData.path			=	putData.destination;
				thisObject.parentWidget.store.putData		=	putData;
				
				console.log("%c_GroupDragPane.pollCopy    AFTER putData:", "color: darkorange");
				console.dir({putData:putData});
			
				// SET this.url AND this.putData
				thisObject.url 		= 	putData.url;
				thisObject.putData 	= 	putData;
				
				thisObject.reloadPane();
			}
			else if ( response.error ) {
				thisObject.polling = false;
				thisObject.standby.hide();
			}
			else
				thisObject.delayedPollCopy();
		}
	});
},
setSequence : function () {
	console.log("%cplugins.files._GroupDragPane.setSequence     BEFORE new dojox.timing.Sequence({})", "color: darkorange");
	this.sequence = new Sequence({});
	console.log("%cplugins.files._GroupDragPane.setSequence     AFTER new dojox.timing.Sequence({})", "color: darkorange");
},
setStandby : function () {
	console.log("%c_GroupDragPane.setStandby    _GroupDragPane.setStandby()", "color: darkorange");
	//if ( this.standby )	return this.standby;
	
	var id = dijit.getUniqueId("dojox_widget_Standby");
	this.standby = new Standby ({
		target: this.parentWidget.domNode,
		//onClick: "reload",
		text: "Copying",
		id : id,
		url: "plugins/core/images/agua-biwave-24.png"
	});
	document.body.appendChild(this.standby.domNode);
	console.log("%c_GroupDragPane.setStandby    this.standby: " + this.standby, "color: darkorange");

	return this.standby;
},
reloadPane : function() {
	console.group("_GroupDragPane-" + this.id + "    reloadPane");
	
	console.log("%c_GroupDragPane.reloadPane    plugins.files._GroupDragPane.reloadPane()", "color: darkorange");
	var item = this.lastNode.item;
	console.log("%c_GroupDragPane.reloadPane    item: ", "color: darkorange");
	console.dir({item:item});
	
	var children = item.children;
	if ( ! children )
		children = item.items;
	
	// CHANGE item PATH, NAME AND PARENTPATH TO ONE FOLDER UP
	item = this.itemParent(item);
	
	var itemPane = this.parentWidget._getPaneForItem(item, this._dragSource, children);
	this.query = itemPane.store.query;
	if ( itemPane )
	{
		var paneIndex = this.getIndexInParent();
		this.parentWidget.addChild( itemPane, this.getIndexInParent() );
	}

	console.groupEnd("_GroupDragPane-" + this.id + "    reloadPane");
},
itemParent : function(item) {
	console.log("%c_GroupDragPane.itemParent(item)", "color: darkorange");
	console.dir({item:item});
	
	// SET DIRECTORY = TRUE
	item.directory = true;
	
	// CHANGE NAME, PATH AND PARENTPATH
	//
	// 1. IF PARENTPATH CONTAINS MULTIPLE LEVELS,
	// 		E.G., 'Project1/Workflow1-assembly'
	if ( item.parentPath.match(/^.+\/([^\/]+)$/) )
	{
		item.path = item.parentPath.match(/^(.+?)\/([^\/]+)$/)[2];
		item.parentPath = item.parentPath.match(/^(.+?)\/([^\/]+)$/)[1];
	}

	// 2. IF PARENTPATH IS AT THE TOP LEVEL, E.G., 'Project1',
	// 		SET PATH = PARENTPATH AND PARENTPATH = '' 
	else if ( item.parentPath.match(/\/*[^\/]+$/) )
	{
		item.path = item.parentPath;
		item.parentPath = '';
	}						
	item.name = item.path;
	//item.parentPath = item.parentPath.match(/^(.+?)\/[^\/]+$/)[1];

	console.log("%c_GroupDragPane.itemParent    Returning item:", "color: darkorange");
	console.dir({item:item});
	return item;
},
onclickHandler : function (e) {
// HANDLE CLICK ON FILE OR FOLDER
	console.group("_GroupDragPane-" + this.id + "    onclickHandler");
	console.log("%c_GroupDragPane._onclickHandler    XXXXXXXXXXXXXXXXXXXXXXXXXxx e.target: ", "color: darkorange");
	console.dir({e_target_item:e.target});
	console.log("%c_GroupDragPane._onclickHandler    XXXXXXXXXXXXXXXXXXXXXXXXXxx e.target.item: ", "color: darkorange");
	console.dir({e_target_item:e.target.item});
	console.log("%c_GroupDragPane._onclickHandler    XXXXXXXXXXXXXXXXXXXXXXXXXxx this: " + this, "color: darkorange");

	
	// GET THE CLICKED DND SOURCE ITEM NODE
	var item = e.target.item;
	var children = item.children || item.items;
	
	var itemPane = this.parentWidget._getPaneForItem(item, this, children);

	// SET this.query TO itemPane.store.query
	this.query = itemPane.store.query;
	console.log("%c_GroupDragPane._onclickHandler    this.query: " + dojo.toJson(this.query, true), "color: darkorange");
	
	if (itemPane) {
		// CALLS addChild IN FileDrag
		// summary: adds a child to this rolling list - if passed an insertIndex,
		//  then all children from that index on will be removed and destroyed
		//  before adding the child.
		console.log("%c_GroupDragPane._onclickHandler    Doing this.parentWidget.addChild(itemPane, " + (this.getIndexInParent() + 1) + ")", "color: darkorange");
		
		this.parentWidget.addChild(itemPane, this.getIndexInParent() + 1);
	}
	else {
		this.parentWidget(this);
		this.parentWidget._onItemClick(null, this, selectMenuItem.item, selectMenuItem.children);
	}

	console.groupEnd("_GroupDragPane-" + this.id + "    onclickHandler");
},
focus: function (force){
	// summary: sets the focus to this current widget

	
	if(this._dragSource){
		if(this._pendingFocus){
			this.disconnect(this._pendingFocus);
		}
		delete this._pendingFocus;
		
		// We focus the right widget - either the focusedChild, the
		//   selected node, the first menu item, or the menu itself
		var focusWidget = this._dragSource.focusedChild;
		if(!focusWidget){
			var focusNode = dojo.query(".dojoxRollingListItemSelected", this.domNode)[0];
			if(focusNode){
				focusWidget = dijit.byNode(focusNode);
			}
		}
		
		if(!focusWidget){
			focusWidget = this._dragSource.getAllNodes()[0] || this._dragSource;
		}

		this._focusByNode = false;

		if(focusWidget.focusNode){
			if(!this.parentWidget._savedFocus || force){
				try{focusWidget.focusNode.focus();}catch(e){}
			}
			window.setTimeout(function(){
				try{
					dijit.scrollIntoView(focusWidget.focusNode);
				}catch(e){}
			}, 1);
		}else if(focusWidget.focus){
			if(!this.parentWidget._savedFocus || force){
				focusWidget.focus();
			}
		}else{
			this._focusByNode = true;
		}
		this.inherited(arguments);
	}else if(!this._pendingFocus){
		this._pendingFocus = this.connect(this, "onItems", "focus");
	}
	else
	{
	}
	
},
_getDragSource: function(){
	// summary: returns a widget to be used for the container widget.
	// GET UNIQUE ID FOR THIS MENU TO BE USED IN DND SOURCE LATER
	
	console.log("%c_GroupDragPane._getDragSource    START", "color: darkorange");	
	
	var objectName = "dojo.dnd.Source";
	var id = dijit.getUniqueId(objectName.replace(/\./g,"_"));
	console.log("%c_GroupDragPane._getDragSource    id: " + id, "color: darkorange");	
	//var id = dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));

	//// CREATE NODE
	//var div = domConstruct.create("div", null, id, null);
	//console.log("%c_GroupDragPane._getDragSource    div: " + div, "color: darkorange");	
	//console.dir({div:div});
	
	// SET THE MENU NODE'S ID TO THIS NEW ID
	console.log("%c_GroupDragPane._getDragSource    this.menuNode: " + this.menuNode, "color: darkorange");	
	this.menuNode.id = id;
	
	// GET indexInParent - THE LEVEL OF THIS DRAG SOURCE IN THE PARENT
	console.log("%c_GroupDragPane._getDragSource    BEFORE this.getIndexInParent()", "color: darkorange");	
	var indexInParent = this.getIndexInParent();
	console.log("%c_GroupDragPane._getDragSource    AFTER this.getIndexInParent()", "color: darkorange");	
	
	// SET accept BASED ON THE indexInParent
	
	var acceptType;
	if ( indexInParent == 0 ) {
		acceptType = 'workflow';
	}
	else {
		acceptType = "file";
	}

	// GENERATE DND SOURCE WITH UNIQUE ID
	console.log("%c_GroupDragPane._getDragSource    BEFORE new Source()", "color: darkorange");	
	//console.log("%c_GroupDragPane._getDragSource    Source: " + Source, "color: darkorange");	
	var dragSource = new Source(
		this.menuNode,
		{
			accept: [ acceptType ],
			copyOnly: true
		}
	);
	console.log("%c_GroupDragPane._getDragSource    AFTER new Source()", "color: darkorange");	
	console.log("%c_GroupDragPane._getDragSource    dragSource: " + dragSource, "color: darkorange");
		
	// SET baseClass
	this.menuNode.setAttribute('class', 'fileDrag');
	
	// SET PARENTPATH AND PATH
	if ( this.path )
	{
		dragSource.path = this.path;
	}
	if ( this.parentPath )
	{
		dragSource.parentPath = this.parentPath;
	}

	if(!dragSource._started){
		dragSource.startup();
	}

	console.log("%c_GroupDragPane._getDragSource    END", "color: darkorange");	

	return dragSource;
},
getPreviousPane : function () {
// RETURN THE PREVIOUS DRAG PANE IN THE FILE DRAG

	var fileDrag = this.parentWidget;
	console.log("%cfileMenu.getPreviousPane    fileDrag: ", "color: darkorange");
	console.dir({fileDrag:fileDrag});
	console.dir({fileDrag:fileDrag});
	
	var index = 0;
	var children = fileDrag.getChildren();
	console.log("%cfileMenu.getPreviousPane    children.length: " + children.length, "color: darkorange");
	
	for ( var i = 0; i < children.length; i++ ) {
		if ( children[i] == this ) {
			index = i;
			break;
		}
	}

	if ( index == 0 )    return null;
	return children[index - 1];
}

});
});

console.log("%c%cplugins/files/_GroupDragPane    COMPLETED", "color: blue", "color: darkorange");
