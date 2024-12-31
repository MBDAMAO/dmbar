<template>
    <div class="p-4 pt-1 font-sans flex flex-col h-full">
        <div class="text-center mb-3 flex justify-center">
            <div class="flex w-full max-w-xl">
                <input type="text" ref="search"
                    class="w-full  p-2 rounded-l-lg outline-none h-8 bg-[--bg2] text-sm text-[--text-color]"
                    :placeholder="placeholder" v-model="searchQuery" @keyup.enter="searchVideos" @click="goToSearch" />
                <div @click="searchVideos"
                    class="h-8 w-[60px] bg-[--bg2] rounded-r-lg text-[--text-color] text-sm p-2 flex items-center cursor-pointer">
                    搜索
                </div>
            </div>
        </div>
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const search = ref<HTMLInputElement>();
const placeholder = ref<string>('');
import { defaultSearchContent } from '@/apis/bilibili';

const searchQuery = ref<string>('');

function goToSearch() {
    router.push('/root/videos/search_page')
}

async function searchVideos() {
    let keyword = searchQuery.value;
    if (keyword == '') keyword = placeholder.value;
    router.push({ name: 'search', query: { keyword } });
}
onMounted(async () => {
    const data = await defaultSearchContent();
    placeholder.value = data.body.data.show_name;
})
</script>

<style scoped></style>