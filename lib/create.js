var Promise = require('rsvp').Promise,
  path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra'),
  colors = require('colors'),
  option = require('./helpers/option'),
  errors = require('./helpers/errors');

module.exports = function (basePath, stdout, args){
  //create a promise
  return new Promise(function (resolve, reject){
    //process arguments
    var projectName = option(args, ['create', 'c'], 'string', '');
    var forceOverwrite = option(args, '--force');
    var targetPath = path.resolve(basePath, projectName);
    var targetExists = fs.existsSync(targetPath);

    //validate project name
    if (!projectName) return reject(errors(100)); //No project name specified!
    if (!~projectName.search(/^[\w-]+$/)) return reject(errors(101)); //Project name must be made up of numbers, letters, underscores and dashes!

    //check existing target directory
    if (targetExists && !forceOverwrite){
      reject(errors(102)); //Project creation failed! Project directory is not empty. Use --force to overwrite.
      return;
    }

    //shoule we remove files?
    //if (targetExists) fse.removeSync(targetPath);

    //create directory if it does not exist
    fse.ensureDirSync(targetPath);

    var template = {
      name: projectName,
      sourcePath: "src",
      corePath: "libs/core",
      vendorPath: "libs/vendor",
      publicPath: "public",
      outputPath: "dist"
    };

    //copy template to target path
    stdout.write("Generating project files...");
    fse.copySync(path.resolve(__dirname, '../template'), targetPath);

    //update index file's title with project name
    var html = fs.readFileSync(path.resolve(targetPath, 'public/index.html'), {encoding:'utf-8'});
    html = html.replace(/(<title>)(<\/title>)/i, '$1'+projectName.replace(/\$/g, '\\$')+'$2');
    fs.writeFileSync(path.resolve(targetPath, 'public/index.html'), html);
    stdout.write("done!\n");

    //write project file
    stdout.write("Creating project file...");
    fs.writeFileSync(path.resolve(targetPath, '.pixi'), JSON.stringify(template));
    stdout.write("done\n\n");

    stdout.write(colors.gray("Run `"+process.title+' update` to get the latest pixi.js library\n\n'));

    //resolve the promise
    stdout.write(colors.green("Project created succesfully!\n"));
    resolve(true);
  });
};