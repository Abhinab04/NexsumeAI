import cors from "cors";
import cookieParser from "cookie-parser";
import express, {
  type Express,
  type Request,
  type Response,
} from "express";
import path from "node:path";
import { pino } from "pino";
import favicon from "serve-favicon";

import { healthCheckRouter } from "./api/healthCheck/healthCheckRouter";

import errorHandler from "./common/middleware/errorHandler";
import rateLimiter from "./common/middleware/rateLimiter";
import requestLogger from "./common/middleware/requestLogger";

import { env } from "./common/utils/env";

import helmetConfig from "./config/helmetConfig";

import { authRouter } from "./api/auth/authRouter";
import { userRouter } from "./api/user/userRouter";

import { featureRouter } from "./routes/featuresRouter";

import { clerkMiddleware } from "@clerk/express";

const logger = pino({
  name: "server start",
});

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
  path.join(__dirname, "views")
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
      "favicon.ico"
    )
  )
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

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
    return res.render("index");
  }
);

app.use(
  "/health-check",
  healthCheckRouter
);

app.use(
  "/auth",
  authRouter
);

app.use(
  "/user",
  userRouter
);

app.use(
  "/api/features",
  featureRouter
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
