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
            url: 'https://d1--cn-gotcha04.bilivideo.com/live-bvc/233239/live_1264695936_58616662.flv?expires=1733489670&len=0&oi=1899428998&pt=web&qn=10000&trid=1000611fdc1f3a1d16ef597c4e496a6752e5&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha04&sign=0e4c2c29eef4f29546f26f4821f85b83&site=e2d48bc24d8f6d697da5419b5f3309d2&free_type=0&mid=330838998&sche=ban&trace=4&isp=fx&rg=SouthWest&pv=Sichuan&hot_cdn=0&sl=1&p2p_type=1&sk=a1b36de8809966c929f1b9ecf307cbd0&info_source=origin&deploy_env=prod&source=puv3_onetier&score=1&suffix=origin&origin_bitrate=333531&pp=rtmp&vd=bc&src=puv3&order=2'
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