var Promise = require('rsvp').Promise,
  path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra'),
  colors = require('colors'),
  request = require('request'),
  option = require('./helpers/option'),
  errors = require('./helpers/errors'),
  projectFileLoader = require('./helpers/project-file-loader');

var PIXI_DEV_URL = 'https://raw.githubusercontent.com/GoodBoyDigital/pixi.js/master/bin/pixi.dev.js';

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
    stdout.write("Downloading latest pixi.js library...");
    request.get(PIXI_DEV_URL, function(err, res, body) {
      //check we got a server status 200
      if (!err && res.statusCode===200){
        stdout.write('done\n\n');
        //get library version
        var pixiVersion = body.match(/\* pixi\.js \- (v[\d\.]*)/);
        if (pixiVersion && pixiVersion[1]){
          //overwrite library file and print out version
          fs.writeFileSync(path.resolve(paths.vendorPath, 'pixi-dev.js'), body);
          stdout.write(colors.green('Downloaded successfully! pixi.js '+pixiVersion[1]+' \n'));
          //resolve the promise
          resolve(true);
        }else{
          reject(errors(103)); // "Unable to read pixi.js library!"
        }
      }else{
        //if we didn't get server status 200 error out
        stdout.write('error\n');
        reject(errors(1002, body || err));
      }
    }).on('error', function(err) {
      //if an error occured mark error
      stdout.write('error\n');
      if (err.name==='NetConnectNotAllowedError'){
        reject(errors(104, err.hostname));
      }else{
        reject(errors(105, err.message));
      }
    });
  });
};