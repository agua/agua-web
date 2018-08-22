define([
    'intern!object',
    'intern/chai!assert',
	//'intern/dojo/node!leadfoot/helpers/pollUntil',
    'require'
], function (
		registerSuite,
		assert,
		//pollUntil,
		require
	) {
	
    registerSuite({
	
	name: 'hello',

	'greeting form': function () {
            return this.remote
                .get(require.toUrl('t/functional/plugins/test/test.html'))
	            //.then(pollUntil('return window.ready;', 5000))
                .setFindTimeout(5000)
                .findByCssSelector('body.loaded')
                .findById('nameField')
                    .click()
                    .type('Elaine')
                    .end()
                .findByCssSelector('#loginForm input[type=submit]')
                    .click()
                    .end()
                .findById('greeting')
                .getVisibleText()
                .then(function (text) {
					console.log("Name greeting displayed after form submitted");
                    assert.strictEqual(text, 'Hello, Elaine!', 'Name greeting displayed after form submitted');
                });
	    }
	});
});
