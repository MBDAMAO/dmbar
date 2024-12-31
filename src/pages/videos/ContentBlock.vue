<template>
    <div v-ripple class="relative h-full w-full flex flex-col">
        <div class="relative w-full">
            <div class="absolute w-full bottom-0 z-10 text-white text-left text-sm pl-1 pr-1 flex justify-between"
                style="height: 22px;">
                <div class="flex flex-row items-center">
                    <View class="h-full p-0.5"></View>
                    <div>
                        {{ plays }}
                    </div>
                </div>

                <div>{{ duration }}</div>
            </div>
            <div class="relative">
                <!-- <div class="w-full">
                    <Image16x9 v-show="isLoading"></Image16x9>
                </div> -->

                <div class="aspect-ratio-16x9">
                    <Transition>
                        <img :src="cover" v-show="!isLoading" class="w-full object-cover" :alt="title"
                            @load="onImageLoad" />
                    </Transition>
                </div>

                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50">
                </div>
            </div>
        </div>
        <div class="bg-[--bg2] text-left">
            <div class="text-[13px] text-[--text-color] mt-1 line-clamp-2 leading-[1.3rem] pl-1 pr-1"
                style="height: 2.6rem; font-weight: normal;">
                {{ title }}
            </div>
            <div class="text-[12px] text-gray-600 flex justify-between items-center h-5">
                <div class="flex flex-row items-center">
                    <Up class="h-full p-1"></Up>
                    <div class="line-clamp-1">{{ owner }}</div>
                </div>
                <div class="line-clamp-1 pr-1"> {{ pubTime }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import View from '../../icons/View.vue';
import Up from '../../icons/Up.vue';
import Image16x9 from '../../dynamics/Image16x9.vue';

const isLoading = ref(true);
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

// 图片加载完成时的回调函数
const onImageLoad = () => {
    isLoading.value = false; // 图片加载完成后，更新状态，移除占位图
};



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

/* 保持 16:9 比例 */
.aspect-ratio-16x9 {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 9 ÷ 16 = 0.5625, 即 56.25% */
    overflow: hidden;
}

.aspect-ratio-16x9 img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 保证图片不失真地覆盖整个容器 */
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.15s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>