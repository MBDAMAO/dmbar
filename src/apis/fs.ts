import {
  exists,
  BaseDirectory,
  writeTextFile,
  readTextFile,
  stat,
  create,
} from "@tauri-apps/plugin-fs";
export const fileExists = async (filename: string) => {
  return await exists(filename, {
    baseDir: BaseDirectory.AppLocalData,
  });
};

export const ceateFile = async (filename: string) => {
  const file = await create(filename, {
    baseDir: BaseDirectory.AppLocalData,
  });
  await file.write(new TextEncoder().encode(""));
  await file.close();
};

export const writeFile = async (filename: string, data: string) => {
  return await writeTextFile(filename, data, {
    baseDir: BaseDirectory.AppLocalData,
  });
};

export const readFile = async (filename: string) => {
  return await readTextFile(filename, {
    baseDir: BaseDirectory.AppLocalData,
  });
};

export const fileMetaData = async (filename: string) => {
  return await stat(filename, {
    baseDir: BaseDirectory.AppLocalData,
  });
};
