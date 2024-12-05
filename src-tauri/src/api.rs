use reqwest::Client;
use reqwest::Error;
use serde::{Deserialize, Serialize};
use tauri::Manager;

// 定义一个结构体用于接收 API 响应
#[derive(Serialize, Deserialize, Debug)]
pub struct ApiResponse {
    pub status: String,
    pub message: String,
}

// GET 请求的示例
#[tauri::command]
pub async fn get_request(url: String) -> Result<ApiResponse, String> {
    let client = Client::new();
    match client.get(&url).send().await {
        Ok(response) => match response.json::<ApiResponse>().await {
            Ok(response_data) => Ok(response_data),
            Err(_) => Err("Failed to parse JSON response".to_string()),
        },
        Err(_) => Err("Failed to send GET request".to_string()),
    }
}

// POST 请求的示例
#[tauri::command]
async fn post_request(url: String, data: ApiResponse) -> Result<ApiResponse, String> {
    let client = Client::new();
    match client.post(&url).json(&data).send().await {
        Ok(response) => match response.json::<ApiResponse>().await {
            Ok(response_data) => Ok(response_data),
            Err(_) => Err("Failed to parse JSON response".to_string()),
        },
        Err(_) => Err("Failed to send POST request".to_string()),
    }
}

// PUT 请求的示例
#[tauri::command]
async fn put_request(url: String, data: ApiResponse) -> Result<ApiResponse, String> {
    let client = Client::new();
    match client.put(&url).json(&data).send().await {
        Ok(response) => match response.json::<ApiResponse>().await {
            Ok(response_data) => Ok(response_data),
            Err(_) => Err("Failed to parse JSON response".to_string()),
        },
        Err(_) => Err("Failed to send PUT request".to_string()),
    }
}

// DELETE 请求的示例
#[tauri::command]
async fn delete_request(url: String) -> Result<String, String> {
    let client = Client::new();
    match client.delete(&url).send().await {
        Ok(response) => match response.text().await {
            Ok(response_text) => Ok(response_text),
            Err(_) => Err("Failed to parse response text".to_string()),
        },
        Err(_) => Err("Failed to send DELETE request".to_string()),
    }
}
