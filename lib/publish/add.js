var Promise = require('rsvp').Promise,
    addonRegistry = require('../helpers/addon-registry'),
    colors = require('colors'),
    path = require('path'),
    fs = require('fs');

//TODO: maybe write files after all have been downloaded

//decode base64 file
function decodeFile(content){
  return new Buffer(content, 'base64').toString('utf8');
}

//loops through dependencies recursively removing already downloaded ones
function downloadDependencies(stdout, dependencies, addonsPath, vendorPath, callback, existing){
  existing = existing || [];
  if (dependencies.length>0){
    var name = dependencies.shift();
    if (name && existing.indexOf(name) === -1){
      if (!!~name.search(/^[\w-]+$/)){
        stdout.write(colors.gray('  downloading add-on "'+name+'"...'));
        addonRegistry.download(name).then(function(addon){
          fs.writeFile(path.resolve(addonsPath, addon.name+'.js'), decodeFile(addon.content), function (err){
            if (err){
              throw err;
            }
            existing.push(name);
            dependencies = dependencies.concat(addon.dependencies);
            stdout.write(colors.gray('done\n'));
            downloadDependencies(stdout, dependencies, addonsPath, vendorPath, callback, existing);
          });
        }).catch(function (err){
          callback(err);
        });
      }else{
        stdout.write(colors.gray('  downloading vendor library "'+name+'"...'));
        addonRegistry.downloadExternal(name).then(function (raw){
          fs.writeFile(path.resolve(vendorPath, path.basename(name)), raw, function (err){
            existing.push(name);
            stdout.write(colors.gray('done\n'));
            downloadDependencies(stdout, dependencies, addonsPath, vendorPath, callback, existing);
          });
        }).catch(function (err){
          callback(err);
        });
      }
    }else{
      downloadDependencies(stdout, dependencies, addonsPath, vendorPath, callback, existing);
    }
  }else{
    callback(null);
  }
}

module.exports = function (stdout, addonName, pixiProjectFile){

  return new Promise(function (resolve, reject){
    addonRegistry.download(addonName).then(function (addon){
      stdout.write(colors.gray('Downloading add-on "'+addonName+'"...'));
      fs.writeFile(path.resolve(pixiProjectFile.addonsPath, addon.name+'.js'), decodeFile(addon.content), function (){
        stdout.write(colors.gray('done\nChecking dependencies...\n'));
        downloadDependencies(stdout, addon.dependencies, pixiProjectFile.addonsPath, pixiProjectFile.vendorPath, function (err){
          if (err){
            stdout.write(colors.gray('error\n'));
            err.code = 405;
            return reject(err);
          }
          resolve(addon);
        });
      });
    }).catch(function (err){
      reject(err);
    });
  });
}