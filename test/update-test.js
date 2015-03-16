var assert = require('assert'),
  fse = require('fs-extra'),
  genTree = require('./lib/gen-tree'),
  nock = require('nock'),
  update = require('../lib/update');

var basePath, stdout;

describe('#update command', function (){
  this.slow(500);

  before(function (){
    nock.disableNetConnect();
  });

  beforeEach(function(){
    stdout = { write: function(){} };
    basePath = __dirname + '/tmp/temp_u'+(new Date()).getTime();
    fse.mkdirpSync(basePath);
    process.chdir(basePath);
  });

  after(function (){
    fse.removeSync(__dirname + '/tmp');
  });

  it("fails in an invalid directory", function (done){
    update(basePath, stdout, ['update'])
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 10);
        done();
      });
  });

  it("fails with no-internet", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","corePath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{},
      'libs':{
        'vendor':{
          'pixi-dev.js': 'FAKE DATA'
        }
      },
      'src':{}
    });

    update(basePath, stdout, ['update'])
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 1002);
        done();
      });
  });

  it("updates an existing project", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","corePath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{},
      'libs':{
        'vendor':{
          'pixi-dev.js': 'FAKE DATA'
        }
      },
      'src':{}
    });

    nock('https://raw.githubusercontent.com')
      .get('/GoodBoyDigital/pixi.js/master/bin/pixi.dev.js')
      .reply(200, '/**\n * pixi.js - v0.0.0\n**/');

    update(basePath, stdout, ['update'])
      .then(function (result){
        assert.ok(result);
        done();
      }).catch(function (err){
        done(err);
      });
  });

});