var WS_URL = process.env.PILED_SERVER_URL;
var io = require('socket.io-client');
var socket = io(WS_URL);

var RGBColor = require('./client/rgbcolor.js');
var LEDController = require('./client/led-controller.js');

socket.on('connection', function(){
  console.log('connected');
});

socket.on('power', function(data) {
  var power = data == 'on';
  console.log("Turning power " + power ? 'ON' : 'OFF');
  LEDController.setPower(data == 'on');
});

socket.on('color', function(colors) {
  var rgb = colors;
  console.log("Colors are: " + colors)
  if(colors instanceof String){
    rgb = new RGBColor(colors);
  }
  if(!rgb || rgb.ok){
    console.log("Setting to R:" + rgb.r + " G:" + rgb.g + " B:" + rgb.b);
    LEDController.set(rgb);
  }
});
