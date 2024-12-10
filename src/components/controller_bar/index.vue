<template>
    <div id="controller-handler" data-tauri-drag-region>
        <div id="controller-container" data-tauri-drag-region>
            <div id="controller-pages" data-tauri-drag-region>
                <Popover class="relative">
                    <PopoverButton>Solutions</PopoverButton>
                    <transition enter-active-class="transition duration-200 ease-out"
                        enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition duration-150 ease-in"
                        leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                        <PopoverPanel class="absolute z-10">
                            <div class="grid grid-cols-2">
                                <a href="/analytics">Analytics</a>
                                <a href="/engagement">Engagement</a>
                                <a href="/security">Security</a>
                                <a href="/integrations">Integrations</a>
                            </div>

                            <!-- <img src="/solutions.jpg" alt="" /> -->
                        </PopoverPanel>
                    </transition>
                </Popover>
                <!-- Dropdown for Headless UI -->
                <Popover class="relative ml-4">
                    <PopoverButton class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
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
                <el-col :span="8">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            Select Page
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="item in routes" :key="item.name">
                                    <RouterLink :to="item.path" style="width: 100%; display: block; height: 10px;">
                                        {{ item.label }}
                                    </RouterLink>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-col>
            </div>
            <div id="controller-buttons" data-tauri-drag-region>
                <div class="control-button fixed">
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
    </div>
</template>

<script setup lang="ts">
import { Window } from "@tauri-apps/api/window";
import Pin from "@/icons/Pin.vue";
import Min from "@/icons/Min.vue";
import Max from "@/icons/Max.vue";
import Close from "@/icons/Close.vue";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

const routes = [
    { name: "crypto", path: "/crypto_coin", label: "Crypto Coin" },
    { name: "words", path: "/words", label: "Words" },
    { name: "translation", path: "/translation", label: "Translation" },
    { name: "fast_gpt", path: "/fast_gpt", label: "Fast GPT" },
    { name: "vpn", path: "/vpn", label: "VPN" },
    { name: "ssh", path: "/ssh_monitor", label: "SSH Monitor" },
    { name: "rss", path: "/rss", label: "RSS" },
    { name: "live", path: "/live", label: "Live" },
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

.control-button.fixed:hover {
    background-color: rgba(255, 165, 0, 0.4);
}
</style>
