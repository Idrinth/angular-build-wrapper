# @idrinth/angular-build-wrapper

This small tool is a drop-in replacement for build related ng commands.
It adds external variables, so that it is easier to use and deploy the same code in multiple locations.
For that a configuration file is generated in /src/configuration.d.ts and /src/configuration.js.
Do not check in the javascript file, it is regenerated every time an ng command is run.

## Wrapped commands

- serve
- build
- test

## Own commands

- help
- create: creates the files initially, so you can work with autocompletion
