<template>
    <!-- HeaderLayout.vue -->
    <div class="header-layout">
        <div style="height: 25px; width: 100%;" class="relative">
            <ControllerBar></ControllerBar>
        </div>
        <div style="width: 100%; height: calc(100%); overflow-y: hidden;">
            <!-- <RouterView v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </RouterView> -->
            <RouterView></RouterView>
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