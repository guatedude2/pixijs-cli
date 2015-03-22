var compileES6 = require('broccoli-es6-concatenator'),
  uglifyJavaScript = require('broccoli-uglify-js'),
  concat = require('broccoli-concat'),
  mergeTrees = require('broccoli-merge-trees');

module.exports = function (paths, env){
  var gameTree = compileES6(mergeTrees([paths.sourcePath, paths.pluginsPath]), {
    loaderFile: 'loader.js',
    inputFiles: ['**/*.js'],
    wrapInEval: false,
    outputFile: '/es6.js'
  });

  gameTrees = concat(mergeTrees([paths.vendorPath, gameTree]), {
    inputFiles:[
      '**/*.js'
    ],
    outputFile: '/game.js'
  });

  if (env === 'production') {
    gameTrees = uglifyJavaScript(gameTrees, {
      mangle: true,
      compress: true
    });
  }
  return mergeTrees([gameTrees, paths.publicPath]);
};