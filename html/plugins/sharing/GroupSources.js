//dojo.provide("plugins.sharing.GroupSources");
//
//dojo.require("dijit.dijit"); // optimize: load dijit layer
//
//dojo.require("dijit.form.Button");
//dojo.require("dijit.form.ComboBox");
//dojo.require("dijit.form.ComboBox");
//
//dojo.require("dojo.data.ItemFileWriteStore");
//
//// TOOLTIP
//dojo.require("dijit.Tooltip");
//
//dojo.require("dojo.parser");
//dojo.require("dojo.dnd.Source");
//
//// HAS A
//dojo.require("plugins.sharing.GroupSourceRow");
//
//dojo.declare("plugins.sharing.GroupSources",
//
//	[ dijit._Widget, dijit._Templated, plugins.core.Common ],
//{
////Path to the template of this widget. 
//templatePath: dojo.moduleUrl("plugins", "sharing/templates/groupsources.html"),
//
//// Calls dijit._Templated.widgetsInTemplate
//widgetsInTemplate : true,
	
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

	"plugins/core/Common",
	"plugins/sharing/GroupSourceRow",
	
	"dijit/form/Button",
	"dijit/form/ComboBox",
	"dojo/data/ItemFileWriteStore",
	"dijit/Tooltip",
	"dojo/dnd/Source",
//
//dojo.declare("plugins.sharing.GroupSources",


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
	_WidgetsInTemplateMixin,
	
	Common,
	GroupSourceRow
) {

/////}}}}}

return declare([
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Common
], {

// templateString : String	
//		Path to the template of this widget. 
templateString: dojo.cache("plugins", "sharing/templates/groupsources.html"),


//addingSource STATE
addingSource : false,

// OR USE @import IN HTML TEMPLATE
cssFiles : [ "plugins/sharing/css/groupsources.css" ],

// PARENT WIDGET
parentWidget : null,

////}}}

constructor : function(args) {
	// LOAD CSS
	this.loadCSS();		
},
postCreate : function() {
	this.startup();
},
startup : function () {
	console.log("GroupSources.startup    plugins.sharing.GroupSources.start()");

	// COMPLETE CONSTRUCTION OF OBJECT
	this.inherited(arguments);	 

	// ADD ADMIN TAB TO TAB CONTAINER		
	this.attachPoint.addChild(this.sourcesTab);
	//this.attachPoint.selectChild(this.sourcesTab);

	// SET GROUP COMBO
	this.setGroupCombo();

	// SET DRAG SOURCE - LIST OF SOURCES
	this.setDragSource();
	
	// CREATE DROP TARGET
	this.createDropTarget();
	
	// SET DROP TARGET - SOURCES ALREADY IN THE GROUP
	this.setDropTarget();
	
	// SET TRASH DROP TARGET
	this.setTrash();
	
	// SUBSCRIBE TO UPDATES
	Agua.updater.subscribe(this, "updateGroups");

	// SUBSCRIBE TO UPDATES
	Agua.updater.subscribe(this, "updateSources");
},
updateGroups : function (args) {
	console.log("sharing.GroupSources.updateGroups    sharing.GroupSources.updateGroups(args)");
	console.log("sharing.GroupSources.updateGroups    args:");
	console.dir(args);
	this.reload();
},
updateSources : function (args) {
	console.log("sharing.GroupSources.updateSources    sharing.GroupSources.updateSources(args)");
	console.log("sharing.GroupSources.updateSources    args:");
	console.dir(args);
	this.reload();
},
reload : function () {
// RELOAD THE GROUP COMBO AND DRAG SOURCE
// (CALLED AFTER CHANGES TO SOURCES OR GROUPS DATA IN OTHER TABS)
	console.log("sharing.GroupSources.reload    sharing.GroupSources.reload()");

	// SET GROUP COMBO
	this.setGroupCombo();

	// SET DRAG SOURCE - LIST OF SOURCES
	this.setDragSource();

	// SET DROP TARGET - SOURCES ALREADY IN THE GROUP
	this.setDropTarget();
},
setGroupCombo : function () {
	console.log("GroupSources.setGroupCombo     plugins.sharing.GroupSources.setGroupCombo()");

	// GET GROUP NAMES		
	var itemArray = Agua.getGroupNames();
	console.log("GroupSources.setGroupCombo     itemArray");
	console.dir({itemArray:itemArray});
	var store = this.createStore(itemArray);

	// SET COMBO
	this.groupCombo.store = store;
	this.groupCombo.startup();
	console.log("GroupSources.setGroupCombo::setCombo     AFTER this.groupCombo.startup()");

	// SET COMBO VALUE
	var firstValue = itemArray[0];
	this.groupCombo.setValue(firstValue);
	console.log("GroupSources.setGroupCombo::setCombo     AFTER this.groupCombo.setValue(firstValue)");

	// CONNECT ONCLICK WITH dojo.connect TO BUILD TABLE
	var sharingSources = this;
	dojo.connect(this.groupCombo, "onChange", function(event) {
		sharingSources.setDropTarget();
	});
},
setDragSource : function () {
	console.log("GroupSources.setDragSource     plugins.sharing.GroupSources.setDragSource()");
	// REMOVE ALL EXISTING CONTENT
	while ( this.dragSourceContainer.firstChild )
	{
		if ( dijit.byNode(this.dragSourceContainer)
			&& dijit.byNode(this.dragSourceContainer).destroy )
		{
			dijit.byNode(this.dragSourceContainer).destroy();
		}
		this.dragSourceContainer.removeChild(this.dragSourceContainer.firstChild);
	}

	var dataArray = new Array;
	var sourceArray = Agua.getSources();
	console.log("GroupSources.setDragSource     sourceArray: ");
	console.dir({sourceArray:sourceArray});
	//console.log("GroupSources.setDragSource     sourceArray.length: " + sourceArray.length);


	if ( sourceArray == null || ! sourceArray )
	{
		console.log("GroupSources.setDragSource     sourceArray is null or empty. Returning.");
		return;
	}

	for ( var j = 0; j < sourceArray.length; j++ )
	{
		var data = sourceArray[j];				
		data.toString = function () { return this.name; }
		dataArray.push( { data: data, type: ["draggableItem"] } );
	}

	// GENERATE DND SOURCE
	var dragSource = new dojo.dnd.Source(
		this.dragSourceContainer,
		{
			copyOnly: true,
			selfAccept: false,
			accept : [ "none" ]
		}
	);
	dragSource.insertNodes(false, dataArray);
	//console.log("GroupSources.setDragSource     dragSource: " + dragSource);
	//console.log("GroupSources.setDragSource     dragSource.domNode: " + dragSource.domNode);

	// SET TABLE ROW STYLE IN dojDndItems
	var allNodes = dragSource.getAllNodes();
	//console.log("GroupSources.setDragSource     After insertNodes. allNodes.length: " + allNodes.length);
	for ( var k = 0; k < allNodes.length; k++ )
	{
		// ADD CLASS FROM type TO NODE
		var node = allNodes[k];

		//console.log("GroupSources.setDragSource     Setting node " + k + " data: " + dojo.toJson(dataArray[k]));

		// SET NODE name AND description
		node.name = dataArray[k].data.name;
		node.description = dataArray[k].data.description;
		node.location = dataArray[k].data.location;

		var source = {
			name : node.name,
			location : node.location,
			description : node.description
		};

		//console.log("Sources.setDropTarget    dropTarget.creator    source: " + dojo.toJson(source));
		source.parentWidget = this;			

		var groupSourceRow = new plugins.sharing.GroupSourceRow(source);
		//console.log("Sources.setDropTarget    dropTarget.creator    groupSourceRow: " + groupSourceRow);
		node.innerHTML = '';
		node.appendChild(groupSourceRow.domNode);
	}

	var groupObject = this;
	dragSource.creator = function (item, hint)
	{
		console.log("GroupSources.setDragSource dragSource.creator         item: " + dojo.toJson(item));
		//console.log("GroupSources.setDragSource dragSource.creator         item: " + item);
		//console.log("GroupSources.setDragSource dragSource.creator         hint: " + hint);

		var node = dojo.doc.createElement("div");
		node.name = item.name;
		node.description = item.description;
		node.location = item.location;
		node.id = dojo.dnd.getUniqueId();
		node.className = "dojoDndItem";

		//console.log("GroupSources.setDragSource dragSource.creator         node.name: " + node.name);
		//console.log("GroupSources.setDragSource dragSource.creator         node.description: " + node.description);

		// SET FANCY FORMAT IN NODE INNERHTML
		node.innerHTML = "<table> <tr><td><strong style='color: darkred'>" + item.name + "</strong></td></tr><tr><td> " + item.description + "</td></tr></table>";
		//console.log("GroupSources.setDragSource dragSource.creator         node: " + node);

		return {node: node, data: item, type: ["text"]};
	};
},
createDropTarget : function () {
	// GENERATE DROP TARGET
	this.dropTarget = new dojo.dnd.Source(
		this.dropTargetContainer,
		{
			accept : [ "draggableItem" ]
		}
	);

	var thisObject = this;

	this.dropTarget.creator = function (item, hint)
	{
		console.log("GroupSources.createDropTarget this.dropTarget.creator         item: ");
		console.dir({item:item});
		console.log("GroupSources.createDropTarget this.dropTarget.creator         hint: " + hint);

		var data			= item;
		if ( item.data )	data = item.data;
		var name 			= data.name;
		var description	 	= data.description;
		var location 		= data.location;

		// ADD VALUES TO NODE SO THAT THEY GET PASSED TO this.addToGroup
		var node = dojo.doc.createElement("div");
		node.name 			= name;
		node.description 	= description;
		node.location 		= location;
		node.id 			= dojo.dnd.getUniqueId();
		node.className 		= "dojoDndItem";

		var source = {
			name : name,
			description : description,
			location : location
		}; 
		console.log("GroupUsers.createDropTarget    this.dropTarget.creator    source: ");
		console.dir({source:source});

		source.parentWidget = this;			

		var groupSourceRow = new plugins.sharing.GroupSourceRow(source);
		//console.log("GroupUsers.createDropTarget    this.dropTarget.creator    groupUserRow: " + groupUserRow);
		node.innerHTML = '';
		node.appendChild(groupSourceRow.domNode);


		if ( hint != 'avatar' )
		{
			thisObject.addToGroup(node.name, node.description, node.location);
		}

		return {node: node, data: item, type: ["draggableItem"]};
	};
	

	dojo.connect(this.dropTarget, "onDndDrop", function(source, nodes, copy, target){
		console.log("GroupSources.createDropTarget dojo.connect onDndDrop    AFTER this.dropTarget.onDndDrop");

		if ( source == this )
		{
			console.log("GroupSources.createDropTarget dojo.connect(onDndDrop)    Node has been moved to trash.");
			for ( var i = 0; i < nodes.length; i++ )
			{
				var node = nodes[i];
				//console.log("GroupSources.createDropTarget dojo.connect(onDndDrop)    node.name: " + node.name);
				//console.log("GroupSources.createDropTarget dojo.connect(onDndDrop)    node.item: " + node.item);
				//console.log("GroupSources.createDropTarget dojo.connect(onDndDrop)    node.description: " + node.description);
				
				//console.log("GroupSources.createDropTarget dojo.connect(onDndDrop)    Doing thisObject.removeFromGroup(node.name, node.description, node.location)");
				thisObject.removeFromGroup(node.name, node.description, node.location);
			}
		}
		
		// REMOVE DUPLICATE NODES
		var currentNodes = thisObject.dropTarget.getAllNodes();
		if ( currentNodes == null || ! currentNodes )
		{
			console.log("GroupSources.createDropTarget dojo.connect onDndDrop    currentNodes is null or empty. Returning");
			return;
		}
		
		var names = new Object;
		for ( var i = 0; i < currentNodes.length; i++ )
		{
			var node = currentNodes[i];
			//console.log("GroupSources.createDropTarget dojo.connect onDndDrop    Checking if node.name " + i + ": " + node.name + " already in nodes");
			if ( ! names[node.name] )
			{
				names[node.name] = 1;
			}
			else
			{
				// HACK TO AVOID THIS ERROR: node.parentNode is null
				try {
					node.parentNode.removeChild(node)

					// NB: this has no effect on nodes in dnd.Source
					//currentNodes.splice(i, 1); 
					//i--;
				}
				catch (e) {
					//console.log("GroupSources.createDropTarget dojo.connect onDndDrop    INSIDE catch");
				}
			}
		}
	});
},
setDropTarget : function () {
	console.log("GroupSources.setDropTarget     plugins.sharing.GroupSources.setDropTarget()");

	// DELETE EXISTING CONTENTS OF DROP TARGET
	while ( this.dropTargetContainer.firstChild )
	{
		console.log("GroupSources.setDropTarget     REMOVING firstChild");
		this.dropTargetContainer.removeChild(this.dropTargetContainer.firstChild);
	}

	//// GET THE SOURCES IN THIS GROUP
	var groupname = this.groupCombo.getValue();
	var sourceArray = Agua.getSourcesByGroup(groupname);
	if ( sourceArray == null )
	{
		console.log("GroupSources.setDropTarget     sourceArray is null or empty. Returning.");
		return;
	}		
	console.log("GroupSources.setDropTarget     sourceArray: " + dojo.toJson(sourceArray, true));

	if ( sourceArray == null || sourceArray.length == 0 )	return;

	var dataArray = new Array;
	for ( var j = 0; j < sourceArray.length; j++ )
	{
		var data = sourceArray[j];				
		data.toString = function () { return this.name; }
		var description = sourceArray[j].description;

		dataArray.push( { data: data, type: ["draggableItem"], description: description  } );
	}
	console.log("GroupSources.setDropTarget     dataArray: ");
	console.dir({dataArray:dataArray});
	//console.log("GroupSources.setDropTarget     dataArray.length: " + dataArray.length);

	this.dropTarget.insertNodes(false, dataArray );
	//console.log("GroupSources.setDropTarget     dropTarget: " + this.dropTarget);
	//console.log("GroupSources.setDropTarget     this.dropTarget.domNode: " + this.dropTarget.domNode);

	// SET TABLE ROW STYLE IN dojDndItems
	var allNodes = this.dropTarget.getAllNodes();
	console.log("GroupSources.setDropTarget     allNodes.length: " + allNodes.length);
	for ( var k = 0; k < allNodes.length; k++ )
	{
		// ADD CLASS FROM type TO NODE
		var node = allNodes[k];
		var nodeClass = dataArray[k].type;
		dojo.addClass(node, nodeClass);

		//console.log("GroupSources.setDropTarget     dataArray[" + k + "].data: " + dojo.toJson(dataArray[k].data));

		// SET APPLICATION FOR NODE
		node.description = dataArray[k].description;
		node.location = dataArray[k].location;

		var name = dataArray[k].data;
		node.name = name;

		// SET NODE name AND description
		node.name = dataArray[k].data.name;
		node.description = dataArray[k].data.description;
		node.location = dataArray[k].data.location;

		var source = {
			name : node.name,
			location : node.location,
			description : node.description
		};
		//console.log("Sources.setDropTarget    this.dropTarget.creator    source: " + dojo.toJson(source));
		source.parentWidget = this;			

		var groupSourceRow = new plugins.sharing.GroupSourceRow(source);
		node.innerHTML = '';
		node.appendChild(groupSourceRow.domNode);
		//console.log("Sources.setDropTarget    this.dropTarget.creator    groupSourceRow: " + groupSourceRow);
	}

	//var thisObject = this;
	//this.dropTarget.creator = function (item, hint)
	//{
	//	console.log("GroupSources.setDropTarget this.dropTarget.creator         item: " + dojo.toJson(item));
	//	console.log("GroupSources.setDropTarget this.dropTarget.creator         item: " + item);
	//	console.log("GroupSources.setDropTarget this.dropTarget.creator         hint: " + hint);
	//
	//	var name = item.name;
	//	var description = item.description;
	//
	//	// ADD VALUES TO NODE SO THAT THEY GET PASSED TO this.addToGroup
	//	var node = dojo.doc.createElement("div");
	//	node.name = item.name;
	//	node.description = item.description;
	//	node.location = item.location;
	//	node.id = dojo.dnd.getUniqueId();
	//	node.className = "dojoDndItem";
	//
	//	// SET FANCY FORMAT IN NODE INNERHTML
	//	//node.innerHTML = "<table> <tr><td><strong style='color: darkred'>" + name + "</strong></td></tr><tr><td> " + description + "</td></tr></table>";
	//
	//	var source = {
	//		name : node.name,
	//		description : node.description,
	//		location : node.location
	//	};
	//
	//	//console.log("GroupUsers.setDropTarget    this.dropTarget.creator    user: " + dojo.toJson(user));
	//	source.parentWidget = this;			
	//
	//	var groupSourceRow = new plugins.sharing.GroupSourceRow(source);
	//	//console.log("GroupUsers.setDropTarget    this.dropTarget.creator    groupUserRow: " + groupUserRow);
	//	node.innerHTML = '';
	//	node.appendChild(groupSourceRow.domNode);
	//
	//
	//	if ( hint != 'avatar' )
	//	{
	//		thisObject.addToGroup(node.name, node.description, node.location);
	//	}
	//
	//	return {node: node, data: item, type: ["draggableItem"]};
	//};
	

},
addToGroup : function (name, description, location ) {
	console.log("GroupSources.addToGroup    plugins.sharing.GroupSources.addToGroup(name, description, location)");
	console.log("GroupSources.addToGroup    name: " + name);
	//console.log("GroupSources.addToGroup    description: " + description);
	//console.log("GroupSources.addToGroup    location: " + location);
	
	var groupObject = new Object;
	groupObject.username = Agua.cookie('username');
	groupObject.name = name;
	groupObject.description = description;
	groupObject.location = location;
	
	// ADD SOURCE OBJECT TO THE SOURCES IN THIS GROUP
	var groupName = this.groupCombo.getValue();
	console.log("GroupSources.addToGroup     groupName: " + groupName);
	
	if ( Agua.addSourceToGroup(groupName, groupObject) == false )
	{
		console.log("GroupSources.addToGroup     Failed to add source to group: " + groupObject.name + ". Returning.");
		return;
	}

	// ADD THE SOURCE INTO THE groupusers TABLE ON THE SERVER
	var data = new Object;
	data.name = name;
	data.description = description;
	data.location = location;
	data.groupname = groupName;
	data.type = "source";
	
	var url = Agua.cgiUrl + "agua.cgi";
	var query = new Object;
	query.username = Agua.cookie('username');
	query.sessionid = Agua.cookie('sessionid');
	query.data = data;
	query.mode = "addToGroup";
	query.module = "Agua::Sharing";

	var queryString = dojo.toJson(query).replace(/undefined/g, '""');
	//console.log("SourceManager.addToGroup    queryString: " + queryString);

	// SEND TO SERVER
	dojo.xhrPut(
		{
			url: url,
			contentType: "text",
			sync : false,
			handleAs: "json",
			putData: queryString,
			timeout: 15000,
			load: function(data)
			{
				console.log("SourceManager.addToGroup    JSON loaded okay");
				console.log("SourceManager.addToGroup    data: " + dojo.toJson(data));		
			},
			error: function(response, ioArgs) {
				console.log("SourceManager.addToGroup    Error with JSON Post, response: " + response + ", ioArgs: " + ioArgs);
				return response;
			}
		}
	);
},
removeFromGroup : function (name, description, location ) {
	console.log("GroupSources.removeFromGroup    plugins.sharing.GroupSources.removeFromGroup(name, description, location)");
	console.log("GroupSources.removeFromGroup    name: " + name);
	//console.log("GroupSources.removeFromGroup    description: " + description);
	//console.log("GroupSources.removeFromGroup    location: " + location);

	// REMOVE SOURCE FROM THE SOURCES IN THIS GROUP
	var groupName = this.groupCombo.getValue();
	console.log("GroupSources.removeFromGroup     groupName: " + groupName);

	var sourceObject = new Object;
	sourceObject.name = name;
	sourceObject.description = description;
	sourceObject.location = location;
	//console.log("GroupSources.addToGroup     sourceObject: " + dojo.toJson(sourceObject));

	if ( Agua.removeSourceFromGroup(groupName, sourceObject) == false )
	{
		console.log("GroupSources.removeFromGroup     Failed to remove source from group: " + sourceObject.name + ". Returning.");
		return;
	}

	// REMOVE THE SOURCE FROM THE groupusers TABLE ON THE SERVER
	var data = new Object;
	data.name = String(name);
	data.description = description;
	data.location = location;
	data.groupname = groupName;
	data.type = "source";
	
	var url = Agua.cgiUrl + "agua.cgi";
	var query = new Object;
	query.username = Agua.cookie('username');
	query.sessionid = Agua.cookie('sessionid');
	query.data = data;
	query.mode = "removeFromGroup";
	query.module = "Agua::Sharing";

	var queryString = dojo.toJson(query).replace(/undefined/g, '""');
	//console.log("SourceManager.removeFromGroup    queryString: " + queryString);

	// SEND TO SERVER
	dojo.xhrPut(
		{
			url: url,
			contentType: "text",
			sync : false,
			handleAs: "json",
			putData: queryString,
			timeout: 15000,
			load: function(data)
			{
				console.log("SourceManager.removeFromGroup    JSON loaded okay");
				console.log("SourceManager.removeFromGroup    data: " + dojo.toJson(data));		
			},
			error: function(response, ioArgs) {
				console.log("SourceManager.removeFromGroup    Error with JSON Post, response: " + response + ", ioArgs: " + ioArgs);
				return response;
			}
		}
	);
},
setTrash : function () {
	console.log("GroupSources.setTrash     plugins.sharing.GroupSources.setTrash()");

	var trash = new dojo.dnd.Source(
		this.trashContainer,
		{
			accept : [ "draggableItem" ]
		}
	);

	// REMOVE DUPLICATE NODES
	dojo.connect(trash, "onDndDrop", function(source, nodes, copy, target){
		console.log("GroupSources.setTrash    dojo.connect(onDndDrop)    Checking if target == this");
		console.log("GroupSources.setTrash    target:");
		console.dir({target:target});
		console.log("GroupSources.setTrash    this:");
		
		// NODE DROPPED ON SELF --> DELETE THE NODE
		if ( target == this )
		{
			console.log("GroupSources.setTrash    dojo.connect(onDndDrop)    target == this. Removing dropped nodes");
			var currentNodes = trash.getAllNodes();

			for ( var i = 0; i < currentNodes.length; i++ )
			{
				var node = currentNodes[i];
				console.log("GroupSources.setTrash    dojo.connect(onDndDrop)    target == this. Removing dropped nodes");


				// HACK TO AVOID THIS ERROR: node.parentNode is null
				try {
					node.parentNode.removeChild(node)
				}
				catch (e) {
				}
			}
		}
	});
}


}); //	end declare

});	//	end define
