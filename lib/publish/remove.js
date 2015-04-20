var Promise = require('rsvp').Promise,
    pluginRegistry = require('../helpers/plugin-registry'),
    colors = require('colors'),
    path = require('path'),
    fse = require('fs-extra'),
    fs = require('fs');

//TODO: remove dependencies?
module.exports = function (stdout, pluginName, pixiProjectFile){
  return new Promise(function (resolve, reject){
    var pluginFile = path.resolve(pixiProjectFile.pluginsPath, pluginName+'.js');
    if (fs.existsSync(pluginFile)){
      fse.removeSync(path.resolve(pluginFile));
      resolve(true);
    }else{
      reject("File does not exist");
    }
  });
}