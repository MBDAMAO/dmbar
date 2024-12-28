import os
import shutil

# 定义路径
res_path = '../../src-tauri/gen/android/app/src/main/res'
icons_path = '../../src-tauri/src-tauri/icons/android'

# 需要删除的目录列表
mipmap_dirs = [
    'mipmap-hdpi',
    'mipmap-mdpi',
    'mipmap-xhdpi',
    'mipmap-xxhdpi',
    'mipmap-xxxhdpi'
]

def delete_mipmap_folders():
    for folder in mipmap_dirs:
        target_path = os.path.join(res_path, folder)
        if os.path.exists(target_path):
            shutil.rmtree(target_path)
            print(f"Deleted: {target_path}")
        else:
            print(f"Not found: {target_path}")

def copy_mipmap_folders():
    for folder in mipmap_dirs:
        source_path = os.path.join(icons_path, folder)
        target_path = os.path.join(res_path, folder)
        
        if os.path.exists(source_path):
            shutil.copytree(source_path, target_path)
            print(f"Copied: {source_path} -> {target_path}")
        else:
            print(f"Source not found: {source_path}")

if __name__ == "__main__":
    delete_mipmap_folders()
    copy_mipmap_folders()
    print("Operation completed.")
