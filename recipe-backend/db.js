// db.js
import sqlite3 from "sqlite3";

sqlite3.verbose();

// Create or open the database file
const db = new sqlite3.Database("./recipes.db", (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");

    // Create table if not exists
    db.run(
      `CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          console.error("❌ Error creating table:", err.message);
        } else {
          console.log("✅ Recipes table ready.");
        }
      }
    );
  }
});

export default db;   // ✅ Default export
