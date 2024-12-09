<template>
    <div class="live-container">
        <!-- 多个 live-block -->
        <div class="live-block" v-for="(item, index) in liveBlocks" :key="index" @click="goToPlayer(item)">
            <!-- 左侧头像 -->
            <div class="avatar"></div>

            <!-- 右侧信息 -->
            <div class="info">
                <div class="name">{{ item.name }}</div>
                <div class="tags">{{ item.tags.join(', ') }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 模拟数据
const liveBlocks = ref([
    {
        name: '音乐播放', tags: ['Gamer', 'Streamer'], videoUrl: "https://d1--cn-gotcha04.bilivideo.com/live-bvc/612218/live_544266238_1919984.flv?expires=1733658838&len=0&oi=1899426053&pt=web&qn=10000&trid=100070be7e8ceb0dc27e42f620030267557a&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha04&sign=3f2db4cc96a65a9b5e7de51acb099814&site=b57e3fafedf41ae57ba88a4cd3cd85dd&free_type=0&mid=330838998&sche=ban&trace=4&isp=fx&rg=SouthWest&pv=Sichuan&score=1&origin_bitrate=418435&suffix=origin&hot_cdn=0&sk=49c77a3c00ecc4726f7e0e5a13f39f63&deploy_env=prod&info_source=origin&pp=rtmp&sl=1&p2p_type=1&source=puv3_onetier&vd=bc&src=puv3&order=2"
    },
    { name: 'Jane Smith', tags: ['Vlogger', 'Content Creator'], videoUrl: 'https://example.com/video2' },
    { name: 'Alex Brown', tags: ['Tech Enthusiast', 'Developer'], videoUrl: 'https://example.com/video3' },
    { name: 'Alice Lee', tags: ['Designer', 'Artist'], videoUrl: 'https://example.com/video4' },
    { name: 'Bob White', tags: ['Music Producer', 'DJ'], videoUrl: 'https://example.com/video5' },
    { name: 'Tom Green', tags: ['Fitness Expert', 'Trainer'], videoUrl: 'https://example.com/video6' },
]);

// 使用 Vue Router
const router = useRouter();

// 跳转到 /player 页面，并附带视频 URL
function goToPlayer(item: any) {
    router.push({ name: 'player', query: { videoUrl: item.videoUrl } });
}
</script>

<style scoped>
.live-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    justify-items: center;
    min-height: 100vh;
    padding: 20px;
}

.live-block {
    cursor: pointer;
    display: flex;
    width: 100%;
    height: 160px;
    background-color: rgba(109, 109, 109, 0.2);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar {
    width: 60px;
    height: 60px;
    background-color: #ccc;
    border-radius: 50%;
    margin: 20px;
}

.info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    flex-grow: 1;
}

.name {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.tags {
    font-size: 12px;
    color: #777;
    margin-top: 8px;
}

@media (max-width: 600px) {
    .live-container {
        padding: 10px;
        grid-template-columns: 1fr;
    }

    .live-block {
        flex-direction: column;
        height: auto;
    }

    .avatar {
        margin: 10px auto;
    }

    .info {
        align-items: center;
        padding: 10px;
    }

    .name {
        font-size: 14px;
    }

    .tags {
        font-size: 10px;
    }
}
</style>