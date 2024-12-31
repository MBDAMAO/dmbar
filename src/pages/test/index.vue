<template>
    <div class="container">
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh" class="h-full">
            <div v-for="item in list" :key="item.id" class="item">
                {{ item.text }}
            </div>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isRefreshing = ref(false);
const list = ref([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
]);

// 模拟刷新数据
const onRefresh = () => {
    setTimeout(() => {
        list.value.unshift({
            id: list.value.length + 1,
            text: `New Item ${list.value.length + 1}`,
        });
        isRefreshing.value = false;
    }, 1000);
};
</script>

<style scoped>
.container {
    height: 100%;
    overflow: auto;
}

.item {
    padding: 16px;
    border-bottom: 1px solid #eee;
}
</style>