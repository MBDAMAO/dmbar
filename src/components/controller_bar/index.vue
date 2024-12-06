<template>
    <div id="controller-handler" data-tauri-drag-region>
        <div id="controller-container" data-tauri-drag-region>
            <div id="controller-pages" data-tauri-drag-region>
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/crypto_coin">
                        <div style="height: 100%; width: 100%;">c</div>
                    </RouterLink>
                </div>
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/words">
                        <div style="height: 100%; width: 100%;">w</div>
                    </RouterLink>
                </div>
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/translation">
                        <div style="height: 100%; width: 100%;">t</div>
                    </RouterLink>
                </div>
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/fast_gpt">
                        <div style="height: 100%; width: 100%;">g</div>
                    </RouterLink>
                </div>
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/vpn">
                        <div style="height: 100%; width: 100%;">v</div>
                    </RouterLink>
                </div>
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/ssh_monitor">
                        <div style="height: 100%; width: 100%;">s</div>
                    </RouterLink>
                </div>
                <div style="height: 100%; background-color: azure;">
                    <RouterLink to="/rss">
                        <div style="height: 100%; width: 100%;">rss</div>
                    </RouterLink>
                </div>
            </div>
            <div id="controller-buttons">
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
import Unpin from "../../icons/Unpin.vue";
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';

const minsize = async () => {
    const appWindow = Window.getCurrent();
    await appWindow.minimize();
};

const resize = async () => {
    let window = getCurrentWindow();
    let res = await window.setSize(new LogicalSize(1024, 800));
    // console.log(await window.innerSize())
    // console.log(await window.outerSize())
    console.log(res)
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
#controller-handler {}

#controller-container {
    width: 100%;
    height: 15px;
    display: flex;
    cursor: move;
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
    /* Default background color */
    transition: background-color 0.3s ease;
    /* Smooth transition for background color */
}

/* Specific hover colors for each button */
.control-button.close:hover {
    background-color: rgba(255, 0, 0, 0.4);
    /* Red for close button */
}

.control-button.minimize:hover {
    background-color: rgba(255, 255, 0, 0.4);
    /* Yellow for minimize button */
}

.control-button.maximize:hover {
    background-color: rgba(0, 255, 0, 0.4);
    /* Green for maximize button */
}

.control-button.fixed:hover {
    background-color: rgba(255, 165, 0, 0.4);
    /* Orange for fixed button */
}
</style>