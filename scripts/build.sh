#!/bin/bash

set -eu

echo "Setup Rustup"
curl https://sh.rustup.rs -sSf | sh

echo "Build"
yarn build

echo "Add _headers"
mv _headers ./dist/_headers
