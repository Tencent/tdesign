#!/usr/bin/env sh

set -e

npm run build

git checkout gh-pages

cd dist

cp -r assets ../ && rm -rf assets && mv * ../

cd ..

git add -A
git commit -m 'feat: deploy'

git push -f git@github.com:naive-ui/issue-helper.git gh-pages

# 部署到码云
# git push -f git@gitee.com:naive-ui/issue-helper.git main

cd -

git checkout main
