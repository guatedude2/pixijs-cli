var path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra'),
  colors = require('colors'),
  broccoli = require('./pixi-broccoli'),
  copyDereferenceSync = require('copy-dereference').sync,
  option = require('./helpers/option'),
  errors = require('./helpers/errors'),
  treeProjectBuilder = require('./helpers/tree-project-builder'),
  projectFileLoader = require('./helpers/project-file-loader');

module.exports = function (basePath, stdout, args){
  //create a promise
  return new Promise(function (resolve, reject){
    //check target path is an existing pixi.js project
    var pixiProjectFile = projectFileLoader(basePath);

    process.chdir(pixiProjectFile.projectPath);

    //check existing target directory
    if (pixiProjectFile===false){
      reject(errors(10)); //You have to be inside an pixi.js CLI project in order to update a project.
      return;
    }else if (pixiProjectFile.error){
      reject(errors(20, pixiProjectFile.error)); //Error loading project file:
      return;
    }

    //process arguments
    var outputPath = option(args, ['--path'], 'string', pixiProjectFile.outputPath);
    var forceOverwrite = option(args, '--force');
    var targetPath = path.resolve(basePath, outputPath);
    var targetExists = fs.existsSync(targetPath);
    var targetEmpty = targetExists ? fs.readdirSync(targetPath).length===0 : true;

    //check existing target directory
    if (targetExists && !targetEmpty && !forceOverwrite){
      reject(errors(106)); //Build project failed! Output directory is not empty. Use --force to overwrite.
      return;
    }

    //build project tree base on project file
    var tree = treeProjectBuilder(pixiProjectFile, 'production');
    var builder = new broccoli.Builder(tree);

    //remove target directory if not empty
    fse.removeSync(targetPath);

    //build tree with broccoli's builder
    stdout.write("Building project...");
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
        stdout.write('done\nCleaning up...');
        fse.removeSync(path.resolve(pixiProjectFile.projectPath, 'tmp'));
        fse.removeSync(path.resolve(pixiProjectFile.outputPath, 'tmp'));
        stdout.write("done\n\n" + colors.green("Project built succesfully!\n"));
        resolve(true);
      })
      .catch(function (err) {
        //throw an error
        if (err.file) {
          reject(errors(1003, err.message, err.file, err.stack));
        }else{
          reject(errors(1002, err.message, err.stack));
        }
        std.write('\nBuild failed!\n\n');
      });

  });
};