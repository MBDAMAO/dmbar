// src/components/index.ts

// 使用 import.meta.glob 导入所有 .vue 文件
const components = import.meta.glob('./*.vue');

// 创建一个对象来存储组件
const componentModules: Record<string, any> = {};

// 遍历组件并导入
for (const [path, component] of Object.entries(components)) {
    // 提取组件名称
    const componentName = path.split('/').pop()?.replace('.vue', '');

    if (componentName) {
        componentModules[componentName] = component;
    }
}

// 导出所有组件
export default componentModules;