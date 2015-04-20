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

		case 107: return "Please provide a keyword to search the plugin registry.";
		case 108: return "A plugin filename must be provided.";
		case 109: return "\"%s\" does not exist in the registry.";
		case 110: return "One or more dependencies could not be downloaded";
		case 111: return "Plugin \"%s\" does not exist in project.";
		case 112: return "Plugin file does not exist.";

		case 120: return "Unable to publish plugin \"%s\". Plugin is missing @description, @version, @author and @dependencies if any. Read documentaion for more details.";


		case 1001: return 'Server Error:\n\tServer status: %s\n\tServer response: %s\n';
		case 1002: return 'Parse Error: %s %s';
		case 1003: return 'Parse Error: %s\nFile: %s\nStack: %s';
		case 1004: return 'Server Error:\n\t%s';
		case 1005: return 'Unable to reach plugin registry server';

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