import { defineStore } from 'pinia';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { DeviceType } from '../types/device.ts';

export const useDeviceStore = defineStore('device', () => {
    const deviceType = ref<DeviceType>(DeviceType.Desktop); // 默认设备类型是 desktop

    // 根据窗口宽度更新设备类型
    const updateDeviceType = () => {
        const width = window.innerWidth;
        if (width <= 768) {
            deviceType.value = DeviceType.Mobile; // 手机
        } else if (width <= 1024) {
            deviceType.value = DeviceType.Tablet; // 平板
        } else {
            deviceType.value = DeviceType.Desktop; // 桌面
        }
    };

    // 计算属性：判断当前设备类型
    const isMobile = computed(() => deviceType.value === DeviceType.Mobile);
    const isTablet = computed(() => deviceType.value === DeviceType.Tablet);
    const isDesktop = computed(() => deviceType.value === DeviceType.Desktop);

    // 在组件加载时添加事件监听
    onMounted(() => {
        updateDeviceType(); // 初始化
        window.addEventListener('resize', updateDeviceType);
    });

    // 在组件卸载时移除事件监听
    onUnmounted(() => {
        window.removeEventListener('resize', updateDeviceType);
    });

    return {
        deviceType,
        isMobile,
        isTablet,
        isDesktop,
    };
});
