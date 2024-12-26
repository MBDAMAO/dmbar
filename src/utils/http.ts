import { invoke } from "@tauri-apps/api/core";

interface HttpRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

interface HttpResponse {
  status: number;
  body: string;
}

export async function useHttp(req: HttpRequest): Promise<HttpResponse> {
  try {
    const response: HttpResponse = await invoke("send_request", { req });
    console.log(`[Tauri Http] result: ${response}`);
    return response;
  } catch (error) {
    console.error("[Tauri Http] error:", error);
    throw error;
  }
}
