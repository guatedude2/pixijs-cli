var Promise = require('rsvp').Promise,
    fs = require('fs'),
    path = require('path');

function matchFirst(string, regexp){
  var matches = string.match(regexp);
  if (matches){
    return matches[1];
  }
  return null;
}

function matchAll(string, regexp){
  var matches;
  var array = [];
  while (matches = regexp.exec(string)){
    array.push(matches[1]);
    string = string.substr(matches.index+ matches[0].length)
  }
  return array;
}

function removeDups(array){
  return array.filter(function(elem, pos) {
    return array.indexOf(elem) == pos;
  });
}

module.exports = {
  parse: function(file){
    var raw = fs.readFileSync(file, {encoding:'utf-8'});
    if (raw){
      var name = matchFirst(raw, /^\s*\*\s*@plugin\s+(.+)$/m);
      var author = matchFirst(raw, /^\s*\*\s*@author\s+(.+)$/m);
      var description = matchFirst(raw, /^\s*\*\s*@description\s+(.+)$/m);
      var email = matchFirst(raw, /^\s*\*\s*@email\s+(.+)$/m);
      var version = matchFirst(raw, /^\s*\*\s*@version\s+(.+)$/m);
      var dependencies = removeDups(matchAll(raw, /^\s*\*\s*@dependency\s+(.+)$/m));

      if (name && email && description && version && author){
        return {
          name: name,
          email: email.toLowerCase(),
          file: path.dirname(file),
          description: description,
          author: author,
          version: version,
          dependencies: dependencies.map(function (e){ return e.trim(); }),
          raw: raw
        };
      }
    }
    return null;
  }
}