<template>
    <div class="videoContainer">
        <div class="pre-back"></div>
        <div class="shadow"></div>
        <div class="background">
            <canvas id="canvas" class="canvas" ref="canvas"></canvas>
        </div>
        <div class="vbox">
            <Listbox v-model="selectedPerson">
                <ListboxButton class="bottom-full" style="background-color: antiquewhite;">{{
                    selectedPerson.name }}
                </ListboxButton>
                <ListboxOptions style="background-color: aqua;" class="bottom-full">
                    <ListboxOption @click="reload(url.name)" v-for="url in urls" :key="url.id" :value="url"
                        :disabled="url.unavailable" style="background-color: azure;" class="bottom-full">
                        {{ url.name }}
                    </ListboxOption>
                </ListboxOptions>
            </Listbox>
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
                            <div class="playButton" @click="reload()">
                                <Link />
                            </div>
                            <!-- <div class="timeDetails">{{ timeNow }} {{ liveStatus }}</div> -->
                        </div>
                        <div class="right">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import Play from '@/icons/Play.vue';
import Pause from '@/icons/Pause.vue';
import Pause2 from '@/icons/Pause2.vue';
import Refresh from '../../icons/Refresh.vue';
import flvjs from 'flv.js';
import Link from '../../icons/Link.vue';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
const urls = reactive([
    { id: 1, name: 'Durward Reynolds', unavailable: false },
])
const selectedPerson = ref(urls[0])
import bilibili from "../../apis/live.ts";
const playing = ref(true);
const canvas = ref<HTMLCanvasElement | null>(null);
const rv = ref<HTMLVideoElement | null>(null);
const progressNow = ref<HTMLDivElement | null>(null);
import { useRoute } from 'vue-router';

const route = useRoute();
function change() {
    draw();
    playing.value = !playing.value;
    if (playing.value) {
        play();
    } else {
        pause();
    }
}
async function parseUrl(roomId: string, platform: string, params: string): Promise<string[] | Error> {
    if (platform != "bilibili") {
        return Error("Error")
    }
    let parser = bilibili("https://live.bilibili.com/" + roomId, cookie);
    let result: ParsedResult | Error | null;
    try {
        result = await parser.parse();
    } catch (e) {
        result = Error("Error")
    }
    console.log(result);
    if (result instanceof Error) {
        return Error("Error")
    } else if (result) {
        console.log(result.links);
    }
    urls.splice(0, urls.length) // 清空数组
    urls.push(...result.links.map((url, index) => { return { id: index + 1, name: url, unavailable: false } }))
    console.log(urls)
    return result.links
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
let cookie = "buvid3=063B581A-C6F5-EE0B-C43F-830C290D5BB209485infoc; b_nut=1714128009; _uuid=261093CFF-7F96-69CC-99AD-C2D1F421B83B06421infoc; enable_web_push=DISABLE; FEED_LIVE_VERSION=V_WATCHLATER_PIP_WINDOW3; buvid4=AACD56BA-1BAC-AF79-AF92-2A6F4D17EA1C35455-022112711-s62au2mc03Xvrbf7mUgygA%3D%3D; rpdid=|(umR|Y|k~Ru0J'u~uRuk)u|l; buvid_fp_plain=undefined; DedeUserID=330838998; DedeUserID__ckMd5=881a8a520eb829f4; header_theme_version=CLOSE; hit-dyn-v2=1; LIVE_BUVID=AUTO1017155301152291; CURRENT_QUALITY=80; fingerprint=b2a78f67292046fb59d465d8c30ddc3b; buvid_fp=b2a78f67292046fb59d465d8c30ddc3b; home_feed_column=5; browser_resolution=1707-898; PVID=9; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQwMTQ0NDYsImlhdCI6MTczMzc1NTE4NiwicGx0IjotMX0.8vIhDwYAU7xG5SslXlLZwpr0v3ufp6iHn_G_NKgaayw; bili_ticket_expires=1734014386; SESSDATA=db06f869%2C1749307247%2Cb4e76%2Ac2CjA7l4Os2BSfuZZa6Cu4-QTJjvTXMjk8afA9RJLPaWNsqz9PExnUr1hs6idDmALAWdESVkg4b3ZJYnBBSjRscEJLR2c3OFYwN3J2dE1qZUpTcDFZOWVMUzQ3RTdIa0tzNm1Pb3d6dVlBUlo3XzhXSFAwRVNrTGU5MThwRnZqV29uMExhWkdUelBBIIEC; bili_jct=399350212997568b6f80dc21ba4f2634; sid=85e8z0h9; b_lsid=F810F99DF_193ABE2398E; CURRENT_FNVAL=4048; bp_t_offset_330838998=1008972776578482176"
let player: any;
async function reload(newUrl?: string) {
    try {
        if (!newUrl) {
            let urlList = await parseUrl(route.query.videoUrl as string, "bilibili", cookie);
            if (urlList instanceof Error) {
                return;
            }
            newUrl = urlList[0]
        }

        // 重新加载视频流
        if (rv.value) {
            if (player) {
                player.pause();
                player.unload();
                player.detachMediaElement();
                player.destroy();
                player = null; // 确保旧的播放器实例被清理
            }
            player = flvjs.createPlayer({
                type: 'flv',
                url: newUrl
            });
            player.attachMediaElement(rv.value);
            player.load();
            player.play();
        }
    } catch (error) {
        console.error('Error fetching new video URL:', error);
        // 处理错误，比如显示错误消息
    }
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
onMounted(async () => {
    let uri = route.query.videoUrl;
    let urlList = await parseUrl(uri as string, "bilibili", cookie);
    let platform = route.query.platform;
    let type = route.query.type;
    if (type == "video" && platform == "bilibili") {
        console.log(uri)
    }
    if (urlList instanceof Error) {
        return;
    }
    let url = urlList[0]
    if (rv.value && flvjs.isSupported()) {
        player = flvjs.createPlayer({
            type: 'flv',
            url
        });
        player.attachMediaElement(rv.value);
        player.load();
        player.play();
        setTimeout(() => {
            draw();
        }, 1000);
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
    z-index: 6;
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
    z-index: 7;
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
