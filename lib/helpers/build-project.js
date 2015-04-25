var path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra'),
  broccoli = require('./pixi-broccoli'),
  copyDereferenceSync = require('copy-dereference').sync,
  errors = require('./errors'),
  treeProjectBuilder = require('./tree-project-builder');

module.exports = function (pixiProjectFile, debugMode){
  //create a promise
  return new Promise(function (resolve, reject){

    //change directory to project path
    process.chdir(pixiProjectFile.projectPath);

    //process arguments
    var targetPath = path.resolve(pixiProjectFile.projectPath, pixiProjectFile.deployPath, 'www');
    var targetExists = fs.existsSync(targetPath);
    var targetEmpty = targetExists ? fs.readdirSync(targetPath).length===0 : true;

    //build project tree base on project file
    var tree = treeProjectBuilder(pixiProjectFile, debugMode ? 'development' : 'production');
    var builder = new broccoli.Builder(tree);

    //remove target directory if not empty
    fse.removeSync(targetPath);

    //build tree with broccoli's builder
    builder.build()
      .then(function (hash) {
        var dir = hash.directory;
        try {
          copyDereferenceSync(dir, targetPath);
        } catch (err) {
          reject(error(-1, err));
        }
      })
      .finally(function () {
        return builder.cleanup();
      })
      .then(function () {
        resolve(true);
      })
      .catch(function (err) {
        //throw an error
        reject(err);
      });

  });
};