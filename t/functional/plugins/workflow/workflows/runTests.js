console.log("runTests    LOADING");

// GLOBAL VARIABLES
var Agua;
window.Agua = Agua;

require([
	"dojo/_base/declare",
	"dojo/ready",
	"t/unit/doh/util",
	"t/unit/doh/Factory",
	"dijit/Toolbar",
	"dijit/layout/TabContainer"	
],

function (
	declare,
	ready,
	util,
	Factory
) {

console.log("Factory    Factory:");
console.dir({Factory:Factory});

console.log("Factory    BEFORE ready");

ready(function() {

var mixins = [
	"plugins/core/Agua",
	"plugins/core/Agua/App",
	"plugins/core/Agua/Aws",
	"plugins/core/Agua/Cloud",
	"plugins/core/Agua/Cluster",
	"plugins/core/Agua/Data",
	"plugins/core/Agua/Exchange",
	"plugins/core/Agua/Feature",
	"plugins/core/Agua/File",
	"plugins/core/Agua/Group",
	"plugins/core/Agua/Hub",
	"plugins/core/Agua/Package",
	"plugins/core/Agua/Parameter",
	"plugins/core/Agua/Project",
	"plugins/core/Agua/Request",
	"plugins/core/Agua/Shared",
	"plugins/core/Agua/Sharing",
	"plugins/core/Agua/Stage",
	"plugins/core/Agua/StageParameter",
	"plugins/core/Agua/User",
	"plugins/core/Agua/View",
	"plugins/core/Agua/Workflow",
	
	"plugins/core/Common/Array",
	"plugins/core/Common/Sort",
	"plugins/core/Common/Toast",
	"plugins/core/Common/Util"
];
var components	=	[
	{
		name	:	"updater",
		module	:	"plugins/core/Updater"
	}
	,
	{
		name	:	"conf",
		module	:	"plugins/core/Conf"
	}
	,
	{
		name	:	"exchange",
		module	:	"plugins/exchange/Exchange"
	}
];

// AGUA
console.log("runTests    BEFORE new Factory()");
Agua = new Factory({
	mixins		: 	mixins,
	components 	: 	components
});
console.log("runTests    AFTER new Factory()");
console.log("runTests    Agua:");
console.dir({Agua:Agua});

// DATA
Agua.data	=	util.fetchJson("./data.json");
Agua.token 	= 	"Eliyjj4WlqmZfR5M";
console.log("runTests    Agua.data:");
console.dir({Agua_data:Agua.data});

var apps 	=	Agua.getApps();
console.log("runTests    apps:");
console.dir({apps:apps});

Agua.cookie("test", "TEST");


//// CORE
//var core	=	{};
//var modules = [
//	{
//		name 		: "t/functional/mock/plugins/workflow/Parameters",
//		location 	: "parameters",
//		attachPoint : "rightPane"
//	}
//	,
//	{
//		name 		: "t/functional/mock/plugins/workflow/RunStatus/Status",
//		location 	: "runStatus",
//		attachPoint : "rightPane"
//	}
//	,
//	{
//		name 		: "plugins/workflow/UserWorkflows",
//		location 	: "userWorkflows",
//		attachPoint : "middlePane"
//	}
//];
//
//console.log("runTests    BEFORE new Controller()");
//var controller	=	new Controller({
//	modules		:	modules,
//	core		:	core,
//	attachPoint	:	dojo.byId("attachPoint")
//});
//console.log("runTests    AFTER new Controller()");
//
//console.log("runTests    controller:");
//console.dir({controller:controller});

}); // ready

}); // require

console.log("runTests    COMPLETED");