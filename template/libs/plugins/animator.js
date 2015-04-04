/**
 * Animator Library
 * based on jQuery UI Effects (https://github.com/jquery/jquery-ui/blob/master/ui/effect.js)
 **/

import PIXI from 'pixi';
import GameWindow from 'game-window';


function Animator(obj){
  PIXI.EventTarget.call(self);
  this.uid = (new Date()).getTime() + Math.random();
  this.object = obj;
  this.isAnimating = false;
  this.progress = 0;
  this.defaultEasing = Animator.Easing.Swing;
  this.defaultDuration = 400
  this.step = 0;
  this.totalSteps = 0;
  this.totalDuration = 0;
  this.loops = 1;
  this._steps = [];
  this._time = 0;
  this._start = null;
  this._end = null;
  this._complete = null;
}

Animator.Easing = {
  Linear: function( p ) {
    return p;
  },
  Swing: function( p ) {
    return 0.5 - Math.cos( p * Math.PI ) / 2;
  }
};

Animator.prototype._updateDuration = function(){
  this.totalDuration = 0;
  for (var i = 0; i < this._steps.length; i++){
    this.totalDuration += this._steps[i].duration || this.defaultDuration;
  }
}

Animator.prototype.to = function (props, duration, easing, complete){
  this._steps.push({
    props: props,
    duration: duration || null,
    easing: easing || null,
    complete: complete || null
  });
  this._updateDuration();
  this.totalSteps = this._steps.length;
  return this;
}

Animator.prototype.start = function(callback){
  var self = this;
  this.step = -1;
  this._time = 0;
  this._start = null;
  this._end = null;
  this._complete = callback || null
  this._initialProps = {};
  this.isAnimating = true;
  for (var i=0; i < this._steps.length; i++){
    for (var name in this._steps[i].props){
      this._initialProps[name] = this.object[name];
    }
  }
  this._updateDuration();
  Animator._animations.push(this);
  return this;
}

Animator.prototype.stop = function(){
  for(var i=0; i<Animator._animations.length; i++){
    if (Animator._animations[i].uid == this.uid){
      Animator._animations.splice(i, 1);
      break;
    }
  }
  return this;
}

Animator.prototype.update = function(){
  this._time += GameWindow.deltaTime;

  var currentStep = this._start;
  var nextStep = this._end;
  var elapsed;

  if (currentStep && nextStep){
    var duration = nextStep.duration || this.defaultDuration;
    elapsed = (this._time / duration);
    elapsed = elapsed > 1 ? 1 : elapsed;

    this.progress = (this.step+elapsed) / this.totalSteps;
    var easing = nextStep.easing===null ? this.defaultEasing : nextStep.easing;
    var value = easing ? easing(elapsed) : 1

    for(var p in nextStep.props){
      var start = currentStep.props[p] || 0;
      var end = nextStep.props[p];
      this.object[p] = start + (end - start) * value;
    }
  }else{
    elapsed = 1;
  }

  if (elapsed===1){
    if (currentStep && currentStep.complete) currentStep.complete();
    this.step += 1;
    if (this.step < this._steps.length){
      this._time = 0;
      this._start = { props: {} };
      this._end = this._steps[this.step];
      for(var name in this._end.props){
        this._start.props[name] = this.object[name];
      }
      return;
    }

    if (this.loops>0) this.loops--;
    if (this.loops != 0){

      this.step = -1;
      this._time = 0;
      this._start = null;
      this._end = null;
      for(var name in this._initialProps){
        this.object[name] = this._initialProps[name];
      }
    }else{
      this.stop();
      this.isAnimating = false;
      if (this._complete) this._complete();
      return;
    }
  }
}

Animator.prototype.onComplete = function(callback){
  this.on('complete', callback.bind(this));
  return this;
}

Animator.prototype.onStart = function(callback){
  this.on('start', callback.bind(this));
  return this;
}

Animator.prototype.onStep = function(callback){
  this.on('step', callback.bind(this));
  return this;
}

var baseEasings = {
  Sine: function( p ) {
    return 1 - Math.cos( p * Math.PI / 2 );
  },
  Circ: function( p ) {
    return 1 - Math.sqrt( 1 - p * p );
  },
  Elastic: function( p ) {
    return p === 0 || p === 1 ? p :
      -Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
  },
  Back: function( p ) {
    return p * p * ( 3 * p - 2 );
  },
  Bounce: function( p ) {
    var pow2,
      bounce = 4;

    while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
    return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
  }
}

var easings = [ "Quad", "Cubic", "Quart", "Quint", "Expo" ];
for(var i=0; i<easings.length; i++){
  baseEasings[easings[i]] = function( p ) {
    return Math.pow( p, i + 2 );
  };
}

for (var name in baseEasings){
  var easeIn = baseEasings[name];
  Animator.Easing['EaseIn' +name] = easeIn;
  Animator.Easing['EaseOut' +name] = function( p ) {
    return 1 - easeIn( 1 - p );
  };
  Animator.Easing['EaseInOut' +name] = function( p ) {
    return p < 0.5 ?
      easeIn( p * 2 ) / 2 :
      1 - easeIn( p * -2 + 2 ) / 2;
  };
}

var fatalError = false;
Animator._animations = [];
Animator._update = function(){
  for(var i=0; i<Animator._animations.length; i++){
    try{
      Animator._animations[i].update.call(Animator._animations[i]);
    }catch(err){
      if (!fatalError){
        fatalError = true;
        throw new Error(err)
      }
    }
  }
}
GameWindow.on('tick', Animator._update);

export default Animator;