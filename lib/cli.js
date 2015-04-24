var Promise = require('rsvp').Promise,
  colors = require('colors'),
  option = require('./helpers/option'),
  pjson = require('../package.json');

function reject(){
  return new Promise(function (resolve, reject){ reject(false); });
}

module.exports = function (args){
  var clicommand = process.title;

  console.log(colors.magenta("Pixi.js CLI - "+pjson.version)+'\n');
  var baseDir = process.cwd();
  var stdout = process.stdout;
  var doop;

  if (option(args, ['build', 'b'])){ //TODO: Maybe brgin compile to build?
    doop = require('./build');
  }else if (option(args, ['serve', 's'])){
    doop = require('./serve');
  }else if (option(args, ['create', 'c'])){
    doop = require('./create');
  }else if (option(args, ['platform'])){
    doop = require('./cordova').platform;
  }else if (option(args, ['run'])){
    doop = require('./cordova').run;
  }else if (option(args, ['compile'])){
    doop = require('./cordova').compile;
  }else if (option(args, ['plugin'])){
    doop = require('./cordova').plugin;
  //TODO: update plugins from registry
  //}else if (option(args, ['update', 'u'])){
  //  doop = update;
  }else if (option(args, ['clean'])){
    doop = require('./clean');
  }else if (option(args, ['addon', 'a'])){ //TODO: rename to "addon"
    doop = require('./addon');
  }else{
    doop = reject;
  }

  doop(baseDir, stdout, args).then(function (result){
    process.exit(0);
  }).catch(function (err){
    if (err===false){
      if (args.length>0 && !option(args, ['help', '--help'])) console.log('Invalid option ', args.join(' '));
      console.log('Usage: pixijs '+colors.yellow('<command (Default: help)>'));
      console.log('');
      console.log('Available commands in pixi.js CLI:');
      console.log('');
      console.log(clicommand + ' create, c <name>');
      console.log(colors.grey('  Creates a new pixi.js CLI project'));
      console.log(colors.blue('  --path <path>'), colors.cyan('the path to create the new project'));
      console.log(colors.blue('  --force'), colors.cyan('overwrites exisiting files'));
      console.log('');
      console.log(clicommand + ' serve, s <options>');
      console.log(colors.grey('  Starts an http server with LiveReload'));
      console.log(colors.blue('  --port <port>'), colors.cyan('the port to bind to [4200]'));
      console.log(colors.blue('  --host <host>'), colors.cyan('the host to bind to [localhost]'));
      console.log(colors.blue('  --live-reload-port <port>'), colors.cyan('the port to start LiveReload on [35729]'));
      console.log('');
      console.log(clicommand + ' platform (list | ls | add | remove | rm | update | up) <options>');
      console.log(colors.grey('  Adds, remove or list cordova platforms'));
      console.log(colors.blue('  [list | ls]'), colors.cyan('list all platforms for which the project will build'));
      console.log(colors.blue('  add <platform> [<platform> ...]'), colors.cyan('add one (or more) platforms as a build target for the project'));
      console.log(colors.blue('  [remove | rm] <platform> [<platform> ...]'), colors.cyan('removes one (or more) platform build targets from the project'));
      console.log(colors.blue('  [update | up] <platform>'), colors.cyan('updates the Cordova version used for the given platform'));
      console.log('');
      // console.log(clicommand + ' update, u');
      // console.log(colors.grey('  Updates the pixi.js library with the lastest master version on github'));
      // console.log('');
      console.log(clicommand + ' build, b <options>');
      console.log(colors.grey('  Builds the project to the build directory'));
      console.log(colors.blue('  --path <path>'), colors.cyan('the build directory [dist/]'));
      console.log(colors.blue('  --force'), colors.cyan('force removes exisiting files'));
      console.log('');
      console.log(clicommand + ' addon, a (search | add | remove | publish) <addon_name>');
      console.log(colors.grey('  Search, adds, removes or publishes a pixi.js add-ons'));
      console.log(colors.blue('  search <addon_name>'), colors.cyan('searches the registry for a add-on'));
      console.log(colors.blue('  add <addon_name>'), colors.cyan('adds a add-on from the registry to the current project'));
      console.log(colors.blue('  remove <addon_name>'), colors.cyan('removes an existing add-on from the current project'));
      console.log(colors.blue('  publish <addon_name>'), colors.cyan('publishes an existing add-on in the project. See documentation on publishing for more details.'));
      console.log('');
      console.log(clicommand + ' clean');
      console.log(colors.grey('  Cleans the project temporary build folders'));
      console.log('');
      console.log(clicommand + ' help, --help');
      console.log(colors.grey('  Outputs the usage instructions for all commands or the provided command'));
      console.log('');
    }else{
      //console.log(err.stack);
      console.error(colors.red(err.message)+'\n');
    }
  });

};