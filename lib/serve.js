var path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra'),
  colors = require('colors'),
  broccoli = require('./pixi-broccoli'),
  option = require('./helpers/option'),
  errors = require('./helpers/errors'),
  treeProjectBuilder = require('./helpers/tree-project-builder'),
  projectFileLoader = require('./helpers/project-file-loader'),
  messages = require('./pixi-broccoli/messages');

module.exports = function (basePath, stdout, args){
  //create a promise
  return new Promise(function (resolve, reject){
    //check target path is an existing pixi.js project
    var pixiProjectFile = projectFileLoader(basePath);

    //siwtch to the project root path
    process.chdir(pixiProjectFile.projectPath);

    //check existing target directory
    if (pixiProjectFile===false){
      reject(errors(10)); //You have to be inside an pixi.js CLI project in order to update a project.
      return;
    }else if (pixiProjectFile.error){
      reject(errors(20, pixiProjectFile.error)); //Error loading project file:
      return;
    }

    //process arguments
    var host = option(args, '--host', 'string', 'localhost');
    var port = option(args, '--port', 'number', 4200);
    var liveReoloadPort = option(args, '--live-reload-port', 'number', 35729);

    //build project tree base on project file
    var tree = treeProjectBuilder(pixiProjectFile);
    var builder = new broccoli.Builder(tree);

    //listen to server messages
    messages.on('server', function(value){
      if (value==='closed'){
        stdout.write('\nDoing clean-up...');
        fse.removeSync(path.resolve(pixiProjectFile.projectPath, 'tmp'));
        stdout.write("done\n" + colors.green('Server closed!\n'));
        resolve(true);
      }
    });

    //starts a server
    broccoli.server.serve(builder, {
      host: host,
      port: port,
      liveReoloadPort: liveReoloadPort,
      stdout: stdout
    })
    .on('error', function(err){
      reject(errors(-1, err));
    });

  });
};