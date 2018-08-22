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
	
	"plugins/cloud/Ami",
	
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

	Ami
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
	name	: 	"addAmi",
	timeout	:	30000,
	setUp: function(){
		// CLEAN UP
		var attachPoint = dom.byId("attachPoint");
		console.log("runTests    				attachPoint: ", attachPoint);
		//while ( attachPoint.childNodes ) {
		//	attachPoint.removeChild(attachPoint.childNodes[0]);
		//}

		Agua.cookie("username", "testuser");
		Agua.cookie("sessionid", "0000000000.0000.000");
		Agua.data	= 	util.fetchJson("data.json");
	},
	
	runTest	: function(){
	
		// SET DEFERRED OBJECT
		var deferred = new doh.Deferred();
			
		// OPEN DIRECTORIES AUTOMATICALLY
		setTimeout(function() {
			try {
				console.log("runTests    new");
				widget = new Ami({
					attachPoint: dom.byId("attachPoint")
				});

				// SAVE DATA
				Agua.loadResponse("addAmi-response.json");
				var data = util.fetchJson("addAmi-request.json");
				widget.aminame.textbox.value = data.aminame;
				widget.aminame.value = data.aminame;
				console.log("runTests    BEFORE widget.saveInputs()");
				widget.saveInputs(data, widget.id);
				console.log("runTests    AFTER widget.saveInputs()");

				console.log("runTests    				doh.assertTrue(widget.amitype.selectedOptions[0].value == data.amitype)");
				doh.assertTrue(widget.amitype.selectedOptions[0].value == data.amitype);
				console.log("runTests    				doh.assertTrue(widget.aminame.value == data.aminame)");
				//console.log("runTests    				widget.aminame.value: ", widget.aminame.value);
				//console.log("runTests    				data.aminame: ", data.aminame);
				doh.assertTrue(widget.aminame.value == data.aminame);
				//console.log("runTests    				widget.amiid.value: ", widget.amiid.value);
				//console.log("runTests    				data.amiid: ", data.amiid);

				console.log("runTests    				doh.assertTrue(widget.amiid.value == data.amiid)");
				doh.assertTrue(widget.amiid.value == data.amiid);
				deferred.callback(true);
	
			} catch(e) {
			  deferred.errback(e);
			}
		}, 1000);
	
		return deferred;
	}
},
{
	name	: 	"removeAmi",
	timeout	:	30000,
	setUp: function(){
		// CLEAN UP
		var attachPoint = dom.byId("attachPoint");
		console.log("runTests    				attachPoint: ", attachPoint);
		while ( attachPoint.childNodes.length ) {
			attachPoint.removeChild(attachPoint.childNodes[0]);
		}

		Agua.cookie("username", "testuser");
		Agua.cookie("sessionid", "0000000000.0000.000");
		Agua.data	= 	util.fetchJson("data.json");
	},
	
	runTest	: function(){
		// SET DEFERRED OBJECT
		var deferred = new doh.Deferred();
		
		// OPEN DIRECTORIES AUTOMATICALLY
		setTimeout(function() {
			try {
				// GET WIDGET
				console.log("runTests    				BEFORE new Ami");
				widget = new Ami({
					attachPoint: dom.byId("attachPoint")
				});
				console.log("runTests    				AFTER new Ami");
				
				// LOAD RESPONSE
				Agua.loadResponse("addAmi-response.json");
				Agua.loadResponse("removeAmi-response.json");

				// SEND DATA
				var data = util.fetchJson("addAmi-request.json");
				//widget.aminame.textbox.value = data.aminame;
				//widget.aminame.value = data.aminame;
				console.log("runTests    				BEFORE widget.saveInputs()");
				widget.saveInputs(data, widget.id);
				console.log("runTests    AFTER widget.saveInputs()");
				data = util.fetchJson("removeAmi-request.json");
				widget.deleteItem(data);
				

				// TESTS
				var length = widget.dragSource.getAllNodes().length;
				console.log("runTests    				length: ", length);
				console.log("runTests    				doh.assertTrue(length === 0)");
				doh.assertTrue(length == 0);

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

