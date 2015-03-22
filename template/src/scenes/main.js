import PIXI from 'pixi';
import Class from 'class';
import PIXIHelper from 'pixi-helper';
import R from 'pixi-resource';

export default PIXIHelper.Scene.extend({
  constructor: function (){
    this._super();

    this.bunny = new PIXI.Sprite(R.assets.bunny);

    // center the sprites anchor point
    this.bunny.anchor.x = 0.5;
    this.bunny.anchor.y = 0.5;

    // move the sprite to the center of the screen
    this.bunny.position.x = 200;
    this.bunny.position.y = 150;

    this.addChild(this.bunny);

  },
  render: function (){
    this.bunny.rotation += 0.1;
  }
});