var uglifyJavaScript = require('broccoli-uglify-js'),
  concat = require('broccoli-concat'),
  mergeTrees = require('broccoli-merge-trees'),
  injectLivereload = require('broccoli-inject-livereload'),
  esTranspiler = require('broccoli-babel-transpiler'),
  concatFilesWithSourcemaps = require('broccoli-sourcemap-concat'),
  ES6Modules  = require('broccoli-es6modules'),
  Funnel        = require('broccoli-funnel');

module.exports = function (paths, env){

  var gameTree = new Funnel(new ES6Modules(new Funnel(paths.sourcePath, {
    include: [ /.*\.js$/ ],
    description: 'Funnel: Filtered Game Files'
  }), {
    esperantoOptions: {
      absolutePaths: true,
      strict: true
    },
    description: "ES6: Game Tree"
  }),{
    include: [ /.*\.js$/ ],
    destDir: 'src',
    description: 'Funnel: Filtered Game Files'
  });

  var pluginTree = new Funnel(new ES6Modules(new Funnel(paths.pluginsPath, {
    include: [ /.*\.js$/ ],
    description: 'Funnel: Filtered Plugin Files'
  }), {
    esperantoOptions: {
      absolutePaths: true,
      strict: true,
    },
    description: "ES6: Plugins Tree"
  }),{
    include: [ /.*\.js$/ ],
    destDir: 'plugins',
    description: 'Funnel: Filtered Plugin Files'
  });

  var loaderTree = new Funnel(__dirname, {
    files: ['loader.js']
  });

  var vendorTree = concat(mergeTrees([ loaderTree, paths.vendorPath ]), {
    inputFiles:[
      '**/*.js'
    ],
    outputFile: '/vendor/vendor.js',
    description: "Concat: Vendor Files"
  });

  gameTree = concatFilesWithSourcemaps(mergeTrees([ gameTree, vendorTree, pluginTree ]), {
    enabled: (env !== 'production'),
    extensions: ['js'],
    headerFiles: [
      'vendor/vendor.js'
    ],
    inputFiles: [
      'src/**/*.js',
      'plugins/**/*.js'
    ],
    outputFile: '/game.js',
    allowNone: true,
    description: 'Concat: Game App'
  });

  if (env === 'production'){
    publicTree = paths.publicPath;
    gameTree = uglifyJavaScript(gameTree, {
      mangle: true,
      compress: true
    });
  }else{
    publicTree = injectLivereload(paths.publicPath);
  }

  return mergeTrees([ gameTree, publicTree ]);
};