import Database from "@tauri-apps/plugin-sql";

const db = await Database.load("sqlite:data.db");

export const execute = async (sql: string, params?: Array<string>) => {
  if (params == null) {
    return db.execute(sql).catch(console.error);
  } else {
    return db.execute(sql, params).catch(console.error);
  }
};

export const close = async () => {
  return db.close().catch(console.error);
};
