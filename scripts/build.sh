#!/bin/bash

set -eu

echo "Setup Rustup"
curl https://sh.rustup.rs -sSf | sh -s -- -y
export PATH="$PATH:$HOME/.cargo/bin"

echo "Build"
yarn build

echo "Add _headers"
mv _headers ./dist/_headers
