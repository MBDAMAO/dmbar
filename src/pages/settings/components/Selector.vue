<template>
    <Base @click="open()" :name="name" :sub="sub">
    <template v-slot:left>
        <slot></slot>
    </template>
    <template v-slot:right>
        <div class="h-full flex items-center aspect-square p-3">
            <More></More>
        </div>
    </template>
    </Base>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-[9999]">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                {{ name }}
                            </DialogTitle>
                            <div class="w-full px-4 py-16">
                                <div class="mx-auto w-full max-w-md">
                                    <RadioGroup v-model="selected">
                                        <RadioGroupLabel class="sr-only">Server size</RadioGroupLabel>
                                        <div class="space-y-2">
                                            <RadioGroupOption as="template" v-for="option in options" :key="option.name"
                                                :value="option" v-slot="{ active, checked }"
                                                @click="choose(option.value)">
                                                <div :class="[
                                                    active
                                                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                                                        : '',
                                                    checked ? 'bg-sky-900/75 text-white ' : 'bg-white ',
                                                ]"
                                                    class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none">
                                                    <div class="flex w-full items-center justify-between">
                                                        <div class="flex items-center">
                                                            <div class="text-sm">
                                                                <RadioGroupLabel as="p"
                                                                    :class="checked ? 'text-white' : 'text-gray-900'"
                                                                    class="font-medium">
                                                                    {{ option.name }}
                                                                </RadioGroupLabel>
                                                                <RadioGroupDescription as="span"
                                                                    :class="checked ? 'text-sky-100' : 'text-gray-500'"
                                                                    class="inline">
                                                                    <span> {{ option.sub }} </span>
                                                                </RadioGroupDescription>
                                                            </div>
                                                        </div>
                                                        <div v-show="checked" class="shrink-0 text-white">
                                                            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="12" r="12" fill="#fff"
                                                                    fill-opacity="0.2" />
                                                                <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="1.5"
                                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </RadioGroupOption>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang='ts'>
import Base from './Base.vue';
import { ConfigPath, Option } from '../../../types/config';
import { useConfig } from '../../../stores/config';
const props = defineProps({
    name: String,
    sub: String,
    options: Array<Option>,
    configPath: Object as () => ConfigPath,
    value: String,
})
import { ref } from 'vue';
import More from '../../../icons/More.vue';
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import {
    RadioGroup,
    RadioGroupLabel,
    RadioGroupDescription,
    RadioGroupOption,
} from '@headlessui/vue'

let selected = ref()
for (const option of props.options) {

    if (option.value == props.value) {
        console.log(props.value, option.value)
        selected.value = option
        break
    }
}
async function choose(value: any) {
    const config = useConfig().config;
    if (config == undefined) return;
    config.sections[props.configPath?.sectionIndex].components[props.configPath?.componentIndex].value = value;
    await useConfig().saveConfig();
}
const isOpen = ref(false)
function open() {
    openModal()
}
function closeModal() {
    isOpen.value = false
}
function openModal() {
    isOpen.value = true
}
</script>

<style scoped></style>