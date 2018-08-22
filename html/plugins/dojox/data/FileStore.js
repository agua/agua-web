//dojo.provide("plugins.dojox.data.FileStore");
//
//dojo.require("dojox.data.FileStore");
//
//dojo.declare("plugins.dojox.data.FileStore", [dojox.data.FileStore], {
//

console.log("%cdojox.data.FileStore    LOADING", "color: darkorange");

define([
	"dojo/_base/declare"
	,"dojox/data/FileStore"
],


function (
	declare
	,FileStore
) {


return declare("plugins/dojox/data/FileStore", [
	FileStore
], {

// path: string
// full path to file
path : '',

// putdata: object
// data for xhrPut
data: null,

////}}}}	

////}}}}}
constructor: function (args){
	console.log("FileStore.constructor    START");
	console.log("FileStore.constructor    caller: " + this.constructor.caller.nom);
	
	this.inherited(arguments);
	
	console.log("FileStore.constructor    args:");
	console.dir({args:args});
	if ( ! args ) {
		console.log("FileStore.constructor    args not defined. Returning:");
		return;
	}
	this.core 		= 	args.core;
	this.path		=	args.path;
	this.data		=	args.data;
	this.parentPath	=	args.parentPath;

	// SET _processResult CALLBACK
	this.processResultCallback = dojo.hitch(this, "_processResult");
},
_assertIsItem: function(/* item */ item){
	// summary:
	//      This function tests whether the item passed in is indeed an item in the store.
	// item:
	//		The item to test for being contained by the store.

	console.log("plugins.dojox.data.FileStore._assertIsItem    caller: " + this._assertIsItem.caller.nom);
	//console.log("plugins.dojox.data.FileStore._assertIsItem    item: " + dojo.toJson(item));

	if(!this.isItem(item)){
		console.warn("dojox.data.FileStore: a function was passed an item argument that was not an item");
	
		//throw new Error("dojox.data.FileStore: a function was passed an item argument that was not an item");
	}
},
_assertIsAttribute: function(/* attribute-name-string */ attribute){
	// summary:
	//		This function tests whether the item passed in is indeed a valid 'attribute' like type for the store.
	// attribute:
	//		The attribute to test for being contained by the store.
	if(typeof attribute !== "string"){
		throw new Error("dojox.data.FileStore: a function was passed an attribute argument that was not an attribute name string");
	}
},
loadItem: function(keywordArgs){
	// summary:
	//      See dojo.data.api.Read.loadItem()
	var item = keywordArgs.item;
	var self = this;
	var scope = keywordArgs.scope || dojo.global;

	var content = {};

	if(this.options.length > 0){
		content.options = dojo.toJson(this.options);
	}

	if(this.pathAsQueryParam){
		content.path = item.parentPath + this.pathSeparator + item.name;
	}

	var xhrData = {
		url: this.pathAsQueryParam? this.url : this.url + "/" + item.parentPath + "/" + item.name,
		handleAs: "json-comment-optional",
		content: content,
		preventCache: this.urlPreventCache,
		failOk: this.failOk
	};

	var deferred = dojo.xhrGet(xhrData);
	deferred.addErrback(function(error){
			if(keywordArgs.onError){
				keywordArgs.onError.call(scope, error);
			}
	});
	
	deferred.addCallback(function(data){
		delete item.parentPath;
		delete item._loaded;
		dojo.mixin(item, data);
		self._processItem(item);
		if(keywordArgs.onItem){
			keywordArgs.onItem.call(scope, item);
		}
	});
},
isItem: function(item){
	// summary:
	//      See dojo.data.api.Read.isItem()
	console.log("plugins.dojox.data.FileStore.isItem    caller: " + this.isItem.caller.nom);
	//console.log("plugins.dojox.data.FileStore.isItem    item: " + dojo.toJson(item));
	
	if(item && item[this._storeRef] === this){
		return true;
	}
	return false;
},
close: function(request){
	// summary:
	//      See dojo.data.api.Read.close()
},
fetch: function(request){
	console.log("%cplugins.dojox.data.FileStore.fetch    caller: " + this.fetch.caller.nom, "color: darkred");
	console.log("%cplugins.dojox.data.FileStore.fetch    request: ", "color: darkred");
	console.dir({request:request});

	request = request || {};
	if(!request.store){
		request.store = this;
	}

	var self = this;
	var scope = request.scope || dojo.global;
	
	console.log("%cplugins.dojox.data.FileStore.fetch    this.path: " + this.path, "color: darkred");
	console.log("%cplugins.dojox.data.FileStore.fetch    this.parentPath: " + this.parentPath, "color: darkred");
	console.log("%cplugins.dojox.data.FileStore.fetch    this.name: " + this.name, "color: darkred");

	console.log("%cplugins.dojox.data.FileStore.fetch    BEFORE request.query: ", "color: darkred");
	console.dir({request_query:request.query});

	// Generate request parameters
	var reqParams = {};
	if ( request.query ) {
		//request.query = request.query.replace(/^\//, '');
		reqParams.query = request.query;
	}
	console.log("%cplugins.dojox.data.FileStore.fetch    AFTER request.query: ", "color: darkred");
	console.dir({request_query:request.query});

	var data = this.data || {};
	if ( request.query ) {
		data.query = request.query;
	}

	// SET LOCATION
	var location = '';
	if ( data.location || data.query ) {
		location = data.query || data.location;
	}
	console.log("%cplugins.dojox.data.FileStore.fetch    location: " + location, "color: darkred");
	
	var username = Agua.cookie("username");
	console.log("%cplugins.dojox.data.FileStore.fetch    username: " + username, "color: darkred");
	
	// USE FILE SYSTEM DATA IF CACHED
	var fileCache = Agua.getFileCache(username, location);
	console.log("%cplugins.dojox.data.FileStore.fetch    fileCache:", "color: darkred");
	console.dir({fileCache:fileCache});
	if ( fileCache ) {
		console.log("%cplugins.dojox.data.FileStore.fetch    fileCache IS DEFINED. Doing this._processResult(fileCache, request)", "color: darkred");
		this._processResult(fileCache, request);
	}
	// OTHERWISE, REQUEST FROM REMOTE
	else {
		console.log("%cplugins.dojox.data.FileStore.fetch    fileCache NOT DEFINED. Doing remote query", "color: darkred");

		data.callback 	= 	"processResultCallback";
		data.sourceid 	= 	this.id;
		console.log("%cplugins.dojox.data.FileStore.fetch    data:");
		console.dir({data:data});

		// SEND REQUEST
		console.log("%cplugins.dojox.data.FileStore.fetch    BEFORE Agua.sendRequest()", "color: darkred");
		Agua.sendRequest({
			data		: 	data,
			mode		:	"fileSystem",
			module 		: 	"Agua::Workflow",
			sourceid	:	this.id,
			callback	:	"handleFileSystem"
		});

		console.log("%cplugins.dojox.data.FileStore.fetch    AFTER Agua.sendRequest()", "color: darkred");
	}	
},
handleFileSystem: function(data){
	console.log("%cplugins.dojox.data.FileStore.handleFileSystem    caller: " + this.handleFileSystem.caller.nom, "color: darkred");
	console.log("%cplugins.dojox.data.FileStore.handleFileSystem    data: ", "color: darkred")
	console.dir({data:data});

	// SET SCOPE BASED ON QUERIED PATH
	// dijitContentPane.dojoxRollingListPane.dojoxFileDragPane.dojoxRollingListPaneCurrentChild	

	var scope = dojo.global;
	try {
		console.log("%cplugins.dojox.data.FileStore.handleFileSystem    ONE", "color: darkred");
		// PROCESS ALL items IN data
		var items = this._processItemArray(data.items);

		if(request.onItem){
		   var i;
		   for(i = 0; i < items.length; i++){
			   request.onItem.call(scope, items[i], request);
		   }
		   items = null;
		}

	   console.log("%cplugins.dojox.data.FileStore.handleFileSystem    THREE", "color: darkred");

		if (request.onComplete) {
			console.log("%cplugins.dojox.data.FileStore.handleFileSystem    items:", "color: darkred");
			console.dir({items:items});
			//console.log("%cplugins.dojox.data.FileStore.handleFileSystem    request.onComplete: " + request.FileStore);
			//console.log("%cplugins.dojox.data.FileStore.handleFileSystem    request.onComplete.toString(): " + request.onComplete.toString());
			//
			console.log("%cplugins.dojox.data.FileStore.handleFileSystem    BEFORE request.onComplete.call(scope, items, request)", "color: darkred");	   
			request.onComplete.call(scope, items, request);
			console.log("%cplugins.dojox.data.FileStore.handleFileSystem    AFTER request.onComplete.call(scope, items, request)", "color: darkred");	   
		}
		console.log("%cplugins.dojox.data.FileStore.handleFileSystem    FOUR", "color: darkred");
	} catch (e) {
		if (request.onError) {
			request.onError.call(scope, e, request);
		}
		else {
			console.log(e);
		}
	}
	 
	console.log("%cplugins.dojox.data.FileStore.handleFileSystem    END", "color: darkred");
	//console.log("%cplugins.dojox.data.FileStore.handleFileSystem    this.core.folders: " + this.core.folders);
	//console.log("%cplugins.dojox.data.FileStore.handleFileSystem    Doing this.core.folders.roundRobin(): ");
	//this.core.folders.roundRobin();
},
_processResult: function(data, request){
	console.log("%cplugins.dojox.data.FileStore._processResult    caller: " + this._processResult.caller.nom, "color: darkred");
	console.log("%cplugins.dojox.data.FileStore._processResult    data: ", "color: darkred");
	console.dir({data:data});
	console.log("%cplugins.dojox.data.FileStore._processResult    request: ", "color: darkred");
	console.dir({request:request});
	
	if ( ! request ) {
		console.log("%cplugins.dojox.data.FileStore._processResult    Returning because request is null", "color: darkred");
		return;
	}

	var scope = request.scope || dojo.global;
	try{

		//If the data contains a path separator, set ours
		if(data.pathSeparator){
			this.pathSeparator = data.pathSeparator;
		}
		console.log("%cplugins.dojox.data.FileStore._processResult    ONE", "color: darkred");
		   
		//Invoke the onBegin handler, if any, to return the
		//size of the dataset as indicated by the service.
		if(request.onBegin){
			request.onBegin.call(scope, data.total, request);
		}
		console.log("%cplugins.dojox.data.FileStore._processResult    TWO", "color: darkred");

		// PROCESS ALL items IN data
		var items = this._processItemArray(data.items);

		if(request.onItem){
		   var i;
		   for(i = 0; i < items.length; i++){
			   request.onItem.call(scope, items[i], request);
		   }
		   items = null;
		}
		console.log("%cplugins.dojox.data.FileStore._processResult    THREE", "color: darkred");

		if (request.onComplete) {
			console.log("%cplugins.dojox.data.FileStore._processResult    items:", "color: darkred");
			console.dir({items:items});
			//console.log("%cplugins.dojox.data.FileStore._processResult    request.onComplete: " + request.FileStore, "color: darkred");
			//console.log("%cplugins.dojox.data.FileStore._processResult    request.onComplete.toString(): " + request.onComplete.toString(), "color: darkred");
			//console.log("%cplugins.dojox.data.FileStore._processResult    Doing request.onComplete.call(scope, items, request)", "color: darkred");
		
			console.log("%cplugins.dojox.data.FileStore._processResult    BEFORE request.onComplete.call()", "color: darkred");
			request.onComplete.call(scope, items, request);
			console.log("%cplugins.dojox.data.FileStore._processResult    AFTER request.onComplete.call()", "color: darkred");
		}
		console.log("%cplugins.dojox.data.FileStore._processResult    FOUR", "color: darkred");
	}
	catch (e) {
		if (request.onError) {
			request.onError.call(scope, e, request);
		}
		else {
			console.log(e, "color: darkred");
		}
	}
	 
	//console.log("%cplugins.dojox.data.FileStore._processResult    END", "color: darkred");
	//console.log("%cplugins.dojox.data.FileStore._processResult    this.core.folders: " + this.core.folders, "color: darkred");
	//console.log("%cplugins.dojox.data.FileStore._processResult    Doing this.core.folders.roundRobin(): ", "color: darkred");
	//this.core.folders.roundRobin();
},
_processItemArray : function(itemArray) {
	// Internal function for processing an array of items for return.
	
	if ( ! itemArray ) {
		console.log("plugins.dojox.data.FileStore._processItemArray    itemArray is null. Returning empty array []");
		return [];
	}
	
	var i;
	for(i = 0; i < itemArray.length; i++){
		this._processItem(itemArray[i]);
	}
	return itemArray;
},
_processItem: function(item){
	//	summary:
	//		Internal function for processing an item returned from the store.
	//		It sets up the store ref as well as sets up the attributes necessary
	//		to invoke a lazy load on a child, if there are any.
	if(!item){return null;}
	item[this._storeRef] = this;
	if(item.children && item.directory){
		if(dojo.isArray(item.children)){
			var children = item.children;
			var i;
			for(i = 0; i < children.length; i++ ){
				var name = children[i];
				if(dojo.isObject(name)){
					children[i] = this._processItem(name);
				}else{
					children[i] = {name: name, _loaded: false, parentPath: item.path};
					children[i][this._storeRef] = this;
				}
			}
		}else{
			delete item.children;
		}
	}
	return item;
},

fetchItemByIdentity: function(keywordArgs){
	// summary:
	//      See dojo.data.api.Read.loadItem()
	var path = keywordArgs.identity;
	var self = this;
	var scope = keywordArgs.scope || dojo.global;

	var content = {};

	if(this.options.length > 0){
		content.options = dojo.toJson(this.options);
	}

	if(this.pathAsQueryParam){
		content.path = path;
	}
	
	var xhrData = {
		url: this.pathAsQueryParam? this.url : this.url + "/" + path,
		handleAs: "json-comment-optional",
		content: content,
		preventCache: this.urlPreventCache,
		failOk: this.failOk
	};

	var deferred = dojo.xhrGet(xhrData);
	deferred.addErrback(function(error){
			if(keywordArgs.onError){
				keywordArgs.onError.call(scope, error);
			}
	});
	
	deferred.addCallback(function(data){
		var item = self._processItem(data);
		if(keywordArgs.onItem){
			keywordArgs.onItem.call(scope, item);
		}
	});
}


}); 	//	end declare

});		//	end define

console.log("%cdojox.data.FileStore    COMPLETED", "color: darkorange");
