require([
	"dojo/_base/declare",
	"dijit/registry",
	"dojo/parser",
	"dojo/dom",
	"doh/runner",
	"t/unit/doh/util",
	
	// AGUA
	"plugins/core/Common/Util",
	"plugins/core/Common/Array",
	"plugins/core/Agua/Data",
	"plugins/core/Agua/Ami",
	"t/unit/doh/Exchange",
	"plugins/core/Updater",
	
	"plugins/cloud/Controller",
	"dijit/Toolbar",
	
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
	AguaData,
	AguaAmi,
	AguaExchange,
	Updater,

	Controller,
	Toolbar
) {

	
// INSTANTIATE MOCK AGUA
var Module = new declare([
	AguaData,
	AguaAmi,
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

doh.register("plugins.cloud.Ami", [

////}}}}}

{
	name	: 	"controller",
	timeout	:	30000,
	setUp: function(){
		// CLEAN UP
		var attachPoint = dom.byId("attachPoint");
		console.log("runTests    				attachPoint: ", attachPoint);

		Agua.cookie("username", "testuser");
		Agua.cookie("sessionid", "0000000000.0000.000");
		Agua.data	= 	util.fetchJson("data.json");
		Agua.toolbar = new Toolbar({}, "toolbar");
		console.log("runTests    Agua.toolbar: ", Agua.toolbar);
	},
	
	runTest	: function(){
	
		// SET DEFERRED OBJECT
		var deferred = new doh.Deferred();
			
		// OPEN DIRECTORIES AUTOMATICALLY
		setTimeout(function() {
			try {
				console.log("runTests    new");
				widget = new Controller({
					attachPoint: dom.byId("attachPoint")
				});
				console.log("runTests    widget", widget);
				widget.startup();
				
				var label = dijit.byNode(Agua.toolbar.domNode.childNodes[1]).containerNode.innerHTML;
				console.log("runTests    label", label);

				doh.assertTrue(label == "Cloud");
				
				// DEFERRED CALLBACK
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

