#!/bin/bash

# 设置脚本的退出规则，遇到错误立即退出
set -e

# 定义变量
BUILD_DIR="./src-tauri"
RELEASE_DIR="./release"
APK_OUTPUT_PATH="./src-tauri\gen\android\app\build\outputs\apk\universal\release" # APK 默认输出路径
APK_NAME="app-universal-release.apk"                                              # 你可以根据实际情况调整

# 创建 release 目录（如果不存在）
mkdir -p "$RELEASE_DIR"

# 打印开始构建消息
echo "🚀 开始构建 Android 版本的 Tauri 应用..."

# 2. 检查项目类型
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ 错误: Tauri 构建目录 $BUILD_DIR 不存在，请确认 Tauri 配置已完成！"
    exit 1
fi

# 3. 构建 Android 版本
echo "🔧 执行 Tauri Android 构建..."
# cd "$BUILD_DIR"
pnpm tauri android build

# 4. 检查 APK 文件是否生成
if [ ! -f "$APK_OUTPUT_PATH/$APK_NAME" ]; then
    echo "❌ 错误: 构建失败，未在 $APK_OUTPUT_PATH 找到 APK 文件！"
    exit 1
fi

# 5. 移动 APK 到 /release 目录
echo "📂 移动生成的 APK 文件到 $RELEASE_DIR..."
cp "$APK_OUTPUT_PATH/$APK_NAME" "$RELEASE_DIR/"

# 6. 完成
echo "✅ 构建完成！APK 文件已保存到 $RELEASE_DIR/$APK_NAME"
