# Pixi.js CLI
A command line interface for Pixi.js with ES6 support and Pixi.js plugins that facilitate game development.

##What is Pixi.js?
Pixi.js is a super fast HTML 5 2D rendering engine that uses webGL with canvas fallback.

Read more: http://www.pixijs.com/

##What plugins are available?

Plugin documentation coming soon at www.pixijs-cli.com:3000/docs


##How do I install Pixi.js CLI?

You need to have npm to run:

`npm install pixijs-cli -g`

* Please note that this tool is still in beta stages.



##How do I use Pixi.js CLI?

`pixijs <command (Default: help)>`



### pixijs create, c <name>
Creates a new pixi.js CLI project
  - `--path <path>` the path to create the new project
  - `--force` overwrites exisiting files

**Example:**

`pixijs create MyPixiProject`



### pixijs serve, s <options>
Starts an http server with LiveReload
  - `--port <port>` the port to bind to [4200]
  - `--host <host>` the host to bind to [localhost]
  - `--live-reload-port <port>` the port to start LiveReload on [35729]

**Example:**

`pixijs serve --port 9999`



### pixijs addon (search|add|remove|publish) <plugin_name>
Search, adds, removes or publishes a pixi.js plugin
  - `search <plugin_name>` searches the registry for a plugin
  - `add <plugin_name>` adds a plugin from the registry to the current project
  - `remove <plugin_name>` removes an existing plugin from the current project
  - `publish <plugin_name>` publishes an existing plugin in the project. See documentation on publishing for more details.

**Example:**

`pixijs addon add object-pool`



### pixijs platform (list | ls | add | remove | rm | update | up) <options>
Adds, remove or list cordova platforms
  - `[list | ls]` list all platforms for which the project will build
  - `add <platform> [<platform> ...]` add one (or more) platforms as a build target for the project
  - `[remove | rm] <platform> [<platform> ...]` removes one (or more) platform build targets from the project
  - `[update | up] <platform>` updates the Cordova version used for the given platform

**Example:**

`pixijs platform add ios android`



### pixijs run [<platforms>] <options>
Launches the project on the provided platforms (Note: Will launch on all projects if not platform is provided)
  - `--debug` enables debug mode when running
  - `--release` creates a release of the project before running it
  - `--device` launches the project on connected devices of the selected platforms
  - `--emulator` launches the project on the selected platform emulator if available
  - `--nobuild` launches the project without rebuilding the project
  - `--list` lists all emulators and devices available for the selected platform

**Example:**

`pixijs run ios --device`



### pixijs compile [<platforms>] <options>
Comile the project on the provided platforms (Note: Will compile on all projects if not platform is provided)
  - `--debug` enables debug mode when running
  - `--release` creates a release of the project before running it
  - `--device` launches the project on connected devices of the selected platforms
  - `--emulator` launches the project on the selected platform emulator if available
  - `--nobuild` launches the project without rebuilding the project
  - `--list` lists all emulators and devices available for the selected platform

**Example:**

`pixijs compile android --release`



### pixijs plugin (list | ls | add | remove | rm | search | save) <plugin_name>
Adds, remove, list or searches a cordova plugin
  - `[list | ls]` list all platforms for which the project will build
  - `add <plugin_name> [<plugin_name> ...]` add one (or more) cordova plugins to the project
  - `[remove | rm] <plugin_name> [<plugin_name> ...]` removes one (or more) cordova plugins to the project
  - `search <plugin_name>` searches the cordova plugin repository for the given plugin name keyword
  - `save <plugin_name>` save the versions/folders/git-urls of currently installed cordova plugins into the project config.xml

**Example:**

`pixijs plugin search maps`



### pixijs help, --help
Outputs the usage instructions for all commands or the provided command

**Example:**

`pixijs help`



### pixijs clean
Cleans the project temporary build folders

**Example:**

`pixijs clean`

