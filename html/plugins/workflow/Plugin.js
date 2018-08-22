/* LOAD A PLUGIN

*/


define([
	"dojo/_base/declare",
	"dojo/ready",
],

//////}}}}}}}

function (
	declare,
	ready
) {

//////}}}}}}}

return declare([], {

	load : function (pluginName, className, args) {
		console.log("workflow.Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX    pluginName: " + pluginName);
		console.log("workflow.Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX    args: ");
		console.dir({args:args});

		//var className = pluginName.match(/^plugins(\.|\/)([^\.\/]+)(\.|\/)/)[2];
		//console.log("workflow.Plugin.load    XXXXXXXXXXXXXXXXXXXXXXXXXX    className: " + className);

		var plugin;
		require([pluginName], function (Module) {
			plugin = new Module(args);
			console.log("workflow.Plugin.load    plugin: " + plugin);
			
			args.parentWidget[className] = plugin;
			
		});

		return plugin;
	}
});

});
