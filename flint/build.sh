#!/bin/bash

# Build script for Flint VSCode extension
# Usage: nix-shell -> cd flint -> ./build.sh

set -e

echo "Building Flint VSCode extension..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Package the extension
echo "Packaging extension..."
vsce package

echo "Build complete!"
