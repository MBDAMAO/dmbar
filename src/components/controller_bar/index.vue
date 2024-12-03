<template>
    <div id="controller-handler" data-tauri-drag-region>
        <div id="controller-container" data-tauri-drag-region>
            <div id="controller-pages" data-tauri-drag-region>
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/crypto_coin">
                        <div style="height: 100%; width: 100%;">crypto</div>
                    </RouterLink>
                </div>
            </div>
            <div id="controller-pages">
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/words">
                        <div style="height: 100%; width: 100%;">words</div>
                    </RouterLink>
                </div>
            </div>
            <div id="controller-pages">
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/translation">
                        <div style="height: 100%; width: 100%;">words</div>
                    </RouterLink>
                </div>
            </div>
            <div id="controller-buttons">
                <Pin @click="resize"></Pin>
                <Min @click="minsize" />
                <Max @click="toggleMaximize" />
                <Close @click="close" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { LogicalSize, PhysicalSize, Window } from "@tauri-apps/api/window";
import Pin from "@/icons/Pin.vue";
import Min from "@/icons/Min.vue";
import Max from "@/icons/Max.vue";
import Close from "@/icons/Close.vue";
import Unpin from "../../icons/Unpin.vue";

const minsize = async () => {
    const appWindow = Window.getCurrent();
    await appWindow.minimize();
};

const resize = async () => {
    const appWindow = Window.getCurrent();
    await appWindow.setSize(new PhysicalSize(800, 600))
}

const toggleMaximize = async () => {
    const appWindow = Window.getCurrent();
    const isMaximized = await appWindow.isMaximized();

    if (isMaximized) {
        await appWindow.unmaximize();  // 如果已最大化，则恢复
    } else {
        await appWindow.maximize();    // 如果未最大化，则最大化
    }
};
const close = async () => {
    const appWindow = Window.getCurrent();
    await appWindow.close();
};
</script>
<style scoped>
#controller-handler {
    display: absolute;
}

#controller-container {
    width: 100%;
    height: 20px;
    display: flex;
}

#controller-pages {
    display: flex;
    background-color: aquamarine;
    width: 60%;
}

#controller-buttons {
    display: flex;
    width: 40%;
}
</style>