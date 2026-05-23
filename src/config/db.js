import pg from "pg";

import env from "./env.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.databaseUrl,
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function testDatabaseConnection() {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}

export { pool, query, testDatabaseConnection };
