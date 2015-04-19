var Promise = require('rsvp').Promise,
    pluginRegistry = require('../helpers/plugin-registry'),
    colors = require('colors'),
    path = require('path'),
    fs = require('fs');

//TODO: maybe write files after all have been downloaded

//decode base64 file
function decodeFile(content){
  return new Buffer(content, 'base64').toString('utf8');
}

//loops through dependencies recursively removing already downloaded ones
function downloadDependencies(stdout, dependencies, pluginsPath, vendorPath, callback, existing){
  existing = existing || [];
  if (dependencies.length>0){
    var name = dependencies.shift();
    if (existing.indexOf(name) === -1){
      if (!!~name.search(/^[\w-]+$/)){
        stdout.write(colors.gray('  downloading plugin "'+name+'"...'));
        pluginRegistry.downloadPlugin(name).then(function(plugin){
          fs.writeFile(path.resolve(pluginsPath, plugin.name+'.js'), decodeFile(plugin.content), function (err){
            if (err){
              throw err;
            }
            existing.push(name);
            stdout.write(colors.gray('done\n'));
            downloadDependencies(stdout, dependencies, pluginsPath, vendorPath, callback, existing);
          });
        }).catch(function (err){
          callback(err);
        });
      }else{
        stdout.write(colors.gray('  downloading vendor library "'+name+'"...'));
        pluginRegistry.downloadExternal(name).then(function (raw){
          fs.writeFile(path.resolve(vendorPath, path.basename(name)), raw, function (err){
            existing.push(name);
            stdout.write(colors.gray('done\n'));
            downloadDependencies(stdout, dependencies, pluginsPath, vendorPath, callback, existing);
          });
        }).catch(function (err){
          callback(err);
        });
      }
    }else{
      downloadDependencies(stdout, dependencies, pluginsPath, vendorPath, callback, existing);
    }
  }else{
    callback(null);
  }
}

module.exports = function (stdout, pluginName, pixiProjectFile){

  return new Promise(function (resolve, reject){
    pluginRegistry.downloadPlugin(pluginName).then(function (plugin){
      stdout.write(colors.gray('Downloading plugin "'+pluginName+'"...'));
      fs.writeFile(path.resolve(pixiProjectFile.pluginsPath, plugin.name+'.js'), decodeFile(plugin.content), function (){
        stdout.write(colors.gray('done\nDownload complete\nChecking dependencies...\n'));
        downloadDependencies(stdout, plugin.dependencies, pixiProjectFile.pluginsPath, pixiProjectFile.vendorPath, function (err){
          if (err){
            stdout.write(colors.gray('error\n'));
            err.code = 405;
            return reject(err);
          }
          resolve(plugin);
        });
      });
    }).catch(function (err){
      reject(err);
    });
  });
}