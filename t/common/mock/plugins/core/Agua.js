define([
	"dojo/_base/declare"
],

function(
	declare
){

return declare([
], {
	
/////}}}}}}}

mixins		:	[],

components	:	[],

cookies 	: 	[],

conf		:	null,

updater		:	null,

baseClass : "pluginsCoreAgua",

/////}}}}}}}

cookie : function (name, value) {
	console.log("t.common.mock.plugins.core.Agua.cookie     name: " + name);
	console.log("t.common.mock.plugins.core.Agua.cookie     value: " + value);		

	if ( value != null ) {
		this.cookies[name] = value;
	}
	else if ( name != null ) {
		return this.cookies[name];
	}

	return 0;
}	
});
	
});
