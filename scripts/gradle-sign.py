import os
import re

BUILD_GRADLE_PATH = "src-tauri/gen/android/app/build.gradle.kts"
IMPORT_ = """
import java.util.Properties
import java.io.FileInputStream
"""
SIGNING_CONFIG = """
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
"""

RELEASE_CONFIG = """
            signingConfig = signingConfigs.getByName("release")"""

def update_gradle_file():
    if not os.path.exists(BUILD_GRADLE_PATH):
        print("build.gradle.kts 文件未找到")
        return

    with open(BUILD_GRADLE_PATH, "r", encoding="utf-8") as file:
        content = file.read()

    content = IMPORT_ + content
    
    # 在 release buildType 添加签名
    pattern = re.compile(r'buildTypes\s*{[\s\S]*?getByName\(\"release\".*?{')

    if pattern.search(content):
        content = pattern.sub(lambda m: m.group(0) + RELEASE_CONFIG, content)
    else:
        print("未找到 buildTypes 代码块")
        return

    pattern = re.compile(r'(android\s*{(?:[^{}]*|{[^{}]*})*?)\bbuildTypes\b')

    if pattern.search(content):
        content = pattern.sub(lambda m: m.group(1) + SIGNING_CONFIG + "\n    buildTypes", content)
    else:
        print("未找到 android 代码块")
        return

    print(content)
    with open(BUILD_GRADLE_PATH, "w", encoding="utf-8") as file:
        file.write(content)

    print("签名配置已成功添加")

if __name__ == "__main__":
    update_gradle_file()
