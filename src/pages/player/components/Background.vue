<template>
    <div class="absolute inset-0 bg-black z-[-3] transition-opacity"></div>
    <div class="absolute inset-0 z-[-2] overflow-hidden">
        <canvas id="canvas" class="h-full w-full scale-120 blur-[30px]" ref="canvas"></canvas>
    </div>
    <div class="absolute inset-0 z-[-1] shadow-[inset_0_0_50px_20px_rgba(0,0,0,0.5)]"></div>
</template>

<script setup lang="ts">
const canvas = defineProps(['canvas']);
</script>