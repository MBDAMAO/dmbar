<template>
    <div class="flex flex-col h-full w-full overflow-x-hidden">
        <!-- Background Layers -->
        <div class="absolute inset-0 bg-black z-[-3] transition-opacity"></div>
        <div class="absolute inset-0 z-[-2] overflow-hidden">
            <canvas id="canvas" class="h-full w-full scale-120 blur-[30px]" ref="canvas"></canvas>
        </div>
        <div class="absolute inset-0 shadow-inner z-[-1] shadow-[0_0_50px_20px_rgba(0,0,0,0.5)]"></div>

        <!-- Top Bar with Back Button -->
        <div data-tauri-drag-region
            class="absolute top-0 left-0 z-10 w-full bg-black/10 flex items-center p-2 transition-opacity duration-300"
            :class="{ 'opacity-0 pointer-events-none': !showTopBar }" @mousemove="resetHideTimeout">
            <div class="h-6 w-6" @click="goBack">
                <Back></Back>
            </div>
        </div>

        <!-- Video Container -->
        <div class="relative flex flex-col h-full w-full overflow-hidden">
            <!-- Play Button -->
            <div class="absolute top-1/2 left-1/2 h-[20%] w-[20%] flex items-center justify-center z-10 transform -translate-x-1/2 -translate-y-1/2"
                @click="change()" v-show="!playing">
                <Pause />
            </div>

            <!-- Details Section -->
            <div class="absolute bottom-12 w-full h-16 px-4 flex flex-col z-10" data-tauri-drag-region>
                <!-- Account and Title Details -->
                <div class="flex items-center w-full">
                    <div class="text-white text-lg px-4">Uploader</div>
                    <div class="text-white text-sm">Publication Date</div>
                </div>
                <div class="flex items-center w-full">
                    <div class="text-white text-base pl-4">Title Content</div>
                    <div class="text-yellow-400 text-base pl-1">Tags</div>
                </div>
            </div>

            <!-- Video Section -->
            <div class="relative flex flex-col h-full w-full items-center justify-center z-0">
                <video class="h-[calc(100%-46px)] w-full" ref="rv" @click="change(); resetHideTimeout()"
                    @mousemove="resetHideTimeout" data-tauri-drag-region>
                </video>

                <!-- Controller Section -->
                <div class="flex flex-col w-full h-[46px]">
                    <!-- Progress Bar -->
                    <div class="w-full pb-0.5 opacity-50 hover:opacity-90 transition-opacity">
                        <div class="h-0.5 bg-gray-500">
                            <div class="h-full bg-white" ref="progressNow"></div>
                        </div>
                    </div>

                    <!-- Control Items -->
                    <div class="flex w-full h-full">
                        <!-- Left Controls -->
                        <div class="flex items-center w-7/10">
                            <div class="ml-5 h-5 w-5" @click="change()">
                                <Pause2 v-show="!playing" />
                                <Play v-show="playing" />
                            </div>
                            <div class="ml-5 h-5 w-5" @click="refresh()" v-if="type === 'live'">
                                <Refresh />
                            </div>
                            <div class="ml-5 h-5 w-5" @click="reload()" v-if="type === 'live'">
                                <Link />
                            </div>
                        </div>
                        <!-- Right Controls -->
                        <div class="flex items-center justify-end w-3/10">
                            <Listbox v-model="selectedPerson" v-if="type === 'live'">
                                <ListboxButton class="bg-antiquewhite">
                                    {{ selectedPerson.name }}
                                </ListboxButton>
                                <ListboxOptions class="absolute bottom-full z-50 bg-aqua transform -translate-y-full">
                                    <ListboxOption v-for="url in urls" :key="url.id" :value="url"
                                        :disabled="url.unavailable" @click="reload(url.name)" class="bottom-full">
                                        {{ url.name }}
                                    </ListboxOption>
                                </ListboxOptions>
                            </Listbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted } from 'vue';
import Play from '@/icons/Play.vue';
import Pause from '@/icons/Pause.vue';
import Pause2 from '@/icons/Pause2.vue';
import Refresh from '../../icons/Refresh.vue';
import flvjs from 'flv.js';
import Link from '../../icons/Link.vue';
import Back from '../../icons/Back.vue';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
const urls = reactive([
    { id: 1, name: 'Durward Reynolds', unavailable: false },
    { id: 11, name: 'Durward Reynolds', unavailable: false },
])
const selectedPerson = ref(urls[0])
import bilibili from "../../apis/live.ts";
const playing = ref(true);
const canvas = ref<HTMLCanvasElement | null>(null);
const rv = ref<HTMLVideoElement | null>(null);
const progressNow = ref<HTMLDivElement | null>(null);
import { useRoute, useRouter } from 'vue-router';
import { invoke } from '@tauri-apps/api/core';

let player: any = null;
const type = ref()
const route = useRoute();
const router = useRouter();
const goBack = () => {
    router.go(-1);
};
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
let cookie = "buvid3=063B581A-C6F5-EE0B-C43F-830C290D5BB209485infoc; b_nut=1714128009; _uuid=261093CFF-7F96-69CC-99AD-C2D1F421B83B06421infoc; enable_web_push=DISABLE; FEED_LIVE_VERSION=V_WATCHLATER_PIP_WINDOW3; buvid4=AACD56BA-1BAC-AF79-AF92-2A6F4D17EA1C35455-022112711-s62au2mc03Xvrbf7mUgygA%3D%3D; rpdid=|(umR|Y|k~Ru0J'u~uRuk)u|l; buvid_fp_plain=undefined; DedeUserID=330838998; DedeUserID__ckMd5=881a8a520eb829f4; header_theme_version=CLOSE; hit-dyn-v2=1; LIVE_BUVID=AUTO1017155301152291; CURRENT_QUALITY=80; PVID=9; fingerprint=4e109b97323e7386f22aedddcb16f57f; buvid_fp=4e109b97323e7386f22aedddcb16f57f; home_feed_column=5; browser_resolution=1707-898; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQ1MzI5NjcsImlhdCI6MTczNDI3MzcwNywicGx0IjotMX0.COHHDjRvCRDWnzxGaGTU7Z3eyRD_SzdROrFrnjOfL9U; bili_ticket_expires=1734532907; SESSDATA=d4971bd8%2C1749830058%2C2f12d%2Ac2CjCbwRhqyUCMSKdWUs4oXkueydqizRRChjzONU97G5CSP2nz8kDKabMOyGeBmv1_OjISVlRNMUlMQmw5WlUzVUUzX3ZRQ19tWVlQOG5mVWROQlNlMy05OHpGaU9DRFBUZjBva3NGdGx5SmxqMUt6dFRyMlpOUVJaRDNOdEtrR1pxTDQwVWpGWHBRIIEC; bili_jct=d7658c11272074a1fd17066922f75c1a; b_lsid=C2BC7599_193CD6A9AE1; CURRENT_FNVAL=4048; sid=5a53swol; bp_t_offset_330838998=1011378130062934016";
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
function drawFirstFrame(firstFrame: string) {
    if (!canvas.value) return;
    const context = canvas.value.getContext("2d");
    if (!context) return;

    const image = new Image();
    image.onload = () => {
        canvas.value.width = image.width;
        canvas.value.height = image.height;
        context.drawImage(image, 0, 0, canvas.value.width, canvas.value.height);

        // Apply styles
        canvas.value.style.transform = "scale(1.2)";
        canvas.value.style.filter = "blur(30px)";
    };
    image.src = firstFrame; // Set the image source to the first frame URL
}
// 初始化直播流
onMounted(async () => {
    let uri = route.query.videoUrl;
    type.value = route.query.type;
    let platform = route.query.platform;
    let urll = null;
    if (type.value == "video" && platform == "bilibili") {
        let details = await invoke("video_detail", { bvid: uri.split('/').pop(), sessdata: cookie })
        console.log(details)
        let first_frame = details.data.pages[0].first_frame;
        drawFirstFrame(first_frame);
        // draw
        let addr = await invoke("fetch_video_url", { bvid: uri.split('/').pop(), cid: details.data.cid, qn: 112 })
        // console.log(addr)
        urll = addr
    } else if (type.value == "live") {
        let urlList: any = await parseUrl(uri as string, "bilibili", cookie);
        urll = urlList[2]
    }

    if (rv.value && flvjs.isSupported()) {
        if (type.value == "video" && platform == "bilibili") {
            rv.value.src = urll;
            rv.value.play()
            return;
        } else if (type.value == "live") {
            player = flvjs.createPlayer({
                type: 'flv',
                url: urll
            });
            player.attachMediaElement(rv.value);
            player.load();
            player.play();
            setTimeout(() => {
                draw();
            }, 1000);
        }
    }
});
const showTopBar = ref(true);
let hideTimeout: ReturnType<typeof setTimeout>;

const resetHideTimeout = () => {
    clearTimeout(hideTimeout);
    showTopBar.value = true;
    hideTimeout = setTimeout(() => {
        showTopBar.value = false;
    }, 3000); // Hide after 3 seconds of inactivity
};

onMounted(() => {
    resetHideTimeout();
});

onUnmounted(() => {
    clearTimeout(hideTimeout);
});
</script>
<style scoped>
.icon {
    opacity: 0.75;
    transition: opacity var(--transition-duration);
}

.icon:hover {
    opacity: 0.9;
}
</style>