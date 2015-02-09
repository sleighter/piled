var WS_URL = 'ws://serene-earth-2066.herokuapp.com';
var GREEN_PIN = 17
var blaster = require('pi-blaster.js')
var WebSocket = require('ws');
var client = new WebSocket(WS_URL);

client.on('message', function(data, flags) {
  if(data == 'on'){
    blaster.setPwm(GREEN_PIN, 0.7);
  } else if(data == 'off'){
    blaster.setPwm(GREEN_PIN, 0);
  }
});
