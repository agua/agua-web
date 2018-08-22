var express = require('express');
var http = require('http');

// Create a service (the app object is just a callback).
var app = express();
console.dir({app:app})

app.configure(function() {
  var hourMs = 1000*60*60;
  app.use(express.static("/a/html", { maxAge: hourMs }));
  app.use(express.directory("/a/html"));
  app.use(express.errorHandler());
});

/* serves all the static files */
app.get(/^(.+)$/, function(request, response){
  console.log('static file request: ' + request.params);
  response.sendfile( "/a/html/" + request.params[0]); 
});

// Create an HTTP service.
console.log("DOING http.createServer(app).listen(80)");
http.createServer(app).listen(80);

