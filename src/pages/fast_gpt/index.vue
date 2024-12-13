<template>
    <div class="video-recommend">
        <header class="header">
            <h1>视频推荐</h1>
        </header>

        <main class="content">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <ul v-else class="video-list">
                <li v-for="item in videos" :key="item.bvid" class="video-item hover:cursor-pointer"
                    @click="onVideoClick(item)">
                    <!-- 使用Base64图片 -->
                    <img :src="item.pic" :alt="item.title" class="thumbnail" />
                    <h3 class="title">{{ item.title }}</h3>
                    <p class="owner">UP主: {{ item.owner.name }}</p>
                </li>
            </ul>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { useRouter } from 'vue-router';
const router = useRouter();
const videos = ref<VideoItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

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
    try {
        // 假设后端已经提供了一个API接口来获取视频信息
        const response = await invoke<VideoItem[]>('fetch_videos');

        // 为每个视频获取图片的Base64编码，并行请求
        const imagePromises = response.map(async (video) => {
            // video.pic = await fetchImageBase64(video.pic);  // 获取图片Base64
            return video;
        });

        // 等待所有的图片请求完成
        videos.value = await Promise.all(imagePromises);
    } catch (err) {
        error.value = (err as Error).message || '网络错误，请稍后重试';
    } finally {
        loading.value = false;
    }
}
// 点击视频时跳转到播放器页面
function onVideoClick(item: VideoItem) {
    // 使用router.push跳转到播放页面，并传递videoUrl作为query参数
    router.push({ name: 'player', query: { videoUrl: item.uri, type: "video", platform: "bilibili" } });
}
// 调用后端的接口来获取图片的Base64编码
async function fetchImageBase64(imageUrl: string): Promise<string> {
    try {
        const base64Image = await invoke<string>('get_image_base64', { url: imageUrl });
        return base64Image;
    } catch (err) {
        console.error("获取Base64图片失败", err);
        return '';  // 如果失败，返回一个空字符串
    }
}

onMounted(fetchVideos);
</script>

<style scoped>
.video-recommend {
    font-family: Arial, sans-serif;
    padding: 16px;
}

.header {
    text-align: center;
    margin-bottom: 16px;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.loading,
.error {
    font-size: 18px;
    color: #666;
}

.video-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
}

.video-item {
    width: 240px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.thumbnail {
    width: 100%;
    height: 135px;
    object-fit: cover;
}

.title {
    font-size: 16px;
    margin: 8px 0;
    color: white;
    /* Multi-line truncation */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    /* Show only 2 lines */
    text-overflow: ellipsis;
}

.owner {
    font-size: 14px;
    color: #666;
}

.link {
    display: inline-block;
    margin: 8px 0;
    padding: 8px 16px;
    color: #fff;
    background-color: #007bff;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s;
}

.link:hover {
    background-color: #0056b3;
}
</style>
