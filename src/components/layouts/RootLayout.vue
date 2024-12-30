<template>
    <!-- RootLayout.vue -->
    <div style="background: var(--bg1);" class="absolute top-0 left-0 -z-10 h-full w-full"></div>
    <div class="parent-page">
        <!-- <RouterView v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </RouterView> -->
        <RouterView></RouterView>
    </div>
</template>

<script setup>
const onBack = () => {
    console.log('back');
};

const onForward = () => {
    console.log('forward');
};
</script>

<style scoped>
.parent-page {
    width: 100%;
    height: 100%;
}
</style>