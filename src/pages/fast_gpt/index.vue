<template>
    <div class="p-4 font-sans">
        <header class="text-center mb-4">
            <h1 class="text-2xl font-bold">视频推荐</h1>
        </header>

        <main class="flex flex-col items-center h-screen overflow-y-auto" @scroll="handleScroll">
            <div v-if="loading" class="text-lg text-gray-600">加载中...</div>
            <div v-else-if="error" class="text-lg text-red-600">{{ error }}</div>
            <ul v-else class="grid grid-cols-2 gap-4 w-full max-w-4xl">
                <li v-for="item in videos" :key="item.bvid"
                    class="border border-gray-300 rounded-lg shadow-md overflow-hidden text-center hover:cursor-pointer"
                    @click="onVideoClick(item)">
                    <img :src="item.pic" :alt="item.title" class="w-full object-contain" />
                    <h3 class="text-base font-semibold text-white mt-2 line-clamp-2">{{ item.title }}</h3>
                    <p class="text-sm text-gray-600">@{{ item.owner.name }}</p>
                </li>
            </ul>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invokeWrapper } from '../../utils/tauri_api';
import { useRouter } from 'vue-router';

const router = useRouter();
const videos = ref<VideoItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const page = ref(1);
const hasMore = ref(true);
const isFetching = ref(false);

interface Owner {
    name: string;
    face: string;
    mid: number;
}

interface VideoItem {
    bvid: string;
    title: string;
    pic: string;  // 图片的Base64编码
    uri: string;
    owner: Owner;
}

// 获取视频列表
async function fetchVideos() {
    if (!hasMore.value || isFetching.value) return;

    isFetching.value = true;
    try {
        const response = await invokeWrapper<VideoItem[]>({ command: 'fetch_videos', payload: { page: page.value } });
        if (response == null) {
            return;
        }
        if (response.length === 0) {
            hasMore.value = false;
        } else {
            // 将返回的所有 pic 字段中的 http 替换为 https
            const updatedResponse = response.map(video => ({
                ...video,
                pic: video.pic.replace(/^http:/, 'https:')
            }));

            videos.value.push(...updatedResponse);
            page.value++;
        }
    } catch (err) {
        error.value = (err as Error).message || '网络错误，请稍后重试';
    } finally {
        isFetching.value = false;
        loading.value = false;
    }
}

// 点击视频时跳转到播放器页面
function onVideoClick(item: VideoItem) {
    router.push({ name: 'player', query: { videoUrl: item.uri, type: "video", platform: "bilibili" } });
}

// 处理滚动事件
function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
        fetchVideos();
    }
}

onMounted(fetchVideos);
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
}
</style>
