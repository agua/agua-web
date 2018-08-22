/* FILE METHODS INHERITED BY Agua.js */

console.log("Loading plugins.core.Agua.File");

define([
	"dojo/_base/declare",
],

function(declare) {

return declare([], {

/////}}}}}}

//////}}}}}}}}

// FILECACHE METHODS
getFoldersUrl : function () {
	return Agua.cgiUrl + "agua.cgi?";
},
setFileCaches : function (url) {
	console.log("Agua.File.setFileCache    url: " + url);
	var callback = dojo.hitch(this, function (data) {
		//console.log("Agua.File.setFileCache    BEFORE setData, data: ");
		//console.dir({data:data});
		this.setData("filecaches", data);
	});

	//console.log("Agua.File.setFileCache    Doing this.fetchJson(url, callback)");
	this.fetchJson(url, callback);
},
getFileCache : function (username, location) {
	console.log("Agua.File.getFileCache    username: " + username);
	console.log("Agua.File.getFileCache    location: " + location);
	
	var fileCaches = this.cloneData("filecaches");
	console.log("Agua.File.getFileCache    fileCaches: ");
	console.dir({fileCaches:fileCaches});
	
	// RETURN IF NO ENTRIES FOR USER
	if ( ! fileCaches[username] )	return null;
	
	return fileCaches[username][location];
},
setFileCache : function (username, location, item) {
	console.log("Agua.File.setFileCache    username: " + username);
	console.log("Agua.File.setFileCache    location: " + location);
	console.log("Agua.File.setFileCache    item: ");
	console.dir({item:item});
	
	var fileCaches = this.getData("filecaches");
	console.log("Agua.File.setFileCache    fileCaches: ");
	console.dir({fileCaches:fileCaches});
	if ( ! fileCaches )	fileCaches = {};
	if ( ! fileCaches[username] )	fileCaches[username] = {};
	fileCaches[username][location] = item;

	var parentDir = this.getParentDir(location);
	console.log("Agua.File.setFileCache    parentDir: " + parentDir);
	if ( ! parentDir )	{
    	console.log("Agua.File.setFileCache    SETTING fileCaches[" + username + "][" + location + "] = item");
	    fileCaches[username][location] = item;
	    return;
	}
	
	var parent = fileCaches[username][parentDir];
	console.log("Agua.File.setFileCache    parent: " + parent);
	if ( ! parent )	return;
	console.log("Agua.File.setFileCache    parent: " + parent);
	this.addItemToParent(parent, item);

	console.log("Agua.File.setFileCache    parent: " + parent);
	console.dir({parent:parent});	
},
addItemToParent : function (parent, item) {
	parent.items.push(item);
},
removeFileTree : function (username, location) {
	console.log("Agua.File.removeFileTree    username: " + username);
	console.log("Agua.File.removeFileTree    location: " + location);

	var fileCaches = this.getData("filecaches");
	console.log("Agua.File.removeFileTree    fileCaches: ");
	console.dir({fileCaches:fileCaches});

	if ( ! fileCaches )	{
		console.log("Agua.File.removeFileTree    fileCaches is null. Returning");
		return;
	}
	
	var rootTree = fileCaches[username];
	console.log("Agua.File.removeFileTree    rootTree: ");
	console.dir({rootTree:rootTree});

	if ( ! rootTree ) {
		console.log("Agua.File.removeFileTree    rootTree is null. Returning");
		return;
	}

	for ( var fileRoot in fileCaches[username] ) {
		if ( fileRoot.match('^' + location +'$')
                    || fileRoot.match('^' + location +'\/') ) {
			console.log("Agua.File.removeFileTree    DELETING fileRoot: " + fileRoot);
//			delete fileCaches[username][fileRoot];
		}		
	}
	
	if ( ! location.match(/^(.+)\/[^\/]+$/) )	{
		console.log("Agua.File.removeFileTree    No parentDir. Returning");
		return;
	}
	var parentDir = location.match(/^(.+)\/[^\/]+$/)[1];
	var child = location.match(/^.+\/([^\/]+)$/)[1];
	console.log("Agua.File.removeFileTree    parentDir: " + parentDir);
	console.log("Agua.File.removeFileTree    child: " + child);
	
	this.removeItemFromParent(fileCaches[username][parentDir], child);
	
	var project1 = fileCaches[username][parentDir];
	console.log("Agua.File.removeFileTree    project1: " + project1);
	console.dir({project1:project1});	

	console.log("Agua.File.removeFileTree    END");
},
removeItemFromParent : function (parent, childName) {
	for ( i = 0; i < parent.items.length; i++ ) {
		var childObject = parent.items[i];
		if ( childObject.name == childName ) {
			parent.items.splice(i, 1);
			break;
		}
	}
},
removeRemoteFile : function (username, location, callback) {
	console.log("Agua.File.removeRemoteFile    username: " + username);
	console.log("Agua.File.removeRemoteFile    location: " + location);
	console.log("Agua.File.removeRemoteFile    callback: " + callback);

	// DELETE ON REMOTE
	var url 			= 	this.getFoldersUrl();
	var putData 		= 	new Object;
	putData.mode		=	"removeFile";
	putData.module 		= 	"Folders";
	putData.sessionid	=	Agua.cookie('sessionid');
	putData.username	=	Agua.cookie('username');
	putData.file		=	location;

	var thisObject = this;
	dojo.xhrPut(
		{
			url			: 	url,
			putData		:	dojo.toJson(putData),
			handleAs	: 	"json",
			sync		: 	false,
			handle		: 	function(response) {
				if ( callback )	callback(response);
			}
		}
	);
},
renameFileTree : function (username, oldLocation, newLocation) {
	console.log("Agua.File.renameFileTree    username: " + username);
	console.log("Agua.File.renameFileTree    oldLocation: " + oldLocation);
	console.log("Agua.File.renameFileTree    newLocation: " + newLocation);

	var fileCaches = this.getData("filecaches");
	console.log("Agua.File.renameFileTree    fileCaches: ");
	console.dir({fileCaches:fileCaches});

	if ( ! fileCaches )	{
		console.log("Agua.File.renameFileTree    fileCaches is null. Returning");
		return;
	}
	
	var rootTree = fileCaches[username];
	console.log("Agua.File.renameFileTree    rootTree: ");
	console.dir({rootTree:rootTree});

	if ( ! rootTree ) {
		console.log("Agua.File.renameFileTree    rootTree is null. Returning");
		return;
	}

	for ( var fileRoot in fileCaches[username] ) {
		if ( fileRoot.match('^' + oldLocation +'$')
                    || fileRoot.match('^' + oldLocation +'\/') ) {
			console.log("Agua.File.renameFileTree    DELETING fileRoot: " + fileRoot);
			var value = fileCaches[username][fileRoot];
			var re = new RegExp('^' + oldLocation);
			var newRoot = fileRoot.replace(re, newLocation);
			console.log("Agua.File.renameFileTree    ADDING newRoot: " + newRoot);
			delete fileCaches[username][fileRoot];
			fileCaches[username][newRoot] = value;
		}		
	}

		
    console.log("Agua.File.renameFileTree    oldLocation: " + oldLocation);
	var parentDir = this.getParentDir(oldLocation);
    console.log("Agua.File.renameFileTree    oldLocation: " + oldLocation);

	if ( ! parentDir ) 	return;
	console.log("Agua.File.renameFileTree    Doing this.renameItemInParent()");
	var child = this.getChild(oldLocation);
	var newChild = newLocation.match(/^.+\/([^\/]+)$/)[1];
	console.log("Agua.File.renameFileTree    parentDir: " + parentDir);
	console.log("Agua.File.renameFileTree    child: " + child);
	console.log("Agua.File.renameFileTree    newChild: " + newChild);
	var parent = fileCaches[username][parentDir];
	this.renameItemInParent(parent, child, newChild);
	
	console.log("Agua.File.renameFileTree    parent: " + parent);
	console.dir({parent:parent});	

	console.log("Agua.File.renameFileTree    END");
},
renameItemInParent : function (parent, childName, newChildName) {
	for ( i = 0; i < parent.items.length; i++ ) {
		var childObject = parent.items[i];
		if ( childObject.name == childName ) {
			var re = new RegExp(childName + "$");
			parent.items[i].name= parent.items[i].name.replace(re, newChildName);
			console.log("Agua.File.renameItemInParent    NEW parent.items[" + i + "].name: " + parent.items[i].name);
			parent.items[i].path= parent.items[i].path.replace(re, newChildName);
			console.log("Agua.File.repathItemInParent    NEW parent.items[" + i + "].path: " + parent.items[i].path);
			break;
		}
	}
},
getParentDir : function (location) {
	if ( ! location.match(/^(.+)\/[^\/]+$/) )	return null;
	return location.match(/^(.+)\/[^\/]+$/)[1];
},
getChild : function (location) {
	if ( ! location.match(/^.+\/([^\/]+)$/) )	return null;
	return location.match(/^.+\/([^\/]+)$/)[1];
},
isDirectory : function (username, location) {
	// USE IF CACHED
	var fileCache = this.getFileCache(username, location);
	console.log("Agua.File.isDirectory    username: " + username);
	console.log("Agua.File.isDirectory    location: " + location);
	console.log("Agua.File.isDirectory    fileCache: ");
	console.dir({fileCache:fileCache});

	if ( fileCache )	return fileCache.directory;
	return null;
},
isFileCacheItem : function (username, directory, itemName) {
	console.log("Agua.isFileCacheItem     username: " + username);
	console.log("Agua.isFileCacheItem     directory: " + directory);
	console.log("Agua.isFileCacheItem     itemName: " + itemName);

	var fileCache = this.getFileCache(username, directory);
	console.log("Agua.isFileCacheItem     fileCache: " + fileCache);
	console.dir({fileCache:fileCache});
	
	if ( ! fileCache || ! fileCache.items )	return false;
	
	for ( var i = 0; i < fileCache.items.length; i++ ) {
		if ( fileCache.items[i].name == itemName)	return true;
	}
	
	return false;

},

// FILE METHODS
renameFile : function (oldFilePath, newFilePath) {
// RENAME FILE OR FOLDER ON SERVER	
	var url 			= 	this.getFoldersUrl();
	var query 			= 	new Object;
	query.mode			=	"renameFile";
	query.module = "Agua::Folders";
	query.sessionid		=	Agua.cookie('sessionid');
	query.username		=	Agua.cookie('username');
	query.oldpath		=	oldFilePath;
	query.newpath		=	newFilePath;
	
	this.doPut({ url: url, query: query, sync: false });
},
createFolder : function (folderPath) {
	// CREATE FOLDER ON SERVER	
	var url 			= 	this.getFoldersUrl();
	var query 			= 	new Object;
	query.mode			=	"newFolder";
	query.module 		= 	"Agua::Folders";
	query.sessionid		=	Agua.cookie('sessionid');
	query.username		=	Agua.cookie('username');
	query.folderpath	=	folderPath;
	
	this.doPut({ url: url, query: query, sync: false });
},
// FILEINFO METHODS
getFileInfo : function (stageParameterObject) {
// RETURN THE BOOLEAN fileInfo VALUE FOR A STAGE PARAMETER
	
	console.log("Agua.File.getFileInfo    plugins.core.Data.getFileInfo()");
	console.log("Agua.File.getFileInfo    stageParameterObject: ");
	console.dir({stageParameterObject:stageParameterObject});

	var uniqueKeys = ["username", "project", "workflow", "appname", "appnumber", "name", "paramtype"];
	var valueArray = new Array;
	for ( var i = 0; i < uniqueKeys.length; i++ ) {
		valueArray.push(stageParameterObject[uniqueKeys[i]]);
	}
	var stageParameter = this.getEntry(this.cloneData("stageparameters"), uniqueKeys, valueArray);
	console.log("Agua.File.getFileInfo    stageParameter found: ");
	console.dir({stageParameter:stageParameter});
	if ( stageParameter == null ) {
		console.log("Agua.File.getFileInfo    stageParameter is null. Returning null");
		return null;
	}

	// RETURN FOR GETTER	
	if ( stageParameter.fileinfo ) {
		console.log("Agua.File.getFileInfo    DOING the GETTER. Returning stageParameter.exists: " + stageParameter.fileinfo.exists);
		return stageParameter.fileinfo.exists;
	}
	else {
		console.log("Agua.File.getFileInfo    ERROR: DOING the GETTER but fileinfo not defined");
		return null;
	}
},
setFileInfo : function (stageParameterObject, fileinfo) {
// SET THE BOOLEAN fileInfo VALUE FOR A STAGE PARAMETER
	if ( ! stageParameterObject	)	return;
	
	console.log("Agua.File.setFileInfo    plugins.core.Data.setFileInfo()");
	console.log("Agua.File.setFileInfo    stageParameterObject: ");
	console.dir({stageParameterObject:stageParameterObject});
	console.log("Agua.File.setFileInfo    fileinfo: ");
	console.dir({fileinfo:fileinfo});

	var uniqueKeys = ["username", "project", "workflow", "appname", "appnumber", "name", "paramtype"];
	var valueArray = new Array;
	for ( var i = 0; i < uniqueKeys.length; i++ ) {
		valueArray.push(stageParameterObject[uniqueKeys[i]]);
	}
	var stageParameter = this.getEntry(this.cloneData("stageparameters"), uniqueKeys, valueArray);
	console.log("Agua.File.setFileInfo    stageParameter found: ");
	console.dir({stageParameter:stageParameter});
	if ( stageParameter == null ) {
		console.log("Agua.File.setFileInfo    stageParameter is null. Returning null");
		return null;
	}

	// ELSE, DO THE SETTER
	stageParameter.fileinfo = fileinfo;
	var success = this._removeStageParameter(stageParameter);
	if ( success == false ) {
		console.log("Agua.File.setFileInfo    Could not remove stage parameter. Returning null");
		return null;
	}
	console.log("Agua.File.setFileInfo    	BEFORE success = this._addStageParameter(stageParameter)");
		
	success = this._addStageParameter(stageParameter);			
	if ( success == false ) {
		console.log("Agua.File.setFileInfo    Could not add stage parameter. Returning null");
		return null;
	}

	return true;
},
// VALIDITY METHODS
getParameterValidity : function (stageParameterObject, booleanValue) {
// GET THE BOOLEAN parameterValidity VALUE FOR A STAGE PARAMETER
	//console.log("Agua.File.getParameterValidity    plugins.core.Data.getParameterValidity()");
	////console.log("Agua.File.getParameterValidity    stageParameterObject: " + dojo.toJson(stageParameterObject));
	////console.log("Agua.File.getParameterValidity    booleanValue: " + booleanValue);

	if ( booleanValue != null )
	{
		//console.log("Agua.File.getParameterValidity    booleanValue parameter is present. Should you be using "setParameterValidity" instead?. Returning null.");
		return null;
	}
	
	var isValid = this._parameterValidity(stageParameterObject, booleanValue);
	//console.log("Agua.File.getParameterValidity   '" + stageParameterObject.name + "' isValid: " + isValid);
	
	return isValid;
},
setParameterValidity : function (stageParameterObject, booleanValue) {
// SET THE BOOLEAN parameterValidity VALUE FOR A STAGE PARAMETER
	////console.log("Agua.File.setParameterValidity    plugins.core.Data.setParameterValidity()");
	////console.log("Agua.File.setParameterValidity    stageParameterObject: " + dojo.toJson(stageParameterObject));
	////console.log("Agua.File.setParameterValidity    " + stageParameterObject.name + " booleanValue: " + booleanValue);
	if ( booleanValue == null )
	{
		//console.log("Agua.File.setParameterValidity    booleanValue is null. Returning null.");
		return null;
	}

	var isValid = this._parameterValidity(stageParameterObject, booleanValue);
	//console.log("Agua.File.setParameterValidity   '" + stageParameterObject.name + "' isValid: " + isValid);

	return isValid;
},
_parameterValidity : function (stageParameterObject, booleanValue) {
// RETURN THE parameterValidity BOOLEAN FOR A STAGE PARAMETER
// OR SET IT IF A VALUE IS SUPPLIED
	////console.log("Agua.File._parameterValidity    plugins.core.Data._parameterValidity()");
	//console.log("Agua.File._parameterValidity    stageParameterObject: " + dojo.toJson(stageParameterObject, true));
	////console.log("Agua.File._parameterValidity    booleanValue: " + booleanValue);

	//////var filtered = this._getStageParameters();
	//////var keys = ["appname"];
	//////var values = ["image2eland.pl"];
	//////filtered = this.filterByKeyValues(filtered, keys, values);
	////////console.log("Agua.File._parameterValidity    filtered: " + dojo.toJson(filtered, true));
	var uniqueKeys = ["project", "workflow", "appname", "appnumber", "name", "paramtype"];
	var valueArray = new Array;
	for ( var i = 0; i < uniqueKeys.length; i++ )
	{
		valueArray.push(stageParameterObject[uniqueKeys[i]]);
	}
	var stageParameter = this.getEntry(this._getStageParameters(), uniqueKeys, valueArray);
	//console.log("Agua.File._parameterValidity    stageParameter found: " + dojo.toJson(stageParameter, true));
	if ( stageParameter == null )
	{
		//console.log("Agua.File._parameterValidity    stageParameter is null. Returning null");
		return null;
	}
	
	if ( booleanValue == null )
		return stageParameter.isValid;

	//console.log("Agua.File._parameterValidity    stageParameter: " + dojo.toJson(stageParameter, true));
	//console.log("Agua.File._parameterValidity    booleanValue: " + booleanValue);
	// SET isValid BOOLEAN VALUE
	stageParameter.isValid = booleanValue;		
	var success = this._removeStageParameter(stageParameter);
	if ( success == false )
	{
		//console.log("Agua.File._parameterValidity    Could not remove stage parameter. Returning null");
		return null;
	}
	////console.log("Agua.File._parameterValidity    	BEFORE success = this._addStageParameter(stageParameter)");
		
	success = this._addStageParameter(stageParameter);			
	if ( success == false )
	{
		//console.log("Agua.File._parameterValidity    Could not add stage parameter. Returning null");
		return null;
	}

	return true;
}

});

});

