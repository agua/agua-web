define([ 
	'require',
	'intern!object', 
	'intern/chai!assert', 
	'intern/dojo/Deferred',
	'dojo/has' 
], function(require, registerSuite, assert, Deferred, has) {

	function testIt(expected, fooValue, barValue) {
		has.add("foo", fooValue, true, true);
		has.add("bar", barValue, true, true);
		var dfd = new Deferred();
		require([ "./foobarPlugin!" ], function(data) {
			assert.strictEqual(data, expected);
			dfd.resolve();
		});
		return dfd;
	}

	registerSuite({
		name : 'foobarPlugin',
		setup : function() {
			require({async:true});	// only fails in async mode
		},
		beforeEach : function() {
			require.undef('./foobarPlugin!');
			require.undef('./foobarPlugin');
		},
		teardown : function() {
			require.undef('./foobarPlugin!');
			require.undef('./foobarPlugin');
		},
		expectFoo : function() {
			return testIt("foo", true, false);
		},
		expectBar : function() {
			return testIt("bar", false, true);
		},
		expectUndefined : function() {
			return testIt("undefined", false, false);
		}
	});

});