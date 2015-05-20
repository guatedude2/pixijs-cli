var Promise = require('rsvp').Promise,
  path = require('path'),
  projectFileLoader = require('./helpers/project-file-loader'),
  option = require('./helpers/option'),
  errors = require('./helpers/errors'),
  build = require('./helpers/build-project'),
  cordovaLib = require('cordova').cordova_lib,
  cordova = cordovaLib.cordova;
  events = cordovaLib.events;

function cordovaSetup(basePath, reject, buildProject, debugMode){

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

  var promise;
  if (buildProject){
    promise = build(pixiProjectFile, debugMode || false).catch(function (err){
      if (err.file) {
        reject(errors(1003, err.message, err.file, err.stack));
      }else{
        reject(errors(1002, err.message, err.stack));
      }
    });
  }else{
    promise = new Promise(function (resolve){ resolve(true); });
  }

  //build project
  return promise.then(function(result){

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
    return pixiProjectFile;
  });
}

module.exports = {
  platform: function (basePath, stdout, args) {
    return new Promise(function (resolve, reject) {

      var subCommand = option(args, 'platform', 'string', 'list');
      var targets = option(args, subCommand, 'array', []);
      return cordovaSetup(basePath, reject).then(function (){

        if (!~subCommand.search(/^(add|ls|list||rm|remove|up|update)$/i)){
          return reject(false);
        }

        return cordova.raw.platform(subCommand, targets);
      });
    });
  },

  runCompile: function (basePath, stdout, args) {
    return new Promise(function (resolve, reject) {
      var command = args[0];
      var list = false;
      var build = true;
      var debugMode = false;
      var downstreamArgs = [];
      var platforms = option(args, 'run', 'array', []);

      if (command!=='run' && command!=='compile'){
        return reject(false);
      }

      Array.prototype.forEach.call(args, function(flag) {
        if (!!~flag.search(/^--/)){
          if (flag === '--list'){
            list = true;
          }else if (flag === '--nobuild'){
            build = false;
          }else if (flag === '--debug'){
            debugMode = true;
          }
          downstreamArgs.push(flag);
        }
      });

      var opts = {
        options: downstreamArgs,
        platforms: platforms
      }

      if (build){
        stdout.write('\nBuilding project...');
      }
      return cordovaSetup(basePath, reject, build, debugMode).then(function (result){
        if (build){
          stdout.write('done\n');
        }

        if (list && cordova.raw.targets) {
          return cordova.raw.targets.call(null, opts);
        }

        return cordova.raw[command](opts);
      }).catch(function (err){
        reject(err);
      });
    });
  },

  plugin: function (basePath, stdout, args) {
    return new Promise(function (resolve, reject) {
      var subcommand = option(args, 'plugin', 'string', 'list');
      var targets = option(args, subcommand, 'array', []);
      var cli_vars = {};

      if (!~subcommand.search(/^(add|remove|rm|list|ls|search)$/)){
        return reject(false);
      }

      var download_opts = {
        searchpath : undefined,
        noregistry : undefined,
        usegit : undefined,
        cli_variables : {},
        browserify: false,
        link: false,
        save: false,
        shrinkwrap: false
      };

      return cordovaSetup(basePath, reject).then(function (result){
        return cordova.raw.plugin(subcommand, targets, download_opts);
      }).catch(function (err){
        reject(err);
      });
    });
  }
};