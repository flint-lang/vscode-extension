{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
  ];

  shellHook = ''
    # Check if the 'yo-code-generator' image exists. If not, create it
    if ! docker image inspect yo-code-generator > /dev/null 2>&1; then
      echo "Building Docker image 'yo-code-generator'..."
      docker build -t yo-code-generator .
    fi
    docker run -it -v $(pwd):/app yo-code-generator
  '';
}
