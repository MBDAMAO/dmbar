<template>
    <header id="controller-handler" class="fixed w-full" data-tauri-drag-region>
        <div id="controller-container" data-tauri-drag-region>
            <div id="controller-pages" data-tauri-drag-region>
                <el-drawer :z-index="999" v-model="drawer" :with-header="false" size="80%" direction="ltr"
                    custom-class="tailwind-drawer">
                    <div class="h-full flex flex-col justify-between bg-gray-50 shadow-lg rounded-r-lg">
                        <!-- 顶部区域 -->
                        <div class="p-4">
                            <h2 class="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                                菜单
                            </h2>
                            <ul class="space-y-2">
                                <li v-for="item in routes" :key="item.name">
                                    <RouterLink :to="item.path"
                                        class="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                        @click="drawer = false">
                                        {{ item.label }}
                                    </RouterLink>
                                </li>
                            </ul>
                        </div>

                        <!-- 底部区域 -->
                        <div class="p-4 border-t border-gray-200">
                            <button
                                class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                                @click="drawer = false">
                                关闭菜单
                            </button>
                        </div>
                    </div>
                </el-drawer>


                <div class="control-button">
                    <Drawer class="h-full icon" style="margin-left: 16px;" @click="drawer = true"></Drawer>
                </div>
                <!-- Dropdown for Headless UI -->
                <Popover class="relative ml-4" v-if="false">
                    <PopoverButton class="bg-gray-200 hover:bg-gray-300 h-[80%] rounded">
                        Select Page
                        <span class="ml-2">▼</span>
                    </PopoverButton>
                    <transition enter-active-class="transition duration-200 ease-out"
                        enter-from-class="transform opacity-0" enter-to-class="transform opacity-100"
                        leave-active-class="transition duration-150 ease-in" leave-from-class="transform opacity-100"
                        leave-to-class="transform opacity-0">
                        <PopoverPanel class="absolute z-10 bg-white shadow-lg p-4 rounded w-48">
                            <ul>
                                <li v-for="item in routes" :key="item.name" class="hover:bg-gray-100 p-2 rounded">
                                    <RouterLink :to="item.path" class="block text-gray-700">
                                        {{ item.label }}
                                    </RouterLink>
                                </li>
                            </ul>
                        </PopoverPanel>
                    </transition>
                </Popover>
            </div>
            <div id="controller-buttons" data-tauri-drag-region v-if="currentDeviceType == 'desktop'">
                <div class="control-button fix-window">
                    <Pin @click="resize"></Pin>
                </div>
                <div class="control-button minimize">
                    <Min @click="minsize" />
                </div>
                <div class="control-button maximize">
                    <Max @click="toggleMaximize" />
                </div>
                <div class="control-button close">
                    <Close @click="close" />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { Window } from "@tauri-apps/api/window";
import Pin from "@/icons/Pin.vue";
import Min from "@/icons/Min.vue";
import Max from "@/icons/Max.vue";
import Drawer from "../../icons/Drawer.vue";
import Close from "@/icons/Close.vue";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { useDeviceStore } from '@/stores/device.ts';

// 从 store 中获取设备类型
const { currentDeviceType } = useDeviceStore();
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { ref } from "vue";
const drawer = ref(false)
const routes = [
    { name: "crypto", path: "/root/crypto_coin", label: "Crypto Coin" },
    // { name: "words", path: "/root/words", label: "Words" },
    // { name: "translation", path: "/root/translation", label: "Translation" },
    { name: "videos", path: "/root/fast_gpt", label: "videos" },
    // { name: "vpn", path: "/root/vpn", label: "VPN" },
    // { name: "ssh", path: "/root/ssh_monitor", label: "SSH Monitor" },
    // { name: "rss", path: "/root/rss", label: "RSS" },
    { name: "live", path: "/root/live", label: "Live" },
    { name: "settings", path: "/root/settings", label: "settings" },
];

const minsize = async () => {
    const appWindow = Window.getCurrent();
    await appWindow.minimize();
};

const resize = async () => {
    const window = getCurrentWindow();
    await window.setSize(new LogicalSize(1024, 800));
};

const toggleMaximize = async () => {
    const appWindow = Window.getCurrent();
    const isMaximized = await appWindow.isMaximized();

    if (isMaximized) {
        await appWindow.unmaximize();
    } else {
        await appWindow.maximize();
    }
};

const close = async () => {
    const appWindow = Window.getCurrent();
    await appWindow.close();
};
</script>

<style scoped>
.block-col-2 .el-dropdown-link {
    display: flex;
    align-items: center;
}

#controller-handler {}

#controller-container {
    width: 100%;
    height: 15px;
    display: flex;
}

#controller-pages {
    display: flex;
    width: 60%;
}

#controller-buttons {
    display: flex;
    justify-content: flex-end;
    width: 40%;
}

.control-button {
    height: 15px;
    width: 15px;
    cursor: pointer;
    background-color: transparent;
    transition: background-color 0.3s ease;
    margin-right: 5px;
}

.control-button.close:hover {
    background-color: rgba(255, 0, 0, 0.4);
}

.control-button.minimize:hover {
    background-color: rgba(255, 255, 0, 0.4);
}

.control-button.maximize:hover {
    background-color: rgba(0, 255, 0, 0.4);
}

.control-button.fix-window:hover {
    background-color: rgba(255, 165, 0, 0.4);
}
</style>
