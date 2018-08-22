/* SHARING METHODS INHERITED BY Agua.js */

console.log("Loading plugins.core.Agua.Sharing");

define([
	"dojo/_base/declare",
],

function(declare) {

return declare([], {

/////}}}}}}
///////}}}

// ADMIN METHODS
getSharingHeadings : function () {
	console.log("Agua.Sharing.getSharingHeadings    plugins.core.Data.getSharingHeadings()");
	var headings = this.cloneData("sharingheadings");
	console.log("Agua.Sharing.getSharingHeadings    headings: " + dojo.toJson(headings));
	return headings;
},
getAccess : function () {
	//console.log("Agua.Sharing.getAccess    plugins.core.Data.getAccess()");
	return this.cloneData("access");
}

});

});