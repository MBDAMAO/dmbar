<template>
    <div class="p-4 pt-1 font-sans flex flex-col h-full">
        <div class="text-center mb-3">
            <input type="text" ref="search"
                class="w-full max-w-xl p-2 rounded-lg outline-none h-8 bg-[--bg2] text-sm text-[--text-color]"
                :placeholder="placeholder" v-model="searchQuery" @keyup.enter="searchVideos" @click="goToSearch" />
        </div>
        <KeepAlive>
            <RouterView> </RouterView>
        </KeepAlive>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getSearchResult, Video } from '@/services/videos';
import { useRouter } from 'vue-router';
const videos = ref<Video[]>([]);
const router = useRouter();
const search = ref<HTMLInputElement>();
const placeholder = ref<string>('');
const pageType = ref("recommend")
import { defaultSearchContent } from '@/apis/bilibili';

const searchQuery = ref<string>('');

function goToSearch() {
    console.log('go to search page')
    router.push('/root/videos/search_page')
}

async function searchVideos() {
    pageType.value = "search";
    videos.value.length = 0;
    getSearchResult(searchQuery.value).then((res) => {
        videos.value.push(...res.result)
    })
}
onMounted(async () => {
    const data = await defaultSearchContent();
    placeholder.value = data.body.data.show_name;
})
</script>

<style scoped></style>