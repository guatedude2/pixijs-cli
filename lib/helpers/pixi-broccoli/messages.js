var listners = {};

module.exports = {
	on: function(id, callback){
		if (!listners[id]) listners[id] = [];
		listners[id].push(callback);
	},
	send: function(id, value){
		if (listners[id]){
			for (var i=0; i<listners[id].length; i++){
				listners[id][i].call(null, value);
			}
		}
	}
};