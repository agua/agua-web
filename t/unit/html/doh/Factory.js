console.log("t/unit/doh/Factory    LOADING");

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/DeferredList"
],

function(
	declare,
	lang,
	DeferredList
){

return declare(null, {
	
cookies : 	[],

conf	:	null,

updater	:	null,

constructor : function (args) {
	console.log("Factory.constructor    args: ");
	console.dir({args:args});
	
	// MIXIN ARGS
	lang.mixin(this, args);
	
	// MIXIN MODULES
	this.mixinModules(args.mixins);

	// LOAD COMPONENTS
	this.loadComponents(args.components);
},
loadComponents : function (components) {
	console.log("Factory.loadComponents    components:");
	console.dir({components:components});
	if ( ! components )	return;

	var thisObject	=	this;	
	for ( var i = 0; i < components.length; i++ ) {
		var component	=	components[i];
		var name		=	component.name;
		var module		=	component.module;
		var attachPoint	=	component.attachPoint;

		console.log("Factory.loadComponents    name: " + name);
		console.log("Factory.loadComponents    module: " + module);

		if ( ! name ) {
			console.log("workflow.Controller.injectDependencies    Skipping because name not defined: ");
			continue;
		}

		require([module], function (Module) {
			console.log("Workflow.setCoreWidget    Module: " + typeof Module);

			thisObject[name]	=	new Module({
				parentWidget 	: 	thisObject,
				attachPoint 	:	attachPoint
			});
		});	
	}	

	// STARTUP COMPONENTS
	var array	=	[];
	for ( var i = 0; i < components.length; i++ ) {
		var component	=	components[i];
		var name		=	component.name;

		console.log("Factory.loadComponents    DOING this." + name + ".startup()");
		var deferred = thisObject[name].startup();
		if ( deferred ) array.push(deferred);
	}	
	console.log("Factory.loadComponents    array:");
	console.dir({array:array});
	
	var deferredList = new DeferredList(array);

	deferredList.then(function(result){
		console.log("Factory.loadComponents    ALL DEFERRED COMPLETED");
	});
	
},
mixinModules : function(modules) {
	console.log("Factory.doMixins    modules: ");
	console.dir({modules:modules});
	if ( ! modules )	return;

	var thisObject = this;
	for ( var i = 0; i < modules.length; i++ ) {
		console.log("Factory.doMixins    module[" + i + "]: " + modules[i]);
		
		require([modules[i]], function (Module) {
			console.log("Factory.doMixins    Module: ");
			console.dir({Module:Module});

			lang.mixin(thisObject, dojo.clone(new Module()));
		});	
	}
}


});
});


console.log("t/unit/doh/Factory    COMPLETED");
