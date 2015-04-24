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
    var action = option(args, 'addon', 'string');
    var addonName = option(args, ['search', 'add', 'remove', 'publish'], 'string');

    switch (action){
      case 'search':
        if (!addonName){
          return reject(errors(107));
        }
        //searches the addon registry
        require('./publish/search')(stdout, addonName).then(function (){
          resolve(true);
        }).catch(function (err){
          reject(errors(1005, err.message));
        });
        break;
      case 'add':
        if (!addonName){
          return reject(errors(108));
        }
        //adds a addon from the registry to the current project
        require('./publish/add')(stdout, addonName, pixiProjectFile).then(function (addon){
          stdout.write(colors.green('\nAdd-on "'+addon.name+'" v.'+addon.version+' added'+'\n'));
          resolve(true);
        }).catch(function (err){
          if (err.code === 404){
            return reject(errors(109, addonName));
          }else if (err.code === 405){
            return reject(errors(110));
          }
          reject(err);
        });
        break;
      case 'remove':
        if (!addonName){
          return reject(errors(108));
        }
        //removes a addon from the registry to the current project
        require('./publish/remove')(stdout, addonName, pixiProjectFile).then(function (addon){
          stdout.write(colors.green('Add-on "'+addonName+'" removed! \n'));
        }).catch(function (err){
          reject(errors(111, addonName));
        });
        break;
      case 'publish':
        if (!addonName){
          return reject(errors(108));
        }
        var targetFile = path.resolve(basePath, addonName);

        fs.exists(targetFile, function (exist){
          if (!exist){
            return reject(errors(112));
          }
          //publishes a addon to the registry
          require('./publish/publish')(stdout, targetFile, pixiProjectFile).then(function (addon){
            stdout.write(colors.green('\nAdd-on "'+addon.name+'" published with version '+addon.version+'\n'));
          }).catch(function (err){
            if (err.code === 300){
              return reject(errors(120, addonName));
            }
            reject(err);
          });
        })
        break;
      default:
        reject(false);
    }
  });
}