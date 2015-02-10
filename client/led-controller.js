var LAST_COLOR_KEY = 'last-color';
var ColorController = require('./color-controller.js');
var Store = require('jfs');
var db = new Store("data");
module.exports = { setPower: setPower, setColor: setColor };
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
}

function setColor(colorParams){
  var params = {
    color: colorParams,
    success: function(c){
      console.log("Color successfully set to " + formatColor(c));
      if(c.r > 0 || c.b > 0 || c.g > 0){
        db.save(LAST_COLOR_KEY, c);
      }
    },
    error: function(e){
      console.log("Error: " + e);
    }
  };

  ColorController.set(params)
}

function formatColor(color){
  return "R:" + color.r + " G:" + color.g + " B:" + color.b;
}
