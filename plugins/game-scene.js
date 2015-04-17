import PIXI from 'pixi';
import Class from 'class';
import keyboard from 'keyboard';

export default Class.inherit(PIXI.DisplayObjectContainer).extend({
  stage: null,
  _constructor: function (bgColor){
    var self = this;
    this._super();

    this.interactive = true;

    var backgroundColor = self.backgroundColor || 0x000000;

    Object.defineProperty(self, 'backgroundColor',{
      enumerable: true,
      configurable: true,
      get: function (){
        return backgroundColor;
      },
      set: function (bgColor){
        backgroundColor = bgColor;
        if (self.stage){
          self.stage.setBackgroundColor(bgColor);
        }
      }
    });

    keyboard.onKeyDown(this.keydown, this);
    keyboard.onKeyUp(this.keydown, this);
  },
  _destroy: function(){
    this.removeChildren();
  },
  init: function(){},
  unload: function(){},
  keydown: function (){},
  keyup: function (){}
});
