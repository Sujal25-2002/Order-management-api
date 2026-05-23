# Order Management API

A production-ready REST API for order management built with **Node.js**, **Express.js**, and **PostgreSQL**. Implements JWT authentication, role-based access control, Joi validation, rate limiting, and centralised error handling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js v5 |
| Database | PostgreSQL (via `pg` pool) |
| Auth | JWT (`jsonwebtoken`) |
| Password Hashing | `bcrypt` |
| Validation | `joi` |
| Security | `helmet`, `cors`, `express-rate-limit` |
| Logging | `morgan` |

---

## Project Structure

```
order-management-api/
├── src/
│   ├── config/          # Database pool & environment config
│   ├── controllers/     # Request handlers (auth, order, admin)
│   ├── middlewares/     # Auth, role, validate, error, rate-limit
│   ├── models/          # Raw SQL queries (no ORM)
│   ├── routes/          # Express routers wired to controllers
│   ├── services/        # Thin helpers (token payload, user shape)
│   ├── utils/           # AppError, asyncHandler, formatDate, jwt, pagination, response
│   ├── validations/     # Joi schemas per feature
│   └── server.js        # App bootstrap & DB connection check
├── sql/
│   ├── schema.sql       # DDL for users & orders tables
│   └── seed-admin.sql   # Inserts a default ADMIN user
├── docs/
│   └── postman_collection.json
├── .env.example
└── README.md
```

---

## Setup

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 13
- A database named `order_management` (or any name — update the env var)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd order-management-api
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the server listens on | `3000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret key for signing JWTs (keep long & random) | — |
| `JWT_EXPIRES_IN` | JWT lifetime (e.g. `1d`, `12h`) | `1d` |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor | `10` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window per IP | `100` |

> `DATABASE_URL` and `JWT_SECRET` are **required** — the server will refuse to start without them.

### 3. Create the database schema

```bash
psql -d order_management -f sql/schema.sql
```

### 4. (Optional) Seed the admin user

```bash
psql -d order_management -f sql/seed-admin.sql
```

Seeded admin credentials:

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `Admin@123` |

### 5. Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

---

## API Endpoints

Base URL: `http://localhost:3000`

All protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

### Authentication

#### `POST /api/auth/register`

Register a new user. All new accounts are created with the `USER` role.

**Request body:**
```json
{
  "name": "Sujal Sharma",
  "email": "sujal@example.com",
  "password": "password123"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": { "id": 1, "name": "Sujal Sharma", "email": "sujal@example.com", "role": "USER", "created_at": "..." },
    "token": "<jwt>"
  }
}
```

---

#### `POST /api/auth/login`

**Request body:**
```json
{
  "email": "sujal@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": { "id": 1, "name": "Sujal Sharma", "email": "sujal@example.com", "role": "USER", "created_at": "..." },
    "token": "<jwt>"
  }
}
```

---

### Orders  *(requires auth)*

#### `POST /api/orders/create_order` — Create Order

**Request body:**
```json
{
  "symbol": "AAPL",
  "order_type": "BUY",
  "quantity": 10,
  "price": 182.50
}
```

`order_type`: `BUY` | `SELL`  
New orders are always created with `status: "PENDING"`.  
All date fields (`created_at`, `updated_at`) are returned as `DD/MM/YYYY HH:MM:SS`.

---

#### `GET /api/orders/get_orders` — Get My Orders *(paginated)*

**Query params (optional):**

| Param | Type | Default | Max |
|---|---|---|---|
| `page` | integer | `1` | — |
| `limit` | integer | `10` | `100` |

**Response `200`:**
```json
{
  "success": true,
  "message": "Orders fetched successfully.",
  "data": [ { "id": 1, "symbol": "AAPL", "order_type": "BUY", "created_at": "23/05/2026 19:28:40", ... } ],
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

---

#### `GET /api/orders/get_order_by_id/:id` — Get Order By ID

Returns a single order belonging to the authenticated user.

---

#### `PUT /api/orders/update_order/:id` — Update Order

Update an order's fields. Cannot update a deleted order (it no longer exists).
Setting `status: "CANCELLED"` is not permitted via this endpoint.

**Request body:**
```json
{
  "symbol": "AAPL",
  "order_type": "SELL",
  "quantity": 5,
  "price": 190.25,
  "status": "COMPLETED"
}
```

`status` (optional): `PENDING` | `COMPLETED`

---

#### `DELETE /api/orders/delete_order/:id` — Delete Order

Permanently removes the order from the database. Only the owner of the order can delete it.

---

### Admin  *(requires auth + ADMIN role)*

#### `GET /api/admin/get_all_orders` — Get All Orders *(paginated)*

Returns all orders across all users, joined with user name and email.

**Query params (optional):** `page`, `limit` (same as above)

**Response `200`:**
```json
{
  "success": true,
  "message": "All orders fetched successfully.",
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "user_name": "Sujal Sharma",
      "user_email": "sujal@example.com",
      "symbol": "AAPL",
      "order_type": "BUY",
      "quantity": 10,
      "price": "182.50",
      "status": "PENDING",
      "created_at": "23/05/2026 18:56:34",
      "updated_at": "23/05/2026 18:56:34"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
```

---

## Error Responses

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Human-readable error message.",
  "errors": ["field-level detail (only for validation errors)"]
}
```

| HTTP Status | Cause |
|---|---|
| `400` | Validation failed (Joi) |
| `401` | Missing / invalid / expired JWT |
| `403` | Authenticated but insufficient role |
| `404` | Route or resource not found |
| `409` | Duplicate unique value (e.g. email already registered) |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error |

---

## Postman Collection

Import `docs/postman_collection.json` into Postman.

Set the `baseUrl` collection variable to `http://localhost:3000`.
The **Login** and **Admin Login** requests have test scripts that automatically set the `token` and `adminToken` collection variables after a successful login — no manual copy-paste needed.

---

## Notes

- New users always receive the `USER` role. Promote a user to `ADMIN` directly in the database or use the seeded admin account.
- The `seed-admin.sql` password hash corresponds to `Admin@123` (bcrypt, 10 rounds).

## Render Deployment

This backend is ready for Render Blueprint deployment.

1. Push this folder to its own GitHub repository.
2. In Render, choose `New` -> `Blueprint`.
3. Select the backend repository.
4. Render will create:
   - a free web service named `order-management-api`
   - a free PostgreSQL database named `order-management-db`
5. The app bootstraps the schema and admin seed automatically on startup.
- Rate limiting is applied globally: 100 requests per IP per 15-minute window by default (configurable via `.env`).
