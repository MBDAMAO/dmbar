import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { platform } from '@tauri-apps/plugin-os';

// 定义设备类型常量
enum DeviceType {
    Mobile = 'mobile',
    Desktop = 'desktop',
}

export const useDeviceStore = defineStore('device', () => {
    const osPlatform = ref<string>('unknown'); // 当前操作系统平台
    const deviceType = ref<DeviceType>(DeviceType.Desktop); // 默认设备类型为 desktop

    // 获取操作系统平台
    const fetchPlatform = async () => {
        try {
            osPlatform.value = await platform();
            updateDeviceType(); // 根据操作系统更新设备类型
        } catch (error) {
            console.error('Failed to fetch platform:', error);
        }
    };

    // 根据操作系统平台判断设备类型
    const updateDeviceType = () => {
        // 判断是否为移动设备
        if (osPlatform.value == 'android' || osPlatform.value == 'ios') {
            deviceType.value = DeviceType.Mobile; // 移动设备
        } else {
            deviceType.value = DeviceType.Desktop; // 桌面设备
        }
    };

    // 在组件加载时初始化
    onMounted(() => {
        fetchPlatform();
    });

    // 返回当前设备类型
    const currentDeviceType = computed(() => deviceType.value);

    return {
        osPlatform,
        currentDeviceType, // 返回设备类型（"mobile" 或 "desktop"）
    };
});
