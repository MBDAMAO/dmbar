<template>
    <div class="h-full w-full overflow-y-auto">
        <div class="absolute top-0 left-0 z-[-1] h-full w-full"></div>

        <div v-for="(section, sectionIndex) in config.sections" :key="section.name">
            <Title :label="section.title" />

            <div v-for="(component, index) in section.components" :key="index">
                <Selector v-if="component.type === 'selector'" :name="component.name" :sub="component.sub"
                    :options="component.options" :config-path="{
                        sectionIndex: Number(sectionIndex), componentIndex: index
                    }" :value="component.value">
                    <div v-if="component.image">
                        <div class="h-full aspect-square rounded-full overflow-hidden mr-4">
                            <img :src="component.image" />
                        </div>
                    </div>
                </Selector>

                <Switch v-if="component.type === 'switch'" :name="component.name" :sub="component.sub"
                    :status="component.value" :config-path="{
                        sectionIndex: Number(sectionIndex), componentIndex: index
                    }" />

                <Input v-if="component.type === 'input'" :name="component.name" :sub="component.sub"
                    :value="component.value" :config-path="{
                        sectionIndex: Number(sectionIndex), componentIndex: index
                    }" />
            </div>

            <Spliter />
        </div>
        <UpdateCheck></UpdateCheck>
    </div>
</template>



<script setup lang="ts">
import Selector from './components/Selector.vue';
import Spliter from './components/Spliter.vue';
import Title from './components/Title.vue';
import Input from './components/Input.vue';
import { useConfig } from '@/stores/config';
import Switch from './components/Switch.vue';
import UpdateCheck from './components/UpdateCheck.vue';

const config = useConfig().config;
</script>