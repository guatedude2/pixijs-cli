import cordova from 'cordova';

cordova.onReady(function(){
  if (!navigator){
    console.log("Cordova Error: org.apache.cordova.vibration is not available!");
  }
});

export default function (time){
  if (cordova.isReady && navigator){
    navigator.vibrate(time);
  }
};