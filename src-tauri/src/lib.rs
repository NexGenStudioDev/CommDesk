use tauri::{LogicalSize, Manager, WebviewWindow};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// tauri.conf.json's width/height (1200x800) are only used as a fallback for
// the brief moment before this runs, and as the size on platforms where
// monitor info is unavailable at startup. The window starts hidden
// (`visible: false` in tauri.conf.json) so the resize below never causes a
// visible flash.
const TARGET_WORK_AREA_RATIO: f64 = 0.75;
const MIN_LOGICAL_WIDTH: f64 = 1000.0;
const MIN_LOGICAL_HEIGHT: f64 = 700.0;
const MAX_LOGICAL_WIDTH: f64 = 1600.0;
const MAX_LOGICAL_HEIGHT: f64 = 1000.0;

/// Resizes and centers the window relative to the current monitor's
/// available work area (screen size minus taskbars/docks), scaled for its
/// DPI, and clamped to a sane min/max so it is never unusably small on a
/// dense display nor absurdly large on an ultrawide one.
fn size_window_for_monitor(window: &WebviewWindow) {
    let monitor = match window.primary_monitor() {
        Ok(Some(monitor)) => monitor,
        _ => return,
    };

    let scale_factor = monitor.scale_factor();
    let work_area_logical: LogicalSize<f64> = monitor.work_area().size.to_logical(scale_factor);

    let target_width =
        (work_area_logical.width * TARGET_WORK_AREA_RATIO).clamp(MIN_LOGICAL_WIDTH, MAX_LOGICAL_WIDTH);
    let target_height = (work_area_logical.height * TARGET_WORK_AREA_RATIO)
        .clamp(MIN_LOGICAL_HEIGHT, MAX_LOGICAL_HEIGHT);

    let _ = window.set_size(LogicalSize::new(target_width, target_height));
    let _ = window.center();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                size_window_for_monitor(&window);
                // Always show, even if monitor detection above failed —
                // the window must never stay hidden.
                let _ = window.show();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
