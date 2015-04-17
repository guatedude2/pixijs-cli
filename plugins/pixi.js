//wraps pixi in es6 module and removes global variable
var PIXI;
if (window.PIXI){
	PIXI = window.PIXI;
	delete window.PIXI;
}else{
  throw new Error("PIXI library is not available!");
}

export default PIXI;
