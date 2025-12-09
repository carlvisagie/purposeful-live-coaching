// Direct AWS S3 storage implementation
// No Manus dependencies - uses standard AWS SDK

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from './_core/env';

// Initialize S3 client
function getS3Client(): S3Client {
  const region = process.env.AWS_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS credentials missing: set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables"
    );
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function getBucketName(): string {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET environment variable is required");
  }
  return bucket;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

/**
 * Upload data to S3
 * @param relKey - Relative path/key for the file (e.g., "uploads/image.jpg")
 * @param data - File data as Buffer, Uint8Array, or string
 * @param contentType - MIME type (default: "application/octet-stream")
 * @returns Object with key and public URL
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const s3Client = getS3Client();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  // Convert string to Buffer if needed
  const body = typeof data === "string" ? Buffer.from(data) : data;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    // Make file publicly readable (optional - remove if you want private files)
    ACL: "public-read",
  });

  await s3Client.send(command);

  // Construct public URL
  const region = process.env.AWS_REGION || 'us-east-1';
  const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { key, url };
}

/**
 * Get a presigned URL for downloading a file from S3
 * @param relKey - Relative path/key for the file
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Object with key and presigned URL
 */
export async function storageGet(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const s3Client = getS3Client();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  // Generate presigned URL
  const url = await getSignedUrl(s3Client, command, { expiresIn });

  return { key, url };
}
