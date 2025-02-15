# vscode-extension

The Flint extension for VSCode

To enter the `nodejs` docker container, where `yo`, `generator-code` and `vsce` are installed, just enter the nix shell in this projects root directory. If you want to package the extension, you can simply change your directory (within the docker container) to the `flint` directory. When you are within the docker container in the `flint` directory, type `vsce package` to build the VSCode extension.

If you want to debug the extension, change the directory to the `flint` directory and then vscode with this directory as its root. You will be able to press play and vscode then should use the extension in a newly spawned instance of vscode.