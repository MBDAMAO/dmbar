<!-- ControlBar.vue -->
<template>
    <div class="control-bar flex w-full">
        <div class="ml-5 h-5 w-5" @click="togglePlay">
            <Pause2 v-show="!playing" />
            <Play v-show="playing" />
        </div>
        <div class="text-white pl-4" v-if="type !== 'live'">{{ timeNow }} / {{ duration }}</div>
        <div class="ml-5 h-5 w-5" @click="refresh" v-if="type === 'live'">
            <Refresh />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    playing: Boolean,
    timeNow: String,
    duration: String,
    type: String
});
defineEmits(['togglePlay', 'refresh']);
</script>