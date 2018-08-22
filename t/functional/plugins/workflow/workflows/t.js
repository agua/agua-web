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

name: 'drop stage',

'greeting form': function () {
	return this.remote
		// LOAD PAGE
		.get(require.toUrl('t/functional/plugins/workflow/workflows/test.html'))
		//.then(pollUntil('return window.ready;', 5000))
		.setFindTimeout(5000)
		.then(function (text) {
			console.log("Loaded test.html page");
		})


		//.findByCssSelector('body.loaded')
		//.findById('nameField')
		//	.click()
		//	.type('Elaine')
		//	.end()
		
		// DRAG
		//.elementByCss("#dojoUnique1 .title")
		.findById("dojoUnique20")
		.then(function (text) {
			console.log("t    Found sleep app in left panel");
		})
		.moveTo()
		.buttonDown(0)
		.then(function (text) {
			console.log("t    Clicked on sleep app in left panel");
		})
		.sleep(500)
		.end()
	
		////.elementByCss("#ROOT_DROP_ZONE > div.control > div.alfresco-creation-DropZone > div.previewPanel")
		//.findByCss(".workflows .dropTarget.dojoDndSource.dojoDndTarget.dojoDndContainer")
		//.moveTo()
		//.sleep(500)
		//.buttonUp()
		//.end()
		//
		//.sleep(1000)
		
		
		// 
		//.findByCssSelector('#loginForm input[type=submit]')
		//	.click()
		//	.end()
		//.findById('greeting')
		//.getVisibleText()
		//.then(function (text) {
		//	console.log("Name greeting displayed after form submitted");
		//	assert.strictEqual(text, 'Hello, Elaine!', 'Name greeting displayed after form submitted');
		//});
}


});
});
