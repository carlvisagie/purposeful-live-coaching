/**
 * Local file storage for Render deployment
 * Stores files in /opt/render/project/src/uploads directory
 * WARNING: Files are ephemeral - will be deleted on redeploy
 * For production, use S3 or similar cloud storage
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { randomBytes } from 'crypto';

// Render persistent storage path
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/opt/render/project/src/uploads';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
  }
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, '');
}

function randomSuffix(): string {
  return randomBytes(8).toString('hex');
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  await ensureUploadDir();
  
  const key = normalizeKey(relKey);
  const filePath = path.join(UPLOAD_DIR, key);
  
  // Ensure subdirectories exist
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  
  // Write file
  const buffer = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data);
  await fs.writeFile(filePath, buffer);
  
  // Generate public URL
  const url = `${BASE_URL}/uploads/${key}`;
  
  console.log(`[Storage] Uploaded file: ${key} -> ${url}`);
  
  return { key, url };
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const url = `${BASE_URL}/uploads/${key}`;
  
  return { key, url };
}
