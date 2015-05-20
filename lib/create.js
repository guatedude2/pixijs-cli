var Promise = require('rsvp').Promise,
  path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra'),
  nconf = require('nconf'),
  colors = require('colors'),
  option = require('./helpers/option'),
  addon = require('./addon'),
  errors = require('./helpers/errors'),
  projectFileLoader = require('./helpers/project-file-loader');

module.exports = function (basePath, stdout, args){
  nconf.argv().file({ file: __dirname + '/../config.json' });

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
      addonsPath: "libs/addons",
      vendorPath: "libs/vendor",
      publicPath: "public",
      deployPath: "deploy"
    };

    var vars = {
      AUTHOR: nconf.get('name') || 'Author',
      EMAIL: nconf.get('email') || 'author@example.com',
      APP_ID: 'com.example.'+projectName.replace(/\W/g, '').toLowerCase(),
      APP_NAME: projectName.replace(/\s+/, '_')
    }

    //TODO: update deploy/config.xml file

    //copy template to target path
    stdout.write(colors.gray("Generating project files..."));
    fse.copySync(path.resolve(__dirname, '../template'), targetPath);

    //update index file's title with project name
    var html = fs.readFileSync(path.resolve(targetPath, 'public/index.html'), {encoding:'utf-8'});
    html = html.replace(/(<title>)(<\/title>)/i, '$1'+projectName.replace(/\$/g, '\\$')+'$2');
    fs.writeFileSync(path.resolve(targetPath, 'public/index.html'), html);
    stdout.write(colors.gray("done!\n"));

    //write project file
    stdout.write(colors.gray("Creating project file..."));
    //write pixi project file
    fs.writeFileSync(path.resolve(targetPath, '.pixi'), JSON.stringify(template, null, 4));
    //write config.xml
    var configFile = fs.readFileSync(path.resolve(targetPath, template.deployPath, 'config.xml'), {encoding:'utf-8'});
    configFile = configFile.replace(/%(\w+)%/g, function (d, varName){ return vars[varName] || '';  });
    fs.writeFileSync(path.resolve(targetPath, template.deployPath, 'config.xml'), configFile);
    //write index.html
    var indexFile = fs.readFileSync(path.resolve(targetPath, template.publicPath, 'index.html'), {encoding:'utf-8'});
    indexFile = indexFile.replace(/%(\w+)%/g, function (d, varName){ return vars[varName] || '';  });
    fs.writeFileSync(path.resolve(targetPath, template.publicPath, 'index.html'), indexFile);

    stdout.write(colors.gray("done\n\n"));

    //download game-window add-on and its dependencies
    var pixiProjectFile = projectFileLoader(targetPath);
    process.chdir(pixiProjectFile.projectPath);
    require('./publish/add')(stdout, 'game-window', pixiProjectFile).then(function (addon){
      stdout.write(colors.green("Project created succesfully!\n"));
      resolve(true);
    }).catch(function (err){
      if (err.code === 404){
        return reject(errors(109, addonName));
      }else if (err.code === 405){
        return reject(errors(110));
      }
      reject(err);
    });

  });
};