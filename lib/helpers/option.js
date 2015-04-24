module.exports = function (args, match, type, defaultValue){
  match = (match instanceof Array ? match : [match]);
  for(var i=0; i<args.length; i++){
    if (match.indexOf(args[i])>=0){
      switch(type){
        case 'number':
          return !isNaN(args[i+1]) ? args[i+1] : defaultValue;
        case 'boolean':
          return args[i+1]===true || args[i+1]===false ? args[i+1] : defaultValue;
        case 'string':
          return typeof(args[i+1])=='string' ? args[i+1] : defaultValue;
        case 'array':
          var items = [];
          for(t=i+1; t<args.length; t++){
            if (!!~args[t].search(/^-/)){
              break;
            }
            items.push(args[t]);
          }
          return items;
        default:
          return defaultValue || true;
      }
    }
  }
  return defaultValue || false;
};