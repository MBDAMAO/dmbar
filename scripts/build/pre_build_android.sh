#!/bin/bash

ORIGINAL_DIR=$(pwd)

cd "$(dirname "$0")"

python ./gradle-sign.py

python ./add-android-icons.py

cd "$ORIGINAL_DIR"
