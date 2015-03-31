var Watcher = require('./watcher');
var middleware = require('./middleware');
var http = require('http');
var tinylr = require('tiny-lr');
var connect = require('connect');
var messages = require('./messages');

exports.serve = serve;
function serve (builder, options) {
  options = options || {};

  var stoud = options.stdout || process.stdout;

  stoud.write('Serving on http://' + options.host + ':' + options.port + '\n\n');

  var watcher = options.watcher || new Watcher(builder, {verbose: true, livereload: { host: options.host, port: options.liveReloadPort } });

  var app = connect().use(middleware(watcher));

  var server = options.server || http.createServer(app);

  // We register these so the 'exit' handler removing temp dirs is called
  function cleanupAndExit() {
    builder.cleanup().catch(function(err) {
      //console.error('Cleanup error:')
      //console.error(err && err.stack ? err.stack : err)
      throw err;
    })
    .finally(function (){
      server.close();
      livereloadServer.close();
      messages.send('server', 'closed');
    });
  }
  if (!options.testing){
    process.on('SIGINT', cleanupAndExit);
    process.on('SIGTERM', cleanupAndExit);
  }

  var livereloadServer = options.livereloadServer || new tinylr.Server();
  livereloadServer.listen(options.liveReloadPort, function (err) {
    if(err) {
      throw err;
    }
  });

  var liveReload = function() {
    // Chrome LiveReload doesn't seem to care about the specific files as long
    // as we pass something.
    livereloadServer.changed({body: {files: ['livereload_dummy']}});
  };

  watcher.on('change', function(results) {
    stoud.write('Built - ' + Math.round(results.totalTime / 1e6) + ' ms @ ' + new Date().toString()+'\n');
    messages.send('server', 'ready');
    liveReload();
  });

  watcher.on('error', function(err) {
    stoud.write('Built with error:\n');
    // Should also show file and line/col if present; see cli.js
    if (err.file) {
      stoud.write('File: ' + err.file+'\n');
    }
    stoud.write(err.stack+'\n\n');
    liveReload();
  });

  messages.on('server', function(value){
    if (value==='kill') cleanupAndExit();
  });

  server.listen(parseInt(options.port, 10), options.host);

  return server;
}
