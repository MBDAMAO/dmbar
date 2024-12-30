#!/bin/bash

# 获取当前版本号
current_version=$(jq -r .version package.json)

# 将版本号拆分为数组
ios=(${current_version//./ })

# 版本号递增
new_version="${ios[0]}.${ios[1]}.$((${ios[2]} + 1))"

# 修改 package.json
jq --arg v "$new_version" '.version = $v' package.json >temp.json && mv temp.json package.json

# 修改 src-tauri/tauri.config.json
jq --arg v "$new_version" '.version = $v' src-tauri/tauri.conf.json >temp.json && mv temp.json src-tauri/tauri.conf.json

# 设置 tag 名称
tag="v$new_version"

执行 Git 操作
git add .
git commit -m "Bump version to $new_version"
git checkout release
git merge main
git push
git tag $tag
git push origin $tag
git checkout main

# 输出新版本号
echo "Version updated to $new_version and tagged as $tag"
