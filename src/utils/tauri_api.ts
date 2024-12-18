import { invoke } from '@tauri-apps/api/core';
import { ElMessage } from "element-plus";

interface InvokeOptions {
    command: string; // Tauri 命令
    payload?: Record<string, unknown>; // 参数
    showError?: boolean; // 是否显示错误提示
    handleError?: (error: Error) => void; // 自定义错误处理
}

export async function invokeWrapper<T>({
    command,
    payload = {},
    showError = true,
    handleError,
}: InvokeOptions): Promise<T | null> {
    try {
        // 调用 Tauri 的 invoke
        const result = await invoke<T>(command, payload);
        console.log(`[Tauri Invoke] Command: ${command}`, result);
        return result;
    } catch (error) {
        // 默认错误处理
        if (showError) {
            console.error(`[Tauri Invoke Error] Command: ${command}`, error);
            ElMessage.error((error as Error).message || "Unknown error occurred.");
        }

        // 自定义错误处理
        if (handleError) {
            handleError(error as Error);
        }

        return null;
    }
}
