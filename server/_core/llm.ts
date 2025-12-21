/**
 * LLM Invocation Module with Built-in Protection
 * 
 * This module provides rate limiting, caching, and retry logic for ALL OpenAI calls.
 * Every module that uses invokeLLM automatically gets protection against:
 * - Rate limiting (429 errors)
 * - Quota exhaustion
 * - Temporary API failures
 */

import { ENV } from "./env";
import * as crypto from "crypto";

// ============================================================
// PROTECTION CONFIGURATION
// ============================================================

const PROTECTION_CONFIG = {
  // Cache settings
  CACHE_ENABLED: true,
  CACHE_TTL_MS: 30 * 60 * 1000, // 30 minutes for conversation responses
  CACHE_MAX_SIZE: 500,
  
  // Rate limiting  
  MIN_REQUEST_INTERVAL_MS: 50, // 50ms minimum between requests
  MAX_CONCURRENT_REQUESTS: 15,
  
  // Retry settings
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 30000,
  
  // Model fallback
  MODEL_FALLBACK: {
    "gpt-4o": "gpt-4o-mini",
    "gpt-4o-mini": "gpt-4o-mini", // Stay on mini
  } as Record<string, string>,
};

// ============================================================
// TYPES
// ============================================================

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4" ;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  model?: "gpt-4o-mini" | "gpt-4o";
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  skipCache?: boolean; // New: skip cache for this request
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  _cached?: boolean; // New: indicates if response was from cache
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

// ============================================================
// PROTECTION STATE
// ============================================================

interface CacheEntry {
  result: InvokeResult;
  timestamp: number;
}

// Response cache
const responseCache = new Map<string, CacheEntry>();

// Rate limiting state
let lastRequestTime = 0;
let activeRequests = 0;
const requestQueue: Array<{
  resolve: (value: InvokeResult) => void;
  reject: (error: Error) => void;
  params: InvokeParams;
  retryCount: number;
  currentModel: string;
}> = [];
let isProcessingQueue = false;

// Statistics
const stats = {
  totalRequests: 0,
  cacheHits: 0,
  retries: 0,
  fallbacks: 0,
  errors: 0,
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function generateCacheKey(params: InvokeParams): string {
  // Create a deterministic key from the request
  const keyData = {
    messages: params.messages.map(m => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
    })),
    model: params.model,
  };
  return crypto.createHash("md5").update(JSON.stringify(keyData)).digest("hex");
}

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < PROTECTION_CONFIG.CACHE_TTL_MS;
}

function cleanupCache(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  responseCache.forEach((entry, key) => {
    if (now - entry.timestamp > PROTECTION_CONFIG.CACHE_TTL_MS) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => responseCache.delete(key));
  
  if (responseCache.size > PROTECTION_CONFIG.CACHE_MAX_SIZE) {
    const entries: Array<[string, CacheEntry]> = [];
    responseCache.forEach((value, key) => entries.push([key, value]));
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const removeCount = entries.length - PROTECTION_CONFIG.CACHE_MAX_SIZE;
    for (let i = 0; i < removeCount; i++) {
      responseCache.delete(entries[i][0]);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRetryDelay(retryCount: number): number {
  const delay = PROTECTION_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount);
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 500;
  return Math.min(delay + jitter, PROTECTION_CONFIG.MAX_RETRY_DELAY_MS);
}

// ============================================================
// MESSAGE NORMALIZATION (unchanged from original)
// ============================================================

const ensureArray = (
  value: MessageContent | MessageContent[]
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent
): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(part => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

const resolveApiUrl = () => "https://api.openai.com/v1/chat/completions";

const assertApiKey = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return apiKey;
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (
      explicitFormat.type === "json_schema" &&
      !explicitFormat.json_schema?.schema
    ) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

// ============================================================
// QUEUE PROCESSING
// ============================================================

async function processQueue(): Promise<void> {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    // Rate limiting delay
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    if (timeSinceLastRequest < PROTECTION_CONFIG.MIN_REQUEST_INTERVAL_MS) {
      await sleep(PROTECTION_CONFIG.MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest);
    }

    // Concurrency limit
    while (activeRequests >= PROTECTION_CONFIG.MAX_CONCURRENT_REQUESTS) {
      await sleep(50);
    }

    const request = requestQueue.shift();
    if (!request) continue;

    activeRequests++;
    lastRequestTime = Date.now();

    // Process without awaiting to allow parallelism
    processRequest(request).finally(() => {
      activeRequests--;
    });
  }

  isProcessingQueue = false;
}

async function processRequest(request: {
  resolve: (value: InvokeResult) => void;
  reject: (error: Error) => void;
  params: InvokeParams;
  retryCount: number;
  currentModel: string;
}): Promise<void> {
  try {
    const result = await makeApiCall(request.params, request.currentModel);
    request.resolve(result);
  } catch (error: any) {
    const isRateLimited = error?.message?.includes("429") || 
                          error?.message?.includes("rate") ||
                          error?.message?.includes("Too Many Requests");

    if (isRateLimited) {
      // Try retry with backoff
      if (request.retryCount < PROTECTION_CONFIG.MAX_RETRIES) {
        stats.retries++;
        const delay = getRetryDelay(request.retryCount);
        console.log(`[LLM] Rate limited, retrying in ${Math.round(delay)}ms (attempt ${request.retryCount + 1}/${PROTECTION_CONFIG.MAX_RETRIES})`);
        
        await sleep(delay);
        request.retryCount++;
        requestQueue.unshift(request);
        processQueue();
        return;
      }

      // Try fallback model
      const fallbackModel = PROTECTION_CONFIG.MODEL_FALLBACK[request.currentModel];
      if (fallbackModel && fallbackModel !== request.currentModel) {
        stats.fallbacks++;
        console.log(`[LLM] Falling back from ${request.currentModel} to ${fallbackModel}`);
        
        request.currentModel = fallbackModel;
        request.retryCount = 0;
        requestQueue.unshift(request);
        processQueue();
        return;
      }
    }

    stats.errors++;
    request.reject(error);
  }
}

async function makeApiCall(params: InvokeParams, model: string): Promise<InvokeResult> {
  const apiKey = assertApiKey();

  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
  } = params;

  const payload: Record<string, unknown> = {
    model: model,
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  payload.max_tokens = 16384;

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }

  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  return (await response.json()) as InvokeResult;
}

// ============================================================
// PUBLIC API
// ============================================================

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  stats.totalRequests++;
  const model = params.model || "gpt-4o";

  // Check cache first (skip for tool calls and explicit skip)
  if (PROTECTION_CONFIG.CACHE_ENABLED && !params.skipCache && !params.tools) {
    const cacheKey = generateCacheKey(params);
    const cached = responseCache.get(cacheKey);
    
    if (cached && isCacheValid(cached)) {
      stats.cacheHits++;
      console.log(`[LLM] Cache hit`);
      return { ...cached.result, _cached: true };
    }
  }

  // Queue the request
  return new Promise((resolve, reject) => {
    const wrappedResolve = (result: InvokeResult) => {
      // Cache the result
      if (PROTECTION_CONFIG.CACHE_ENABLED && !params.tools) {
        const cacheKey = generateCacheKey(params);
        responseCache.set(cacheKey, {
          result,
          timestamp: Date.now(),
        });
        cleanupCache();
      }
      resolve(result);
    };

    requestQueue.push({
      resolve: wrappedResolve,
      reject,
      params,
      retryCount: 0,
      currentModel: model,
    });

    processQueue();
  });
}

/**
 * Get LLM usage statistics
 */
export function getLLMStats() {
  return {
    ...stats,
    cacheSize: responseCache.size,
    cacheHitRate: stats.totalRequests > 0 
      ? (stats.cacheHits / stats.totalRequests * 100).toFixed(1) + '%'
      : '0%',
    queueLength: requestQueue.length,
    activeRequests,
  };
}

/**
 * Clear the LLM cache
 */
export function clearLLMCache() {
  responseCache.clear();
  console.log(`[LLM] Cache cleared`);
}
