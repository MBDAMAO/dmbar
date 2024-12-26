<!-- ControlBar.vue -->
<template>
    <div class="flex w-full h-full justify-between">
        <div class="flex items-center w-7/10">
            <div class="ml-5 h-5 w-5" @click="change()">
                <Pause2 v-show="!playing" />
                <Play v-show="playing" />
            </div>
            <div class="text-white pl-4" v-if="type !== 'live'">{{ timeNow }} / {{ duration }}</div>
            <div class="ml-5 h-5 w-5" @click="refresh()" v-if="type === 'live'">
                <Refresh />
            </div>
            <div class="ml-5 h-5 w-5" @click="reload()" v-if="type === 'live'">
                <Link />
            </div>
        </div>
        <div class="relative flex items-center justify-end w-3/10">
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
        </div>
        <div class="flex items-center justify-end w-3/10">
            <Listbox v-model="selectedPerson" v-if="type === 'live'">
                <ListboxButton class="text-white truncate">
                    {{ selectedPerson.name }}
                </ListboxButton>
                <ListboxOptions class="absolute flex flex-col w-80"
                    style="border-radius: 5px;transform: translateZ(0);z-index: 1000; bottom: 50px;
                                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);">
                    <ListboxOption v-for="url in urls" :key="url.id" :value="url" :disabled="url.unavailable"
                        @click="reload(url.name)" class="h-30 w-full truncate cursor-pointer text-white">
                        {{ url.name }}
                    </ListboxOption>
                </ListboxOptions>
            </Listbox>
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