use anyhow::Result;
type CmdResult<T = ()> = Result<T, String>;
use serde::Serialize;
use serde_json::Value;
// use crate::utils::db;
use binance_spot_connector_rust::{http::Credentials, hyper::BinanceHttpClient, market, trade};

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub async fn get_kline(symbol: &str) -> CmdResult<String> {
    let client = BinanceHttpClient::default();

    match client
        .send(market::klines(symbol, market::klines::KlineInterval::Days1))
        .await
    {
        Ok(response) => {
            let body = response
                .into_body_str()
                .await
                .unwrap_or_else(|_| "Failed to parse body".to_string());
            Ok(body)
        }
        Err(_) => Err("Request failed".to_string()),
    }
}

#[tauri::command]
pub async fn get_orders(symbol: &str) -> CmdResult<String> {
    let api_key = "1".to_string();
    let api_secret = "1".to_string();
    let client = BinanceHttpClient::default()
        .credentials(Credentials::from_hmac(api_key.clone(), api_secret.clone()));

    match client.send(trade::all_orders(symbol)).await {
        Ok(response) => {
            // Print the response for debugging
            println!("Response: {:?}", response);

            let body = response
                .into_body_str()
                .await
                .unwrap_or_else(|_| "Failed to parse body".to_string());
            Ok(body)
        }
        Err(_) => Err("Request failed".to_string()),
    }
}

#[derive(Serialize)]
pub struct VideoItem {
    bvid: String,
    title: String,
    pic: String,
    uri: String,
    owner: Owner,
}

#[derive(Serialize)]
pub struct Owner {
    name: String,
    face: String,
    mid: u64,
}

#[tauri::command]
pub async fn fetch_videos() -> Result<Vec<VideoItem>, String> {
    let url = "https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd";
    let client = reqwest::Client::new();
    let sessdata = "3fd35e39%2C1749567752%2C22002%2Ac2CjBYs8YsItSGB5NqefLAAWhBIRF9Kh46_lnQ3kiyTpXJkXXBMoWRn-702YgfRudfXQUSVmR2SVQ5NGNXdi0yUnc0QXE1Rkt1bTZzNGdldTctRDUzaEw0RjJ5M1BzamxjOUZCMGtTcXBTMW5HTkJLU3BmeXl6bzQ1WnZ1ZVBWVXNDWURCSkR4Smx3IIEC"; // 替换为实际的 SESSDATA

    let response = client
        .get(url)
        .query(&[("fresh_type", "4"), ("ps", "12"), ("fresh_idx", "1")])
        .header("Cookie", format!("SESSDATA={}", sessdata))
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let data: Value = response.json().await.map_err(|err| err.to_string())?;
    if data["code"] == 0 {
        let items = data["data"]["item"]
            .as_array()
            .unwrap_or(&vec![])
            .iter()
            .map(|item| VideoItem {
                bvid: item["bvid"].as_str().unwrap_or("").to_string(),
                title: item["title"].as_str().unwrap_or("").to_string(),
                pic: item["pic"].as_str().unwrap_or("").to_string(),
                uri: item["uri"].as_str().unwrap_or("").to_string(),
                owner: Owner {
                    name: item["owner"]["name"].as_str().unwrap_or("").to_string(),
                    face: item["owner"]["face"].as_str().unwrap_or("").to_string(),
                    mid: item["owner"]["mid"].as_u64().unwrap_or(0),
                },
            })
            .collect();
        Ok(items)
    } else {
        Err(data["message"]
            .as_str()
            .unwrap_or("Unknown error")
            .to_string())
    }
}
