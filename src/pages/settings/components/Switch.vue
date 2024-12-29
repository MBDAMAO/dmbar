<template>
    <Base @click="switch_" :name="name" :sub="sub">
    <template v-slot:right>
        <div class="h-full flex items-center">
            <Switch @click.stop v-model="enabled" :class="enabled ? 'bg-blue-600' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 items-center rounded-full">
                <span class="sr-only">Enable notifications</span>
                <span :class="enabled ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </Switch>
        </div>
    </template>
    </Base>
</template>

<script setup lang='ts'>
import Base from './Base.vue';
import { ConfigPath } from '../../../types/config';
import { useConfig } from '../../../stores/config';

const props = defineProps({
    name: String,
    sub: String,
    configPath: Object as () => ConfigPath,
    status: Boolean
})

import { Switch } from '@headlessui/vue'
import { ref } from 'vue';
const enabled = ref(props.status)
const switch_ = async () => {
    const config = useConfig().config;
    if (config == undefined) return;
    config.sections[props.configPath?.sectionIndex].components[props.configPath?.componentIndex].value = !enabled.value;
    await useConfig().saveConfig();
    enabled.value = !enabled.value;
};
</script>

<style scoped></style>