use sqlite::{Connection, State};
use tauri::command;

#[tauri::command]
fn init_db() -> Result<(), String> {
    // 获取应用数据目录
    let db_path = tauri::api::path::app_data_dir()
        .expect("Failed to get app data directory")
        .join("database.sqlite");

    // 连接到数据库，如果数据库不存在会自动创建
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 创建一个表格
    connection
        .execute(
            "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                age INTEGER NOT NULL
            )",
        )
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn insert_user(name: String, age: i32) -> Result<(), String> {
    // 获取应用数据目录
    let db_path = tauri::api::path::app_data_dir()
        .expect("Failed to get app data directory")
        .join("database.sqlite");

    // 连接到数据库
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 插入数据
    let mut statement = connection
        .prepare("INSERT INTO users (name, age) VALUES (?, ?)")
        .map_err(|e| e.to_string())?;
    statement.bind(1, name).map_err(|e| e.to_string())?;
    statement.bind(2, age).map_err(|e| e.to_string())?;
    statement.next().map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn get_users() -> Result<Vec<(i32, String, i32)>, String> {
    // 获取应用数据目录
    let db_path = tauri::api::path::app_data_dir()
        .expect("Failed to get app data directory")
        .join("database.sqlite");

    // 连接到数据库
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 查询所有用户
    let mut statement = connection
        .prepare("SELECT id, name, age FROM users")
        .map_err(|e| e.to_string())?;
    let mut users = Vec::new();
    while let State::Row = statement.next().map_err(|e| e.to_string())? {
        let id: i32 = statement.read(0).map_err(|e| e.to_string())?;
        let name: String = statement.read(1).map_err(|e| e.to_string())?;
        let age: i32 = statement.read(2).map_err(|e| e.to_string())?;
        users.push((id, name, age));
    }

    Ok(users)
}

#[tauri::command]
fn update_user(id: i32, name: String, age: i32) -> Result<(), String> {
    // 获取应用数据目录
    let db_path = tauri::api::path::app_data_dir()
        .expect("Failed to get app data directory")
        .join("database.sqlite");

    // 连接到数据库
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 更新数据
    let mut statement = connection
        .prepare("UPDATE users SET name = ?, age = ? WHERE id = ?")
        .map_err(|e| e.to_string())?;
    statement.bind(1, name).map_err(|e| e.to_string())?;
    statement.bind(2, age).map_err(|e| e.to_string())?;
    statement.bind(3, id).map_err(|e| e.to_string())?;
    statement.next().map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn delete_user(id: i32) -> Result<(), String> {
    // 获取应用数据目录
    let db_path = tauri::api::path::app_data_dir()
        .expect("Failed to get app data directory")
        .join("database.sqlite");

    // 连接到数据库
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 删除数据
    let mut statement = connection
        .prepare("DELETE FROM users WHERE id = ?")
        .map_err(|e| e.to_string())?;
    statement.bind(1, id).map_err(|e| e.to_string())?;
    statement.next().map_err(|e| e.to_string())?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            init_db,
            insert_user,
            get_users,
            update_user,
            delete_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
