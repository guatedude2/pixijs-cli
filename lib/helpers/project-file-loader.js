var findup = require('findup-sync'),
	path = require('path'),
	fs = require('fs');

module.exports = function (basePath){
	var raw, err;
	var pixifile = findup('.pixi', {cwd: basePath ,nocase: true});
	if (pixifile === null) return false;

	try{
		raw = fs.readFileSync(pixifile, {encoding: 'utf-8'});
		paths = JSON.parse(raw);
	}catch(e){
		err = e;
	}
	if (!err && paths.sourcePath && paths.pluginsPath && paths.vendorPath && paths.publicPath){
		paths.projectPath = path.dirname(pixifile);
		return paths;
	}
	return { error: err };
};