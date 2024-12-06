<template>
    <div class="videoContainer">
        <div class="pre-back"></div>
        <div class="shadow"></div>
        <div class="background">
            <canvas id="canvas" class="canvas" ref="canvas"></canvas>
        </div>
        <div class="vbox">
            <div class="topPlay" @click="change()" v-show="!playing">
                <Pause />
            </div>
            <div class="details" data-tauri-drag-region></div>
            <div class="videoBlock">
                <video class="videoEntity" ref="rv" @click="change()" data-tauri-drag-region>
                </video>
                <div class="controller">
                    <div class="progressBar" ref="progressBar">
                        <div class="progressBackground">
                            <div class="progressNow" ref="progressNow"></div>
                        </div>
                    </div>
                    <div class="controlItems">
                        <div class="left">
                            <div class="playButton" @click="change()">
                                <Pause2 v-show="!playing" />
                                <Play v-show="playing" />
                            </div>
                            <div class="playButton" @click="refresh()">
                                <Refresh></Refresh>
                            </div>
                            <div class="playButton" @click="draw()">
                                <Link />
                            </div>
                            <!-- <div class="timeDetails">{{ timeNow }} {{ liveStatus }}</div> -->
                        </div>
                        <div class="right"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Play from '@/icons/Play.vue';
import Pause from '@/icons/Pause.vue';
import Pause2 from '@/icons/Pause2.vue';
import Refresh from '../../icons/Refresh.vue';
import flvjs from 'flv.js';
import Link from '../../icons/Link.vue';
// 播放状态和时间显示
const playing = ref(true);
const timeNow = ref("00:00");
const liveStatus = ref("");

// 视频和画布引用
const canvas = ref<HTMLCanvasElement | null>(null);
const rv = ref<HTMLVideoElement | null>(null);
const progressNow = ref<HTMLDivElement | null>(null);

// 播放/暂停切换
function change() {
    draw();
    playing.value = !playing.value;
    if (playing.value) {
        play();
    } else {
        pause();
    }
}

// 播放与暂停控制
function play() {
    playing.value = true;
    rv.value?.play();
}
function pause() {
    playing.value = false;
    rv.value?.pause();
}
function refresh() {
    if (rv.value) {
        const videoElement = rv.value;
        pause();
        let end = videoElement.buffered.end(0) - 1;
        videoElement.currentTime = end;
        play();
    }
}

// 更新时间
function update() {
    const now = new Date();
    timeNow.value = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    liveStatus.value = "Live";
}

// 画布更新背景
function draw() {
    if (!rv.value || !canvas.value) return;
    const context = canvas.value.getContext("2d");
    canvas.value.width = rv.value.videoWidth;
    canvas.value.height = rv.value.videoHeight;
    if (context) {
        context.drawImage(rv.value, 0, 0, canvas.value.width, canvas.value.height);
        canvas.value.style.transform = "scale(1.2)";
        canvas.value.style.filter = "blur(30px)";
    }
}

// 初始化直播流
onMounted(() => {
    if (rv.value && flvjs.isSupported()) {
        const player = flvjs.createPlayer({
            type: 'flv',
            url: 'https://d1--cn-gotcha07.bilivideo.com/live-bvc/508268/live_544266238_1919984.flv?expires=1733590899&len=0&oi=3525928160&pt=web&qn=10000&trid=10002ece1a6c4ca9bfdc2487962fb3675471&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha07&sign=dd90961379462d9613e0d6d637879b44&site=3685e88fc5104bd69ae0aa09a47359e9&free_type=0&mid=330838998&sche=ban&trace=4&isp=fx&rg=SouthWest&pv=Sichuan&info_source=origin&score=37&suffix=origin&hot_cdn=0&sl=1&pp=rtmp&source=puv3_onetier&sk=49c77a3c00ecc4726f7e0e5a13f39f63&origin_bitrate=420596&deploy_env=prod&p2p_type=1&vd=bc&src=puv3&order=2'
        });
        player.attachMediaElement(rv.value);
        player.load();
        player.play();
    }
});
</script>

<style scoped>
:root {
    --primary-color: white;
    --secondary-color: rgba(255, 255, 255, 0.75);
    --highlight-color: rgb(250, 206, 21);
    --bg-blur: 30px;
    --transition-duration: 300ms;
}

.pre-back {
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -3;
    background: black;
    /* opacity: 0.5; */
    transition: opacity var(--transition-duration);
    ;
}

.videoContainer {
    /* position: relative; */
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}

.vbox {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.vbox:hover {
    cursor: pointer;
}

.background {
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -2;
    overflow: hidden;
}

.canvas {
    /* position: relative; */
    height: 100%;
    width: 100%;
    /* transform: scale(1.6);
    filter: blur(var(--bg-blur)); */
}

.shadow {
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    box-shadow: 0 0 50px 20px rgba(0, 0, 0, 0.5) inset;
}

.topPlay {
    position: absolute;
    top: 40%;
    left: 40%;
    height: 20%;
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
}

.icon {
    opacity: 0.75;
    transition: opacity var(--transition-duration);
}

.icon:hover {
    opacity: 0.9;
}

.details {
    position: absolute;
    bottom: 50px;
    width: 100%;
    height: 70px;
    padding: 16px 0;
    z-index: 99;
    display: flex;
    flex-direction: column;
    box-sizing: content-box;
}

.details .account,
.details .title {
    display: flex;
    align-items: center;
    width: 100%;
}

.details .account .uploader {
    font-family: "PingFang SC", serif;
    font-size: 19px;
    color: var(--primary-color);
    padding: 0 16px 0 16px;
}

.details .account .pubTime {
    font-size: 14px;
    color: var(--primary-color);
}

.details .title .content {
    padding-left: 16px;
    font-size: 15px;
    color: var(--primary-color);
}

.details .title .tags {
    padding-left: 5px;
    font-size: 15px;
    color: var(--highlight-color);
}

.videoBlock {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 0;
}

.videoEntity {
    height: calc(100% - 46px);
    width: 100%;
}

.controller {
    height: 46px;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.progressBar {
    width: 100%;
    padding-bottom: 2px;
    opacity: 0.5;
    transition: opacity var(--transition-duration);
}

.progressBar:hover {
    opacity: 0.9;
}

.progressBar .progressBackground {
    width: 100%;
    height: 2.55px;
    background-color: rgb(104, 104, 104);
}

.progressBar .progressBackground .progressNow {
    height: 100%;
    background-color: var(--primary-color);
}

.controlItems {
    display: flex;
    width: 100%;
    height: 100%;
}

.controlItems .left {
    width: 70%;
    display: flex;
    align-items: center;
}

.controlItems .left .playButton {
    margin-left: 20px;
    height: 20px;
    width: 20px;
}

.controlItems .left .timeDetails {
    margin-left: 5px;
    height: 20px;
    color: var(--primary-color);
}

.controlItems .right {
    width: 30%;
}

.icon1 {
    width: 40px;
    height: 40px;
    transition: transform var(--transition-duration);
}

.icon1:hover {
    transform: scale(1.2);
}

.numinfo {
    font-size: 13px;
    color: var(--primary-color);
}
</style>
