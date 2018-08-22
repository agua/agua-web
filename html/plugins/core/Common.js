/* 	PROVIDE COMMONLY USED METHODS FOR ALL CLASSES:

	-   LOW-LEVEL METHODS THAT ACCOMPLISH GENERIC TASKS 
	
	-   METHODS THAT ARE WRAPPED AROUND BY CONTEXT-SPECIFIC METHODS
*/

define([
	"dojo/_base/declare",
    "plugins/core/Common/Array",
    //"plugins/core/Common/BrowserDetect",
    "plugins/core/Common/ComboBox",
    "plugins/core/Common/Date",
    "plugins/core/Common/Logger",
    "plugins/core/Common/Sort",
    "plugins/core/Common/Text",
    "plugins/core/Common/Toast",
    "plugins/core/Common/Util"
],
	   
function (
	declare,
	Array,
	ComboBox,
	Date,
	Logger,
	Sort,
	Text,
	Toast,
	Util
) {
////}}}}}
return declare([
	Array,
	ComboBox,
	Date,
	Logger,
	Sort,
	Text,
	Toast,
	Util
], {


// HASH OF LOADED CSS FILES
loadedCssFiles : null,


}); 	//	end declare

});	//	end define


