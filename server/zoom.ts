import { ENV } from "./_core/env";
import crypto from "crypto";

/**
 * ZOOM VIDEO SDK INTEGRATION
 * 
 * Generates JWT tokens for Zoom Video SDK sessions
 * Each coaching session gets a unique Zoom meeting room
 */

interface ZoomSessionConfig {
  sessionId: string;
  role: 0 | 1; // 0 = participant, 1 = host
  userName: string;
  expirationSeconds?: number;
}

/**
 * Generate Zoom Video SDK JWT token
 * 
 * @param config - Session configuration
 * @returns JWT token for Zoom Video SDK
 */
export function generateZoomToken(config: ZoomSessionConfig): string {
  const { sessionId, role, userName, expirationSeconds = 7200 } = config;

  if (!ENV.zoomSdkKey || !ENV.zoomSdkSecret) {
    throw new Error("Zoom SDK credentials not configured");
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expirationSeconds;

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    app_key: ENV.zoomSdkKey,
    tpc: sessionId,
    role_type: role,
    user_identity: userName,
    version: 1,
    iat,
    exp,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac("sha256", ENV.zoomSdkSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Create Zoom session configuration for coaching session
 */
export function createCoachingSessionConfig(
  sessionId: string,
  isCoach: boolean,
  userName: string
): ZoomSessionConfig {
  return {
    sessionId: `coaching-${sessionId}`,
    role: isCoach ? 1 : 0, // Coach is host, client is participant
    userName,
    expirationSeconds: 7200, // 2 hours
  };
}
