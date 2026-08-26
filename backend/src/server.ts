import cors from "cors";
import cookieParser from "cookie-parser";
import express, {
  type Express,
  type Request,
  type Response,
} from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pino } from "pino";
import favicon from "serve-favicon";

import { healthCheckRouter } from "./api/healthCheck/healthCheckRouter.js";

import errorHandler from "./common/middleware/errorHandler.js";
import rateLimiter from "./common/middleware/rateLimiter.js";
import requestLogger from "./common/middleware/requestLogger.js";

import { env } from "./common/utils/env.js";

import helmetConfig from "./config/helmetConfig.js";

import { authRouter } from "./api/auth/authRouter.js";
import { userRouter } from "./api/user/userRouter.js";

import { featureRouter } from "./routes/featuresRouter.js";

import { clerkMiddleware } from "@clerk/express";

// =====================================================
// ESM __dirname replacement
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// Logger
// =====================================================

const logger = pino({
  name: "server start",
});

// =====================================================
// Express App
// =====================================================

const app: Express = express();

// =====================================================
// Trust reverse proxy
// =====================================================

app.set("trust proxy", true);

// =====================================================
// View engine
// =====================================================

app.set("view engine", "ejs");

app.set(
  "views",
  path.join(__dirname, "views"),
);

// =====================================================
// Middlewares
// =====================================================

app.use(cookieParser());

app.use(
  favicon(
    path.join(
      process.cwd(),
      "public",
      "favicon.ico",
    ),
  ),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// =====================================================
// DEBUG
// =====================================================

app.get("/api/debug", (req: Request, res: Response) => {
    console.log("========== DEBUG ENDPOINT HIT ==========");
    console.log("Origin:", req.headers.origin);
    res.json({ success: true, message: "Backend is reachable!" });
});

// =====================================================
// Clerk
// =====================================================

app.use(clerkMiddleware());

// =====================================================
// Security
// =====================================================

app.use(helmetConfig);

// =====================================================
// Rate limiter
// =====================================================

app.use(rateLimiter);

// =====================================================
// Request logging
// =====================================================

app.use(requestLogger);

// =====================================================
// Routes
// =====================================================

app.get(
  "/",
  (_req: Request, res: Response) => {
    return res.status(200).json({ status: "API is running" });
  },
);

app.use(
  "/health-check",
  healthCheckRouter,
);

app.use(
  "/auth",
  authRouter,
);

app.use(
  "/user",
  userRouter,
);

app.use(
  "/api/features",
  featureRouter,
);

// =====================================================
// Error handler
// =====================================================

app.use(errorHandler());

// =====================================================
// Exports
// =====================================================

export {
  app,
  logger,
};
