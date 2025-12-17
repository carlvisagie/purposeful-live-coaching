import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

/**
 * Database Connection Pool Configuration
 * 
 * CRITICAL FOR SCALING:
 * - Render free tier: 25 max connections
 * - Reserve 5 for admin/monitoring
 * - Pool max: 20 connections
 * - Requests queue when pool is full (prevents crashes)
 * - Idle connections close after 30s to free resources
 * - Connection timeout: 5s (fail fast if DB unavailable)
 */

let _db: ReturnType<typeof drizzle> | null = null;
let _client: postgres.Sql | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, {
        max: 20, // Max 20 connections (reserve 5 for admin)
        idle_timeout: 30, // Close idle connections after 30s
        connect_timeout: 30, // Increased timeout for slow DB connections
        max_lifetime: 60 * 30, // Recycle connections every 30 minutes
        ssl: 'require', // Force SSL for Render database
        connection: {
          application_name: 'purposeful_live_coaching_app'
        }
      });
      _db = drizzle(client, { schema });
      _client = client;
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// Synchronous db instance for use in routers (assumes DB is already initialized)
// Uses connection pooling to prevent crashes
const client = postgres(process.env.DATABASE_URL || '', {
  max: 20, // Max 20 connections (reserve 5 for admin/monitoring)
  idle_timeout: 30, // Close idle connections after 30 seconds
  connect_timeout: 30, // Increased timeout for slow DB connections
  max_lifetime: 60 * 30, // Recycle connections every 30 minutes
  ssl: 'require', // Force SSL for Render database
  connection: {
    application_name: 'purposeful_live_coaching_app'
  },
  // Requests queue when pool is full (prevents "too many connections" crashes)
});

export const db = drizzle(client, { schema });

// Graceful shutdown: close all database connections
process.on('SIGTERM', async () => {
  console.log('[Database] SIGTERM received, closing connections...');
  try {
    await client.end({ timeout: 5 });
    if (_client) {
      await _client.end({ timeout: 5 });
    }
    console.log('[Database] All connections closed');
  } catch (error) {
    console.error('[Database] Error closing connections:', error);
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[Database] SIGINT received, closing connections...');
  try {
    await client.end({ timeout: 5 });
    if (_client) {
      await _client.end({ timeout: 5 });
    }
    console.log('[Database] All connections closed');
  } catch (error) {
    console.error('[Database] Error closing connections:', error);
  }
  process.exit(0);
});

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.
