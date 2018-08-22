define([
	"dojo/_base/declare",
	"dojo/_base/lang"
],
function(
	declare,
	lang
){

return declare(null, {

/////}}}}}}}

TEST : null,

// outputs : ArrayRef
//    Array of outputs to be spliced consecutively by calls to object
outputs	: 	[],

// outputs : ArrayRef
//    Array of consecutive inputs provided in calls to object
inputs	:	[],

/////}}}}}}}

mockOut : function () {
	return this.outputs.splice(0,1);
},

mockIn : function (input) {
	this.inputs.push(input);
}

});
});
