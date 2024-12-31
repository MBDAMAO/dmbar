<template>
    <div class="flex flex-col items-center overflow-y-auto h-screen" style="scroll-behavior: smooth;">
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh" class="h-full" @scroll="handleScroll">
            <div v-if="loading" class="text-lg text-gray-600 mt-3">
                <loading></loading>
            </div>
            <div v-else-if="error" class="text-lg text-red-600">{{ error }}</div>
            <ul v-else class="grid grid-cols-1 gap-4 w-full max-w-4xl">
                <li v-for="item in videos" :key="item.bvid"
                    class="rounded-lg shadow-md overflow-hidden text-center hover:cursor-pointer"
                    @click="pushToPlayer(item)">
                    <ContentBlock :cover="item.cover" :owner="item.owner" :title="item.title" :plays="item.play"
                        :pub-time="item.pubDate" :duration="item.duration"></ContentBlock>
                </li>
            </ul>
            <div class="text-lg text-gray-600 mt-5">
                <loading></loading>
            </div>
        </van-pull-refresh>
    </div>
    <div class="absolute h-[50px] w-[30px] bottom-2 right-4 z-50 cursor-pointer rounded-md overflow-hidden"
        style="transform: translateZ(0);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);" @click="refresh()">
        <Refresh></Refresh>
    </div>
</template>
<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ContentBlock from '../Components/ContentBlock.vue';
import { getHomeRecommend, Video } from '@/services/videos';
import Refresh from '@/icons/Refresh.vue';
import Loading from '@/dynamics/Loading.vue';
const isRefreshing = ref(false);
const router = useRouter();
const videos = ref<Video[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const page = ref(1);
const hasMore = ref(true);
const isFetching = ref(false);

const onRefresh = () => {
    // if (isRefreshing.value) return;
    getHomeRecommend().then((data) => {
        videos.value.length = 0;
        videos.value.push(...data.result);
        isRefreshing.value = false;
    });
};

async function refresh() {
    if (isRefreshing.value) return;
    isRefreshing.value = true;
    getHomeRecommend().then((data) => {
        videos.value.length = 0;
        videos.value.push(...data.result);
        isRefreshing.value = false;
    });
}
async function fetchVideos() {
    if (!hasMore.value || isFetching.value) return;

    isFetching.value = true;
    try {
        const response = (await getHomeRecommend()).result;
        if (response == null) {
            return;
        }
        if (response.length === 0) {
            hasMore.value = false;
        } else {
            videos.value.push(...response);
            page.value++;
        }
    } catch (err) {
        error.value = (err as Error).message || '网络错误，请稍后重试';
    } finally {
        isFetching.value = false;
    }
}

async function pushToPlayer(item: Video) {
    router.push({ name: 'player', query: { videoUrl: item.url, type: "video", platform: "bilibili" } });
}

async function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 60) {
        fetchVideos();
    }
}

onMounted(async () => {
    fetchVideos();
});
</script>
<style scoped>
/* 基础样式 */
.grid {
    display: grid;
    gap: 4px;
}

/* 小屏幕（手机） */
@media (max-width: 300px) {
    .grid {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

/* 小屏幕（手机） */
@media (min-width: 300px) and (max-width: 767px) {
    .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* 中等屏幕（平板） */
@media (min-width: 768px) and (max-width: 1023px) {
    .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

/* 大屏幕（桌面） */
@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

.van-pull-refresh {
    overflow: auto;
}
</style>