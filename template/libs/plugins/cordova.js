//wraps cordova in es6 module
var cordova = {};
var readyCallbacks = [];
if (window.cordova){
  cordova = window.cordova;
}
cordova.isReady = false;
cordova.onReady = function(callback){
  if (!cordova.isReady){
    readyCallbacks.push(callback);
  }else{
    callback.call(null);
  }
};

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  cordova.isReady = true;
  for(var i=0; i<readyCallbacks.length; i++){
    readyCallbacks[i].call(null);
  }
}

export default cordova;
