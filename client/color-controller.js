var RED_PIN = 18;
var GREEN_PIN = 17;
var BLUE_PIN = 19;

var Blaster = require('pi-blaster.js');

function set(colorParams){
  try{
    color = colorParams.color;
    Blaster.setPwm(RED_PIN, normalizeColorValue(color.r) );
    Blaster.setPwm(GREEN_PIN,normalizeColorValue(color.g) );
    Blaster.setPwm(BLUE_PIN, normalizeColorValue(color.b) );
    if(colorParams.success){
      colorParams.success(color);
    }
  } catch(ex) {
    if(colorParams.error){
      colorParams.error(ex);
    }
  }

}

function normalizeColorValue(val){
  return (val % 256)/255;
}