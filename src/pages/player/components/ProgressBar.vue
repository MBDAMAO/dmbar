<template>
    <div @click="tapProgressBar" ref="progressBar"
        class="cursor-pointer w-full pb-0.5 opacity-50 hover:opacity-90 transition-opacity">
        <div class="h-0.5 bg-gray-500">
            <div class="h-full bg-white" :style="{ width: progressWidth }"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
const progressBar = ref(null);
const progressWidth = defineProps(['progressWidth']);

function tapProgressBar(event: Event) {
    let rect = progressBar.value.getBoundingClientRect();
    let clickPercentage = (event.clientX - rect.left) / rect.width;
    emit('seek', clickPercentage);
}
</script>
