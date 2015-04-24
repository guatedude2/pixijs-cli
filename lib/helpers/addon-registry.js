var registryUrl = "http://www.pixijs-cli.com:3000";

var Promise = require('rsvp').Promise,
    sha1 = require('node-sha1'),
    request = require('request');

module.exports = {

  search: function (query){
    return new Promise(function (resolve, reject){
      request({
        uri: registryUrl+'/addons?query='+query,
        method: 'GET',
        json: true
      }, function(err, res, json){
        if (!err && res.statusCode === 200){
          resolve(json);
        }else{
          var error = new Error(err || "File not found");
          error.code = 404;
          reject(error);
        }
      });
    });
  },

  download: function (name){
    return new Promise(function (resolve, reject){
      request({
        uri: registryUrl+'/addons/'+name,
        method: 'GET',
        json: true
      }, function(err, res, json){
        if (!err && res.statusCode === 200){
          resolve(json);
        }else{
          var error = new Error(err || "File not found");
          error.code = 404;
          reject(error);
        }
      });
    });
  },

  publish: function (addonName, payload){
    return new Promise(function (resolve, reject){
      request({
        uri: registryUrl+'/addons/'+addonName,
        method: 'PUT',
        json: payload
      }, function(err, res, json){
        if (!err && res.statusCode === 200){
          resolve(json);
        }else{
          var error = new Error(err || "File not found");
          error.code = 404;
          reject(error);
        }
      });
    });
  },

  downloadExternal: function (url){
    return new Promise(function (resolve, reject){
      request({
        uri: url,
        method: 'GET'
      }, function(err, res, body){
        if (!err && res.statusCode === 200){
          resolve(body);
        }else{
          var error = new Error(err || "File not found");
          error.code = 404;
          reject(error);
        }
      });
    });
  },

  registerUser: function (name, email, password){
    return new Promise(function (resolve, reject){
      request({
        uri: registryUrl+'/register',
        method: 'POST',
        json: {
          name: name,
          email: email,
          password: sha1(password)
        }
      }, function(err, res, json){
        if (!err && res.statusCode === 200){
          resolve(json);
        }else{
          var error = new Error(err || "File not found");
          error.code = 404;
          reject(error);
        }
      });
    });
  },

  userLogin: function (email, password){
    return new Promise(function (resolve, reject){
      request({
        uri: registryUrl+'/auth',
        method: 'POST',
        json: {
          email: email,
          password: sha1(password)
        }
      }, function(err, res, json){
        if (!err && res.statusCode === 200){
          resolve(json);
        }else{
          var error = new Error(err || "File not found");
          error.code = 404;
          reject(error);
        }
      });
    });
  }
};