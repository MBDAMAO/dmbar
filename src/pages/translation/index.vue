<template>
    <div>
        <video ref="video" controls autoplay></video>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import flvjs from 'flv.js';

const video = ref<HTMLVideoElement | null>(null);

onMounted(() => {
    if (video.value && flvjs.isSupported()) {
        const player = flvjs.createPlayer({
            type: 'flv',
            url: 'http://tx.flv.huya.com/src/1182498550-1182498550-5078792599817420800-2365120556-10057-A-0-1-imgplus.flv?sv=2110211124&ver=1&uid=1468441917181&uuid=2828704052&seqid=3201665971356&t=102&ctype=tars_mp&wsSecret=bf88a794b078fbdb2a3052bb44ac0576&wsTime=675037f5&fs=bgct'
        });
        player.attachMediaElement(video.value);
        player.load();
        player.play();
    }
});
</script>

<style scoped>
video {
    width: 100%;
    height: auto;
}
</style>