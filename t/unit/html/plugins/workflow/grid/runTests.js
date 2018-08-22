var Agua;

require([
	"dojo/_base/declare"
	,"dojo/dom"
	,"dojo/ready"
	,"t/unit/doh/util"
	,"t/unit/doh/Agua"
	,"plugins/workflow/Grid"

	//,'intern!object'
	//,'intern/chai!assert'
	//,'intern/dojo/Deferred'
	//'dojo/has' 

],

function (declare
	,dom
	,ready
	,util
	,Agua
	,Grid

	//,registerSuite
	//,assert
	//,Deferred
	//has
) {

	
window.Agua = Agua;
Agua.data = util.fetchJson("data.json");



ready(function(){

	var projectPanel = new Grid({
		attachPoint : dojo.byId("attachPoint")
	});
	
})


	
	
});
