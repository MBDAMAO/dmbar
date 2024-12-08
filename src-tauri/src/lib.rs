mod api;
mod cmds;
mod init;
mod tray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // check singleton
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

    #[cfg(target_os = "linux")]
    std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");

    #[cfg(debug_assertions)]
    let devtools = tauri_plugin_devtools::init();

    let mut builder = tauri::Builder::default()
        .setup(|app| {
            #[cfg(all(desktop))]
            {
                let handle = app.handle();
                tray::create_tray(handle)?;
            }
            Ok(())
        })
        .setup(init::init)
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            cmds::greet,
            cmds::get_kline,
            cmds::get_orders,
            api::get_request
        ]);
    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(devtools);
    }
    let app = builder
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    app.run(|_, _| {});
}
