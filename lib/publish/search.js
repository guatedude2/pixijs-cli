var Promise = require('rsvp').Promise,
    colors = require('colors'),
    addonRegistry = require('../helpers/addon-registry');

module.exports = function (stdout, addonName){
  return new Promise(function (resolve, reject){
    stdout.write('Searching add-on registry...\n\n');
    addonRegistry.search(addonName).then(function (addons){
      for(var i = 0; i < addons.length; i++){
        stdout.write(colors.white(addons[i].name) + '\t' + colors.gray(addons[i].description)+'\n');
      }
      stdout.write('\n'+colors.gray(addons.length +' result(s) for "'+addonName+'"')+'\n');
      resolve(true);
    }).catch(function (err){
      console.log(err)
      reject(err);
    });
  });
}