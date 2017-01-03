var LAST_COLOR_KEY = 'last-color';
var ColorController = require('./ir-color-controller.js');
var Store = require('jfs');
var db = new Store("data");
var logger = require('./logger.js');
module.exports = { setPower: setPower, setColor: setColor, transition: transition, flash: flash };
function setPower(on){
  if(on){
    db.get(LAST_COLOR_KEY, function(err, last_color){
      if(!err){
        setColor(last_color);
      } else {
        setColor({r:0.7, b:0.7, g:0.7});
      }
    });
  }else{
    setColor({r:0, b:0, g:0});
  }
  ColorController.power();
}

function transition(rgb, timeMs){
  logger.debug(rgb);
  db.get(LAST_COLOR_KEY, function(err, last_color){
    if(!err){
      logger.info("Transitioning to " + formatColor(rgb) + " over " + timeMs + "ms")
      ColorController.transition(last_color, rgb, timeMs);
      db.save(LAST_COLOR_KEY, rgb);
    }
  });
}

function setColor(colorParams){
  var params = {
    color: colorParams,
    success: function(c){
      logger.info("Color successfully set to " + formatColor(c));
      if(c.r > 0 || c.b > 0 || c.g > 0){
        db.save(LAST_COLOR_KEY, c);
      }
    },
    error: function(e){
      logger.error("Error: " + e);
    }
  };

  ColorController.set(params)
}

function flash(timeMs){
  ColorController.flash(2,timeMs)
}

function formatColor(color){
  return "R:" + color.r + " G:" + color.g + " B:" + color.b;
}
