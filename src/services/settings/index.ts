import { execute } from "@/apis/db";

export const initSettings = async () => {
  return execute("CREATE TABLE IF NOT EXISTS settings (key TEXT, value TEXT)");
};

export const saveSetting = async (key: string, value: string) => {
  return execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [
    key,
    value,
  ]);
};

export const getAllSettings = async () => {
  return execute("SELECT * FROM settings");
};

export const getSetting = async (key: string) => {
  return execute("SELECT * FROM settings WHERE key = ?", [key]);
};
