<template>
    <div class="relative h-full w-full flex flex-col">
        <div class="relative w-full">
            <div class="absolute w-full bottom-0 z-10 text-white text-left text-sm pl-1 pr-1 flex justify-between"
                style="height: 22px;">
                <div class="flex flex-row items-center">
                    <View class="h-full p-0.5"></View>
                    <div>
                        {{ formattedPlays }}
                    </div>
                </div>

                <div>{{ formattedDuration }}</div>
            </div>
            <div class="relative">
                <img :src="cover" class="w-full object-contain" :alt="title" />
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50">
                </div>
            </div>
        </div>
        <div class="bg-white text-left">
            <div class="text-sm font-semibold text-black mt-1 line-clamp-2 leading-[1.3rem] pl-1"
                style="min-height: 2.6rem;">
                {{ title }}
            </div>
            <div class="text-[12px] text-gray-600 flex justify-between items-center">
                <div class="flex flex-row items-center">
                    <Up class="h-full p-1"></Up>
                    <div class="line-clamp-1">{{ owner }}</div>
                </div>
                <div class="line-clamp-1 pr-1"> {{ formattedDateTime }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import View from '../../icons/View.vue';
import Up from '../../icons/Up.vue';
const router = useRouter();
const { cover, plays, title, owner, platform, duration, pubTime } = defineProps({
    cover: String,
    uri: String,
    plays: Number,
    pubTime: Number,
    duration: Number,
    title: String,
    owner: String,
    platform: String,
    tags: String
});

// 格式化播放量
const formattedPlays = computed(() => {
    if (typeof plays !== 'number' || isNaN(plays)) return "NaN";
    if (plays >= 10000) {
        return (plays / 10000).toFixed(2) + '万';
    }
    return plays.toString();
});
// 格式化持续时间
const formattedDuration = computed(() => {
    if (typeof duration !== 'number' || isNaN(duration)) return "NaN";
    const totalSeconds = duration;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const formattedDateTime = computed(() => {
    if (typeof pubTime !== 'number' || isNaN(pubTime)) return "NaN";
    const now = new Date();
    const pubDate = new Date(pubTime * 1000);
    const diff = now - pubDate;

    if (diff < 24 * 60 * 60 * 1000) {
        return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
    } else {
        return pubDate.toLocaleDateString();
    }
});
function onVideoClick(uri: String) {
    router.push({ name: 'player', query: { videoUrl: uri, type: "video", platform: platform } });
}
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