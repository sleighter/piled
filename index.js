var express = require('express');
var ws = require('ws').Server;
var wss = new WebSocketServer({port: 8080})
var app = express();
var clients = [];

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.post('/on', function(req, resp) {
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send('on');
    });
  };
  response.send('success');
});

app.post('/off', function(req, resp) {
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send('off');
    });
  };
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

wss.on('connection', function(ws){
  console.log("New connection.");
});
