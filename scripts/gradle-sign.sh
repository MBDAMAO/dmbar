#!/bin/bash

# 定义 Gradle 配置文件路径
GRADLE_FILE="src-tauri/gen/android/app/build.gradle.kts"

# 添加导入（如果尚未添加）
if ! grep -q "import java.util.Properties" "$GRADLE_FILE"; then
  echo "import java.util.Properties" >> "$GRADLE_FILE"
  echo "import java.io.FileInputStream" >> "$GRADLE_FILE"
fi

# 在 buildTypes 之前添加签名配置
if ! grep -q "signingConfigs" "$GRADLE_FILE"; then
  cat <<EOL >> "$GRADLE_FILE"

signingConfigs {
    create("release") {
        val keystorePropertiesFile = rootProject.file("keystore.properties")
        val keystoreProperties = Properties()
        if (keystorePropertiesFile.exists()) {
            keystoreProperties.load(FileInputStream(keystorePropertiesFile))
        }

        keyAlias = keystoreProperties["keyAlias"] as String
        keyPassword = keystoreProperties["keyPassword"] as String
        storeFile = file(keystoreProperties["storeFile"] as String)
        storePassword = keystoreProperties["storePassword"] as String
    }
}
EOL
fi

# 确保不会覆盖已有的 buildTypes 配置，只在 release 配置中添加签名配置
# 只添加签名配置，不影响 isMinifyEnabled 和 proguardFiles 配置
sed -i '/getByName("release") {/a\
    signingConfig = signingConfigs.getByName("release")\
' "$GRADLE_FILE"
