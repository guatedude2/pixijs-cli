import PIXI from 'pixi';
import GameWindow from 'game-window';
import Assets from './assets';
import MainScene from './scenes/main';
//Create a new game window
GameWindow.init({
  screenWidth: 1334,
  screenHeight: 750,
  scale: true
});

//Wait for assets to be loaded
Assets.preload(function (){
  //create a new scene and set the current stage
  var scene = new MainScene();
  GameWindow.setScene(scene);
});
