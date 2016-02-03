module.exports = { info: info, debug: debug, warn: warn, error: error };

function info(msg){
  log("[INFO] : " + msg);
}

function debug(msg){
  log("[DEBUG] : " + msg);
}

function warn(msg){
  log("[WARN] : " + msg);
}

function error(msg){
  log("[ERROR] : " + msg);
}

function log(msg){
  console.log(Date() + " :: " + msg);
}
