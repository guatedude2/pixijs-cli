import PIXI from 'pixi';
import Audio from 'audio';

var assetQueue = {};
var soundQueue = {};
var preloaded = false;

//TODO: FIX UNSUPPORTED
// 'atlas': PIXI.AtlasLoader,
// 'anim': PIXI.SpineLoader,
// 'xml':  PIXI.BitmapFontLoader,
// 'fnt':  PIXI.BitmapFontLoader

function loadAsset(source, callback){
  if (!!~source.search(/\.(jpe?g|png|gif|webp)$/)){
    var textureObject = PIXI.Texture.fromImage(source);
    textureObject.on('update', function (){
      if (typeof callback === 'function') callback();
    });
    return textureObject;
  }else if (source.toLowerCase().slice(-5)==='.json'){
    var jsonObject = { data:null, hasLoaded: false };
    var loader = new PIXI.JsonLoader(source);
    loader.on('loaded', function(evt) {
      jsonObject.data = evt.data.content.json;
      jsonObject.hasLoaded = true;
      if (typeof callback === 'function') callback();
    });
    loader.load();
    return jsonObject;
  }else{
    throw new Error("Unrecoginze file format " + source);
  }
}

function loadSound(id, source, callback){
  if (!!~source.search(/\.(mp3)$/)){
    var audioObject = { hasLoaded: false }
    Audio.loadSound(id, source, function (){
      audioObject.hasLoaded = true;
      return (typeof callback === 'function') && callback();
    });
    return audioObject;
  }else{
    throw new Error("Unrecoginze file format " + source);
  }
}
export default {
  assets: {},
  percent: 0,

  addAsset: function (id, source, force){
    if (source===undefined || typeof source === 'boolean'){
      force = !!source;
      source = id;
      id = id.replace(/^(.+\/|)(\w+)\.\w+$/, '$2');
    }
    if (preloaded || force){
      this.assets[id] = loadAsset(source);
    }else{
      assetQueue[id] = source;
    }
  },
  addSound: function (id, source, force){
    if (source===undefined || typeof source === 'boolean'){
      force = !!source;
      source = id;
      id = id.replace(/^(.+\/|)(\w+)\.\w+$/, '$2');
    }

    soundQueue[id] = preloaded || force ? loadSound(id, source) : source;
  },
  preload: function(callback){
    var id;
    var self = this;
    var assetsCount = Object.keys(assetQueue).length + Object.keys(soundQueue).length;
    var assetsLoaded = 0;
    var check = function (id, asset){
      assetsLoaded++;
      if (assetsLoaded===assetsCount){
        preloaded = true;
        callback.call(null);
      }
    }

    for(id in assetQueue){
      var asset = loadAsset(assetQueue[id], function (){
        check(id, asset);
      });
      if (asset.hasLoaded){
        check(id, asset);
      }
      self.assets[id] = asset;
    }

    for (id in soundQueue){
      var asset = loadSound(id, soundQueue[id], function (){
        check(id, asset);
      });
      if (asset.hasLoaded){
        check(id, asset);
      }
    }
  }
}
