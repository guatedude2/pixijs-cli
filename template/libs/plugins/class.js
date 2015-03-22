/**
 * JavaScript simple inheritance
 * by Alejandro Gonzalez Sole (inspired by John Resig)
 * MIT Licensed.
 **/
var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.* /;
function Class(){ }

function classExtend(extendClass, props){
  if (typeof extendClass !== "function"){
    props = extendClass;
    extendClass = this;
  }
  function Class(){
    for (var name in this) {
      this[name] = typeof extendClass.prototype[name] == "function" &&
        fnTest.test(this[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            this._super = extendClass.prototype[name];
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
          };
        })(name, this[name]) :
        this[name];
    }

    if (this.constructor!==Class) this.constructor.apply( this, arguments );
  }

  Class.prototype = Object.create( extendClass.prototype );
  for(var name in props){
    Class.prototype[name] = props[name];
  }
  Class.extend = classExtend;

  return Class;
}

Class.extend = classExtend;

export default Class;