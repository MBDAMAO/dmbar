<template>
    <div class="flex flex-col h-full w-full overflow-x-hidden">
        <Background :canvas="canvas" />
        <TopBar :showTopBar="showTopBar" @go-back="goBack" @resetTimeout="resetHideTimeout" />

        <div class="relative flex flex-col h-full w-full overflow-hidden">
            <OverlayPause v-show="!playing" @click="change()" />

            <video ref="rv" class="h-[calc(100%-46px)] w-full" @click="change()" @mousemove="resetHideTimeout"
                @timeupdate="update()"></video>

            <ProgressBar :progressWidth="progressWidth" @seek="seek" />
            <VideoControls :playing="playing" :timeNow="timeNow" :duration="duration" @change="change()"
                @refresh="refresh()" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Background from './components/Background.vue';
import TopBar from './components/TopBar.vue';
import OverlayPause from './components/OverlayPause.vue';
import VideoControls from './components/VideoControls.vue';
import ProgressBar from './components/ProgressBar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const rv = ref<HTMLVideoElement | null>(null);
const playing = ref(true);
const showTopBar = ref(true);
const progressWidth = ref('0%');
const timeNow = ref("00:00");
const duration = ref("00:00");
const canvas = ref<HTMLCanvasElement | null>(null);

let hideTimeout: ReturnType<typeof setTimeout>;

const resetHideTimeout = async () => {
    clearTimeout(hideTimeout);
    showTopBar.value = true;
    hideTimeout = setTimeout(() => {
        showTopBar.value = false;
    }, 3000);
};
async function update() {
    const currentTime = rv.value?.currentTime || 0;
    const duration = rv.value?.duration || 1;  // 避免除以0
    const percentage = (currentTime / duration) * 100;
    progressWidth.value = `${percentage}%`;

    timeNow.value =
        Math.floor(currentTime / 60).toString().padStart(2, '0') + ":" +
        Math.floor(currentTime % 60).toString().padStart(2, '0');
}
const goBack = async () => {
    router.go(-1);
};

function change() {
    playing.value = !playing.value;
}

function refresh() {
    console.log('Refresh video');
}

function seek(percentage: number) {
    console.log(`Seek to ${percentage * 100}%`);
}
</script>
