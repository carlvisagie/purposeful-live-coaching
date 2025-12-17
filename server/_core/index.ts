console.log("[App] Starting application...");
import "dotenv/config";
console.log("[App] dotenv loaded");
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { webhookRouter } from "../routers/webhooks";
import { seedCoachAvailability } from "../seed-availability";
import { runMigrations } from "../run-migrations-startup";

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

// Helper to run async operation with timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${operation} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    
    promise
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Stripe webhooks need raw body - register BEFORE body parser
  app.use("/api/webhooks", express.raw({ type: "application/json" }), webhookRouter);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Serve uploaded files
  const uploadDir = process.env.UPLOAD_DIR || "/opt/render/project/src/uploads";
  app.use("/uploads", express.static(uploadDir));
  // OAuth removed - using guest checkout for Stripe
  
  // Manual seed endpoint (for when auto-seed doesn't work)
  app.get("/api/seed-availability", async (req, res) => {
    const force = req.query.force === "true";
    const result = await seedCoachAvailability(force);
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

  // Run migrations first to ensure tables exist
  console.log("[Startup] Running migrations...");
  try {
    await withTimeout(runMigrations(), 60000, "Migrations");
    console.log("[Startup] Migrations complete");
  } catch (error) {
    console.error("[Startup] Migration error (continuing anyway):", error);
  }
  
  // Then seed coach availability if needed (with timeout)
  console.log("[Startup] Seeding coach availability...");
  try {
    await withTimeout(seedCoachAvailability(), 30000, "Seeding");
    console.log("[Startup] Seeding complete");
  } catch (error) {
    console.error("[Startup] Seeding error (continuing anyway):", error);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}/`);
    console.log(`✅ All systems ready!`);
  });
}

startServer().catch(error => {
  console.error("[Startup] Fatal error:", error);
  process.exit(1);
});
