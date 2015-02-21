var RED_PIN = process.env.RED_PIN ? process.env.RED_PIN : 17;
var GREEN_PIN = process.env.GREEN_PIN ? process.env.GREEN_PIN : 27;
var BLUE_PIN = process.env.BLUE_PIN ? process.env.BLUE_PIN : 22;

var Blaster = require('pi-blaster.js');

module.exports = { set: set };

function set(colorParams){
  try{
    var color = colorParams.color;
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

function transition(currentColor, colorParams, time_ms) {
  var color = colorParams.color;
  var targetColor = [normalizeColorValue(color.r), normalizeColor(color.g), normalizeColor(color.b)];
  var distance		= calculateDistance(currentColor, randomColor);
	var increment		= calculateIncrement(distance);
	var iteration		= Math.round(time_ms/distance);
	
	var makeTransition = function() {
		if (currentColor[0] > targetColor[0]) {
			currentColor[0] -= increment[0];
			if (currentColor[0] <= targetColor[0]) {
				increment[0] = 0;
			}
		} else {
			currentColor[0] += increment[0];
			if (currentColor[0] >= targetColor[0]) {
				increment[0] = 0;
			}
		}
		
		if (currentColor[1] > targetColor[1]) {
			currentColor[1] -= increment[1];
			if (currentColor[1] <= targetColor[1]) {
				increment[1] = 0;
			}
		} else {
			currentColor[1] += increment[1];
			if (currentColor[1] >= targetColor[1]) {
				increment[1] = 0;
			}
		}
		
		if (currentColor[2] > targetColor[2]) {
			currentColor[2] -= increment[2];
			if (currentColor[2] <= targetColor[2]) {
				increment[2] = 0;
			}
		} else {
			currentColor[2] += increment[2];
			if (currentColor[2] >= targetColor[2]) {
				increment[2] = 0;
			}
		}
  
    var nextColor = { color: { r: currentColor[0], g: currentColor[1], b: currentColor[2] } };
    set(nextColor)
		
		if (increment[0] == 0 && increment[1] == 0 && increment[2] == 0) {
			clearInterval(handler);
		}
	}
	var handler = setInterval(makeTransition, iteration);
}

function calculateDistance(current, next) {
	var distance = [];
	for (var i = 0; i < 3; i++) {
		distance.push(Math.abs(current[i] - next[i]));
	}
	return distance;
}

function calculateIncrement(distance) {
	var incrementStops	= 50;
	var increment		= [];
	for (var i = 0; i < 3; i++) {
		increment.push(Math.abs(Math.floor(distance[i] / incrementStops)));
		if (increment[i] == 0) {
			increment[i]++;
		}
	}
	return increment;
}

function normalizeColorValue(val){
  return (val % 256)/255;
}
