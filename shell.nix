{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
  ];

  shellHook = ''
    docker run -it -v $(pwd):/app yo-code-generator
  '';
}
