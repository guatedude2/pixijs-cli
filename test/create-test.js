var assert = require('assert'),
  fse = require('fs-extra'),
  genTree = require('./lib/gen-tree'),
  create = require('../lib/create');

var basePath, stdout;

describe('#create command', function (){
  this.slow(500);
  beforeEach(function(){
    stdout = { write: function(){} };
    basePath = __dirname + '/tmp/temp_c'+(new Date()).getTime();
    fse.mkdirpSync(basePath);
    process.chdir(basePath);
  });

  after(function (){
    fse.removeSync(__dirname + '/tmp');
  });

  it("fails with no specified project name", function (done){
    create(basePath, stdout, ['create'])
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 100);
        done();
      });
  });

  it("fails with invalid project name characters", function (done){
    create(basePath, stdout, ['create', 'test-project-$*?'])
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 101);
        done();
      });
  });

  it("fails with a non-empty project directory", function (done){
    genTree(basePath, {
      'test-project': {
        '.pixi': '{"name":"test-project","sourcePath":"src","corePath":"libs/core","vendorPath":"libs/vendor","publicPath":"public","outputPath":"dist"}'
      }
    });
    create(basePath, stdout, ['create', 'test-project'])
      .then(function (result){
        done("Not expected to pass");
      }).catch(function (err){
        assert.equal(err.code, 102);
        done();
      });
  });

  it("creates a new project", function (done){
    create(basePath, stdout, ['create', 'test-project'])
      .then(function (result){
        assert.ok(result);
        done();
      }).catch(function (err){
        done(err);
      });
  });

  it("force creates a new project", function (done){
    genTree(basePath, {
      'test-project':{
        'fake-file.txt': 'FAKE DATA'
      }
    });

    create(basePath, stdout, ['create', 'test-project', '--force'])
      .then(function (result){
        assert.ok(result);
        done();
      }).catch(function (err){
        done(err);
      });
  });
});