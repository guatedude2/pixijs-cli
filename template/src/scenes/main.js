import PIXI from 'pixi';
import Class from 'class';
import GameScene from 'game-scene';
import GameWindow from 'game-window';
import R from 'pixi-resource';
import keyboard from 'keyboard';

// class MainScene extends GameScene{

//   init(){
//     this.setBackgroundColor(0x66FF99);
//     this.bunny = new PIXI.Sprite(R.assets.bunny);

//     // center the sprites anchor point
//     this.bunny.anchor.x = 0.5;
//     this.bunny.anchor.y = 0.5;

//     // move the sprite to the center of the screen
//     this.bunny.position.x = 200;
//     this.bunny.position.y = 150;

//     this.addChild(this.bunny);
//   }

//   render(){
//     this.bunny.rotation += 0.1;
//     if (keyboard.down('UP')) console.log("UP");
//   }

//   mousedown(){
//     console.log("PAUSE", GameWindow.paused)
//     GameWindow.paused = !GameWindow.paused;
//     vibrate(100);
//   }

//   keydown(){
//     console.log("KEY DOWN");
//   }

//   touchstart(event){
//     this.mousedown(event);
//   }
// }

export default GameScene.extend({
  backgroundColor: 0x66FF99,
  init: function (){

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
    if (keyboard.down('UP')) console.log("UP");
  },
  mousedown: function (){
    console.log("PAUSE", GameWindow.paused)
    GameWindow.paused = !GameWindow.paused;
    vibrate(100);
  },
  keydown: function(){
    console.log("KEY DOWN");
  },
  touchstart: function (event){
    this.mousedown(event);
  }
});
