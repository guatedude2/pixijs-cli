var assert = require('assert'),
  fse = require('fs-extra'),
  genTree = require('./lib/gen-tree'),
  build = require('../lib/build');

var basePath, stdout;

describe('#build command', function (){
  this.slow(500);
  beforeEach(function(){
    stdout = { write: function(){} };
    basePath = __dirname + '/tmp/temp_b'+(new Date()).getTime();
    fse.mkdirpSync(basePath);
    process.chdir(basePath);
  });

  after(function (){
    fse.removeSync(__dirname + '/tmp');
  });

  it("fails in an invalid directory", function (done){
    build(basePath, stdout, ['build'])
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 10);
        done();
      });
  });

  it("fails when target directory is not empty", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","corePath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{},
      'libs':{
        'vendor':{}
      },
      'src':{},
      'dist':{
        'some_file.js': 'FAKE DATA'
      }
    });

    build(basePath, stdout, ['build'])
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 106);
        done();
      });
  });

  it("fails when a file has an error", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","corePath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{},
      'libs':{
        'vendor':{
          'pixi-dev.js': '/* DUMMY DATA */'
        },
        'core':{
          'loader.js': '/* DUMMY DATA */'
        }
      },
      'src':{
        'index.js': 'non valid javascript'
      },
      'dist':{}
    });

    build(basePath, stdout, ['build'])
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 1003);
        done();
      });
  });

  it("builds a project", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","corePath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{},
      'libs':{
        'vendor':{
          'pixi-dev.js': '/* DUMMY DATA */'
        },
        'core':{
          'loader.js': '/* DUMMY DATA */'
        }
      },
      'src':{
        'index.js': '/* DUMMY DATA */'
      }
    });
    build(basePath, stdout, ['build'])
      .then(function (result){
        assert.ok(result);
        done();
      }).catch(function (err){
        done(err);
      });
  });

  it("builds a project to a target directory", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","corePath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{},
      'libs':{
        'vendor':{
          'pixi-dev.js': '/* DUMMY DATA */'
        },
        'core':{
          'loader.js': '/* DUMMY DATA */'
        }
      },
      'src':{
        'index.js': '/* DUMMY DATA */'
      }
    });
    build(basePath, stdout, ['build', '--path', 'target'])
      .then(function (result){
        assert.ok(result);
        done();
      }).catch(function (err){
        done(err);
      });

  });

  it("builds a project overwriting target directory", function (done){
    genTree(basePath, {
      '.pixi': '{"name":"test-project","sourcePath":"src","corePath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}',
      'public':{},
      'libs':{
        'vendor':{
          'pixi-dev.js': '/* DUMMY DATA */'
        },
        'core':{
          'loader.js': '/* DUMMY DATA */'
        }
      },
      'src':{
        'index.js': '/* DUMMY DATA */'
      },
      'dist':{
        'some_file.txt':'DUMMY DATA'
      }
    });
    build(basePath, stdout, ['build', '--force'])
      .then(function (result){
        assert.ok(result);
        done();
      }).catch(function (err){
        done(err);
      });
  });
});