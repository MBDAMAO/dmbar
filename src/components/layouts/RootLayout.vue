<template>
    <!-- RootLayout.vue -->
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