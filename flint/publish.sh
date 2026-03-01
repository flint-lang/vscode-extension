#!/usr/bin/env sh

echo "-- Publishing to the VSCode market place..."
vsce publish

echo "-- Publishing to the OpenVSX market place..."
ovsx publish
