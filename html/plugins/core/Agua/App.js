/* SUMMARY: THIS CLASS IS INHERITED BY Agua.js AND CONTAINS APP METHODS */

define([
	"dojo/_base/declare"
],

function(
	declare
) {

return declare([], {

/////}}}

getAppHeadings : function () {
	console.log("Agua.App.getAppHeadings    plugins.core.Data.getAppHeadings()");
	var headings = this.cloneData("appheadings");
	console.log("Agua.App.getAppHeadings    headings: " + dojo.toJson(headings));
	return headings;
},
getApps : function () {
	//console.log("Agua.App.getApps    plugins.core.Data.getApps()");
	return this.cloneData("apps");
},
getAguaApps : function () {
	console.log("%cAgua.App.getAguaApps", "color: darkgreen");
	var apps = this.cloneData("apps");
	console.log("%cAgua.App.getAguaApps    apps:", "color: darkgreen");
	console.log("apps", apps);
	
	console.log("%cAgua.App.getAguaApps    Agua.conf:", "color: darkgreen");
	console.log("Agua.conf", Agua.conf);
	var aguauser =	Agua.conf.getKey("agua", "aguauser");
	console.log("%cAgua.App.getAguaApps    aguauser: " + aguauser, "color: darkgreen");
	
	return this.filterByKeyValues(apps, ["owner"], [aguauser]);
},
getAdminApps : function () {
	var apps = this.cloneData("apps");
	var adminuser =	Agua.conf.getKey("agua", "adminuser");
	console.log("Agua.App.getAdminApps    adminuser: " + adminuser, "color: darkgreen");
	
	return this.filterByKeyValues(apps, ["owner"], [adminuser]);
},
getAppTypes : function (apps) {
    console.log("%cAgua.App.getAppTypes    apps: ", "color: darkgreen");
    console.dir({apps:apps});
    if ( ! apps ) {
        console.log("%cAgua.App.getAppTypes    apps is not defined. Returning", "color: darkgreen");
        return;
    }

// GET SORTED LIST OF ALL APP TYPES
	var typesHash = new Object;
	for ( var i = 0; i < apps.length; i++ ) {
		typesHash[apps[i].type] = 1;
	}	
	var types = this.hashkeysToArray(typesHash)
	types = this.sortNoCase(types);
	
	return types;
},
getAppType : function (appName) {
// RETURN THE TYPE OF AN APP OWNED BY THE USER
	//console.log("%cAgua.App.getAppType    appName: *" + appName + "*", "color: darkgreen");
	var apps = this.cloneData("apps");
	for ( var i in apps )
	{
		var app = apps[i];
		if ( app.name.toLowerCase() == appName.toLowerCase() )
			return app.type;
	}
	
	return null;
},
hasApps : function () {
	//console.log("%cAgua.App.hasApps    plugins.core.Data.hasApps()", "color: darkgreen");
	if ( this.getData("apps").length == 0 )	return false;	
	return true;
},
addApp : function (appObject) {
// ADD AN APP OBJECT TO apps
	console.log("%cAgua.App.addApp    plugins.core.Data.addApp(appObject)", "color: darkgreen");
	//console.log("%cAgua.App.addApp    appObject: " + dojo.toJson(appObject), "color: darkgreen");
	var result = this.addData("apps", appObject, [ "name" ]);
	if ( result == true ) this.sortData("apps", "name");
	
	// RETURN TRUE OR FALSE
	return result;
},
removeApp : function (appObject) {
// REMOVE AN APP OBJECT FROM apps
	console.log("%cAgua.App.removeApp    plugins.core.Data.removeApp(appObject)", "color: darkgreen");
	//console.log("%cAgua.App.removeApp    appObject: " + dojo.toJson(appObject), "color: darkgreen");
	var result = this.removeData("apps", appObject, ["name"]);
	
	return result;
},
isApp : function (appName) {
// RETURN true IF AN APP EXISTS IN apps
	console.log("%cAgua.App.isApp    plugins.core.Data.isApp(appName, appObject)", "color: darkgreen");
	console.log("%cAgua.App.isApp    appName: *" + appName + "*", "color: darkgreen");
	
	var apps = this.getApps();
	for ( var i in apps )
	{
		var app = apps[i];
		console.log("%cAgua.App.isApp    Checking app.name: *" + app.name + "*", "color: darkgreen");
		if ( app.name.toLowerCase() == appName.toLowerCase() )
		{
			return true;
		}
	}
	
	return false;
}


}); // declare

}); // define