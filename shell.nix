{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
  ];

  shellHook = ''
    # Check if the 'flint-vscode-extension' image exists. If not, create it
    if ! docker image inspect flint-vscode-extension > /dev/null 2>&1; then
      echo "Building Docker image 'flint-vscode-extension'..."
      docker build -t flint-vscode-extension .
    fi
    docker run -it -v $(pwd):/app flint-vscode-extension
  '';
}
