<template>
    <div class="absolute top-0 left-0 bg-slate-500 z-[-1] h-full w-full"></div>

    <Title :label="'Account'" />
    <Selector />
    <Spliter />
</template>

<script setup lang="ts">
import Selector from './components/Selector.vue';
import Spliter from './components/Spliter.vue';
import Title from './components/Title.vue';

</script>
