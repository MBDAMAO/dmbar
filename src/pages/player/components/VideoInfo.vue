<!-- VideoInfo.vue -->
<template>
    <div class="absolute bottom-12 w-full h-16 px-4 flex flex-col z-10">
        <div class="flex items-center w-full ">
            <div class="text-white text-lg px-4 one-line">{{ owner }}</div>
            <div class="text-white text-sm one-line">{{ date }}</div>
        </div>
        <div class="flex items-center w-full">
            <div class="text-white text-base pl-4 one-line">{{ title }}</div>
            <div class="text-yellow-400 text-base pl-1 one-line">{{ tags }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    owner: String,
    date: String,
    title: String,
    tags: String
});
</script>