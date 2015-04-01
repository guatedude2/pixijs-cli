var Promise = require('rsvp').Promise,
  path = require('path'),
  fse = require('fs-extra'),
  colors = require('colors'),
  option = require('./helpers/option'),
  errors = require('./helpers/errors'),
  projectFileLoader = require('./helpers/project-file-loader');

module.exports = function (basePath, stdout, args){
  //create a promise
  return new Promise(function (resolve, reject){
    //check target path is an existing pixi.js project
    var pixiProjectFile = projectFileLoader(basePath);

    //check existing target directory
    if (pixiProjectFile===false){
      reject(errors(10)); //You have to be inside an pixi.js CLI project in order to update a project.
      return;
    }else if (pixiProjectFile.error){
      reject(errors(20, pixiProjectFile.error)); //Error loading project file:
      return;
    }

    //download library
    stdout.write("Cleaning...");
    fse.removeSync(path.resolve(pixiProjectFile.projectPath, 'tmp'));
    stdout.write('done\n\n');
    resolve(true);
  });
};