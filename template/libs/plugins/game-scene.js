import PIXI from 'pixi';
import Class from 'class';

export default Class.extend(PIXI.Stage, {
	init: function (){
		this._super(this.backgroundColor);
	}
});