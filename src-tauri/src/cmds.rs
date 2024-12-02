use anyhow::Result;
type CmdResult<T = ()> = Result<T, String>;
use binance_future_connector::{
    http::Credentials as FCredentials,
    hyper::BinanceHttpClient as FBinanceHttpClient,
    market::{contract_klines::ContractType, klines::KlineInterval},
    market_stream::contract_kline::ContractKlineStream,
    trade as ftrade,
    tungstenite::BinanceWebSocketClient,
};

use crate::utils::db;
use binance_spot_connector_rust::{http::Credentials, hyper::BinanceHttpClient, market, trade};
use futures_util::sink::Sink;
use futures_util::stream::Stream;
use futures_util::{SinkExt, StreamExt};
use std::sync::Arc;
use std::sync::Mutex;
use tokio::{net::TcpListener, sync::mpsc};
use tokio_tungstenite::{accept_async, tungstenite::protocol::Message as WsMessage};
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

#[tauri::command]
async fn start_websocket_proxy() -> Result<(), String> {
    // // 使用 Arc 和 Mutex 来共享 tx 通道
    // let (tx, mut rx) = mpsc::channel::<String>(100); // 用于传递数据到前端
    // let tx = Arc::new(Mutex::new(tx)); // 将 tx 放入 Arc<Mutex> 中，供多个任务共享

    // // 启动 WebSocket 服务来监听 Tauri 前端的 WebSocket 连接
    // tokio::spawn(async move {
    //     let listener = TcpListener::bind("127.0.0.1:8081")
    //         .await
    //         .expect("Failed to bind WebSocket server");
    //     println!("WebSocket proxy server listening on ws://127.0.0.1:8081");

    //     while let Ok((socket, _)) = listener.accept().await {
    //         // 启动一个新的任务处理每个连接
    //         let mut ws_stream = accept_async(socket)
    //             .await
    //             .expect("Failed to upgrade to WebSocket");
    //         println!("New WebSocket connection");

    //         // 监听 WebSocket 连接消息
    //         let tx = tx.clone(); // 克隆 tx，传递到新的任务中
    //         tokio::spawn(async move {
    //             while let Some(message) = ws_stream.next().await {
    //                 match message {
    //                     Ok(WsMessage::Text(msg)) => {
    //                         // 收到消息后，将消息传递给 Binance WebSocket 客户端
    //                         if let Err(e) = tx.lock().unwrap().send(msg).await {
    //                             eprintln!("Error sending message to channel: {:?}", e);
    //                         }
    //                     }
    //                     Err(e) => {
    //                         eprintln!("Error reading WebSocket message: {:?}", e);
    //                     }
    //                     _ => {}
    //                 }
    //             }
    //         });
    //     }
    // });

    // // 启动 Binance WebSocket 客户端
    // tokio::spawn(async move {
    //     // Establish connection to Binance WebSocket
    //     let mut conn = BinanceWebSocketClient::connect_with_url("wss://fstream.binance.com/ws")
    //         .expect("Failed to connect to Binance WebSocket");

    //     // Subscribe to streams (Kline stream for BTCUSDT)
    //     conn.subscribe(vec![&ContractKlineStream::new(
    //         "BTCUSDT",
    //         ContractType::Perpetual,
    //         KlineInterval::Minutes1,
    //     )
    //     .into()]);

    //     // Read Binance WebSocket data and send to front-end WebSocket
    //     while let Ok(message) = conn.as_mut().read() {
    //         let data = message.into_data();
    //         let string_data =
    //             String::from_utf8(data).unwrap_or_else(|_| "Invalid UTF-8".to_string());

    //         // 向前端 WebSocket 发送数据
    //         if let Err(e) = tx.lock().unwrap().send(string_data).await {
    //             eprintln!("Error sending data to WebSocket: {:?}", e);
    //         }
    //     }
    // });

    Ok(())
}
