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

### pixijs plugin, p (search|add|remove|publish) <plugin_name>
Search, adds, removes or publishes a pixi.js plugin
  - search <plugin_name> searches the registry for a plugin
  - add <plugin_name> adds a plugin from the registry to the current project
  - remove <plugin_name> removes an existing plugin from the current project
  - publish <plugin_name> publishes an existing plugin in the project. See documentation on publishing for more details.

**Example:**

`pixijs plugin add object-pool`

### pixijs build, b <options>
Builds the project to the build directory
  - `--path <path>` the build directory [dist/]
  - `--force` force removes exisiting files

**Example:**

`pixijs build`

### pixijs help, --help
Outputs the usage instructions for all commands or the provided command

**Example:**

`pixijs help`

### pixijs clean
Cleans the project temporary build folders

**Example:**

`pixijs clean`
