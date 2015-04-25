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
	if (!err && paths.sourcePath && paths.addonsPath && paths.vendorPath && paths.publicPath && paths.deployPath){
		paths.projectPath = path.dirname(pixifile);
		return paths;
	}else if (!err){
		return { error: "Invalid pixi project file" };
	}
	return { error: err };
};