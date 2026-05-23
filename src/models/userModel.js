import { query } from "../config/db.js";

async function createUser({ name, email, passwordHash, role = "USER" }) {
  const sql = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at
  `;

  const values = [name, email, passwordHash, role];
  const result = await query(sql, values);
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await query(
    "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1 LIMIT 1",
    [email],
  );

  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1",
    [id],
  );

  return result.rows[0] || null;
}

export { createUser, findUserByEmail, findUserById };
