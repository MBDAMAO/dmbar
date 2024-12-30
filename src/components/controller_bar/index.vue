<template>
    <div id="controller-handler" class="fixed w-full h-[25px]" data-tauri-drag-region>
        <div id="controller-container" data-tauri-drag-region>
            <div id="controller-pages" data-tauri-drag-region>
                <SideMenu ref="side"></SideMenu>
                <div class="control-button p-1 pl-3" @click="changeStatus">
                    <Drawer class="h-full icon"></Drawer>
                </div>
            </div>
            <div id="controller-buttons" data-tauri-drag-region v-if="currentDeviceType == 'desktop'">
                <div class="control-button minimize p-1.5" @click="reload()">
                    <Refresh></Refresh>
                </div>
                <div class="control-button fix-window p-1.5" @click="fix">
                    <Pin v-if="!alwaysOnTop"></Pin>
                    <Unpin v-if="alwaysOnTop"></Unpin>
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
import SideMenu from "./SideMenu.vue";
import Close from "@/icons/Close.vue";
import { useDeviceStore } from '../../stores/device.ts';
import { useRouter } from "vue-router";
import Unpin from "../../icons/Unpin.vue";
const { currentDeviceType } = useDeviceStore();
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ref } from "vue";
import Refresh from "../../icons/Refresh.vue";
const router = useRouter();
const side = ref(null);
const reload = async () => {
    router.push('/start/start_page')
}
function changeStatus() {
    if (side.value == null) return;
    side.value.changeStatus();
}
const minsize = async () => {
    const appWindow = Window.getCurrent();
    await appWindow.minimize();
};
let alwaysOnTop = ref(false);
const fix = async () => {
    const window = getCurrentWindow();
    await window.setAlwaysOnTop(!alwaysOnTop.value);
    alwaysOnTop.value = !alwaysOnTop.value;
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
