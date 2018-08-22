/*
 * A very simple AMD module with no dependencies
 */

define([], function () {
	
	return {
		pairs : {},
	
		greet: function (name) {
			console.log("greet    name '" + name + "'");
			name = name || 'world';

			return 'Hello, ' + name + '!';
		},
		set : function (key, value) {
			if ( ! key ) {
				console.log("set    key not defined");
				return false;
			}
			console.log("set    key '" + key + "' = value '" + value + "'");
			this.pairs[key]	=	value;
			
			return true;
		}
	};
});