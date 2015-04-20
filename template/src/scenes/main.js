import PIXI from 'pixi';
import Class from 'class';
import GameScene from 'game-scene';
import GameWindow from 'game-window';
import R from 'pixi-resource';
import keyboard from 'keyboard';

export default GameScene.extend({
  backgroundColor: 0x66FF99,

  init: function () {

    this.bunny = new PIXI.Sprite(R.assets.bunny);

    // center the sprites anchor point
    this.bunny.anchor.x = 0.5;
    this.bunny.anchor.y = 0.5;

    // move the sprite to the center of the screen
    this.bunny.position.x = 200;
    this.bunny.position.y = 150;

    // adds the bunny sprite to the scene
    this.addChild(this.bunny);

  },

  update: function () {
    // rotates the sprite every frame by 0.1
    this.bunny.rotation += 0.1;

    // move bunny sprite depending on keyboard arrow direction
    if (keyboard.down('UP')) this.bunny.position.y--;
    if (keyboard.down('DOWN')) this.bunny.position.y++;
    if (keyboard.down('LEFT')) this.bunny.position.x--;
    if (keyboard.down('RIGHT')) this.bunny.position.x++;
  },

  mousedown: function () {
    GameWindow.paused = !GameWindow.paused;
  },
});
