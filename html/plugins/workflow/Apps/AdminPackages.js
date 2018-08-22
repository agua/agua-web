/* DISPLAY ONE OR MORE PACKAGES SHARED BY THE ADMIN USER
	-	EACH PACKAGE IS DISPLAYED IN ITS OWN apps OBJECT

	-	ADMIN USER CREATES AND ADMINISTERS PACKAGE/APPS IN Apps PANE
*/

console.log("plugins.workflow.Apps.AdminPackages    LOADING");

define([
	"dojo/_base/declare",
	"plugins/core/Common",
	"plugins/workflow/Apps/Packages"
],

function (
	declare,
	Common,
	Packages
) {

return declare([ Common, Packages ], {
//return declare([ Common ], {

/////}

// className : String
//		Name of this class
className : "plugins_workflow_Apps_AdminPackages",

// CORE WORKFLOW OBJECTS
core : null,

// PARENT WIDGET
parentWidget : null,

// ATTACH NODE
attachPoint : null,

// ARRAY OF plugins.workflow.Apps.Apps OBJECT
packageApps : [],

// UPDATE AFTER SUBSCRIPTIONS
updatePackages : function (args) {
	console.group("workflow.Apps.AdminPackages    " + this.id + "    updatePackages");
	console.log("workflow.Apps.AdminPackages.updatePackages    args:");
	console.dir(args);

	console.log("workflow.Apps.AdminPackages.updatePackages    DOING this.update()");
	this.update();	

	console.groupEnd("workflow.Apps.AdminPackages    " + this.id + "    updatePackages");
},
updateApps : function (args) {
	console.group("workflow.Apps.AdminPackages    " + this.id + "    updateApps");
	console.log("workflow.Apps.AdminPackages.updateApps    args:");
	console.dir(args);

	this.update();	

	console.groupEnd("workflow.Apps.AdminPackages    " + this.id + "    updateApps");
},
update : function () {
	console.log("workflow.Apps.AdminPackages.update    DOING this.clear()");
	this.clear();
	
	console.log("workflow.Apps.AdminPackages.update    DOING this.setPackages()");
	this.setPackages();
},

getAppsArray : function () {
	console.log("workflow.Apps.AdminPackages.update    DOING return Agua.getAdminApps()");
	console.log("workflow.Apps.AdminPackages.update    Agua:");
	console.dir({Agua:Agua});
	
	return Agua.getAdminApps();
}
	
}); //	end declare

});	//	end define

console.log("plugins.workflow.Apps.AdminPackages    COMPLETED");