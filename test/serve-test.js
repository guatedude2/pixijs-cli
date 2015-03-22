var assert = require('assert'),
  fse = require('fs-extra'),
  genTree = require('./lib/gen-tree'),
  http = require('http'),
  serve = require('../lib/serve'),
  messages = require('../lib/pixi-broccoli/messages');

var basePath, stdout;

describe('#serve functions', function (){
  this.slow(500);
  beforeEach(function(){
    stdout = { write: function(){} };
    basePath = __dirname + '/tmp/temp_s'+(new Date()).getTime();
    fse.mkdirpSync(basePath);
    process.chdir(basePath);
  });

  after(function (){
    fse.removeSync(__dirname + '/tmp');
  });

  it("fails in an invalid directory", function (done){
    serve(basePath, stdout, ['serve'])
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 10);
        done();
      });
  });

  it("starts with the default host and port", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","pluginsPath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{
        'index.html': 'OK'
      },
      'libs':{
        'vendor':{
          'pixi.js': '/* FAKE DATA */'
        },
        'core':{
          'loader.js': '/* FAKE DATA */'
        }
      },
      'src':{}
    });
    setTimeout(function(){
      http.get('http://localhost:4200/index.html', function(res){
        res.setEncoding('utf8');
        if (res.statusCode===200) {
          messages.send('server', 'kill');
        }
      });
    }, 100);
    messages.on('server', function (value){
      if (value==='closed') done();
    });
    serve(basePath, stdout, ['serve'])
      .then(function (result){
        //done("Not expected to reach this point");
      }).catch(function (err){
        done(err);
      });
  });

  it("fails with an invalid host", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","pluginsPath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{
        'index.html': 'OK'
      },
      'libs':{
        'vendor':{
          'pixi.js': '/* FAKE DATA */'
        },
        'core':{
          'loader.js': '/* FAKE DATA */'
        }
      },
      'src':{}
    });
    serve(basePath, stdout, ['serve', '--host', 'fake-host'])
      .then(function (result){
        //done("Not expected to reach this point");
      }).catch(function (err){
        assert.equal(err.code, -1);
        done();
      });
  });

  it("starts with a specific host", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","pluginsPath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{
        'index.html': 'OK'
      },
      'libs':{
        'vendor':{
          'pixi.js': '/* FAKE DATA */'
        },
        'core':{
          'loader.js': '/* FAKE DATA */'
        }
      },
      'src':{}
    });
    setTimeout(function(){
      http.get('http://localhost:4200/index.html', function(res){
        res.setEncoding('utf8');
        if (res.statusCode===200){
          messages.send('server', 'kill');
        }
      });
    }, 100);
    messages.on('server', function (value){
      if (value==='closed') done();
    });
    serve(basePath, stdout, ['serve', '--host', '127.0.0.1'])
      .then(function (result){
        //done("Not expected to reach this point");
      }).catch(function (err){
        done(err);
      });
  });

  it("starts with a specifc port", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","pluginsPath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{
        'index.html': 'OK'
      },
      'libs':{
        'vendor':{
          'pixi.js': '/* FAKE DATA */'
        },
        'core':{
          'loader.js': '/* FAKE DATA */'
        }
      },
      'src':{}
    });
    setTimeout(function(){
      http.get('http://localhost:8080/index.html', function(res){
        res.setEncoding('utf8');
        if (res.statusCode===200){
          messages.send('server', 'kill');
        }
      });
    }, 100);
    messages.on('server', function (value){
      if (value==='closed') done();
    });
    serve(basePath, stdout, ['serve', '--port', 8080])
      .then(function (result){
        //done("Not expected to reach this point");
      }).catch(function (err){
        done(err);
      });
  });

  it("starts with a specifc live reload port", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","pluginsPath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{
        'index.html': 'OK'
      },
      'libs':{
        'vendor':{
          'pixi.js': '/* FAKE DATA */'
        },
        'core':{
          'loader.js': '/* FAKE DATA */'
        }
      },
      'src':{}
    });
    setTimeout(function(){
      http.get('http://localhost:4200/index.html', function(res){
        res.setEncoding('utf8');
        if (res.statusCode===200){
          messages.send('server', 'kill');
        }
      });
    }, 100);
    messages.on('server', function (value){
      if (value==='closed') done();
    });
    serve(basePath, stdout, ['serve', '--live-reload-port', 11234])
      .then(function (result){
        //done("Not expected to reach this point");
      }).catch(function (err){
        done(err);
      });
  });
});