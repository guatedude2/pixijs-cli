/**
 * JavaScript simple inheritance
 * by Alejandro Gonzalez Sole (base on John Resig's simple inheritance script)
 * MIT Licensed.
 **/

var initializing = false,
  fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.* /;

function Class(){};

function inheritClass(superClass){
  var self = this;
  function Class(){
    if (!initializing && typeof this._constructor === 'function')
      this._constructor.apply(this, arguments);
  }

  Class.prototype = superClass.prototype;
  Class.prototype._constructor = superClass;
  Class.prototype.constructor = Class;
  Class.extend = extendClass;
  //currenlty if you inhert multiple classes it breaks
  Class.inherit = inheritClass;
  return Class;
};

function extendClass(prop) {
  var self = this;
  var _super = self.prototype;

  function Class(){
    if (!initializing && typeof this._constructor === 'function')
      this._constructor.apply(this, arguments);
  }

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
      })(name, prop[name]) : prop[name];
  }

  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  Class.extend = extendClass;
  Class.inherit = inheritClass;

  return Class;
};

Class.extend = extendClass;
Class.inherit = inheritClass;

export default Class;