<template>
    <div class="cursor-pointer pl-4 pr-4 pb-3 pt-3 relative h-[60px] w-full overflow-hidden flex justify-between"
        v-ripple>
        <div class="flex">
            <slot name="left"></slot>
            <div class="h-full">
                <div class="h-1/2 flex items-center text-base font">
                    {{ name }}
                </div>
                <div class="h-1/2 flex items-center text-sm font">
                    {{ sub }}
                </div>
            </div>
        </div>
        <slot name="right"></slot>
    </div>
</template>
<script setup lang='ts'>
defineProps({
    name: String,
    sub: String,
})
</script>
<style scoped></style>