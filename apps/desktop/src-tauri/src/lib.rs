use tauri::Emitter;

#[derive(Clone, serde::Serialize)]
struct Event {
    url: String,
    event: String,
    cwd: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            let url = argv[2].clone();

            let event = url.split("://").last().unwrap().to_string();
            app.emit("deep-link", Event { url, event, cwd }).unwrap();
        }))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
