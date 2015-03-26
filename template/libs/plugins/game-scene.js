import PIXI from 'pixi';
import Class from 'class';
import keyboard from 'keyboard';

export default Class.inherit(PIXI.Stage)
.extend({
  _constructor: function (bgColor){
    this._super(bgColor || this.backgroundColor);
    console.log(keyboard)
    keyboard.onKeyDown(this.keydown, this);
    keyboard.onKeyUp(this.keydown, this);
    this.init();
  },
  init: function(){},
  keydown: function (){},
  keyup: function (){}
});