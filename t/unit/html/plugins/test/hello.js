define([
	'intern!object',
	'intern/chai!assert',
	'plugins/test/hello'
], function (registerSuite, assert, hello) {

    registerSuite({
		
		name: 'hello',

        greet: function () {
            assert.strictEqual(hello.greet('Murray'), 'Hello, Murray!',
                'hello.greet should return a greeting for the person named in the first argument');
            assert.strictEqual(hello.greet(), 'Hello, world!',
                'hello.greet with no arguments should return a greeting to "world"');
        },
        set: function () {
            assert.strictEqual(hello.set(), false, 'hello.set returns false if key not defined');
            assert.strictEqual(hello.set("testkey", "testvalue"), true, 'hello.set returns true');       },
		
    });

});
