import { fileExists, ceateFile, writeFile } from "@/apis/fs";
import { useConfig } from "@/stores/config";
import { defaultConfig, Config } from "@/types/config";
import { initSettings } from "./settings";
export const check = async () => {
  let isInitConfig = await fileExists("config.json");
  if (!isInitConfig) {
    await ceateFile("config.json");
    const config: Config = defaultConfig;
    await writeFile("config.json", JSON.stringify(config));
  }

  const config = useConfig();
  await config.loadConfig();

  initSettings();
};
