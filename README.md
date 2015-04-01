# Pixi.js CLI
A command line interface for pixi.js with ES6 support.

Pixi.js is a super fast HTML 5 2D rendering engine that uses webGL with canvas fallback.

Read more: http://www.pixijs.com/

Please note that this tool is still in beta stages.

##Installation

You need to have npm to run:

`npm install pixijs-cli -g`


##Usage

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

### pixijs update, u
Updates the pixi.js library with the lastest master version on github

**Example:**

`pixijs update`

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
