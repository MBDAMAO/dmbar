<template>
    <!-- SimpleLayout.vue -->
    <div class="simple-layout">
        <router-view />
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