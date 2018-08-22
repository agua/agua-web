var Agua;

require([
	"dojo/_base/declare"
	,"dojo/dom"
	,"dojo/ready"
	,"t/unit/doh/util"
	//,"t/unit/doh/Agua"
	,"plugins/workflow/Parameters"

	,"plugins/core/Agua/Data"
	,"plugins/core/Agua/Stage"
	,"plugins/core/Agua/StageParameter"
	,"plugins/core/Common"

	//,'intern!object'
	//,'intern/chai!assert'
	//,'intern/dojo/Deferred'
	//'dojo/has' 

],

function (declare
	,dom
	,ready
	,util
	//,Agua
	,Parameters

	,Data
	,Stage
	,StageParameters
	,Common
	
	//,registerSuite
	//,assert
	//,Deferred
	//has
) {



var Module = new declare([
	Data
	,Stage
	,StageParameters
	,Common
], {

	cookies : 	[],
	constructor : function (args) {
		console.log("runTests    Agua.constructor");
	},
	cookie : function(name, value) {
		if ( value != null ) {
			return this.cookies[name] = value;
		}
		else {
			return this.cookies[name];
		}
	}
});
Agua = new Module({});
console.log("runTests    Agua:");
console.dir({Agua:Agua});

window.Agua = Agua;
Agua.data = util.fetchJson("data.json");
Agua.cookie("username", "testuser");
Agua.cookie("sessionid", "9999999999.9999.999");

ready(function(){

	var parameters = new Parameters({
		attachPoint : dojo.byId("attachPoint")
	});
	
	var stagehash	=	util.fetchJson("stage.json");
	console.log("runTests    stagehash:");
	console.dir({stagehash:stagehash});
	
	console.log("runTests    DOING parameters.load(stagehash)");
	parameters.load(stagehash);

	
	stageparameters = Agua.filterByKeyValues(stageparameters, ["project", "workflow", "paramtype", "appnumber", "appname"], ["Project1", "Workflow1", "input", "1", "sleep"]);
	
})


	
	
});
