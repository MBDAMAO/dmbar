<!-- VideoInfo.vue -->
<template>
    <div class="video-info flex flex-col">
        <div class="text-white text-lg px-4 one-line">{{ owner }}</div>
        <div class="text-white text-sm one-line">{{ date }}</div>
        <div class="text-white text-base pl-4 one-line">{{ title }}</div>
        <div class="text-yellow-400 text-base pl-1 one-line">{{ tags }}</div>
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