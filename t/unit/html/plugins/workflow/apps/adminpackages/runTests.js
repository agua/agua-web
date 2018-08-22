require([
	"dojo/_base/declare"
	,"dojo/ready"
	,"t/unit/doh/util"
	,"t/unit/doh/Agua"
	,"plugins/workflow/Apps/AdminPackages"

],

function (
	declare
	,ready
	,util
	,Agua
	,AdminPackages
) {

/////}}}}}}]]

	// GET DATA
	Agua.data = {};
	console.log("runTests    BEFORE util.fetchJson()");
	console.log("runTests    util: " + util);

	window.Agua  = Agua;
	
	Agua.data.apps = util.fetchJson("apps.json");
	Agua.data.conf = util.fetchJson("conf.json");
	console.log("runTests    AFTER util.fetchJson()");

	console.log("runTests    Agua.data: ");
	console.dir({Agua_data:Agua.data});
	console.log("runTests    Agua.data.apps: ");
	console.dir({Agua_data_apps:Agua.data.apps});

	window.Agua  = Agua;

	var packageApps = new AdminPackages({
		attachPoint: dojo.byId("attachPoint")
	});			
	
//	console.log("DOING TEST");
//	doh.register("t.plugins.workflow.runstatus.test", [
//
///////}}}}]]]]}}}
//
//		{
//			name: "new",
//
//			runTest: function(){
//				packageApps = new plugins.workflow.Apps.AdminPackages({
//					attachNode: Agua.tabs
//				});			
//
//				doh.assertTrue(true);
//			},	
//			timeout: 10000 
//		}
//	
//	]);	// doh.register
//	
//	//Execute D.O.H. in this remote file.
//	console.log("RUNNING TEST");
//	doh.run();
//	
//	console.log("AFTER TEST");


}); 


