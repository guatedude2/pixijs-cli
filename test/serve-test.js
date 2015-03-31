var assert = require('assert'),
  fse = require('fs-extra'),
  genTree = require('./helpers/gen-tree'),
  http = require('http'),
  serve = require('../lib/serve'),
  messages = require('../lib/pixi-broccoli/messages'),
  stub = require('./helpers/stub').stub,
  connect = require('connect');

var basePath, stdout;

var testOptions = {
  testing: true,
  watcher: {
    on: function (){}
  },
  server: {
    listen: function (){ },
    on: function(){}
  },
  livereloadServer: {
    listen: function (){},
    changed: function(){}
  }
};

describe('#serve functions', function (){
  this.slow(500);

  beforeEach(function(){
    stdout = { write: function(){} };
    basePath = __dirname + '/tmp/temp_s'+(new Date()).getTime();
    fse.mkdirpSync(basePath);
    process.chdir(basePath);

    stub(testOptions.server, 'listen');
    stub(testOptions.livereloadServer, 'listen');
  });

  afterEach(function(){
    testOptions.server.listen.restore();
    testOptions.livereloadServer.listen.restore();
  });

  after(function (){
    fse.removeSync(__dirname + '/tmp');
  });

  it("fails in an invalid directory", function (done){
    serve(basePath, stdout, ['serve'], testOptions)
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 10);
        done();
      });
  });

  it("starts with the default host and port", function (){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","pluginsPath":"libs/plugins","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{
        'index.html': 'OK'
      },
      'libs':{
        'vendor':{
          'pixi.js': '/* FAKE DATA */'
        },
        'plugins':{}
      },
      'src':{}
    });
    serve(basePath, stdout, ['serve'], testOptions);

    assert.equal(testOptions.server.listen.called, 1);
    var port = testOptions.server.listen.calledWith[0][0];
    var host = testOptions.server.listen.calledWith[0][1];
    assert.equal(port, 4200);
    assert.equal(host, 'localhost');

  });

  it("starts with a specific host", function (){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","pluginsPath":"libs/plugins","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{
        'index.html': 'OK'
      },
      'libs':{
        'vendor':{
          'pixi.js': '/* FAKE DATA */'
        },
        'plugins':{}
      },
      'src':{}
    });
    serve(basePath, stdout, ['serve', '--host', '127.0.0.1'], testOptions);

    assert.equal(testOptions.server.listen.called, 1);
    var port = testOptions.server.listen.calledWith[0][0];
    var host = testOptions.server.listen.calledWith[0][1];
    assert.equal(port, 4200);
    assert.equal(host, '127.0.0.1');

  });

  it("starts with a specifc port", function (){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","pluginsPath":"libs/plugins","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{
        'index.html': 'OK'
      },
      'libs':{
        'vendor':{
          'pixi.js': '/* FAKE DATA */'
        },
        'plugins':{}
      },
      'src':{}
    });

    serve(basePath, stdout, ['serve', '--port', 8080], testOptions);

    assert.equal(testOptions.server.listen.called, 1);
    var port = testOptions.server.listen.calledWith[0][0];
    var host = testOptions.server.listen.calledWith[0][1];
    assert.equal(port, 8080);
    assert.equal(host, 'localhost');
  });

  it("starts with a specifc live reload port", function (){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","pluginsPath":"libs/plugins","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{
        'index.html': 'OK'
      },
      'libs':{
        'vendor':{
          'pixi.js': '/* FAKE DATA */'
        },
        'plugins':{}
      },
      'src':{}
    });

    serve(basePath, stdout, ['serve', '--live-reload-port', 11234], testOptions);

    assert.equal(testOptions.server.listen.called, 1);
    assert.equal(testOptions.livereloadServer.listen.called, 1);
    var livereloadPort = testOptions.livereloadServer.listen.calledWith[0][0];
    assert.equal(livereloadPort, 11234);

  });
});