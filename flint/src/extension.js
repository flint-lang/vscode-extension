const vscode = require("vscode");
const { LanguageClient } = require("vscode-languageclient/node");
const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const os = require("os");

let client;

function findOnPath(cmd) {
  // On Windows use 'where', on POSIX use 'which'
  try {
    const tool = process.platform === "win32" ? "where" : "which";
    const r = child_process.spawnSync(tool, [cmd], { encoding: "utf8" });
    if (r.status === 0 && r.stdout) {
      // take first non-empty line
      const first = r.stdout.split(/\r?\n/).find(Boolean);
      if (first) return first.trim();
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function tryPathVariants(userPath) {
  // normalize
  const p = path.normalize(userPath);
  if (fs.existsSync(p)) return p;

  // On Windows try adding .exe (if not present)
  if (process.platform === "win32" && path.extname(p) === "") {
    const pexe = p + ".exe";
    if (fs.existsSync(pexe)) return pexe;
  }
  return null;
}

function activate(context) {
  const out = vscode.window.createOutputChannel("Flint Language Server");
  const config = vscode.workspace.getConfiguration("flint");
  const enabled = config.get("languageServer.enabled", true);

  if (!enabled) {
    out.appendLine("Flint Language Server disabled in settings.");
    return;
  }

  let flsPath = config.get("languageServer.path", "fls");

  // Resolve the path robustly
  let resolved = null;

  // 1) If the user provided something that looks like a path (contains a separator or is absolute) try it first
  const looksLikePath =
    path.isAbsolute(flsPath) || flsPath.includes(path.sep) || flsPath.includes("/");
  if (looksLikePath) {
    resolved = tryPathVariants(flsPath);
    if (!resolved) {
      out.appendLine(`User-configured path '${flsPath}' not found (after normalizing).`);
      // Try adding .exe on Windows if user didn't
      if (process.platform === "win32" && path.extname(flsPath) === "") {
        const withExe = tryPathVariants(flsPath + ".exe");
        if (withExe) resolved = withExe;
      }
    }
  }

  // 2) If not a path (or previous checks failed), try to resolve via PATH (where/which)
  if (!resolved) {
    const fromPath = findOnPath(flsPath);
    if (fromPath) resolved = fromPath;
  }

  // 3) Try a small list of common locations (POSIX and some Windows common dirs)
  if (!resolved) {
    const candidates = [
      // POSIX
      path.join(os.homedir(), ".local", "bin", "fls"),
      path.join(os.homedir(), "bin", "fls"),
      "/usr/local/bin/fls",
      "/usr/bin/fls",
    ];
    if (process.platform === "win32") {
      const pf = process.env["ProgramFiles"] || "C:\\Program Files";
      const appdataLocal = path.join(os.homedir(), "AppData", "Local");
      candidates.push(
        path.join(pf, "Flint", "fls.exe"),
        path.join(appdataLocal, "Programs", "Flint", "fls.exe"),
        "C:\\fls\\fls.exe"
      );
    }
    for (const c of candidates) {
      const t = tryPathVariants(c);
      if (t) {
        resolved = t;
        break;
      }
    }
  }

  if (!resolved) {
    out.appendLine("Could not resolve 'fls' executable. Please configure 'flint.languageServer.path' (absolute path or ensure it's on PATH).");
    vscode.window.showErrorMessage(
      "Flint Language Server: couldn't find 'fls'. Set 'flint.languageServer.path' to the fls executable (use C:\\\\path\\\\to\\\\fls.exe or C:/path/to/fls.exe on Windows)."
    );
    return;
  }

  out.appendLine(`Using fls at: ${resolved}`);

  const serverOptions = {
    command: resolved,
    args: [],
    options: {
      // Append ~/.local/bin (POSIX) *correctly* using path.delimiter
      env: {
        ...process.env,
        PATH: (process.env.PATH || "") + path.delimiter + path.join(os.homedir(), ".local", "bin"),
      },
    },
  };

  const clientOptions = {
    documentSelector: [{ scheme: "file", language: "flint" }],
    outputChannel: out,
  };

  client = new LanguageClient("flint", "Flint Language Server", serverOptions, clientOptions);

  client.start().catch((error) => {
    const msg = String(error && error.message ? error.message : error);
    out.appendLine("Failed to start fls: " + msg);
    vscode.window.showErrorMessage(
      `Failed to start Flint Language Server: ${msg}\nMake sure 'fls' is installed and the path in settings is correct.`
    );
  });
}

function deactivate() {
  return client?.stop();
}

module.exports = { activate, deactivate };
