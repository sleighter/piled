var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var util = require('util');
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

app.post('/circleci', function(req, resp) {
  console.log(util.inspect(req.body, {showHidden: false, depth: null}));
  var params = req.body.payload;
  var project = params.username + "/" + params.reponame + "/" + params.branch;
  switch (params.outcome) {
    case "success":
      console.log("Setting success");
      io.emit(project, "green");
      break;
    case "failure":
      console.log("Setting failure");
      io.emit(project, "red");
      break;
    default:
      break;
  }
  resp.send("OK")
});

io.on('connection', function(socket){
  console.log("New connection.");
});
