<template>
    <!-- SimpleLayout.vue -->
    <div class="simple-layout">
        <!-- <RouterView v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </RouterView> -->
        <RouterView></RouterView>
    </div>
</template>

<script setup lang='ts'>
</script>

<style scoped>
.simple-layout {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>