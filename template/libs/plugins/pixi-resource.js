import PIXI from 'pixi';

var assetQueue = {};
var preloaded = false;

export default {
  assets: {},
  percent: 0,
  addAsset: function (id, source, force){
    if (source===undefined) source = id;
    assetQueue[id] = preloaded || force ? PIXI.Texture.fromImage(source) : source;
  },
  preload: function(callback){
    var self = this;
    var assetsCount = Object.keys(assetQueue).length;
    var assetsLoaded = 0;
    var check = function (id, texture){
      assetsLoaded++;
      if (assetsLoaded===assetsCount){
        preloaded = true;
        callback.call(null);
      }
    }

    for(var id in assetQueue){
      var texture = PIXI.Texture.fromImage(assetQueue[id]);
      if (!texture.hasLoaded){
        texture.on('update', function (){
          check(id, texture);
        });
      }else{
        check(id, texture);
      }
      self.assets[id] = texture;
    }
  }
}