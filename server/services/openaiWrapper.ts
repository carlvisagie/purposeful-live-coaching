/**
 * OpenAI Wrapper with Rate Limiting, Caching, and Retry Logic
 * 
 * This wrapper ensures the platform doesn't hit OpenAI rate limits by:
 * 1. Queuing requests with delays
 * 2. Caching responses for identical prompts
 * 3. Automatic retry with exponential backoff on 429 errors
 * 4. Model fallback (expensive → cheap) when rate limited
 * 5. Request deduplication for concurrent identical requests
 */

import OpenAI from "openai";
import crypto from "crypto";

// Initialize OpenAI client
const openai = new OpenAI();

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  // Cache settings
  CACHE_TTL_MS: 60 * 60 * 1000, // 1 hour cache for responses
  CACHE_MAX_SIZE: 1000, // Max cached responses
  
  // Rate limiting
  MIN_REQUEST_INTERVAL_MS: 100, // Minimum 100ms between requests
  MAX_CONCURRENT_REQUESTS: 10, // Max parallel requests
  
  // Retry settings
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000, // 1 second
  MAX_RETRY_DELAY_MS: 30000, // 30 seconds max
  
  // Model fallback chain (most capable → cheapest)
  MODEL_FALLBACK_CHAIN: [
    "gpt-4o",
    "gpt-4o-mini", 
    "gpt-4.1-mini",
    "gpt-4.1-nano"
  ] as const,
};

// ============================================================
// TYPES
// ============================================================

interface CacheEntry {
  response: string;
  timestamp: number;
  model: string;
  tokens: number;
}

interface QueuedRequest {
  id: string;
  resolve: (value: string) => void;
  reject: (error: Error) => void;
  prompt: string;
  systemPrompt?: string;
  model: string;
  maxTokens: number;
  temperature: number;
  retryCount: number;
}

interface UsageStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  retries: number;
  fallbacks: number;
  errors: number;
  totalTokens: number;
}

// ============================================================
// STATE
// ============================================================

// Response cache
const responseCache = new Map<string, CacheEntry>();

// Request queue
const requestQueue: QueuedRequest[] = [];
let isProcessingQueue = false;
let lastRequestTime = 0;
let activeRequests = 0;

// Pending requests (for deduplication)
const pendingRequests = new Map<string, Promise<string>>();

// Usage statistics
const usageStats: UsageStats = {
  totalRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  retries: 0,
  fallbacks: 0,
  errors: 0,
  totalTokens: 0,
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Generate a cache key from the request parameters
 */
function generateCacheKey(
  prompt: string,
  systemPrompt: string | undefined,
  model: string,
  temperature: number
): string {
  const content = JSON.stringify({ prompt, systemPrompt, model, temperature });
  return crypto.createHash("md5").update(content).digest("hex");
}

/**
 * Check if a cache entry is still valid
 */
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CONFIG.CACHE_TTL_MS;
}

/**
 * Clean up expired cache entries
 */
function cleanupCache(): void {
  const now = Date.now();
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > CONFIG.CACHE_TTL_MS) {
      responseCache.delete(key);
    }
  }
  
  // If still over limit, remove oldest entries
  if (responseCache.size > CONFIG.CACHE_MAX_SIZE) {
    const entries = Array.from(responseCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, entries.length - CONFIG.CACHE_MAX_SIZE);
    for (const [key] of toRemove) {
      responseCache.delete(key);
    }
  }
}

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(retryCount: number): number {
  const delay = CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount);
  return Math.min(delay, CONFIG.MAX_RETRY_DELAY_MS);
}

/**
 * Get the next model in the fallback chain
 */
function getNextFallbackModel(currentModel: string): string | null {
  const currentIndex = CONFIG.MODEL_FALLBACK_CHAIN.indexOf(currentModel as any);
  if (currentIndex === -1 || currentIndex >= CONFIG.MODEL_FALLBACK_CHAIN.length - 1) {
    return null;
  }
  return CONFIG.MODEL_FALLBACK_CHAIN[currentIndex + 1];
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// QUEUE PROCESSING
// ============================================================

/**
 * Process the request queue
 */
async function processQueue(): Promise<void> {
  if (isProcessingQueue) return;
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    // Wait for rate limiting
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    if (timeSinceLastRequest < CONFIG.MIN_REQUEST_INTERVAL_MS) {
      await sleep(CONFIG.MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest);
    }
    
    // Wait if too many concurrent requests
    while (activeRequests >= CONFIG.MAX_CONCURRENT_REQUESTS) {
      await sleep(100);
    }
    
    const request = requestQueue.shift();
    if (!request) continue;
    
    activeRequests++;
    lastRequestTime = Date.now();
    
    // Process request (don't await - let it run in parallel)
    processRequest(request).finally(() => {
      activeRequests--;
    });
  }
  
  isProcessingQueue = false;
}

/**
 * Process a single request with retry logic
 */
async function processRequest(request: QueuedRequest): Promise<void> {
  try {
    const response = await makeOpenAIRequest(
      request.prompt,
      request.systemPrompt,
      request.model,
      request.maxTokens,
      request.temperature
    );
    request.resolve(response);
  } catch (error: any) {
    // Check if rate limited (429)
    if (error?.status === 429 || error?.message?.includes("429")) {
      usageStats.retries++;
      
      // Try retry with backoff
      if (request.retryCount < CONFIG.MAX_RETRIES) {
        const delay = getRetryDelay(request.retryCount);
        console.log(`[OpenAI] Rate limited, retrying in ${delay}ms (attempt ${request.retryCount + 1}/${CONFIG.MAX_RETRIES})`);
        
        await sleep(delay);
        request.retryCount++;
        requestQueue.unshift(request); // Add back to front of queue
        processQueue(); // Restart processing
        return;
      }
      
      // Try fallback model
      const fallbackModel = getNextFallbackModel(request.model);
      if (fallbackModel) {
        usageStats.fallbacks++;
        console.log(`[OpenAI] Falling back from ${request.model} to ${fallbackModel}`);
        
        request.model = fallbackModel;
        request.retryCount = 0;
        requestQueue.unshift(request);
        processQueue();
        return;
      }
    }
    
    usageStats.errors++;
    request.reject(error);
  }
}

/**
 * Make the actual OpenAI API request
 */
async function makeOpenAIRequest(
  prompt: string,
  systemPrompt: string | undefined,
  model: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });
  
  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
  });
  
  const response = completion.choices[0]?.message?.content || "";
  const tokens = completion.usage?.total_tokens || 0;
  
  usageStats.totalTokens += tokens;
  
  return response;
}

// ============================================================
// PUBLIC API
// ============================================================

export interface CompletionOptions {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  skipCache?: boolean;
}

/**
 * Get a chat completion with automatic rate limiting, caching, and retry
 */
export async function getCompletion(options: CompletionOptions): Promise<string> {
  const {
    prompt,
    systemPrompt,
    model = "gpt-4o-mini",
    maxTokens = 1000,
    temperature = 0.7,
    skipCache = false,
  } = options;
  
  usageStats.totalRequests++;
  
  // Generate cache key
  const cacheKey = generateCacheKey(prompt, systemPrompt, model, temperature);
  
  // Check cache first (unless skipped)
  if (!skipCache) {
    const cached = responseCache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      usageStats.cacheHits++;
      console.log(`[OpenAI] Cache hit for request`);
      return cached.response;
    }
  }
  
  usageStats.cacheMisses++;
  
  // Check for pending identical request (deduplication)
  const pendingKey = cacheKey;
  const pending = pendingRequests.get(pendingKey);
  if (pending) {
    console.log(`[OpenAI] Deduplicating identical request`);
    return pending;
  }
  
  // Create promise for this request
  const requestPromise = new Promise<string>((resolve, reject) => {
    const request: QueuedRequest = {
      id: crypto.randomUUID(),
      resolve: (response) => {
        // Cache the response
        responseCache.set(cacheKey, {
          response,
          timestamp: Date.now(),
          model,
          tokens: 0,
        });
        cleanupCache();
        pendingRequests.delete(pendingKey);
        resolve(response);
      },
      reject: (error) => {
        pendingRequests.delete(pendingKey);
        reject(error);
      },
      prompt,
      systemPrompt,
      model,
      maxTokens,
      temperature,
      retryCount: 0,
    };
    
    requestQueue.push(request);
    processQueue();
  });
  
  pendingRequests.set(pendingKey, requestPromise);
  return requestPromise;
}

/**
 * Get a quick completion using the cheapest model
 * Good for simple tasks like sentiment analysis, classification
 */
export async function getQuickCompletion(prompt: string, systemPrompt?: string): Promise<string> {
  return getCompletion({
    prompt,
    systemPrompt,
    model: "gpt-4.1-nano",
    maxTokens: 500,
    temperature: 0.3,
  });
}

/**
 * Get a high-quality completion using the best model
 * Good for complex tasks like coaching responses, content generation
 */
export async function getPremiumCompletion(prompt: string, systemPrompt?: string): Promise<string> {
  return getCompletion({
    prompt,
    systemPrompt,
    model: "gpt-4o",
    maxTokens: 2000,
    temperature: 0.7,
  });
}

/**
 * Pre-warm the cache with common prompts
 * Call this on server startup
 */
export async function prewarmCache(prompts: CompletionOptions[]): Promise<void> {
  console.log(`[OpenAI] Pre-warming cache with ${prompts.length} prompts`);
  
  for (const options of prompts) {
    try {
      await getCompletion(options);
      await sleep(500); // Gentle rate limiting during prewarm
    } catch (error) {
      console.error(`[OpenAI] Failed to prewarm:`, error);
    }
  }
  
  console.log(`[OpenAI] Cache prewarm complete`);
}

/**
 * Get current usage statistics
 */
export function getUsageStats(): UsageStats {
  return { ...usageStats };
}

/**
 * Clear the response cache
 */
export function clearCache(): void {
  responseCache.clear();
  console.log(`[OpenAI] Cache cleared`);
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; maxSize: number; hitRate: number } {
  const total = usageStats.cacheHits + usageStats.cacheMisses;
  return {
    size: responseCache.size,
    maxSize: CONFIG.CACHE_MAX_SIZE,
    hitRate: total > 0 ? usageStats.cacheHits / total : 0,
  };
}

// Export the raw OpenAI client for cases where direct access is needed
export { openai };

// Default export
export default {
  getCompletion,
  getQuickCompletion,
  getPremiumCompletion,
  prewarmCache,
  getUsageStats,
  clearCache,
  getCacheStats,
  openai,
};
