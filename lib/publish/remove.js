var Promise = require('rsvp').Promise,
    addonRegistry = require('../helpers/addon-registry'),
    colors = require('colors'),
    path = require('path'),
    fse = require('fs-extra'),
    fs = require('fs');

//TODO: remove dependencies?
module.exports = function (stdout, addonName, pixiProjectFile){
  return new Promise(function (resolve, reject){
    var addonFile = path.resolve(pixiProjectFile.addonsPath, addonName+'.js');
    if (fs.existsSync(addonFile)){
      fse.remove(path.resolve(addonFile));
      resolve(true);
    }else{
      reject("File does not exist");
    }
  });
}