var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
server.listen(process.env.PORT);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.post('/on', function(req, resp) {
  io.emit('power', 'on');
  resp.send('turning on...');
});

app.post('/off', function(req, resp) {
  io.emit('power', 'off')
  resp.send('turning off...');
});

app.post('/color', function(req, resp) {
  var params = req.body;
  io.emit('color', params.color);
  console.log("Set color to: " + params);
  resp.send("Set color to: " + params);
});

app.post('/transition', function(req, resp) {
  var params = req.body;
  io.emit('transition', params);
  var msg = "Transition to " + params.color + " over " + params.timeMs + "ms";
  console.log(msg);
  resp.send(msg)
})

io.on('connection', function(socket){
  console.log("New connection.");
});
