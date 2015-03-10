var sys = require('sys');
var exec = require('child_process').exec;
var child;

var LED_POWER = 'led-power';
var LED_FLASH = 'led-flash';

var LED_RED   = 'led-red';
var LED_GREEN = 'led-blue';
var LED_BLUE  = 'led-green';

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
    console.log(ex);
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
      sys.print('stdout: ' + stdout);
      sys.print('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    }
  );
}
