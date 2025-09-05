const vscode = require("vscode");
const { LanguageClient } = require("vscode-languageclient/node");
const path = require("path");
const os = require("os");

let client;

function activate(context) {
  const config = vscode.workspace.getConfiguration("flint");
  const enabled = config.get("languageServer.enabled", true);

  if (!enabled) {
    console.log("Flint Language Server is disabled");
    return;
  }

  let flsPath = config.get("languageServer.path", "fls");

  // If it's just 'fls', try to find it in common locations
  if (flsPath === "fls") {
    const possiblePaths = [
      "fls", // Try PATH first
      path.join(os.homedir(), ".local", "bin", "fls"),
      path.join(os.homedir(), "bin", "fls"),
      "/usr/local/bin/fls",
      "/usr/bin/fls",
    ];
    flsPath = possiblePaths[0]; // Start with PATH
  }

  const serverOptions = {
    command: flsPath,
    args: [],
    options: {
      env: { ...process.env, PATH: process.env.PATH + ":" + path.join(os.homedir(), ".local", "bin") },
    },
  };

  const clientOptions = {
    documentSelector: [{ scheme: "file", language: "flint" }],
    outputChannelName: "Flint Language Server",
  };

  client = new LanguageClient("flint", "Flint Language Server", serverOptions, clientOptions);

  client.start().catch((error) => {
    vscode.window.showErrorMessage(
      `Failed to start Flint Language Server: ${error.message}\n` +
        `Make sure 'fls' is installed and in your PATH, or configure the path in settings.`,
    );
  });
}

function deactivate() {
  return client?.stop();
}

module.exports = { activate, deactivate };
