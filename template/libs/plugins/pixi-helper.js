import PIXI from 'pixi';
import Class from 'class';
var stageInstance;
var fatalError = false;

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
  Stage: Class.extend(PIXI.Stage, {
    constructor: function (options){
      stageInstance = this;
      options.screen = options.screen || {};
      this._super(options.backgroundColor || 0x000000);
      this.currentScene = null;
      this.renderer = PIXI.autoDetectRenderer(options.screen.width || 800, options.screen.height || 600);
      document.body.appendChild(this.renderer.view);

      loopRender();
    },
    setScene: function (scene){
      if (this.currentScene) this.removeChild(this.currentScene);
      this.addChild(scene);
      this.currentScene = scene;
    }
  }),
  Scene: Class.extend(PIXI.DisplayObjectContainer)

};