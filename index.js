var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.post('/on', function(req, resp) {
  io.emit('control', 'on');
  resp.send('turning on...');
});

app.post('/off', function(req, resp) {
  io.emit('control', 'off')
  resp.send('turning off...');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

io.on('connection', function(socket){
  console.log("New connection.");
});
