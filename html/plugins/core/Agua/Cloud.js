/* CLOUD METHODS INHERITED BY Agua.js */

console.log("Loading plugins.core.Agua.Cloud");

define([
	"dojo/_base/declare",
],

function(declare) {

return declare([], {

/////}}}}}}

getCloudHeadings : function () {
	console.log("Agua.Cloud.getCloudHeadings    plugins.core.Data.getCloudHeadings()");
	var headings = this.cloneData("cloudheadings");
	console.log("Agua.Cloud.getCloudHeadings    headings: " + dojo.toJson(headings));
	return headings;
}

});

});