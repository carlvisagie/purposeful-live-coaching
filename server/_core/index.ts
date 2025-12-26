console.log("[App] Starting application...");
import "dotenv/config";
import * as Sentry from "@sentry/node";

// Initialize Sentry error monitoring
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1, // Capture 10% of transactions for performance monitoring
    integrations: [
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
  });
  console.log("[App] Sentry error monitoring initialized");
} else {
  console.log("[App] Sentry DSN not configured - error monitoring disabled");
}
console.log("[App] dotenv loaded");
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { webhookRouter } from "../routers/webhooks";
import { vapiWebhookRestRouter } from "../routers/vapiWebhookRest";
import { contentRouter } from "../routers/content";
import { seedCoachAvailability } from "../seed-availability";
import { updateSessionPrices } from "../update-session-prices";
import { runMigrations } from "../run-migrations-startup";
// import { startCronJobs } from "../cron/scheduler";

console.log("[App] All imports complete");

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  console.log("[Startup] Initializing Express...");
  const app = express();
  const server = createServer(app);
  
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", "https://api.stripe.com", "wss:", "https:"],
        frameSrc: ["'self'", "https://js.stripe.com"],
        mediaSrc: ["'self'", "blob:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for some third-party integrations
  }));
  
  // Stripe webhooks need raw body - register BEFORE body parser
  app.use("/api/webhooks", express.raw({ type: "application/json" }), webhookRouter);
  
  // Vapi webhooks need JSON body - register AFTER body parser is set up below
  // We'll add it after the body parser
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Vapi webhooks - needs JSON body parser
  app.use("/api/vapi", vapiWebhookRestRouter);
  
  // Content API for serving raw markdown files
  app.use("/api/content", contentRouter);
  
  // Rate limiting for API protection
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // Limit each IP to 5000 requests per windowMs (10x increase for booking system)
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for webhooks and health checks
      return req.path.startsWith("/api/webhooks") || req.path === "/api/health";
    },
  });
  
  // Apply rate limiting to API routes
  app.use("/api", apiLimiter);
  
  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login attempts per hour
    message: { error: "Too many login attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  // Apply stricter rate limiting to auth endpoints
  app.use("/api/trpc/auth.login", authLimiter);
  app.use("/api/trpc/auth.register", authLimiter);
  
  // Health check endpoint with database status
  app.get("/api/health", async (req, res) => {
    try {
      // Check database connection
      const { db } = await import("../db");
      await db.execute("SELECT 1");
      
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
        uptime: process.uptime(),
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB"
      });
    } catch (error) {
      console.error("[Health Check] Database error:", error);
      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Serve uploaded files
  const uploadDir = process.env.UPLOAD_DIR || "/opt/render/project/src/uploads";
  app.use("/uploads", express.static(uploadDir));
  
  // Manual seed endpoint - use this to seed availability after deployment
  // Visit: https://your-app.onrender.com/api/seed-availability
  app.get("/api/seed-availability", async (req, res) => {
    const force = req.query.force === "true";
    const result = await seedCoachAvailability(force);
    res.json(result);
  });
  
  // Update session prices endpoint
  app.get("/api/update-session-prices", async (req, res) => {
    const result = await updateSessionPrices();
    res.json(result);
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Sentry error handler - must be after all routes
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  // Run migrations first to ensure tables exist
  console.log("[Startup] Running migrations...");
  try {
    await runMigrations();
    console.log("[Startup] Migrations complete");
  } catch (error) {
    console.error("[Startup] Migration error (continuing anyway):", error);
  }

  // Start the server - seeding is now manual via /api/seed-availability
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}/`);
    console.log(`✅ All systems ready!`);
    console.log(`📝 To seed availability, visit: /api/seed-availability`);
    
    // Start cron jobs after server is running
    // startCronJobs(); // Temporarily disabled - causing ES module error
  });
}

startServer().catch(error => {
  console.error("[Startup] Fatal error:", error);
  process.exit(1);
});
