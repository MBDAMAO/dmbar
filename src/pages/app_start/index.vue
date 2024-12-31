<template>
    <div class="h-full w-full bg-black"></div>
</template>

<script setup lang='ts'>
import { onMounted } from "vue";
import { check } from "@/services/checkInit";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
    await check();
    router.push('/root/videos');
});
</script>

<style scoped></style>
