dojo.provide("t.plugins.infusion.detailed.test");

if(dojo.isBrowser){
     //Define the HTML file/module URL to import as a 'remote' test.
     doh.registerUrl(
          "t.plugins.infusion.detailed.test", 
          dojo.moduleUrl("t", "plugins/infusion/detailed/test.html"));
}