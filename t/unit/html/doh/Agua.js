define([
	"dojo/_base/declare"

	,"plugins/core/Agua/App"
	,"plugins/core/Agua/Aws"
	,"plugins/core/Agua/Cloud"
	,"plugins/core/Agua/Cluster"
	,"plugins/core/Agua/Data"
	,"plugins/core/Agua/Exchange"
	,"plugins/core/Agua/Feature"
	,"plugins/core/Agua/File"
	,"plugins/core/Agua/Group"
	,"plugins/core/Agua/Hub"
	,"plugins/core/Agua/Package"
	,"plugins/core/Agua/Parameter"
	,"plugins/core/Agua/Project"
	,"plugins/core/Agua/Request"
	,"plugins/core/Agua/Shared"
	,"plugins/core/Agua/Sharing"
	,"plugins/core/Agua/Stage"
	,"plugins/core/Agua/StageParameter"
	,"plugins/core/Agua/User"
	,"plugins/core/Agua/View"
	,"plugins/core/Agua/Workflow"
	
	,"plugins/core/Common/Array"
	,"plugins/core/Common/Sort"
	,"plugins/core/Common/Toast"
	,"plugins/core/Common/Util"
	
	,"plugins/core/Updater"
	,"plugins/core/Conf"
	,"plugins/exchange/Exchange"

	,"dijit/Toolbar"
	,"dijit/layout/TabContainer"
],

function(
	declare,
	App,
	Aws,
	Cloud,
	Cluster,
	Data,
	Exchange,
	Feature,
	File,
	Group,
	Hub,
	Package,
	Parameter,
	Project,
	Request,
	Shared,
	Sharing,
	Stage,
	StageParameter,
	User,
	View,
	Workflow,
	
	Array,
	Sort,
	Toast,
	Util,
	
	Updater,
	Conf,
	SocketExchange
){
	
	var Agua = new declare([
		App,
		Aws,
		Cloud,
		Cluster,
		Data,
		Exchange,
		Feature,
		File,
		Group,
		Hub,
		Package,
		Parameter,
		Project,
		Request,
		Shared,
		Sharing,
		Stage,
		StageParameter,
		User,
		View,
		Workflow,
		
		Array,
		Sort,
		Toast,
		Util,
		
		Updater,
		Conf
	], {
	
		cookies : 	[],
		
		conf	:	null,
		
		updater	:	null,
		
		doPut	:	function (args) {
			console.log("t.unit.doh.Agua.doPut    args: ");
			console.dir({args:args});
			
			if ( args.callback ) {
				console.log("t.unit.doh.Agua.doPut    DOING callback()");
				args.callback();
			}
			
			return args;
		},
		constructor : function (args) {

			this.updater		=	new Updater({});
		
			this.conf			=	new Conf({});
			this.conf.parent	=	this;
		
			this.setExchange(SocketExchange);
		},
		setExchange : function(SocketExchange) {
		
			console.log("Agua.Exchange.setExchange    Exchange:");
			console.dir({Exchange:Exchange});
		
			// SET TOKEN
			this.setToken();
			
			// SET exchange
			//this.exchange = new SocketExchange({});
			//console.dir({this_exchange:this.exchange});
			
			this.exchange = new Object();
			this.exchange.conn = new Object();
			this.exchange.send = function(json) {
				console.log("doh.Agua.exchange.send()");
			};
			
			////// SET onMessage LISTENER
			//var thisObject = this;
			//this.exchange.onMessage = function (json) {
			//
			//	console.log("doh.Agua.Exchange.setExchange    this.exchange.onMessage FIRED    json.toString().substring(0,100):" + json.toString().substring(0,100));
			//	console.log("doh.Agua.Exchange.setExchange    this.exchange.onMessage FIRED    typeof json:" + typeof json);
			//	console.dir({json:json});
			//	var data = json;
			//	if ( typeof json != "object") {
			//		data = JSON.parse(json);
			//	}
			//	
			//	if ( data && data.sendtype && data.sendtype == "request" ) {
			//		console.log("doh.Agua.Exchange.setExchange    this.exchange.onMessage FIRED    data type is 'request'. Returning");
			//		return;
			//	}
			//	
			//	thisObject.onMessage(data);
			//	
			//};
			//
			//// CONNECT
			//var connectTimeout = this.connectTimeout;
			//setTimeout(function(){
			//	try {
			//		console.log("doh.Agua.Exchange.setExchange    thisObject: " + thisObject);
			//		console.log("doh.Agua.Exchange.setExchange    thisObject.exchange: " + thisObject.exchange);
			//		thisObject.exchange.connect();
			//
			//		console.log("doh.Agua.Exchange.setExchange    {} {} {} CONNECTED {} {} {}");
			//
			//		deferred.resolve({success:true});
			//	}
			//	catch(error) {
			//		console.log("doh.Agua.Exchange.setExchange    *** CAN'T CONNECT TO SOCKET ***");
			//		console.log("doh.Agua.Exchange.setExchange    error: " + error);
			//	}
			//},
			//1000);	
			//
			console.log("Agua.Exchange.setExchange    END");
		
		}
		
	});
	
	return new Agua({});
}

);
