<template>
    <Teleport to="body">
        <transition name="drawer-slide">
            <div v-if="drawer" class="fixed inset-0 z-50 flex">
                <div class="bg-[--bg1] w-4/5 max-w-md shadow-lg h-full flex flex-col justify-between rounded-r-lg">
                    <div class="p-4">
                        <h2 class="text-lg font-bold text-[--text-color] border-b border-gray-200 pb-2 mb-4">
                            菜单
                        </h2>
                        <ul class="space-y-2">
                            <li v-for="item in routes" :key="item.name">
                                <RouterLink :to="item.path"
                                    class="block px-4 py-2 rounded-lg text-[--text-color] hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                    @click="drawer = false">
                                    {{ item.label }}
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                    <div class="p-4">
                        <ul class="space-y-2">
                            <li v-for="item in routes2" :key="item.name">
                                <RouterLink :to="item.path"
                                    class="block px-4 py-2 rounded-lg text-[--text-color] hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                    @click="drawer = false">
                                    {{ item.label }}
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex-1 bg-black bg-opacity-40" @click="drawer = false"></div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const drawer = ref(false)
const routes = [
    { name: "crypto", path: "/root/crypto_coin", label: "加密货币" },
    { name: "videos", path: "/root/fast_gpt", label: "视频平台" },
    { name: "live", path: "/root/live", label: "直播" },
];
const routes2 = [
    { name: "settings", path: "/root/settings", label: "设置" },
    { name: "Help & feedback", path: "/root/help", label: "Help & feedback" },
];

function changeStatus() {
    drawer.value = !drawer.value;
}

function handleBackEvent(e: PopStateEvent) {
    e.preventDefault();
    drawer.value = false;
}

onMounted(() => {
    window.addEventListener('popstate', handleBackEvent);
});

onBeforeUnmount(() => {
    window.removeEventListener('popstate', handleBackEvent);
});

defineExpose({
    changeStatus
});
</script>

<style scoped>
.drawer-slide-enter-active,
.drawer-slide-leave-active {
    transition: transform 0.3s ease-in-out;
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
    transform: translateX(-100%);
}
</style>
