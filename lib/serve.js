var path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra'),
  colors = require('colors'),
  broccoli = require('./helpers/pixi-broccoli'),
  option = require('./helpers/option'),
  errors = require('./helpers/errors'),
  treeProjectBuilder = require('./helpers/tree-project-builder'),
  projectFileLoader = require('./helpers/project-file-loader'),
  messages = require('./helpers/pixi-broccoli/messages');

module.exports = function (basePath, stdout, args, options){
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

    //change directory to project path
    process.chdir(pixiProjectFile.projectPath);

    //process arguments
    var host = option(args, '--host', 'string', 'localhost');
    var port = option(args, '--port', 'number', 4200);
    var liveReloadPort = option(args, '--live-reload-port', 'number', 35729);

    //build project tree base on project file
    var tree = treeProjectBuilder(pixiProjectFile);
    var builder = new broccoli.Builder(tree);

    //listen to server messages
    messages.on('server', function(value){
      if (value==='closed'){
        stdout.write('\nCleaning up...');
        builder.cleanup().then(function (){
          stdout.write("done\n\n" + colors.green('Server closed!\n'));
          process.exit(0);
        });
      }
    });

    //set the default server options
    var serverOptions = {
      host: host,
      port: port,
      liveReloadPort: liveReloadPort,
      stdout: stdout
    };

    //override server options passed in arguments
    for(var name in options){
      serverOptions[name] = options[name];
    }

    //starts a server
    broccoli.server.serve(builder, serverOptions)
    .on('error', function(err){
      reject(errors(1004, err)); //Server Error: %s
    });

  });
};