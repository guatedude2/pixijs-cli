import PIXI from 'pixi';
import PIXIHelper from 'pixi-helper';
import Assets from './assets';
import MainScene from './scenes/main';

//Create a new stage
var stage = new PIXIHelper.Stage({
  backgroundColor: 0x66FF99,
  screenSize:{
    width: 800,
    height: 600
  }
});

//Wait for assets to be loaded
Assets.preload(function (){
  //create a new scene and set the current stage
  var scene = new MainScene();
  stage.setScene(scene);
});