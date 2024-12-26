<template>
    <div data-tauri-drag-region
        class="absolute top-0 left-0 z-10 w-full bg-black/10 flex items-center p-2 transition-opacity duration-300"
        :class="{ 'opacity-0 pointer-events-none': !showTopBar }" @mousemove="resetHideTimeout">
        <div class="h-6 w-6" @click="$emit('go-back')">
            <Back />
        </div>
    </div>
</template>

<script setup lang="ts">
import Back from '../../../icons/Back.vue';
defineProps(['showTopBar']);
const emit = defineEmits(['go-back', 'resetTimeout']);
function resetHideTimeout() {
    emit('resetTimeout');
}
</script>
