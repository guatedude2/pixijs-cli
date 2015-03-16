function errorMessage(code){
	switch(code){
		case 10: return "You have to be inside an pixi.js CLI project in order to update a project.";
		case 20: return "Error loading project file: %s";

		case 100: return "No project name specified!";
		case 101: return "Project name must be made up of numbers, letters, underscores and dashes!";
		case 102: return "Project creation failed! Project directory is not empty. Use --force to overwrite.";

		case 103: return "Unable to read pixi.js library!";
		case 104: return "Unable to reach host: %s";
		case 105: return "Unknown error: %s";

		case 106: return "Build project failed! Output directory is not empty. Use --force to overwrite.";

		case 1001: return 'Server Error:\n\tServer status: %s\n\tServer response: %s\n';
		case 1002: return 'Parse Error: %s %s';
		case 1003: return 'Parse Error: %s\nFile: %s\nStack: %s';

		default:
			return "Uncaught exception: %s";
	}
}

function replaceString(string, replacements){
	var i = 0;
	return string.replace(/\%s/g, function (){
		return replacements[++i];
	});
}

module.exports = function (code){
	return {
		code: code,
		message: replaceString(errorMessage(code), arguments)
	};
};