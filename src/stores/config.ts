import { defineStore } from "pinia";
import { readFile, writeFile } from "@/apis/fs";
import { ref, watchEffect } from "vue";
import { Config } from "@/types/config";

export const useConfig = defineStore("config", () => {
  const config = ref<Config>();
  const loadConfig = async () => {
    const configRaw = await readFile("config.json");
    config.value = JSON.parse(configRaw);
  };
  const saveConfig = async () => {
    await writeFile("config.json", JSON.stringify(config.value));
  };

  const useBilibiliCookie = () => {
    return config.value?.sections[2].components[1].value;
  };

  watchEffect(() => {
    document.documentElement.dataset.theme =
      config.value?.sections[1].components[1].value;
  });

  return {
    config,
    loadConfig,
    useBilibiliCookie,
    saveConfig,
  };
});
