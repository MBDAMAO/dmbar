mod cmds;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 单例检测
    // let app_exists: bool = tauri::async_runtime::block_on(async move {
    //     if server::check_singleton().await.is_err() {
    //         println!("app exists");
    //         true
    //     } else {
    //         false
    //     }
    // });
    // if app_exists {
    //     return;
    // }

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            cmds::greet,
            cmds::get_kline,
            cmds::get_orders
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
