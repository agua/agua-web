// GENERAL
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var context = require('../../index').createContext();

// HTTPS
//var http = require('https');
//var options = {
//  key: fs.readFileSync('/a/conf/.https/server.key'),
//  cert: fs.readFileSync('/a/conf/.https/server.crt')
//};
//var httpserver = http.createServer(options, handler);

// HTTP
var http = require('http');
var httpserver = http.createServer(handler);


var socketioserver = io.listen(httpserver);

socketioserver.sockets.on('connection', function(connection) {
    var pub = context.socket('PUB');
    var sub = context.socket('SUB');

	connection.on('disconnect', function() {
		pub.destroy();
		sub.destroy();
	});

	// NB we have to adapt between the APIs
	sub.setEncoding('utf8');
	connection.on('message', function(msg) {
		pub.write(msg);
	});
	sub.on('data', function(msg) {
		connection.send(msg);
	});
	sub.connect('chat');
	pub.connect('chat');
});

console.log("BEFORE httpserver.listen(8080, '0.0.0.0')");

httpserver.listen(8080, '0.0.0.0');

console.log("AFTER httpserver.listen(8080, '0.0.0.0')");

// ==== boring detail

function handler(req, res) {
  var path = url.parse(req.url).pathname;
  //path = "/a/html" + path;
  console.log("handler    path: " + path);
  
  switch (path){
  case '/':
    path = '/index.html';
  case '/index.html':
    fs.readFile(__dirname + '/index.html', function(err, data){


      if (err) return send404(res);

		console.log("err: " + err)
		
      res.writeHead(200, {
		'Content-Type': 'text/html',
		'Access-Control-Allow-Origin' : '*'
		});
      res.write(data, 'utf8');
      res.end();
    });
    break;
  default: send404(res);
  }
}

function send404(res){
  res.writeHead(404);
  res.write('404');
  res.end();
}
