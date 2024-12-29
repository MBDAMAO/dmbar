<template>
    <div id="controller-handler" class="fixed w-full h-[25px]" data-tauri-drag-region>
        <div id="controller-container" data-tauri-drag-region>
            <div id="controller-pages" data-tauri-drag-region>
                <el-drawer v-model="drawer" :with-header="false" size="80%" direction="ltr" append-to-body
                    custom-class="tailwind-drawer">
                    <div class="h-full flex flex-col justify-between bg-gray-50 shadow-lg rounded-r-lg">
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

                        <div class="p-4 border-t border-gray-200">
                            <button
                                class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                                @click="drawer = false">
                                关闭菜单
                            </button>
                        </div>
                    </div>
                </el-drawer>
                <div class="control-button p-1">
                    <Drawer class="h-full icon" style="margin-left: 16px;" @click="drawer = true"></Drawer>
                </div>
            </div>
            <div id="controller-buttons" data-tauri-drag-region v-if="currentDeviceType == 'desktop'">
                <div class="control-button fix-window p-1.5" @click="resize">
                    <Pin></Pin>
                </div>
                <div class="control-button minimize p-1" @click="minsize">
                    <Min />
                </div>
                <div class="control-button maximize p-1.5" @click="toggleMaximize">
                    <Max />
                </div>
                <div class="control-button close p-1" @click="close">
                    <Close />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Window } from "@tauri-apps/api/window";
import Pin from "@/icons/Pin.vue";
import Min from "@/icons/Min.vue";
import Max from "@/icons/Max.vue";
import Drawer from "../../icons/Drawer.vue";
import Close from "@/icons/Close.vue";
import { useDeviceStore } from '../../stores/device.ts';

const { currentDeviceType } = useDeviceStore();
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { ref } from "vue";
const drawer = ref(false)
const routes = [
    { name: "crypto", path: "/root/crypto_coin", label: "加密货币" },
    { name: "videos", path: "/root/fast_gpt", label: "视频平台" },
    { name: "live", path: "/root/live", label: "直播" },
    { name: "settings", path: "/root/settings", label: "设置" },
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


#controller-container {
    width: 100%;
    height: 100%;
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
    height: 100%;
    aspect-ratio: 4/3;
    cursor: pointer;
    background-color: transparent;
    transition: background-color 0.3s ease;
}

.control-button.close:hover {
    background-color: rgba(255, 0, 0, 0.6);
}

.control-button.minimize:hover {
    background-color: rgba(255, 255, 255, 0.4);
}

.control-button.maximize:hover {
    background-color: rgba(255, 255, 255, 0.4);
}

.control-button.fix-window:hover {
    background-color: rgba(255, 255, 255, 0.4);
}
</style>
