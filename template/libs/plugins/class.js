/**
 * JavaScript simple inheritance
 * by Alejandro Gonzalez Sole (base on John Resig's simple inheritance script)
 * MIT Licensed.
 **/

var initializing = false,
  fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.* /;

function Class(){};

function extendClass(ctor, prop) {
  var self = this;
  if (typeof ctor === 'function'){
    var parent = {};
    for(var name in ctor.prototype){
      parent[name] = ctor.prototype[name];
    }
    parent.init = ctor.prototype.constructor;
    self = extendClass.call(self, parent);
  }else{
    prop = ctor;
    ctor = null;
  }
  var _super = self.prototype;

  initializing = true;
  var prototype = new self();
  initializing = false;

  for (var name in prop) {
    prototype[name] = typeof prop[name] == "function" &&
      typeof _super[name] == "function" && fnTest.test(prop[name]) ?
      (function(name, fn){
        return function() {
          var tmp = this._super;
          this._super = _super[name];
          var ret = fn.apply(this, arguments);
          this._super = tmp;
          return ret;
        };
      })(name, prop[name]) :
      prop[name];
  }

  function Class() {
    if ( !initializing && this.init )
      this.init.apply(this, arguments);
  }

  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  Class.extend = extendClass;

  return Class;
};

Class.extend = extendClass;

export default Class;