<template>
    <div class="h-full w-full text-[--text-color] overflow-auto">
        <div>
            <div class="flex justify-between items-center mb-3">
                <div class="line-clamp-1">热搜</div>
                <div>shna</div>
            </div>
            <div class="grid mb-5">
                <div v-for="hot in hot" class="line-container bg-[--bg2] cursor-pointer line-clamp-1">
                    {{ hot.text }}
                </div>
            </div>
        </div>

        <div>
            <div class="flex justify-between items-center mb-3">
                <div class="line-clamp-1">搜索历史</div>
                <div>shna</div>
            </div>
            <div class="mb-5 flex flex-wrap">
                <div v-for="history in history" class="line-container mr-2 bg-[--bg2] line-clamp-1 cursor-pointer mb-2"
                    style="max-width: 25%;">
                    {{ history.text }}
                </div>
            </div>
        </div>

        <div>
            <div class="flex justify-between items-center mb-3 h-10">
                <div class="line-clamp-1">搜索发现</div>
                <div class="h-full p-3 cursor-pointer">
                    <Refresh></Refresh>
                </div>
            </div>
            <div class="grid mb-5">
                <div v-for="find in find" class="line-container bg-[--bg2] cursor-pointer line-clamp-1">
                    {{ find.text }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Refresh from '@/icons/Refresh.vue';
import { hotSearchWords } from '@/apis/bilibili';
const hot = ref([])
const history = ref([{
    text: 'title'
},
{
    text: 'title'
},
{
    text: '对外的好多都爱到哪里我电脑点'
},
{
    text: '对外的好多都爱到哪里我电脑点'
},
{
    text: '对外的好多都爱到哪里我电脑点'
},
{
    text: 'title'
}])
const find = ref([{
    text: 'title'
},
{
    text: 'title'
},
{
    text: 'title'
},
{
    text: 'title'
}])
onMounted(async () => {
    const data = await hotSearchWords();
    const mappedWordList = data.body.data.list.map((item) => {
        return {
            text: item.show_name
        }
    })
    hot.value.push(...mappedWordList)
})
</script>
<style scoped>
.grid {
    display: grid;
    gap: 8px;
}

.line-container {
    background-color: var(--bg2);
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    line-height: 30px;
    font-size: 15px;
}

/* 小屏幕（手机） */
@media (max-width: 300px) {
    .grid {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

/* 小屏幕（手机） */
@media (min-width: 300px) and (max-width: 767px) {
    .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* 中等屏幕（平板） */
@media (min-width: 768px) and (max-width: 1023px) {
    .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

/* 大屏幕（桌面） */
@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}
</style>