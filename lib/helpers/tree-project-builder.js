var uglifyJavaScript = require('broccoli-uglify-js'),
  concat = require('broccoli-concat'),
  mergeTrees = require('broccoli-merge-trees'),
  injectLivereload = require('broccoli-inject-livereload'),
  esTranspiler = require('broccoli-babel-transpiler'),
  concatFilesWithSourcemaps = require('broccoli-sourcemap-concat'),
  ES6Modules  = require('broccoli-es6modules'),
  Funnel        = require('broccoli-funnel');

module.exports = function (paths, env){

  var gameTree = esTranspiler(new Funnel(new ES6Modules(new Funnel(paths.sourcePath, {
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
  }));

  var addonsTree = esTranspiler(new Funnel(new ES6Modules(new Funnel(paths.addonsPath, {
    include: [ /.*\.js$/ ],
    description: 'Funnel: Filtered Addons Files'
  }), {
    esperantoOptions: {
      absolutePaths: true,
      strict: true,
    },
    description: "ES6: Addons Tree"
  }),{
    include: [ /.*\.js$/ ],
    destDir: 'lib/addons',
    description: 'Funnel: Filtered Addons Files'
  }));

  var loaderTree = new Funnel(__dirname, {
    files: ['loader.js']
  });

  var vendorMaps = new Funnel(paths.vendorPath, {
    include: [ /.*\.map$/ ],
    destDir: 'lib/vendor',
    description: 'Funnel: Vendor Map Files'
  });

  var vendorTree = concat(mergeTrees([ loaderTree, paths.vendorPath ]), {
    inputFiles:[
      '**/*.js'
    ],
    outputFile: '/lib/vendor/vendor.js',
    description: "Concat: Vendor Files"
  });

  gameTree = concatFilesWithSourcemaps(mergeTrees([ gameTree, vendorTree, vendorMaps, addonsTree ]), {
    enabled: (env !== 'production'),
    extensions: ['js'],
    headerFiles: [
      'lib/vendor/vendor.js'
    ],
    inputFiles: [
      'src/**/*.js',
      'lib/addons/**/*.js'
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