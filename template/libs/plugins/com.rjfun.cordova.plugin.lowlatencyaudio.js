import cordova from 'org.apache.cordova';
var LowLatencyAudio = {};

LowLatencyAudio.isReady = false;
cordova.onReady(function(){
  if (!window.plugins || !window.plugins.LowLatencyAudio){
    console.log("Warning: com.rjfun.cordova.plugin.lowlatencyaudio is not available!");
    return;
  }
  LowLatencyAudio = window.plugins.LowLatencyAudio;
  LowLatencyAudio.isReady = true;
});

export default LowLatencyAudio;