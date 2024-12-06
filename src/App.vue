<script setup lang="ts">
import { RouterView } from 'vue-router'
import ControllerBar from './components/controller_bar/index.vue'
</script>

<template>
  <div id="main-container">
    <ControllerBar></ControllerBar>
    <div style="width: 100%; height: calc(100% - 15px);">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
#main-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
