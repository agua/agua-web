var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

var keydir = "/a/conf/.https";
//console.log("keydir: " + keydir);

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync(keydir + '/server.key'),
  cert: fs.readFileSync(keydir + '/server.crt')
};

console.log("server.key: " + keydir + "/server.key");

// Create a service (the app object is just a callback).
var app = express();
//console.dir({app:app})

/* serves all the static files */
app.get(/^(.+)$/, function(request, response){
  //console.log('static file request: ' + request.params);
  response.sendfile( "/a/html/" + request.params[0]); 
});

// Create an HTTP service.
//http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
console.log("DOING https.createServer(options, app).listen(443)");
https.createServer(options, app).listen(443);

