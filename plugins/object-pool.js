import Class from 'class';
/**
 * #plugin Object Pool plugin
 * #description A plugin to reuse object creation and destruction.
 * #author Alejandro Gonzalez Sole
 * #dependencies class
 **/

/**
 * A class to reuse object creation and destruction.
 * @class
 * @param {string} key (optional) - key id to store objects in pools with the same key
 */
function ObjectPool(key){
  this._reserve = [];
  this.poolKey = key || '__pool_key__';
}

/**
 * Returns an existing object in the reserve or creates a new object returned by
 * the "init" method.
 *
 * The "enable" method will be triggered before the object is returned.
 * @return {Object}
 */
ObjectPool.prototype.create = function(){
  var obj;
  if (typeof this.init !== 'function'){
    throw new Error('Missing required factory method "init"');
  }
  if (this._reserve.length===0){
    obj = this.init();
    obj.__poolKey = this.poolKey;
  }else{
    obj = this._reserve.pop();
  }
  if (typeof this.enable === 'function') this.enable(obj);
  return obj;
}

/**
 * Removes a pool object created by the "create" method. Objects from different
 * pools can be added as long as the object has the same pool key.
 *
 * The "disable" method will be triggered after the object has been placed in
 * the reserve.
 * @param  {Object} object - the pool object to be placed in the reserve.
 */
ObjectPool.prototype.remove = function(obj){
  if (obj.__poolKey===this.poolKey){
    this._reserve.push(obj);
    if (typeof this.enable === 'function') this.disable(obj);
  }else{
    throw new Error("Unable to add an object that does not belong to this pool");
  }
}

/**
 * Clears the reserve of pool objects
 */
ObjectPool.prototype.clean = function(){
  this._reserve = [];
}

export default Class.inherit(ObjectPool);