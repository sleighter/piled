var WS_URL = 'ws://serene-earth-2066.herokuapp.com';
var GREEN_PIN = 17
var blaster = require('pi-blaster.js')
var WebSocket = require('ws');
var client = new WebSocket(WS_URL);

client.on('connection', function(){
  console.log('connected');
});

client.on('message', function(data, flags) {
  console.log(data)
  if(data == 'on'){
    console.log("Setting pin: " + GREEN_PIN + " to 1")
    blaster.setPwm(GREEN_PIN, 0.7);
  } else if(data == 'off'){
    console.log("Setting pin: " + GREEN_PIN + " to 0")
    blaster.setPwm(GREEN_PIN, 0);
  }
});
