<template>
    <div class="absolute top-1/2 left-1/2 h-[20%] w-[20%] flex items-center justify-center z-10 transform -translate-x-1/2 -translate-y-1/2"
        @click="change()" v-show="!playing">
        <Pause />
    </div>
</template>
<script setup lang='ts'>
</script>
<style scoped></style>