#!/usr/bin/env sh

set -e

npm run build

git checkout gh-pages

rm -rf issue-helper/assets

cd dist

cp -r assets ../issue-helper/ && rm -rf assets && mv * ../issue-helper/

cd ..
