import PIXI from 'pixi';
import Class from 'class';

function loopRender(){
  if (!fatalError) requestAnimFrame(loopRender);
  try{
    if (stageInstance.currentScene) stageInstance.currentScene.render.call(stageInstance.currentScene);
  }catch(err){
    fatalError = true;
    throw err;
  }
  stageInstance.renderer.render(stageInstance);
}

export default {
  error: false,
  currentScene: null,
  init: function (options){
    this.screenWidth = options.screenWidth || 800;
    this.screenHeight = options.screenHeight || 800;
    this.renderer = PIXI.autoDetectRenderer(this.screenWidth, this.screenHeight);
    document.body.appendChild(this.renderer.view);
    if (options.scale){
      this.resize();
      window.addEventListener('resize', this.resize);
    }
    this.mainLoop();
    //loop
    this.initialized = true;

  },
  resize: function (){
    var ratio = Math.min(window.innerWidth / this.screenWidth, window.innerHeight / this.screenHeight);
    this.width = this.screenWidth * ratio;
    this.height = this.screenHeight * ratio;
    this.renderer.resize(this.width, this.height);
  },
  mainLoop: function (){
    var self = this;
    if (!this.error){
      requestAnimFrame(function (){ self.mainLoop(); });
    }
    try{
      if (this.currentScene){
        if (this.currentScene.render) this.currentScene.render.call(this.currentScene);
        this.renderer.render(this.currentScene);
      }
    }catch(err){
      if (!this.error){
        this.error = true;
        throw err;
      }
    }

  },
  setScene: function (scene){
    this.currentScene = scene;
  }
  // constructor: function (options){
  //   stageInstance = this;
  //   options.screen = options.screen || {};
  //   this._super(options.backgroundColor || 0x000000);
  //   this.currentScene = null;
  //   this.screenWidth = options.screen.width || 800;
  //   this.screenHeight = options.screen.height || 600;
  //   this.renderer = PIXI.autoDetectRenderer(this.screenWidth, this.screenHeight);
  //   document.body.appendChild(this.renderer.view);
  //   if (options.scale){
  //     this.resize();
  //     window.addEventListener('resize', stageInstance.resize);
  //   }

  //   loopRender();
  // },
  // resize: function (){
  //   var ratio = Math.min(window.innerWidth / this.screenWidth, window.innerHeight / this.screenHeight);

  //   this.width = this.screenWidth * ratio;
  //   this.height = this.screenHeight * ratio;
  //   console.log(this.width, this.height, ratio)
  //   this.renderer.resize(this.width, this.height);
  // },
  // setScene: function (scene){
  //   if (this.currentScene) this.removeChild(this.currentScene);
  //   this.addChild(scene);
  //   this.currentScene = scene;
  // }
};