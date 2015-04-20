var Promise = require('rsvp').Promise,
    colors = require('colors'),
    pluginRegistry = require('../helpers/plugin-registry');

module.exports = function (stdout, pluginName){
  return new Promise(function (resolve, reject){
    stdout.write('Searching plugin registry...\n\n');
    pluginRegistry.searchPlugin(pluginName).then(function (plugins){
      for(var i = 0; i < plugins.length; i++){
        stdout.write(colors.white(plugins[i].name) + '\t' + colors.gray(plugins[i].description)+'\n');
      }
      stdout.write('\n'+colors.gray(plugins.length +' result(s) for "'+pluginName+'"')+'\n');
      resolve(true);
    }).catch(function (err){
      console.log(err)
      reject(err);
    });
  });
}