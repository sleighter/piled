var WS_URL = process.env.PILED_SERVER_URL;
var CIRCLE_PROJECT = process.env.CIRCLE_CI_PROJECT;
var io = require('socket.io-client');
var socket = io(WS_URL);

var RGBColor = require('./rgbcolor.js');
var LEDController = require('./led-controller.js');

socket.on('connection', function(){
  console.log('connected');
});

socket.on('power', function(data) {
  var power = data == 'on';
  console.log("Turning power " + power ? 'ON' : 'OFF');
  LEDController.setPower(power);
});

socket.on('transition', function(data) {
  console.log("Colors are: " + data.color)
  var rgb = normalizeColors(data.color);
  var timeMs = data.timeMs;
  LEDController.transition(rgb, timeMs);
});

socket.on('color', function(colors) {
  var rgb = normalizeColors(colors);
  console.log("Colors are: " + colors)

  if(rgb){
    console.log("Setting to R:" + rgb.r + " G:" + rgb.g + " B:" + rgb.b);
    LEDController.setColor(rgb);
  }
});

if(CIRCLE_PROJECT){
  socket.on(CIRCLE_PROJECT, function(colors){
    var rgb = normalizeColors(colors);
    console.log(CIRCLE_PROJECT + " status: " + colors);
    if(rgb){
      LEDController.setColor(rgb);
      LEDController.flash(5000);
    }
  });
}

function normalizeColors(colors){
  if(typeof colors == "string"){
    var rgb = new RGBColor(colors);
    if(!rgb.ok){
      console.log("Error parsing color data.");
    }
    return rgb;
  } else if (rgb.r && rgb.g && rgb.b) {
    return rgb;
  }
  return { r: 0, g: 0, b: 0 };
}
