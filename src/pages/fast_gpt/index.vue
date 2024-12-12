<template>
    <div class="video-recommend">
        <header class="header">
            <h1>视频推荐</h1>
        </header>

        <main class="content">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <ul v-else class="video-list">
                <li v-for="item in videos" :key="item.bvid" class="video-item">
                    <img :src="item.pic" :alt="item.title" class="thumbnail" />
                    <h3 class="title">{{ item.title }}</h3>
                    <p class="owner">UP主: {{ item.owner.name }}</p>
                    <a :href="item.uri" target="_blank" class="link">观看</a>
                </li>
            </ul>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const videos = ref<VideoItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

import { invoke } from "@tauri-apps/api/core";

interface Owner {
    name: string;
    face: string;
    mid: number;
}

interface VideoItem {
    bvid: string;
    title: string;
    pic: string;
    uri: string;
    owner: Owner;
}


async function fetchVideos() {
    try {
        const response = await invoke<VideoItem[]>('fetch_videos');
        videos.value = response;
    } catch (err) {
        error.value = (err as Error).message || '网络错误，请稍后重试';
    } finally {
        loading.value = false;
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
    color: #333;
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