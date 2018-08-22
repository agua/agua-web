define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "plugins/core/Common",
    "dijit/form/Button",
    "dijit/form/ValidationTextBox",
    "dijit/layout/ContentPane",
    "dijit/form/TextBox",
    "dijit/form/NumberTextBox",
    "dijit/form/Textarea",
    "dojo/dnd/Source",
],
    
function (
    declare,
    lang,
    _Widget,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Common
) {

return declare([
    _Widget,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Common
], {

/////}}}}}

// Template of this widget. 
templateString: dojo.cache("plugins", "cloud/templates/hub.html"),

//addingUser STATE
addingUser : false,

// OR USE @import IN HTML TEMPLATE
cssFiles : [
    dojo.moduleUrl("plugins", "cloud/css/hub.css"),
],

// PARENT WIDGET
parentWidget : null,

/////}}}}}
constructor : function(args)  {
    
    // MIXIN ARGS
    lang.mixin(args);

    // LOAD CSS
    this.loadCSS();        
},
postCreate : function() {
    this.startup();
},
startup : function () {
    //console.log("Hub.startup    plugins.cloud.GroupHub.startup()");

    // ATTACH PANE
    var thisObj = this;
    setTimeout(function(){
        thisObj.attachPane();
    },
    1000,
    this)

    // SUBSCRIBE TO UPDATES
    if ( Agua.updater ) {
        Agua.updater.subscribe(this, "updateSyncWorkflows");
        Agua.updater.subscribe(this, "updateHub");
        //Agua.updater.subscribe(this, "updateHubCertificate");
    }

    // SET DRAG SOURCE - LIST OF USERS
    this.initialise();
},
updateHub : function (args) {
    console.warn("Hub.updateHub    args:");
    console.dir({args:args});

    // DO NOTHING
},
updateSyncWorkflows : function (args) {
    console.warn("Hub.updateSyncWorkflows    args: ", args);

    // DO NOTHING
},
updateHub : function (args) {
    console.warn("Hub.updateHubCertificate    args: ", args);

    var hub = Agua.getData("hub");
    console.log("Agua.Hub.updateHubCertificate    hub: ", hub);

    if ( ! hub ) {
        console.log("Agua.Hub.updateHubCertificate    hub is null. Returning");
        return;
    }
    if ( ! hub.login ) {
        console.log("Agua.Hub.updateHubCertificate    hub.login is null. Returning");
        return;
    }
    
    this.setLogin(hub.login);
    this.setPublicCert(hub.publiccert);
    this.setToken(hub.token);    
},
initialise : function () {
    // INITIALISE AWS SETTINGS
    var hub = Agua.getHub();
    console.log("Hub.initialiseHub     hub: ");
    console.dir({hub:hub});
    console.log("Hub.initialiseHub     this.login: ");
    console.dir({this_login:this.login});

    // ENSURE POPULATED    
    hub.login = hub.login || "";
    hub.token = hub.token || "";
    hub.publiccert = hub.publiccert || "";

    // SET DISPLAYED VALUES
    this.setLogin(hub.login);
    this.setToken(hub.token);
    this.setPublicCert(hub.publiccert);
},
// ACCESSORS
setLogin : function (login) {
    console.log("Hub.setLogin    login", login);
    this.login.set('value', login);    
},
setToken : function (token) {
    console.log("Hub.setToken    token", token);
    this.token.set('value', token);    
},
setPublicCert : function (publiccert) {
    console.log("Hub.setPublicCert    publiccert", publiccert);
    this.publiccert.innerHTML = publiccert;
},
getLogin : function (login) {
    console.log("Hub.getLogin    Returning ", this.login.get('value'));
    return this.login.get('value');    
},
getToken : function () {
    console.log("Hub.getToken    Returning ", this.token.get('value'));
    return this.token.get('value');    
},
getPublicCert : function () {
    console.log("Hub.getPublicCert    Returning ", this.publiccert.innerHTML);
    return this.publiccert.innerHTML;
},
// SAVE TO REMOTE
addHub : function (event) {
    console.log("Hub.addHub    plugins.cloud.Hub.addHub(event)");

    if ( this.addingHub == true ) {
        console.log("Hub.addHub    this.addingHub: " + this.addingHub + ". Returning.");
        return;
    }
    this.addingHub = true;
    
    // VALIDATE INPUTS
    var inputs = this.validateInputs(["login", "token"]);
    if ( ! inputs ) {
        this.addingHub = false;
        return;
    }
    
    var data = {
        username     :     Agua.cookie('username'),
        login        :     this.login.value,
        token        :     this.token.value,
        hubtype        :     "github"
    };
    
    Agua.addHub(data);
},
// GENERATE PUBLIC CERTIFICATE FOR PRIVATE KEY USED TO ACCESS HUB
addHubCertificate : function () {
    console.log("Hub.addHubCertificate    this.creatingCert: ", this.creatingCert);
    if ( this.creatingCert ) {
        console.log("Hub.addHubCertificate    this.creatingCert: " + this.creatingCert + ". Returning.");
        return;
    }
    this.creatingCert = true;

    var aws = Agua.getAws();
    console.log("Hub.addHubCertificate    aws: ", aws);
    if ( ! aws || ! aws.ec2privatekey ) {
        this.creatingToken = false;
        Agua.toastError("Please input EC2 Private Key in 'AWS' panel and press 'Save'");
        return;
    }

    var inputs = this.validateInputs(["login"]);
    if ( inputs == null ) {
        this.creatingCert = false;
        return;
    }
    inputs.hubtype        =     "github";
    inputs.username     =     Agua.cookie('username');
    
    Agua.addHubCertificate(inputs);
},
// GENERATE OAUTH TOKEN FOR ACCESSING USER'S HUB ACCOUNT
toggleAddToken : function () {
    console.log("Hub.showCreateToken    this.password:" + this.password)
    console.log("Hub.showCreateToken    dojo.hasClass:" + dojo.hasClass(this.password, "showCreateToken"))

    if ( ! dojo.hasClass(this.addToken, "showAddToken") ) {
        this.addTokenButton.innerHTML = "Hide Panel";
        dojo.addClass(this.addToken, "showAddToken");
    }
    else {
        this.addTokenButton.innerHTML = "Add GitHub Token";
        dojo.removeClass(this.addToken, "showAddToken");
    }
},
// GENERATE OAUTH TOKEN FOR ACCESSING USER'S HUB ACCOUNT
closeAddToken : function () {
    console.log("Hub.closeAddToken    Removing class 'showAddToken'");
    this.addTokenButton.innerHTML = "Add GitHub Token";
    dojo.removeClass(this.addToken, "showAddToken");
},
generateToken : function () {
    console.log("Hub.addHubToken");

    if ( this.addingToken == true ) {
        console.log("Hub.addHubToken    this.addingToken: " + this.addingToken + ". Returning.");
        return;
    }
    this.addingToken = true;

    var data = this.validateInputs(["login", "password"]);
    if ( ! data ) {
        this.addingToken = false;
        return;
    }
    data.hubtype            =     "github";
    
    // SEND REQUEST
    this.sendRequest({
        data        :   data,
        mode        :   "generateToken",
        module      :   "Agua::Workflow",
        sourceid    :   this.id,
        callback    :   "handleGenerateToken"
    });

    console.log("Hub.addHubToken    Setting this.addingToken to FALSE");
    this.addingToken = false;
},
handleGenerateToken : function (response) {
    console.log("Hub.addHubToken    response", response);

    if ( response.error ) {
        console.log("Hub.addHubToken    response.error", response.error);
        return;
    }

    // CLOSE PANEL
    this.closeAddToken();

    // DISPLAY PUBLIC CERT 
    var token = response.data.token;
    console.log("Hub.handleGenerateToken    token:");
    console.dir({token:token});
    this.token.set('value', token);
    
    // RELOAD RELEVANT DISPLAYS
    Agua.updater.update("updateSyncWorkflows");    
},
// UTILS
validateInputs : function (keys) {
    console.log("Hub.validateInputs    keys: ", keys);
    var inputs = new Object;
    this.isValid = true;
    for ( var i = 0; i < keys.length; i++ ) {
        inputs[keys[i]] = this.verifyInput(keys[i]);
    }
    console.log("Hub.validateInputs    inputs: ", inputs);

    if ( ! this.isValid ) {
        return null;
    }
    
    return inputs;
},
verifyInput : function (input) {
    console.log("Hub.verifyInput    input: ", input);
    var value = this[input].value;
    value = this.cleanEdges(value);
    console.log("Hub.verifyInput    value: ", value);

    var className = this.getClassName(this[input]);
    console.log("Hub.verifyInput    className: " + className);
    if ( className ) {
        console.log("Hub.verifyInput    this[input].isValid(): " + this[input].isValid());
        if ( ! value || (this[input].isValid && ! this[input].isValid()) ) {
            console.log("Hub.verifyInput    input " + input + " value is empty. Adding class 'invalid'");
            if ( this[input].domNode ) {
                dojo.addClass(this[input].domNode, 'invalid');
            }
            this.isValid = false;
        }
        else {
            console.log("Hub.verifyInput    value is NOT empty. Removing class 'invalid'");
            dojo.removeClass(this[input].domNode, 'invalid');
            return value;
        }
    }
    else {
        if ( ! value ) {
            console.log("Hub.verifyInput    input " + input + " value is empty. Adding class 'invalid'");
            if ( this[input].domNode ) {
                dojo.addClass(this[input].domNode, 'invalid');
            }
            this.isValid = false;
            return null;
        }
        else {
            console.log("Hub.verifyInput    value is NOT empty. Removing class 'invalid'");
            dojo.removeClass(this[input], 'invalid');
            return value;
        }
    }
    
    return null;
},
clearInvalid : function () {
    var inputs = ["login", "token", ""]
    console.log("Hub.clearInvalid    input: ");
    console.dir({this_input:this[input]});
    var value = this[input].value;
    value = this.cleanEdges(value);
    console.log("Hub.clearInvalid    value: " + value);

    var className = this.getClassName(this[input]);
    console.log("Hub.clearInvalid    className: " + className);
    if ( className ) {
        if ( ! value || (this[input].isValid && ! this[input].isValid()) ) {
            console.log("Hub.clearInvalid    this[input].isValid(): " + this[input].isValid());
            console.log("Hub.clearInvalid    input " + input + " value is empty. Adding class 'invalid'");
            if ( this[input].domNode ) {
                dojo.addClass(this[input].domNode, 'invalid');
            }
            this.isValid = false;
        }
        else {
            console.log("Hub.clearInvalid    value is NOT empty. Removing class 'invalid'");
            if ( this[input].domNode ) {
                dojo.removeClass(this[input].domNode, 'invalid');
            }
            return value;
        }
    }
    else {
        if ( ! value ) {
            console.log("Hub.clearInvalid    input " + input + " value is empty. Adding class 'invalid'");
            dojo.addClass(this[input].domNode, 'invalid');
            this.isValid = false;
            return null;
        }
        else {
            console.log("Hub.clearInvalid    value is NOT empty. Removing class 'invalid'");
            dojo.removeClass(this[input], 'invalid');
            return value;
        }
    }
    
    return null;
},
cleanEdges : function (string ) {
// REMOVE WHITESPACE FROM EDGES OF TEXT
    string = string.toString();
    if ( string == null || ! string.replace)
        return null;
    string = string.replace(/^\s+/, '');
    string = string.replace(/\s+$/, '');

    return string;
}

}); // plugins.cloud.Hub

});
