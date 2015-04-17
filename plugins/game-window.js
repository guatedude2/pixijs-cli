import PIXI from 'pixi';
import Class from 'class';
import cordova from 'org.apache.cordova';
import audio from 'audio';

cordova.onReady(function (){
  if (navigator && navigator.splashscreen)
  GameWindow.splashscreen = navigator.splashscreen;
});

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
  splashscreen: { hide: function(){} },
  init: function (options){
    if (this.initialized) return;
    //initialize PIXI
    var self = this;
    self.screenWidth = options.screenWidth || 800;
    self.screenHeight = options.screenHeight || 800;
    self.renderer = PIXI.autoDetectRenderer(self.screenWidth, self.screenHeight, options.rendererOptions || {});
    self.isWebGL = !!self.renderer.gl;
    self.canvas = self.renderer.view;
    document.body.appendChild(self.renderer.view);
    //reset canvas and center it
    self.canvas.style.margin = 'auto';
    self.canvas.style.position = 'absolute';
    self.canvas.style.top = 0;
    self.canvas.style.left = 0;
    self.canvas.style.bottom = 0;
    self.canvas.style.right = 0;
    //scale canvas depending on scaleMode
    self.scaleMode = options.scaleMode || 'ScaleFit';
    if (this.scaleMode==='ScaleFit' || this.scaleMode==='ScaleFitCrop'){
      self.resize();
      window.addEventListener('resize', function (){ self.resize(); });
    }

    //create stage to render objects
    this.stage = new PIXI.Stage(options.backgroundColor || 0x000000);

    //trigger main loop to start animating
    self.mainLoop();
    self.initialized = true;

    //if showFps is enabled then create stats object
    if (options.showFps){
      if (Stats){
        this._stats = new Stats();
        document.body.appendChild( this._stats.domElement );
        this._stats.domElement.style.position = "absolute";
        this._stats.domElement.style.top = "0px";
      }else{
        throw new Error('Stats library was not found!');
      }
    }
  },
  resize: function (){

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;

    var screenRatio = this.screenWidth / this.screenHeight;

    if (this.scaleMode==='ScaleFitCrop'){
      if (windowRatio < screenRatio){
        this.height = windowHeight;
        this.width = this.height * this.screenWidth / this.screenHeight;
      }else{
        this.width = windowWidth;
        this.height = this.width * this.screenHeight / this.screenWidth;
      }
    }else if (this.scaleMode==='ScaleFit'){
      var ratio = Math.min(windowWidth / this.screenWidth, windowHeight / this.screenHeight);
      this.width = this.screenWidth * ratio;
      this.height = this.screenHeight * ratio;
    }

    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.renderer.resize(this.screenWidth, this.screenHeight);

    this.emit('resize');
  },
  mainLoop: function (){


    var self = this;
    var now = Date.now();
    if (!self.error){
      requestAnimFrame(function (){ self.mainLoop(); });
    }
    //if paused dont re-render
    if (self.paused) return;
    //render current scene
    try{
      if (self.currentScene && self.currentScene.update){
        self.currentScene.update.call(self.currentScene);
      }
    }catch(err){
      if (!self.error){
        self.error = true;
        throw err;
      }
    }
    //render stage
    self.renderer.render(self.stage);

    if (this._stats) this._stats.end();

    //calculate delta time
    this.deltaTime = Math.min((now - this.time), 1000/20) * this._speed;
    this.time = now;
    if (this._stats) this._stats.begin();

    //emit ticks for animations
    this.emit('tick');

  },
  pause: function (){
    this.paused = true;
  },
  resume: function (){
    this.paused = false;
  },
  setScene: function (scene){
    if (this.currentScene){
      this.stage.removeChild(this.currentScene);
      this.currentScene._destroy.call(this.currentScene);
    }
    //set new scene and initialize it
    this.currentScene = scene;
    scene.stage = this.stage;
    this.stage.addChild(scene);
    this.stage.setBackgroundColor(scene.backgroundColor);
    scene.hitArea = new PIXI.Rectangle(0,0, this.screenWidth, this.screenHeight);
    scene.init.call(scene);
    this.resize();
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

document.addEventListener("pause", GameWindow.pause, false);
document.addEventListener("resume", GameWindow.resume, false);

PIXI.EventTarget.call(GameWindow);

export default GameWindow;
