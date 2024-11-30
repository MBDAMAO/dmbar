use anyhow::Result;
type CmdResult<T = ()> = Result<T, String>;
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
    let api_key = "12".to_string();
    let api_secret = "12".to_string();
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
