var WS_URL = process.env.PILED_SERVER_URL;
var GREEN_PIN = 17;
var blaster = require('pi-blaster.js');
var io = require('socket.io-client');
var socket = io(WS_URL);

socket.on('connection', function(){
  console.log('connected');
});

socket.on('control', function(data, flags) {
  console.log(data)
  if(data == 'on'){
    console.log("Setting pin: " + GREEN_PIN + " to 1")
    blaster.setPwm(GREEN_PIN, 0.7);
  } else if(data == 'off'){
    console.log("Setting pin: " + GREEN_PIN + " to 0")
    blaster.setPwm(GREEN_PIN, 0);
  }
});
