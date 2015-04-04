import PIXI from 'pixi';
import Class from 'class';
import cordova from 'org.apache.cordova';
import audio from 'audio';

var GameWindow = {
  screenHeight: 0,
  screenWidth: 0,
  error: false,
  isWebGL: false,
  canvas: null,
  currentScene: null,
  paused: false,
  time: 0,
  deltaTime: 0,
  _speed: 1,
  init: function (options){
    var self = this;
    self.screenWidth = options.screenWidth || 800;
    self.screenHeight = options.screenHeight || 800;
    self.renderer = PIXI.autoDetectRenderer(self.screenWidth, self.screenHeight, options.rendererOptions || {});
    self.isWebGL = !!self.renderer.gl;
    self.canvas = self.renderer.view;
    document.body.appendChild(self.renderer.view);
    self.canvas.style.margin = 'auto';
    self.canvas.style.position = 'absolute';
    self.canvas.style.top = 0;
    self.canvas.style.left = 0;
    self.canvas.style.bottom = 0;
    self.canvas.style.right = 0;
    if (options.scale!==false){
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
    this.emit('resize');
  },
  mainLoop: function (){
    var self = this;
    var now = (new Date()).getTime();
    if (!self.error){
      requestAnimFrame(function (){ self.mainLoop(); });
    }
    if (self.paused) return;
    try{
      if (self.currentScene){
        if (self.currentScene.update) self.currentScene.update.call(self.currentScene);
        self.renderer.render(self.currentScene);
      }
    }catch(err){
      if (!self.error){
        self.error = true;
        throw err;
      }
    }

    this.deltaTime = (now - this.time) * this._speed;
    this.time = now;

    this.emit('tick');
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

Object.defineProperty(GameWindow, 'speed', {
  get: function (){
    var speed = this._speed;
    return (speed===1 ? 'normal' : (speed===0.5 ? 'slow' : (speed===1.5 ? 'fast' : speed)));
  },
  set: function (value){
    this._speed = (value==='normal' ? 1 : (value==='slow' ? 0.5 : (value==='fast' ? 1.5 : value)));
  },
  enumerable: true,
  configurable: true
});


PIXI.EventTarget.call(GameWindow);

export default GameWindow;