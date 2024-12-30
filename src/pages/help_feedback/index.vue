<template>
    <div class="w-full h-[100px] flex justify-center items-center">
        <div class="h-[50px] w-[120px] bg-white rounded-md cursor-pointer"
            @click="openExternalBrowser('https://github.com/MBDAMAO/dmbar/issues')">
            <Github />
        </div>
    </div>
</template>
<script setup lang='ts'>
import Github from '../../icons/Github.vue';
import { open } from '@tauri-apps/plugin-shell';
async function openExternalBrowser(url: string) {
    try {
        open(url);
    } catch (error) {
        console.error('打开浏览器失败:', error);
    }
}
</script>
<style scoped></style>