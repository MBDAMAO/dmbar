<template>
    <div class="flex flex-col h-full w-full overflow-x-hidden">
        <Background :canvas="canvas" />
        <TopBar :showTopBar="showTopBar" @go-back="goBack" @resetTimeout="resetHideTimeout" />

        <div class="relative flex flex-col h-full w-full overflow-hidden">
            <OverlayPause v-show="!playing" @click="change()" />
            <VideoInfo :title="title" :tags="tags" :owner="owner" :date="date"></VideoInfo>
            <div class="flex flex-col h-full w-full items-center justify-center">
                <video class="h-[calc(100%-46px)] w-full" ref="rv" @click="change(); resetHideTimeout()"
                    @timeupdate="update()"
                    poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    @mousemove="resetHideTimeout" data-tauri-drag-region>
                </video>
                <div class="flex flex-col w-full h-[46px]">
                    <ProgressBar :progressWidth="progressWidth" @seek="seek" />
                    <VideoControls :playing="playing" :timeNow="timeNow" :duration="duration" @change="change()"
                        @refresh="refresh()" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Background from './components/Background.vue';
import TopBar from './components/TopBar.vue';
import OverlayPause from './components/OverlayPause.vue';
import VideoControls from './components/VideoControls.vue';
import ProgressBar from './components/ProgressBar.vue';
import VideoInfo from './components/VideoInfo.vue';
import flvjs from 'flv.js';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getLiveUrl, getVideoDetails, getVideoUrl } from '../../apis/bilibili';

const router = useRouter();
const route = useRoute();
const rv = ref<HTMLVideoElement | null>(null);
const playing = ref(true);
const showTopBar = ref(true);
const progressWidth = ref('0%');
const timeNow = ref("00:00");
const duration = ref("00:00");
const canvas = ref<HTMLCanvasElement | null>(null);
defineProps({

})

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

const title = ref("");
const tags = ref("");
const owner = ref("");
const date = ref("");

onMounted(async () => {
    resetHideTimeout();

    let url: any = route.query.videoUrl;
    const vid = url.split('/').pop()
    let type: any = route.query.type;
    let platform: any = route.query.platform;
    if (type === "video") {
        // 先获取视频信息
        let resp: any = await getVideoDetails(vid);
        let info = resp.body.data;
        // VideoInfo data
        title.value = info.title;
        tags.value = info.tname;
        date.value = (new Date(info.pubdate * 1000)).toLocaleDateString();
        owner.value = '@' + info.owner.name;

        const cid = info.cid;
        // 获取视频链接
        let res: any = await getVideoUrl(vid, cid, 112);
        let videoLink = res.body.data.durl[0].url;


    } else if (type == "live") {
        // 解析直播链接
        let urlList: any = await getLiveUrl(url as string);
        // 默认选用第一个链接
        let urlSelected = urlList[0]

        if (rv.value && flvjs.isSupported()) {
            const player = flvjs.createPlayer({
                type: 'flv',
                url: urlSelected
            });
            player.attachMediaElement(rv.value);
            player.load();
            player.play();
            setTimeout(() => {
                draw();
            }, 1000);
        }
    }
})
</script>
