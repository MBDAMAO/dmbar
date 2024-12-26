mod api;
mod cmds;
mod error;
mod eval;
mod global;
mod http;
mod init;
mod parser;
mod platform;
mod tray;
mod utils;
use crate::parser::{parse_bilibili, parse_douyin, parse_douyu, parse_huya};
#[macro_use]
extern crate tracing;
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
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            #[cfg(all(desktop))]
            {
                let handle = app.handle();
                tray::create_tray(handle)?;
            }
            Ok(())
        })
        .setup(init::init)
        // .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            cmds::greet,
            cmds::get_kline,
            cmds::get_orders,
            api::get_request,
            cmds::fetch_videos,
            cmds::get_image_base64,
            cmds::fetch_video_url,
            cmds::video_detail,
            cmds::send_request,
            parse_bilibili
        ]);
    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(devtools);
    }
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_window_state::Builder::new().build());
    }
    let app = builder
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    app.run(|_, _| {});
}
