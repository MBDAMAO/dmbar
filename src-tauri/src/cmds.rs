use anyhow::Result;
type CmdResult<T = ()> = Result<T, String>;
use serde_json::Value;
// use crate::utils::db;
use base64::encode;
use binance_spot_connector_rust::{http::Credentials, hyper::BinanceHttpClient, market, trade};
use reqwest;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::error::Error;
#[derive(Deserialize, Debug)]
struct PlayurlResponse {
    code: i32,
    data: Option<PlayurlData>,
}

#[derive(Deserialize, Debug)]
struct PlayurlData {
    dash: Option<Dash>,
}

#[derive(Deserialize, Debug)]
struct Dash {
    video: Option<Vec<VideoStream>>,
}

#[derive(Deserialize, Debug)]
struct VideoStream {
    baseUrl: Option<String>,
    backupUrl: Option<Vec<String>>,
    // 你可以添加其他字段，根据实际需求
}
#[derive(Default)]
struct MyState {
    s: std::sync::Mutex<String>,
    t: std::sync::Mutex<std::collections::HashMap<String, String>>,
}
// bvid: string,
// sessdata: string,
// aid?: string
// ) {
// const url = "https://api.bilibili.com/x/web-interface/view";
// const params = new URLSearchParams();
// console.log("wtf")
// if (bvid) {
//   params.append("bvid", bvid);
// } else if (aid) {
//   params.append("aid", aid);
// } else {
//   throw new Error("必须提供 bvid 或 aid");
// }

// try {
//   const response = await fetch(`${url}?${params.toString()}`, {
//     method: "GET",
//     headers: appendCookieToHeaders(sessdata), // 将 Cookie 添加到请求头
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP 错误：${response.status}`);
//   }

//   // 解析 JSON 响应
//   const data = await response.json();

//   if (data.code !== 0) {
//     throw new Error(`API 错误：${data.message}`);
//   }

//   return data.data; // 返回视频详细信息
// } catch (error) {
//   console.error("获取视频详细信息失败：", error);
// }
// }

#[tauri::command]
pub async fn video_detail(bvid: &str, sessdata: &str) -> Result<Value, String> {
    let url = format!(
        "https://api.bilibili.com/x/web-interface/view?bvid={}",
        bvid
    );
    let client = Client::new();
    let res = client
        .get(&url)
        .header("User-Agent", "Mozilla/5.0")
        .header("Cookie", format!("SESSDATA={}", sessdata))
        .send()
        .await
        .map_err(|e| format!("请求失败: {}", e))?;

    if !res.status().is_success() {
        return Err(format!("请求失败，状态码: {}", res.status()));
    }

    let data: Value = res
        .json()
        .await
        .map_err(|e| format!("解析 JSON 失败: {}", e))?;

    // println!("data: {:?}", data);

    Ok(data)
}

#[tauri::command]
pub async fn fetch_video_url(bvid: &str, cid: u64, qn: u32) -> Result<String, String> {
    let url = format!(
        "https://api.bilibili.com/x/player/playurl?bvid={}&cid={}&qn={}&fnval=80&fnver=0&fourk=1",
        bvid, cid, qn
    );

    let sessdata = "3fd35e39%2C1749567752%2C22002%2Ac2CjBYs8YsItSGB5NqefLAAWhBIRF9Kh46_lnQ3kiyTpXJkXXBMoWRn-702YgfRudfXQUSVmR2SVQ5NGNXdi0yUnc0QXE1Rkt1bTZzNGdldTctRDUzaEw0RjJ5M1BzamxjOUZCMGtTcXBTMW5HTkJLU3BmeXl6bzQ1WnZ1ZVBWVXNDWURCSkR4Smx3IIEC"; // 替换为实际的 SESSDATA

    // 使用 reqwest 客户端发送请求
    let client = Client::new();
    let res = client
        .get(&url)
        .header("User-Agent", "Mozilla/5.0")
        .header("Cookie", format!("SESSDATA={}", sessdata))
        .send()
        .await
        .map_err(|e| format!("请求失败: {}", e))?;

    // 解析 JSON 响应
    let playurl_response: PlayurlResponse = res
        .json()
        .await
        .map_err(|e| format!("解析 JSON 失败: {}", e))?;

    if let Some(data) = playurl_response.data {
        if let Some(dash) = data.dash {
            // 从视频流信息中选择第一个视频流
            if let Some(video_streams) = dash.video {
                for stream in video_streams {
                    // 检查是否有 baseUrl
                    if let Some(base_url) = stream.baseUrl {
                        return Ok(base_url); // 返回视频流的 URL
                    }
                }
            }
        }
    }

    Err("未找到合适的视频流 URL".into())
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
pub async fn get_image_base64(url: String) -> Result<String, String> {
    match reqwest::get(&url).await {
        Ok(response) => {
            if response.status().is_success() {
                let bytes = response.bytes().await.map_err(|e| e.to_string())?;
                let base64_image = encode(bytes);
                Ok(format!("data:image/jpeg;base64,{}", base64_image)) // 假设是 JPEG 图片
            } else {
                Err(format!("Failed to fetch image: {}", response.status()))
            }
        }
        Err(err) => Err(format!("Error fetching image: {}", err)),
    }
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
