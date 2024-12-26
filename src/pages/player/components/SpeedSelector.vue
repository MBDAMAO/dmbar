<template>
    <Listbox v-model="ratioNow" v-if="type !== 'live'">
        <ListboxButton class="text-white truncate">
            倍速{{ ratioNow.name }}
        </ListboxButton>
        <ListboxOptions class="absolute flex flex-col w-19"
            style="border-radius: 5px; z-index: 1000; bottom: 50px;transform: translateZ(0);
                                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);">
            <ListboxOption v-for="item in ratios" :key="item.id" :value="item" @click="switchSpeed(item.ratio)"
                class="h-30 w-full truncate cursor-pointer text-white">
                {{ item.name }}
            </ListboxOption>
        </ListboxOptions>
    </Listbox>
</template>
<script setup lang='ts'>
import { ref, reactive } from 'vue';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
const ratios = reactive([
    { id: 1, ratio: 0.125, name: '0.125x' },
    { id: 2, ratio: 0.25, name: '0.25x' },
    { id: 3, ratio: 0.5, name: '0.5x' },
    { id: 4, ratio: 1, name: '1x' },
    { id: 5, ratio: 1.5, name: '1.5x' },
    { id: 6, ratio: 2, name: '2x' },
    { id: 7, ratio: 3, name: '3x' },
])
const ratioNow = ref(ratios[3])
</script>
<style scoped></style>