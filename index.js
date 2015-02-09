var express = require('express');
var http = require('http');
var WebSocketServer = require('ws').Server;
var app = express();


var server = http.createServer(app);
server.listen(process.env.PORT || 5000);

var wss = new WebSocketServer({server: server})

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.post('/on', function(req, resp) {
  wss.clients.forEach(function (client) {
    client.send({action:'on'});
  });
  resp.send('turning on...');
});

app.post('/off', function(req, resp) {
  wss.clients.forEach(function each(client) {
    client.send({action: 'off'});
  });
  resp.send('turning off...');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

wss.on('connection', function(ws){
  console.log("New connection.");
});
