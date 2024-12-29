<template>
    <div>
        <!-- Base Component that triggers the opening of new pages -->
        <Base :name="name" :sub="sub" @click="openNewSettingPage()" />

        <!-- Transition group for page animations -->
        <transition-group name="page-slide" tag="div" class="page-wrapper">
            <!-- Each 'page' gets stacked in this wrapper -->
            <div v-for="(page, index) in pages" :key="page.id" class="page" :style="{ zIndex: index }">
                <!-- Page Content -->
                <div class="page-content">
                    <h2>{{ page.name }}</h2>
                    <p>{{ page.sub }}</p>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Base from './Base.vue';

defineProps({
    name: String,
    sub: String,
    id: String
});
let numb = 1;

// Store the pages in a reactive array
const pages = ref<{ id: string; name: string; sub: string }[]>([]);

function openNewSettingPage() {
    // Add a new page to the stack when the base component is clicked
    pages.value.push({
        id: `page-${Date.now()}`,
        name: `New Setting Page${numb++}`,
        sub: 'Description for the new setting page',
    });
}
</script>

<style scoped>
.page-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    /* Ensure the container fills the screen height */
    overflow: hidden;
    /* Prevent pages from overflowing the container */
}

.page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Ensure the page takes full height of the container */
}

.page-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* Transition styles */
.page-slide-enter-from {
    transform: translateX(100%);
}

.page-slide-enter-active {
    transition: transform 0.2s ease-in-out;
}

.page-slide-enter-to {
    transform: translateX(0%);
}
</style>