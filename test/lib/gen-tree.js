var path = require('path'),
  fse = require('fs-extra');

function genTree(pathDir, structure) {
	for(var p in structure){
		if (typeof(structure[p])==='string'){
			fse.outputFileSync(path.resolve(pathDir, p), structure[p]);
		}else{
			fse.mkdirpSync(path.resolve(pathDir, p));
			genTree(path.resolve(pathDir, p), structure[p]);
		}
	}
}

module.exports = genTree;