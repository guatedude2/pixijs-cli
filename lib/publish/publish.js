
var Promise = require('rsvp').Promise,
    addonParser = require('../helpers/addon-parser'),
    addonRegistry = require('../helpers/addon-registry'),
    colors = require('colors'),
    prompt = require('prompt'),
    path = require('path'),
    nconf = require('nconf'),
    fs = require('fs');


function userPrompt(text, type){
  return new Promise(function (resolve, reject){
    prompt.start({ message: ' ', delimiter: ' \n' });
    prompt.get([{
      description: text,
      name: 'value',
      required: (type !== 'question'),
      hidden: (type === 'password'),
      pattern: (type === 'email' ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i : (type === 'question' ? /^[YN]/i : ''))
    }], function (err, result) {
      if (err){
        reject(err);
      }else{
        resolve(result.value);
      }
    });
  })
}

module.exports = function (stdout, addonFilename, pixiProjectFile){

  nconf.argv().file({ file: __dirname + '/../../config.json' });
  prompt.colors = false;

  var addonName = path.basename(addonFilename.toLowerCase(), path.extname(addonFilename));

  return new Promise(function (resolve, reject){
    stdout.write(colors.gray('Preparing add-on...'));

    var metaData = addonParser.parse(addonFilename);
    if (!metaData){
      stdout.write(colors.gray('error\n'));
      var err = new Error("Unable to parse plugin");
      err.code = 300;
      throw err;
    }
    stdout.write(colors.gray('done\n'));
    var tokenPromise = new Promise( function (resolve, reject){
      var email = nconf.get('email');
      var token = nconf.get('token');
      if (!email || !token){
        var createAccount, userName, userEmail, userPassword;

        stdout.write('You must be logged in to publish your add-on.\n');

        userPrompt('Do you have an account? [Y/n]', 'question').then(function (answer){
          return (answer !== 'N' && answer !== 'n');
        }).then(function (result){
          createAccount = !result;
          if (createAccount){
            stdout.write('\nTo create an account, please enter your name, email and a password.\n');
            return userPrompt("Name:", 'text').then(function (name){
              userName = name;
              return true;
            });
          }
          return true;
        }).then(function (){
          return userPrompt("E-mail:", 'email').then(function (email){
            userEmail = email.toLowerCase();
            return true;
          });
        }).then(function (){
          return userPrompt('Password:', 'password').then(function (password){
            userPassword = password;
            return true;
          });
        }).then(function (){
          if (createAccount){
            return addonRegistry.registerUser(userName, userEmail, userPassword).then(function (result){
              if (!result.token){
                throw new Error(result.error);
              }else{
                nconf.set('email', userEmail);
                nconf.set('token', result.token);
                nconf.save();
                resolve({ email: userEmail, token: result.token });
              }
            }).catch(function (err){
              reject(err);
            });
          }else{
            return addonRegistry.userLogin(userEmail, userPassword).then(function (result){
              if (!result.token){
                throw new Error(result.error);
              }else{
                nconf.set('email', userEmail);
                nconf.set('token', result.token);
                nconf.save();
                resolve({ email: userEmail, token: result.token });
              }
            }).catch(function (err){
              reject(err);
            });
          }

        }).then(function (result){
          resolve(token);
        }).catch(function (err){
          reject(err);
        });
      }else{
        resolve({ email: email, token: token });
      }
    }).catch(function (err){
      reject(err);
    });

    tokenPromise.then(function (user){
      if (metaData.email != user.email){
        return reject(new Error("User's email does not match add-on author email"));
      }

      stdout.write(colors.gray('Publishing your add-on...'));

      //publish addon with payload
      addonRegistry.publish(addonName, {
        description: metaData.description,
        version: metaData.version,
        email: user.email,
        token: user.token,
        dependencies: metaData.dependencies.join(','),
        content: new Buffer(metaData.raw).toString('base64')
      }).then(function (result){
        if (result.error){
          stdout.write(colors.gray('error\n'));
          return reject(new Error(result.error));
        }
        stdout.write(colors.gray('done\n'));
        resolve(result);
      }).catch(function (err){
        stdout.write(colors.gray('error\n'));
        reject(err);
      });

    })
  });
}