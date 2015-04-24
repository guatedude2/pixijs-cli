var Promise = require('rsvp').Promise,
  path = require('path'),
  projectFileLoader = require('./helpers/project-file-loader'),
  option = require('./helpers/option'),
  errors = require('./helpers/errors'),
  cordovaLib = require('cordova').cordova_lib,
  cordova = cordovaLib.cordova;
  events = cordovaLib.events;

function cordovaSetup(basePath, reject){

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

  //change directory to deploy path
  process.chdir(path.resolve(pixiProjectFile.projectPath, pixiProjectFile.deployPath));

  process.on('uncaughtException', function(err){
    reject(err);
  });

  // Set up event handlers for logging and results emitted as events.
  events.on('results', console.log);

  //if ( !args.silent ) {
    events.on('log', console.log);
    events.on('warn', console.warn);
  //}

  // Add handlers for verbose logging.
  // if (args.verbose) {
  //   events.on('verbose', console.log);
  // }
}

module.exports = {
  platform: function (basePath, stdout, args) {
    return new Promise(function (resolve, reject) {
      cordovaSetup(basePath, reject);

      var subCommand = option(args, 'platform', 'string', 'list');
      var targets = option(args, subCommand, 'array', []);

      if (!~subCommand.search(/^(add|ls|list||rm|remove|up|update)$/i)){
        return reject(false);
      }

      return cordova.raw.platform(subCommand, targets);
    });
  },

  run: function (basePath, stdout, args) {
    return new Promise(function (resolve, reject) {
      cordovaSetup(basePath, reject);

      var list = false;
      var downstreamArgs = [];
      var platforms = option(args, 'run', 'array', []);

      Array.prototype.forEach.call(args, function(flag) {
        if (!!~flag.search(/^--/)){
          if (flag === '--list'){
            list = true;
          }
          downstreamArgs.push(flag);
        }
      });

      var opts = {
        options: downstreamArgs,
        platforms: platforms
      }

      if (list && cordova.raw.targets) {
        return cordova.raw.targets.call(null, opts);
      }

      return cordova.raw.run(opts);
    });
  },

  compile: function (basePath, stdout, args) {
    return new Promise(function (resolve, reject) {
      resolve(true);
    });
  },

  plugin: function (basePath, stdout, args) {
    return new Promise(function (resolve, reject) {
      resolve(true);
    });
  }
};