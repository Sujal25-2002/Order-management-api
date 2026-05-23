import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { query } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

async function runSqlFile(filePath) {
  const sql = await readFile(filePath, "utf8");
  await query(sql);
}

async function bootstrapDatabase() {
  const schemaPath = path.join(projectRoot, "sql", "schema.sql");
  const seedAdminPath = path.join(projectRoot, "sql", "seed-admin.sql");

  try {
    await runSqlFile(schemaPath);
    await runSqlFile(seedAdminPath);
    console.log("Database bootstrap completed.");
  } catch (error) {
    console.error("Database bootstrap failed:", error.message);
    throw error;
  }
}

export default bootstrapDatabase;
