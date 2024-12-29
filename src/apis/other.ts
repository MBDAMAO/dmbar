import { useHttp } from "../utils/http";
import { app } from "@tauri-apps/api";
export async function fetchUpdate() {
  let url = `https://api.github.com/repos/MBDAMAO/dmbar/releases/latest`;
  return await useHttp({
    url,
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });
}

export async function getVersion() {
  const version = await app.getVersion();
  return version;
}
