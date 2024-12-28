import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { platform } from "@tauri-apps/plugin-os";

enum DeviceType {
  Mobile = "mobile",
  Desktop = "desktop",
}

export const useDeviceStore = defineStore("device", () => {
  const osPlatform = ref<string>("unknown");
  const deviceType = ref<DeviceType>(DeviceType.Mobile);

  const fetchPlatform = () => {
    try {
      osPlatform.value = platform();
      updateDeviceType();
    } catch (error) {
      console.error("Failed to fetch platform:", error);
    }
  };

  const updateDeviceType = () => {
    if (osPlatform.value == "android" || osPlatform.value == "ios") {
      deviceType.value = DeviceType.Mobile;
    } else {
      deviceType.value = DeviceType.Desktop;
    }
  };

  fetchPlatform();

  const currentDeviceType = computed(() => deviceType.value);

  return {
    osPlatform,
    currentDeviceType,
  };
});
