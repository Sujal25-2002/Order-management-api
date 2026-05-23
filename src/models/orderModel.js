import { query } from "../config/db.js";

async function createOrder({ userId, symbol, orderType, quantity, price, status = "PENDING" }) {
  const sql = `
    INSERT INTO orders (user_id, symbol, order_type, quantity, price, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at
  `;

  const values = [userId, symbol, orderType, quantity, price, status];
  const result = await query(sql, values);
  return result.rows[0];
}

async function findOrdersByUserId(userId, { limit, offset }) {
  const sql = `
    SELECT id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const countResult = await query(
    "SELECT COUNT(*)::int AS total FROM orders WHERE user_id = $1",
    [userId],
  );
  const dataResult = await query(sql, [userId, limit, offset]);

  return {
    total: countResult.rows[0].total,
    rows: dataResult.rows,
  };
}

async function findOrderByIdAndUserId(orderId, userId) {
  const sql = `
    SELECT id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at
    FROM orders
    WHERE id = $1 AND user_id = $2
    LIMIT 1
  `;

  const result = await query(sql, [orderId, userId]);
  return result.rows[0] || null;
}

async function updateOrderById(orderId, { symbol, orderType, quantity, price, status }) {
  const sql = `
    UPDATE orders
    SET symbol = $2,
        order_type = $3,
        quantity = $4,
        price = $5,
        status = $6,
        updated_at = NOW()
    WHERE id = $1
    RETURNING id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at
  `;

  const values = [orderId, symbol, orderType, quantity, price, status];
  const result = await query(sql, values);
  return result.rows[0] || null;
}

async function deleteOrderById(orderId) {
  const sql = `
    DELETE FROM orders
    WHERE id = $1
    RETURNING id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at
  `;

  const result = await query(sql, [orderId]);
  return result.rows[0] || null;
}

async function findAllOrders({ limit, offset }) {
  const sql = `
    SELECT
      o.id,
      o.user_id,
      u.name AS user_name,
      u.email AS user_email,
      o.symbol,
      o.order_type,
      o.quantity,
      o.price,
      o.status,
      o.created_at,
      o.updated_at
    FROM orders o
    INNER JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const countResult = await query("SELECT COUNT(*)::int AS total FROM orders");
  const dataResult = await query(sql, [limit, offset]);

  return {
    total: countResult.rows[0].total,
    rows: dataResult.rows,
  };
}

export {
  createOrder,
  findOrdersByUserId,
  findOrderByIdAndUserId,
  updateOrderById,
  deleteOrderById,
  findAllOrders,
};
