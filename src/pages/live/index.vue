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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getLiveRoomInfo } from '../../apis/bilibili';

// 模拟数据
const liveBlocks = ref([
    {
        name: '音乐播放', tags: ['Gamer', 'Streamer'], videoUrl: "1773507853"
    },
    {
        name: 'cs2', tags: ['Gamer', 'Streamer'], videoUrl: "4775711"
    },
    {
        name: 'cs2', tags: ['Gamer', 'Streamer'], videoUrl: "27841685"
    }
]);
onMounted(async () => {
    getLiveRoomInfo("1773507853")
})

const router = useRouter();

// 跳转到 /player 页面，并附带视频 URL
function goToPlayer(item: any) {
    router.push({ name: 'player', query: { videoUrl: item.videoUrl, type: "live" } });
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