<template>
    <div class="flex flex-col h-full w-full overflow-x-hidden">
        <div class="absolute inset-0 bg-black z-[-3] transition-opacity"></div>
        <div class="absolute inset-0 z-[-2] overflow-hidden">
            <canvas id="canvas" class="h-full w-full scale-120 blur-[30px]" ref="canvas"></canvas>
        </div>
        <div class="absolute inset-0 z-[-1] shadow-[inset_0_0_50px_20px_rgba(0,0,0,0.5)]"></div>


        <div data-tauri-drag-region
            class="absolute top-0 left-0 z-10 w-full bg-black/10 flex items-center p-2 transition-opacity duration-300"
            :class="{ 'opacity-0 pointer-events-none': !showTopBar }" @mousemove="resetHideTimeout">
            <div class="h-6 w-6" @click="goBack">
                <Back></Back>
            </div>
        </div>

        <div class="relative flex flex-col h-full w-full overflow-hidden">
            <div class="absolute top-1/2 left-1/2 h-[20%] w-[20%] flex items-center justify-center z-10 transform -translate-x-1/2 -translate-y-1/2"
                @click="change()" v-show="!playing">
                <Pause />
            </div>

            <div class="absolute bottom-12 w-full h-16 px-4 flex flex-col z-10" v-if="!simpleMode">
                <div class="flex items-center w-full ">
                    <div class="text-white text-lg px-4 one-line">{{ owner }}</div>
                    <div class="text-white text-sm one-line">{{ date }}</div>
                </div>
                <div class="flex items-center w-full">
                    <div class="text-white text-base pl-4 one-line">{{ title }}</div>
                    <div class="text-yellow-400 text-base pl-1 one-line">{{ tags }}</div>
                </div>
            </div>

            <div class="flex flex-col h-full w-full items-center justify-center">
                <video class="w-full" ref="rv" @click="change(); resetHideTimeout()"
                    :style="{ height: simpleMode ? '100%' : 'calc(100% - 46px)' }" v-loading="loading"
                    @timeupdate="update()"
                    poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    @mousemove="resetHideTimeout" data-tauri-drag-region>
                </video>

                <div class="flex flex-col w-full h-[46px]" v-if="!simpleMode">
                    <div @click="tapProgressBar" ref="progressBar"
                        class="cursor-pointer w-full pb-0.5 opacity-50 hover:opacity-90 transition-opacity">
                        <div class="h-0.5 bg-gray-500">
                            <div class="h-full bg-white" :style="{ width: progressWidth }"></div>
                        </div>
                    </div>

                    <div class="flex w-full h-full justify-between">
                        <div class="flex items-center w-7/10">
                            <div class="ml-5 h-5 w-5" @click="change()">
                                <Pause2 v-show="!playing" />
                                <Play v-show="playing" />
                            </div>
                            <div class="text-white pl-4" v-if="type !== 'live'">{{ timeNow }} / {{ duration }}</div>
                            <div class="ml-5 h-5 w-5" @click="refresh()" v-if="type === 'live'">
                                <Refresh />
                            </div>
                            <div class="ml-5 h-5 w-5" @click="reload()" v-if="type === 'live'">
                                <Link />
                            </div>
                            <div class="ml-5 h-5 w-5" @click="simpleMode = !simpleMode">
                                <Link />
                            </div>
                        </div>
                        <div class="relative flex items-center justify-end w-3/10">
                            <Listbox v-model="ratioNow" v-if="type !== 'live'">
                                <ListboxButton class="text-white truncate">
                                    倍速{{ ratioNow.name }}
                                </ListboxButton>
                                <ListboxOptions class="absolute flex flex-col w-19"
                                    style="border-radius: 5px; z-index: 1000; bottom: 50px;transform: translateZ(0);
                                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);">
                                    <ListboxOption v-for="item in ratios" :key="item.id" :value="item"
                                        @click="switchSpeed(item.ratio)"
                                        class="h-30 w-full truncate cursor-pointer text-white">
                                        {{ item.name }}
                                    </ListboxOption>
                                </ListboxOptions>
                            </Listbox>
                        </div>
                        <div class="flex items-center justify-end w-3/10">
                            <Listbox v-model="selectedPerson" v-if="type === 'live'">
                                <ListboxButton class="text-white truncate">
                                    {{ selectedPerson.name }}
                                </ListboxButton>
                                <ListboxOptions class="absolute flex flex-col w-80"
                                    style="border-radius: 5px;transform: translateZ(0);z-index: 1000; bottom: 50px;
                                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);">
                                    <ListboxOption v-for="url in urls" :key="url.id" :value="url"
                                        :disabled="url.unavailable" @click="reload(url.name)"
                                        class="h-30 w-full truncate cursor-pointer text-white">
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
import Refresh from '@/icons/Refresh.vue';
import flvjs from 'flv.js';
import Link from '@/icons/Link.vue';
import Back from '@/icons/Back.vue';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
const urls = reactive([
    { id: 1, name: 'Durward Reynolds', unavailable: false },
])
const simpleMode = ref(false)
const ratios = reactive([
    { id: 1, ratio: 0.125, name: '0.125x' },
    { id: 2, ratio: 0.25, name: '0.25x' },
    { id: 3, ratio: 0.5, name: '0.5x' },
    { id: 4, ratio: 1, name: '1x' },
    { id: 5, ratio: 1.5, name: '1.5x' },
    { id: 6, ratio: 2, name: '2x' },
    { id: 7, ratio: 3, name: '3x' },
])
const ratioNow = ref(ratios[3])
const selectedPerson = ref(urls[0])
import bilibili from "@/apis/live.ts";
const playing = ref(true);
const title = ref()
const loading = ref(true)
const owner = ref()
const date = ref()
const tags = ref()
const timeNow = ref("00:00");
const duration = ref("00:00");
const canvas = ref<HTMLCanvasElement | null>(null);
const rv = ref<HTMLVideoElement | null>(null);
import { useRoute, useRouter } from 'vue-router';
import { getVideoDetails, getVideoUrl } from '@/apis/bilibili.ts';
import { useConfig } from '@/stores/config';

let player: any = null;
const type = ref()
const route = useRoute();
const router = useRouter();
const goBack = async () => {
    router.go(-1);
};
async function change() {
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
    let cookie = useConfig().useBilibiliCookie();
    let parser = bilibili("https://live.bilibili.com/" + roomId, cookie);
    let result: ParsedResult | Error | null;
    try {
        result = await parser.parse();
    } catch (e) {
        result = Error("Error")
    }
    if (result instanceof Error) {
        return Error("Error")
    } else if (result) {
        console.log(result.links);
    }
    urls.splice(0, urls.length)
    urls.push(...result.links.map((url, index) => { return { id: index + 1, name: url, unavailable: false } }))
    console.log(urls)
    return result.links
}
const progressWidth = ref('0%');
async function update() {
    const currentTime = rv.value?.currentTime || 0;
    const duration = rv.value?.duration || 1;  // 避免除以0
    const percentage = (currentTime / duration) * 100;
    progressWidth.value = `${percentage}%`;

    timeNow.value =
        Math.floor(currentTime / 60).toString().padStart(2, '0') + ":" +
        Math.floor(currentTime % 60).toString().padStart(2, '0');
}
async function switchSpeed(ratio: number) {
    if (rv.value) {
        rv.value.playbackRate = ratio;
    }
}
const progressBar: any = ref(null);
async function tapProgressBar(event: Event | any) {
    if (progressBar.value == null || rv.value == null) return;
    let rect = progressBar.value.getBoundingClientRect();
    let clickPercentage = (event.clientX - rect.left) / rect.width;
    rv.value.currentTime = clickPercentage * rv.value.duration;
}
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
async function reload(newUrl?: string) {
    try {
        loading.value = true;
        if (!newUrl) {
            let cookie = useConfig().useBilibiliCookie();
            let urlList = await parseUrl(route.query.videoUrl as string, "bilibili", cookie);
            if (urlList instanceof Error) {
                return;
            }
            newUrl = urlList[0]
        }

        if (rv.value) {
            if (player) {
                player.pause();
                player.unload();
                player.detachMediaElement();
                player.destroy();
                player = null;
            }
            player = flvjs.createPlayer({
                type: 'flv',
                url: newUrl
            });
            player.attachMediaElement(rv.value);
            player.load();
            loading.value = false;
            player.play();
        }
    } catch (error) {
        console.error('Error fetching new video URL:', error);
    }
}

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

        canvas.value.style.transform = "scale(1.2)";
        canvas.value.style.filter = "blur(30px)";
    };
    image.src = firstFrame;
}
onMounted(async () => {
    resetHideTimeout();
    let uri = route.query.videoUrl;
    type.value = route.query.type;
    let platform = route.query.platform;
    let urll = null;
    let first_frame = null;
    if (type.value == "video" && platform == "bilibili") {
        let details = (await getVideoDetails(uri.split('/').pop())).body
        title.value = details.data.title;
        tags.value = details.data.tname;
        date.value = (new Date(details.data.pubdate * 1000)).toLocaleDateString();
        owner.value = '@' + details.data.owner.name;
        first_frame = details.data.pages[0].first_frame.replace(/^http:/, 'https:');
        drawFirstFrame(first_frame);
        let res = await getVideoUrl(uri.split('/').pop(), details.data.cid, 112);
        let addr = res.body.data.durl[0].url;
        console.log(res)
        urll = addr
    } else if (type.value == "live") {
        let cookie = useConfig().useBilibiliCookie();
        let urlList: any = await parseUrl(uri as string, "bilibili", cookie);
        urll = urlList[2]
    }

    if (rv.value && flvjs.isSupported()) {
        if (type.value == "video" && platform == "bilibili") {
            rv.value.src = urll;
            rv.value.onloadedmetadata = () => {
                duration.value =
                    (rv.value?.duration / 60).toFixed().padStart(2, "0") +
                    ":" +
                    (rv.value?.duration % 60).toFixed().padStart(2, "0");
            }
            rv.value.poster = first_frame;
            loading.value = false;
            rv.value.play()
            return;
        } else if (type.value == "live") {
            console.log(urll)
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

const resetHideTimeout = async () => {
    clearTimeout(hideTimeout);
    showTopBar.value = true;
    hideTimeout = setTimeout(() => {
        showTopBar.value = false;
    }, 1500);
};

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
    cursor: pointer;
}

.one-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
}
</style>