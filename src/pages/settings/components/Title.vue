<template>
    <div class="p-4">
        <h1 class="text-lg font-semibold font">{{ label }}</h1>
    </div>
</template>
<script setup lang='ts'>
defineProps({
    label: String
})
</script>
<style scoped></style>