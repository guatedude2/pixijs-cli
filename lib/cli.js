var colors = require('colors'),
  serve = require('./serve'),
  build = require('./build'),
  create = require('./create'),
  update = require('./update'),
  option = require('./helpers/option'),
  pjson = require('../package.json');

module.exports = function (args){
  var clicommand = process.title;

  console.log(colors.magenta("Pixi.js CLI - "+pjson.version)+'\n');
  var baseDir = process.cwd();
  var stdout = process.stdout;
  var doop;

  if (option(args, ['build', 'b'])){
    doop = build;
  }else if (option(args, ['serve', 's'])){
    doop = serve;
  }else if (option(args, ['create', 'c'])){
    doop = create;
  }else if (option(args, ['update', 'u'])){
    doop = update;
  }else{
    if (args.length>0 && !option(args, ['help', '--help'])) console.log('Invalid option ', args.join(' '));
    console.log('Usage: ember '+colors.yellow('<command (Default: help)>'));
    console.log('');
    console.log('Available commands in pixi.js CLI:');
    console.log('');
    console.log(clicommand + ' create, c <name>');
    console.log(colors.grey('  Creates a new pixi.js CLI project'));
    console.log(colors.cyan('  --path <path>', 'the path to create the new project'));
    console.log(colors.cyan('  --fore', 'overwrites exisiting files'));
    console.log('');
    console.log(clicommand + ' serve, s <options>');
    console.log(colors.grey('  Starts an http server with LiveReload'));
    console.log(colors.cyan('  --port <port>', 'the port to bind to [4200]'));
    console.log(colors.cyan('  --host <host>', 'the host to bind to [localhost]'));
    console.log(colors.cyan('  --live-reload-port <port>', 'the port to start LiveReload on [35729]'));
    console.log('');
    console.log(clicommand + ' update, u');
    console.log(colors.grey('  Updates the pixi.js library with the lastest master version on github'));
    console.log('');
    console.log(clicommand + ' build, b <options>');
    console.log(colors.grey('  Builds the project to the build directory'));
    console.log(colors.cyan('  --path <path>', 'the build directory [dist/]'));
    console.log(colors.cyan('  --fore', 'force removes exisiting files'));
    console.log('');
    console.log(clicommand + ' help, --help');
    console.log(colors.grey('  Outputs the usage instructions for all commands or the provided command'));
    console.log('');
    process.exit(1);
  }

  doop(baseDir, stdout, args).then(function (result){
    process.exit(0);
  }).catch(function (err){
    console.error(colors.red(err.message));
  });

};