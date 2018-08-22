/* LOAD A PLUGIN

*/


define([
	"dojo/_base/declare",
	"dojo/ready",
	"dojo/json",
],

//////}}}}}}}

function (
	declare,
	ready,
	JSON
) {

//////}}}}}}}

return declare([], {

	load : function (pluginName) {
		console.log("Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX");

		var className = pluginName.match(/^plugins(\.|\/)([^\.\/]+)(\.|\/)/)[2];
		console.log("Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX    className: " + className);

		require([pluginName], function (Module) {
			plugin = new Module({});
			console.log("Plugin.load    plugin: " + plugin);
			
			console.log("Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX BEFORE Agua.controllers[" + className + "] = plugin");
			Agua["controllers"][className] = plugin;
			console.log("Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX AFTER Agua.controllers[" + className + "] = plugin");
			console.log("Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX INSIDE require    Agua.controllers: ");
			console.dir({Agua_controllers:Agua.controllers});
			//console.log("Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX Agua.controllers: " + JSON.stringify(Agua.controllers));
		});
		console.log("Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX OUTSIDE require    Agua.controllers:");
		console.dir({Agua_controllers:Agua.controllers});

		return plugin;
	}
});

});
