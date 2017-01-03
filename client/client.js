var WS_URL = process.env.PILED_SERVER_URL;
var CIRCLE_PROJECT = process.env.CIRCLE_CI_PROJECT;
var logger = require('./logger.js');
var io = require('socket.io-client');
var socket = io(WS_URL);

var RGBColor = require('./rgbcolor.js');
var LEDController = require('./led-controller.js');

logger.info("Setting up listeners");

socket.on('connection', function(){
  logger.info('connected to server at ' + WS_URL);
});

socket.on('power', function(data) {
  var power = data == 'on';
  logger.debug("Turning power " + power ? 'ON' : 'OFF');
  LEDController.setPower(power);
});

socket.on('transition', function(data) {
  logger.debug("Colors are: " + data.color)
  var rgb = normalizeColors(data.color);
  var timeMs = data.timeMs;
  LEDController.transition(rgb, timeMs);
});

socket.on('color', function(colors) {
  var rgb = normalizeColors(colors);
  console.log("Colors are: " + colors)

  if(rgb){
    logger.debug("Setting to R:" + rgb.r + " G:" + rgb.g + " B:" + rgb.b);
    LEDController.setColor(rgb);
  }
});

console.log("Listening for Circle CI Project: " + CIRCLE_PROJECT);
if(CIRCLE_PROJECT){
  socket.on(CIRCLE_PROJECT, function(colors){
    var rgb = normalizeColors(colors);
    logger.info(CIRCLE_PROJECT + " status: " + colors);
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
      logger.error("Error parsing color data.");
    }
    return rgb;
  } else if (rgb.r && rgb.g && rgb.b) {
    return rgb;
  }
  return { r: 0, g: 0, b: 0 };
}
