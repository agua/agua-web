dojo.provide("t.plugins.workflow.parameters.test");

if(dojo.isBrowser){
     //Define the HTML file/module URL to import as a 'remote' test.
     doh.registerUrl(
          "t.plugins.workflow.parameters.test", 
          dojo.moduleUrl("t", "plugins/workflow/parameters/test.html"));
}
