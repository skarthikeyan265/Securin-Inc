import fs from "fs";
import db from "./db.js";

const JSON_FILE = "./recipes.json";

function toNullableNumber(v) {
  // Handles JS NaN, string "NaN", empty, null, undefined
  if (v === null || v === undefined) return null;
  if (typeof v === "string" && v.trim().toLowerCase() === "nan") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function safeStr(v) {
  if (v === null || v === undefined) return null;
  return String(v);
}

function insertRecipe(r) {
  const cuisine = safeStr(r.cuisine);
  const title = safeStr(r.title);
  const rating = toNullableNumber(r.rating);
  const prep_time = toNullableNumber(r.prep_time);
  const cook_time = toNullableNumber(r.cook_time);
  const total_time = toNullableNumber(r.total_time);
  const description = safeStr(r.description);
  const nutrients = JSON.stringify(r.nutrients || {});
  const serves = safeStr(r.serves);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO recipes (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

async function main() {
  const raw = fs.readFileSync(JSON_FILE, "utf-8");
  const data = JSON.parse(raw);

  console.log(`Importing ${data.length} recipes...`);
  for (const r of data) {
    await insertRecipe(r);
  }
  console.log("Import completed.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
