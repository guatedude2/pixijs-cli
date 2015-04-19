var Promise = require('rsvp').Promise,
  colors = require('colors'),
  path = require('path'),
  fs = require('fs'),
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

    //change directory to project path
    process.chdir(pixiProjectFile.projectPath);
    var action = option(args, 'plugin', 'string');
    var pluginName = option(args, ['search', 'add', 'remove', 'publish'], 'string');

    switch (action){
      case 'search':
        if (!pluginName){
          return reject(errors(107));
        }
        //searches the plugin registry
        require('./publish/search')(stdout, pluginName).then(function (){
          resolve(true);
        }).catch(function (err){
          reject(errors(1005, err.message));
        });
        break;
      case 'add':
        if (!pluginName){
          return reject(errors(108));
        }
        //adds a plugin from the registry to the current project
        require('./publish/add')(stdout, pluginName, pixiProjectFile).then(function (plugin){
          stdout.write(colors.green('\nPlugin "'+plugin.name+'" v.'+plugin.version+' added'+'\n'));
          resolve(true);
        }).catch(function (err){
          if (err.code === 404){
            return reject(errors(109, pluginName));
          }else if (err.code === 405){
            return reject(errors(110));
          }
          reject(err);
        });
        break;
      case 'remove':
        if (!pluginName){
          return reject(errors(108));
        }
        //removes a plugin from the registry to the current project
        require('./publish/remove')(stdout, pluginName, pixiProjectFile).then(function (plugin){
          stdout.write(colors.green('Plugin "'+pluginName+'" removed! \n'));
        }).catch(function (err){
          reject(errors(111, pluginName));
        });
        break;
      case 'publish':
        if (!pluginName){
          return reject(errors(108));
        }
        var targetFile = path.resolve(basePath, pluginName);

        fs.exists(targetFile, function (exist){
          if (!exist){
            return reject(errors(112));
          }
          //publishes a plugin to the registry
          require('./publish/publish')(stdout, targetFile, pixiProjectFile).then(function (plugin){
            stdout.write(colors.green('\nPlugin "'+plugin.name+'" published with version '+plugin.version+'\n'));
          }).catch(function (err){
            reject(err);
          });
        })
        break;
      default:
        reject(errors(-1));
    }
  });
}