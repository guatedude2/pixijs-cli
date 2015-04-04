import cordova from 'org.apache.cordova';

cordova.onReady(function(){
  if (!navigator){
    console.log("Warning: Plugin org.apache.cordova.vibration is not available!");
  }
});

export default function (time){
  if (cordova.isReady && navigator){
    navigator.vibrate(time);
  }
};