<template>
    <!-- HeaderLayout.vue -->
    <div class="header-layout">
        <ControllerBar></ControllerBar>
        <div style="width: 100%; height: calc(100% - 15px);">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { RouterView } from 'vue-router'
import ControllerBar from '../controller_bar/index.vue'
</script>

<style scoped>
.header-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>