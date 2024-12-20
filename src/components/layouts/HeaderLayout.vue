<template>
    <!-- HeaderLayout.vue -->
    <div class="header-layout">
        <header>
            <ControllerBar></ControllerBar>
        </header>
        <main style="width: 100%; height: calc(100%); margin-top: 15px; overflow-y: hidden;">
            <!-- <RouterView v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </RouterView> -->
            <RouterView></RouterView>
        </main>
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