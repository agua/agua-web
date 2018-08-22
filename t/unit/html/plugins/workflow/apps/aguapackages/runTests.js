require([
	"dojo/_base/declare"
	,"dojo/ready"
	,"t/unit/doh/util"
	,"t/unit/doh/Agua"
	,"plugins/workflow/Apps/AguaPackages"

],

function (
	declare
	,ready
	,util
	,Agua
	,AguaPackages
) {

/////}}}}}}]]

	// GET DATA
	Agua.data = {};
	console.log("runTests    BEFORE util.fetchJson()");
	console.log("runTests    util: " + util);

	window.Agua  = Agua;
	
	//Agua.data = util.fetchJson("data.json");
	Agua.data.apps = util.fetchJson("apps-emboss.json");
	//Agua.data.apps = util.fetchJson("apps.json");
	Agua.data.conf = util.fetchJson("conf.json");
	console.log("runTests    AFTER util.fetchJson()");

	console.log("runTests    Agua.data: ");
	console.dir({Agua_data:Agua.data});
	console.log("runTests    Agua.data.apps: ", Agua.data.apps);

	window.Agua  = Agua;

	var packageApps = new AguaPackages({
		attachPoint: dojo.byId("attachPoint")
	});			
	

}); 


