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

	"plugins/cloud/Aws",

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

	Aws
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

////}}}}}

doh.register("plugins.apps.Dialog.Scrape", [

////}}}}}

{
	name	: 	"addAws",
	timeout	:	30000,
	setUp: function(){
		Agua.cookie("username", "testuser");
		Agua.cookie("sessionid", "0000000000.0000.000");
		Agua.data	= 	util.fetchJson("./data.json");
		console.dir({Agua_data:Agua.data});
	},
	
	runTest	: function(){
	
		// SET DEFERRED OBJECT
		var deferred = new doh.Deferred();
			
		console.log("runTests    new Aws");
		widget = new Aws({
			attachPoint: dom.byId("attachPoint")
		});
		console.log("runTests    widget", widget);

		// DELAY
		setTimeout(function() {
			try {		
				console.log("runTests    DOING Agua.loadResponse()");

				// PRELOAD RESPONSE
				Agua.loadResponse("addAws-response.json");

				// SET DUMMY INPUTS
				var dummy	=	util.fetchJson("addAws-dummy.json").data;
				console.log("runTests    dummy", dummy);
				var elements = ["amazonuserid", "awsaccesskeyid", "awssecretaccesskey", "ec2privatekey", "ec2publiccert"];
				for ( var i = 0; i < elements.length; i++ ) {
					var element = elements[i];
					console.log("runTests    element", element);
					console.log("runTests    dummy.element", dummy[element]);
					widget.setElement(element, dummy[element]);
				}
				
				// ADD CERT
				widget.addAws();
				
				// VERIFY DISPLAYED DATA
				var data	=	util.fetchJson("addAws-response.json").data;
				console.log("runTests    data", data);
				for ( var i = 0; i < elements.length; i++ ) {
					var element = elements[i];
					console.log("runTests    element", element);
					console.log("runTests    dummy.element", dummy[element]);
					var value = widget.getElement(element);

					doh.assertTrue(value == data[element]);
					console.log("runTests    VERIFIED element", element);
				}
				
				deferred.callback(true);
	
			} catch(e) {
			  deferred.errback(e);
			}
		}, 1000);
	
		return deferred;
	}
}

]);	// doh.register


//Execute D.O.H. in this remote file.
doh.run();



});

