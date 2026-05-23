import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import bootstrapDatabase from "./scripts/bootstrapDatabase.js";
import env from "./config/env.js";
import { testDatabaseConnection } from "./config/db.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import apiRateLimiter from "./middlewares/rateLimitMiddleware.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://order-management-frontend-ten.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(apiRateLimiter);

app.get("/health", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Order Management API is running.",
  });
});

app.use("/api", apiRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

async function startServer() {
  try {
    await bootstrapDatabase();
    await testDatabaseConnection();
    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
