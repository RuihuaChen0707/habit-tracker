// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_app_version])
        .setup(|app| {
            // 获取主窗口
            if let Some(window) = app.get_webview_window("main") {
                // 设置窗口标题和图标
                if let Err(e) = window.set_title("习惯追踪器") {
                    eprintln!("警告: 无法设置窗口标题: {}", e);
                }
            } else {
                eprintln!("警告: 无法获取主窗口");
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}