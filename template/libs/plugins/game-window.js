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
  isWebGL: false,
  canvas: null,
  currentScene: null,
  paused: false,
  init: function (options){
    var self = this;
    self.screenWidth = options.screenWidth || 800;
    self.screenHeight = options.screenHeight || 800;
    self.renderer = PIXI.autoDetectRenderer(self.screenWidth, self.screenHeight);
    self.isWebGL = !!self.renderer.gl;
    self.canvas = self.renderer.view;
    document.body.appendChild(self.renderer.view);
    self.canvas.style.margin = 'auto';
    self.canvas.style.position = 'absolute';
    self.canvas.style.top = 0;
    self.canvas.style.left = 0;
    self.canvas.style.bottom = 0;
    self.canvas.style.right = 0;
    if (options.scale){
      self.resize();
      window.addEventListener('resize', function (){ self.resize(); });
    }
    self.mainLoop();
    self.initialized = true;

  },
  resize: function (){
    var ratio = Math.min(window.innerWidth / this.screenWidth, window.innerHeight / this.screenHeight);
    this.width = this.screenWidth * ratio;
    this.height = this.screenHeight * ratio;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    //this.renderer.resize(this.width, this.height);
  },
  mainLoop: function (){
    var self = this;
    if (!self.error){
      requestAnimFrame(function (){ self.mainLoop(); });
    }
    if (self.paused) return;
    try{
      if (self.currentScene){
        if (self.currentScene.render) self.currentScene.render.call(self.currentScene);
        self.renderer.render(self.currentScene);
      }
    }catch(err){
      if (!self.error){
        self.error = true;
        throw err;
      }
    }

  },
  pause: function (){
    this.paused = true;
  },
  resume: function (){
    this.paused = false;
  },
  setScene: function (scene){
    this.currentScene = scene;
  }
};