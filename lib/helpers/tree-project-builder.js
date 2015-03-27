var uglifyJavaScript = require('broccoli-uglify-js'),
  concat = require('broccoli-concat'),
  mergeTrees = require('broccoli-merge-trees'),
  injectLivereload = require('broccoli-inject-livereload'),
  pickFiles = require('broccoli-static-compiler'),
  esTranspiler = require('broccoli-babel-transpiler'),
  compileES6 = require('broccoli-es6-concatenator');

module.exports = function (paths, env){
  var javascriptTree, publicTree, loaderTree;

  javascriptTree = pickFiles(mergeTrees([paths.sourcePath, paths.pluginsPath]), {
    srcDir: '.',
    files: ['**/*.js'],
    destDir: '/'
  });

  loaderTree = pickFiles(__dirname,{
    srcDir: '.',
    files: ['loader.js'],
    destDir: '/'
  });

  javascriptTree = compileES6(mergeTrees([javascriptTree, loaderTree]), {
    loaderFile: 'loader.js',
    inputFiles: ['**/*.js'],
    wrapInEval: false,
    outputFile: '/es6.js'
  });

  javascriptTree = esTranspiler(javascriptTree, {});

  gameTrees = concat(mergeTrees([paths.vendorPath, javascriptTree]), {
    inputFiles:[
      '**/*.js'
    ],
    outputFile: '/game.js'
  });

  if (env === 'production'){
    publicTree = paths.publicPath;
    gameTrees = uglifyJavaScript(gameTrees, {
      mangle: true,
      compress: true
    });
  }else{
    publicTree = injectLivereload(paths.publicPath);
  }

  return mergeTrees([gameTrees, publicTree]);
};