use anyhow::Result;
type CmdResult<T = ()> = Result<T, String>;
use binance_spot_connector_rust::{http::Credentials, market, trade, ureq::BinanceHttpClient};

#[tauri::command]
pub fn copy_clash_env() -> CmdResult {
    Ok(())
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn get_kline(symbol: &str) -> String {
    let client = BinanceHttpClient::default();

    let response = client.send(market::klines(symbol, market::klines::KlineInterval::Days1));

    let body = response
        .expect("Request failed")
        .into_body_str()
        .expect("Failed to parse body");
    body
}

#[tauri::command]
pub fn get_orders(symbol: &str) -> String {
    let api_key = "12".to_string();
    let api_secret = "12".to_string();
    let client = BinanceHttpClient::default()
        .credentials(Credentials::from_hmac(api_key.clone(), api_secret.clone()))
        .timestamp_delta(5000);

    let response = client.send(trade::all_orders(symbol));

    let body = response
        .expect("Request failed")
        .into_body_str()
        .expect("Failed to parse body");
    body
}
