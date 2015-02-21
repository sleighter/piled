var RED_PIN = process.env.RED_PIN ? process.env.RED_PIN : 17;
var GREEN_PIN = process.env.GREEN_PIN ? process.env.GREEN_PIN : 27;
var BLUE_PIN = process.env.BLUE_PIN ? process.env.BLUE_PIN : 22;

var Blaster = require('pi-blaster.js');

module.exports = { set: set, transition: transition };

function set(colorParams){
  try{
    var color = colorParams.color;
    var normalColor = [normalizeColorValue(color.r), normalizeColorValue(color.g), normalizeColorValue(color.b)];
    Blaster.setPwm(RED_PIN, normalColor[0] );
    Blaster.setPwm(GREEN_PIN,normalColor[1] );
    Blaster.setPwm(BLUE_PIN, normalColor[2] );
    if(colorParams.success){
      colorParams.success(color);
    }
  } catch(ex) {
    if(colorParams.error){
      colorParams.error(ex);
    }
  }
}

function transition(current, color, time_ms) {
  var targetColor = [color.r, color.g, color.b];
  var currentColor = [current.r, current.g, current.b];
  var distance = [];
  for(var i = 0; i < 3; i++) {
    distance.push(targetColor[i] - currentColor[i]);
  }
  var stepEach = [];
  for (var i = 0; i < distance.length; i++){
    stepEach.push(Math.abs(distance[i]));
  }
  var steps = Math.max.apply(null, stepEach);
  console.log("steps: " + steps);

  var increment = [steps == 0 ? 0 : Math.ceil(distance[0]/steps), steps == 0 ? 0 : Math.ceil(distance[1]/steps), steps == 0 ? 0 : Math.ceil(distance[2]/steps)];
  var direction = [distance[0] == 0 ? 0 : stepEach[0]/distance[0], increment[1] == 0 ? 0 : stepEach[1]/distance[1], distance[2] == 0 ? 0 : distance[2]/increment[2]];

  var makeTransition = function() {
    for(var i = 0; i < 3; i++){
      currentColor[i] += increment[i];
      if ((direction[i] == 1 && currentColor[i] > targetColor[i]) || (direction[i] == -1 && currentColor[i] < targetColor[i])) {
        currentColor[i] = targetColor[i];
        increment[i] = 0; 
        direction[i] = 0;
      }
    }
    set({color: {r:currentColor[0],g:currentColor[1], b:currentColor[2]} });	
    
    if (increment[0] == 0 && increment[1] == 0 && increment[2] == 0) {
      clearInterval(handler); //transition complete
    }
  };

  if(steps > 0){
    var handler = setInterval(makeTransition, time_ms/steps);
  }
}

function normalizeColorValue(val){
  return (val % 256)/255;
}
