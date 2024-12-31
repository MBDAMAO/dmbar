<template>
    <Base @click="open()" :sub="sub" :name="name">
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
                            <div class="p-4">
                                <textarea v-model="value_" rows="5"
                                    class="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>

                                <div class="mt-4 flex justify-end space-x-2">
                                    <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        @click="save()">
                                        保存
                                    </button>
                                    <button @click="closeModal"
                                        class="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
                                        取消
                                    </button>
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
import { ref } from 'vue';
import { ConfigPath } from '@/types/config';
import Base from './Base.vue';
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import { useConfig } from '@/stores/config';
const props = defineProps({
    name: String,
    sub: String,
    configPath: Object as () => ConfigPath,
    value: String
})
const value_ = ref(props.value)
const isOpen = ref(false)
async function save() {
    const config = useConfig().config;
    if (config == undefined) return;
    config.sections[props.configPath?.sectionIndex].components[props.configPath?.componentIndex].value = value_;
    await useConfig().saveConfig();
    closeModal()
}
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