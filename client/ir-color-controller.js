var sys = require('sys');
var exec = require('child_process').exec;
var child;
var logger = require('./logger.js');

var LED_POWER = 'led-power';
var LED_FLASH = 'led-flash';

var LED_RED   = 'led-red';
var LED_GREEN = 'led-green';
var LED_BLUE  = 'led-blue';

module.exports = { power: power, set: set, transition: transition, flash: flash}

function power(){
  sendIRCommand(LED_POWER)
}

function set(colorParams){
  try{
    var color = colorParams.color;
    if(color.r > 0 && color.b == 0 && color.g == 0) {
      sendIRCommand(LED_RED);
    } else if(color.g > 0 && color.r == 0 && color.b == 0) {
      sendIRCommand(LED_GREEN);
    } else if(color.b > 0 && color.r == 0 && color.g == 0) {
      sendIRCommand(LED_BLUE);
    }
  } catch(ex) {
    logger.error(ex);
  }
}

function transition(current, color, time_ms){

}

function flash()
{
  sendIRCommand(LED_FLASH);
}

function sendIRCommand(cmd)
{
  child = exec(
    "irsend SEND_ONCE led " + cmd,
    function (error, stdout, stderr) {
      if (stdout && stdout.length > 0){
        logger.info(stdout);
      }
      if (stderr && stderr.length > 0){
        logger.error(stderr);
      }
      if (error && error.length > 0) {
        logger.error(error);
      }
    }
  );
}
