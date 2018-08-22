require([
	"dojo/_base/declare",
	"dijit/registry",
	"dojo/parser",
	"dojo/dom",
	"doh/runner",
	"t/unit/doh/util",
	//"t/unit/doh/Agua",

	// AGUA
	"plugins/core/Common/Util",
	"plugins/core/Common/Array",
	"plugins/core/Agua/Aws",
	"plugins/core/Agua/Data",
	"plugins/core/Agua/Hub",
	"t/unit/doh/Exchange",
	"plugins/core/Updater",

	"plugins/cloud/Hub",

	"dojo/domReady!"
],

function (declare,
	registry,
	parser,
	dom,
	doh,
	util,

	CommonUtil,
	CommonArray,
	AguaAws,
	AguaData,
	AguaHub,
	AguaExchange,
	Updater,

	Hub
) {

	// INSTANTIATE MOCK AGUA
var Module = new declare([
	AguaAws,
	AguaData,
	AguaHub,
	CommonUtil,
	CommonArray,
	AguaExchange
], {
	updater : new Updater(),
	cookies : 	[],
	controllers : 	[],
	constructor : function (args) {
		console.log("Agua.constructor    START");
		this.id = dijit.getUniqueId("doh_Agua");
		registry.add(this);

		console.log("Agua.constructor    END");
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

// GLOBAL VARS
Agua = new Module({});
console.log("runTests    Agua: ", Agua);
window.Agua = Agua;
widget = null;
window.widget = widget;


var clear = function() {

	var attachPoint = dojo.byId("attachPoint");
	console.log("runTests    attachPoint", attachPoint);
	console.log("runTests    attachPoint.childNodes", attachPoint.childNodes);

	console.log("runTests    attachPoint.childNodes.length", attachPoint.childNodes.length);
	console.log("runTests    attachPoint.removeChild", attachPoint.removeChild);

	while ( attachPoint.childNodes.length != 0 ) {
		console.log("runTests    attachPoint.childNodes[0]", attachPoint.childNodes[0]);
		attachPoint.removeChild(attachPoint.childNodes[0]);
	}

	console.log("runTests    attachPoint.childNodes.length", attachPoint.childNodes.length);
};

////}}}}


doh.register("plugins.apps.Dialog.Scrape", [

////}}}}}

{
	name	: 	"addHubCertificate",
	timeout	:	10000,
	setUp: function(){
		Agua.cookie("username", "testuser");
		Agua.cookie("sessionid", "0000000000.0000.000");
		Agua.data	= 	util.fetchJson("./data.json");
		console.dir({Agua_data:Agua.data});
	
		// CLEAR
		console.log("runTests    DOING clear()");
		clear();
	},
	
	runTest	: function(){
	
		// SET DEFERRED OBJECT
		var deferred = new doh.Deferred();
			
		console.log("runTests    new Hub");
		widget = new Hub({
			attachPoint: dom.byId("attachPoint")
		});

		// DELAY
		setTimeout(function() {
			try {		
				console.log("runTests    DOING Agua.loadResponse()");

				// PRELOAD RESPONSE
				Agua.loadResponse("addHubCertificate-response.json");

				// GET DATA IN RESPONSE
				var response	=	util.fetchJson("addHubCertificate-response.json");
				var data 	=	response.data;
				console.log("runTests    data", data);

				// ADD CERT
				widget.addHubCertificate();

				// VERIFY hub DATA IS CORRECT
				console.log("runTests    VERIFYING HUB INFO...");
				var hub = Agua.getData("hub");
				console.log("runTests    hub", hub);
				console.log("runTests    data", data);
				var identical = util.identicalHashes(hub, data);
				console.log("identical", identical);
				doh.assertTrue(identical);
				console.log("runTests    HUB INFO VERIFIED");
				
				// VERIFY DISPLAYED VALUES
				console.log("runTests    VERIFYING DISPLAYED PUBLIC CERTIFICATE ...");
				var publiccert = widget.getPublicCert();
				console.log("runTests    publiccert: ", publiccert);
				doh.assertTrue(publiccert == data.publiccert);
				console.log("runTests    PUBLIC CERTIFICATE VERIFIED");

				console.log("runTests    VERIFYING DISPLAYED LOGIN ...");
				var login = widget.getLogin();
				console.log("runTests    login: ", login);
				doh.assertTrue(login == data.login);
				console.log("runTests    LOGIN VERIFIED");

				deferred.callback(true);
	
			} catch(e) {
			  deferred.errback(e);
			}
		}, 1000);
	
		return deferred;
	}
}
,
{
	name	: 	"addHubCertificate",
	timeout	:10000,
	setUp: function(){
		Agua.cookie("username", "testuser");
		Agua.cookie("sessionid", "0000000000.0000.000");
		Agua.data	= 	util.fetchJson("./data.json");
		console.dir({Agua_data:Agua.data});

		// CLEAR
		console.log("runTests    DOING clear()");
		clear();
	},
	
	runTest	: function(){
	
		// SET DEFERRED OBJECT
		var deferred = new doh.Deferred();
			
		console.log("runTests    new Hub");
		widget = new Hub({
			attachPoint: dom.byId("attachPoint")
		});

		// DELAY
		setTimeout(function() {
			try {		
				// PRELOAD RESPONSE
				var datafile = "generateToken-response.json";
				Agua.loadResponse(datafile);

				// GET DATA IN RESPONSE
				var response	=	util.fetchJson(datafile);
				var data 	=	response.data;
				console.log("runTests    data", data);

				// ADD CERT
				widget.addHubCertificate();

				// VERIFY hub DATA IS CORRECT
				console.log("runTests    VERIFYING HUB INFO...");
				var hub = Agua.getData("hub");
				console.log("runTests    hub", hub);
				console.log("runTests    data", data);
				var identical = util.identicalHashes(hub, data);
				console.log("identical", identical);
				doh.assertTrue(identical);
				console.log("runTests    HUB INFO VERIFIED");
				
				// VERIFY DISPLAYED VALUES
				console.log("runTests    VERIFYING DISPLAYED PUBLIC CERTIFICATE ...");
				var publiccert = widget.getPublicCert();
				console.log("runTests    publiccert: ", publiccert);
				doh.assertTrue(publiccert == data.publiccert);
				console.log("runTests    PUBLIC CERTIFICATE VERIFIED");

				console.log("runTests    VERIFYING DISPLAYED LOGIN ...");
				var login = widget.getLogin();
				console.log("runTests    login: ", login);
				doh.assertTrue(login == data.login);
				console.log("runTests    LOGIN VERIFIED");

				deferred.callback(true);
	
			} catch(e) {
			  deferred.errback(e);
			}
		}, 3000);
	
		return deferred;
	}
}

]);	// doh.register


//Execute D.O.H. in this remote file.
doh.run();



});

