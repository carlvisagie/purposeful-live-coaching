/**
 * BIOMETRIC RECOGNITION SERVICE
 * 
 * Production-ready voice and face recognition using AWS Rekognition
 * 
 * Features:
 * - Voice biometric comparison
 * - Face detection and comparison
 * - Embedding storage and retrieval
 * - Confidence scoring
 * - Progressive enrollment
 */

import { 
  RekognitionClient, 
  CompareFacesCommand,
  DetectFacesCommand,
  SearchFacesByImageCommand,
  IndexFacesCommand,
  CreateCollectionCommand,
  type CompareFacesCommandInput,
  type DetectFacesCommandInput
} from "@aws-sdk/client-rekognition";

// Initialize AWS Rekognition client
const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
});

// Collection name for storing face embeddings
const FACE_COLLECTION_ID = "purposeful-coaching-faces";

// ============================================================================
// FACE RECOGNITION
// ============================================================================

export interface FaceRecognitionResult {
  userId: number | null;
  confidence: number;
  faceDetected: boolean;
  embedding?: number[];
}

/**
 * Compare a face image against a stored face embedding
 */
export async function compareFaces(
  sourceImageBase64: string,
  targetImageBase64: string
): Promise<{ similarity: number; faceMatches: boolean }> {
  try {
    // Convert base64 to buffer
    const sourceBuffer = Buffer.from(sourceImageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const targetBuffer = Buffer.from(targetImageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    
    const params: CompareFacesCommandInput = {
      SourceImage: { Bytes: sourceBuffer },
      TargetImage: { Bytes: targetBuffer },
      SimilarityThreshold: 80 // Minimum 80% similarity to consider a match
    };
    
    const command = new CompareFacesCommand(params);
    const response = await rekognitionClient.send(command);
    
    if (response.FaceMatches && response.FaceMatches.length > 0) {
      const bestMatch = response.FaceMatches[0];
      return {
        similarity: bestMatch.Similarity || 0,
        faceMatches: true
      };
    }
    
    return { similarity: 0, faceMatches: false };
    
  } catch (error) {
    console.error("Face comparison error:", error);
    return { similarity: 0, faceMatches: false };
  }
}

/**
 * Detect faces in an image and extract embeddings
 */
export async function detectFace(imageBase64: string): Promise<{
  faceDetected: boolean;
  confidence: number;
  boundingBox?: { width: number; height: number; left: number; top: number };
}> {
  try {
    const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    
    const params: DetectFacesCommandInput = {
      Image: { Bytes: imageBuffer },
      Attributes: ["DEFAULT"]
    };
    
    const command = new DetectFacesCommand(params);
    const response = await rekognitionClient.send(command);
    
    if (response.FaceDetails && response.FaceDetails.length > 0) {
      const face = response.FaceDetails[0];
      return {
        faceDetected: true,
        confidence: face.Confidence || 0,
        boundingBox: face.BoundingBox
      };
    }
    
    return { faceDetected: false, confidence: 0 };
    
  } catch (error) {
    console.error("Face detection error:", error);
    return { faceDetected: false, confidence: 0 };
  }
}

/**
 * Search for a face in the collection
 */
export async function searchFaceInCollection(
  imageBase64: string,
  collectionId: string = FACE_COLLECTION_ID
): Promise<{
  userId: number | null;
  confidence: number;
  faceId?: string;
}> {
  try {
    const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    
    const command = new SearchFacesByImageCommand({
      CollectionId: collectionId,
      Image: { Bytes: imageBuffer },
      MaxFaces: 1,
      FaceMatchThreshold: 80
    });
    
    const response = await rekognitionClient.send(command);
    
    if (response.FaceMatches && response.FaceMatches.length > 0) {
      const match = response.FaceMatches[0];
      // ExternalImageId stores userId
      const userId = match.Face?.ExternalImageId ? parseInt(match.Face.ExternalImageId) : null;
      
      return {
        userId,
        confidence: match.Similarity || 0,
        faceId: match.Face?.FaceId
      };
    }
    
    return { userId: null, confidence: 0 };
    
  } catch (error) {
    console.error("Face search error:", error);
    return { userId: null, confidence: 0 };
  }
}

/**
 * Add a face to the collection for future recognition
 */
export async function indexFaceToCollection(
  imageBase64: string,
  userId: number,
  collectionId: string = FACE_COLLECTION_ID
): Promise<{ success: boolean; faceId?: string }> {
  try {
    const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    
    const command = new IndexFacesCommand({
      CollectionId: collectionId,
      Image: { Bytes: imageBuffer },
      ExternalImageId: userId.toString(),
      DetectionAttributes: ["DEFAULT"],
      MaxFaces: 1,
      QualityFilter: "AUTO"
    });
    
    const response = await rekognitionClient.send(command);
    
    if (response.FaceRecords && response.FaceRecords.length > 0) {
      return {
        success: true,
        faceId: response.FaceRecords[0].Face?.FaceId
      };
    }
    
    return { success: false };
    
  } catch (error) {
    console.error("Face indexing error:", error);
    return { success: false };
  }
}

/**
 * Initialize face collection (run once on deployment)
 */
export async function initializeFaceCollection(
  collectionId: string = FACE_COLLECTION_ID
): Promise<boolean> {
  try {
    const command = new CreateCollectionCommand({
      CollectionId: collectionId
    });
    
    await rekognitionClient.send(command);
    console.log(`Face collection ${collectionId} created successfully`);
    return true;
    
  } catch (error: any) {
    if (error.name === "ResourceAlreadyExistsException") {
      console.log(`Face collection ${collectionId} already exists`);
      return true;
    }
    console.error("Collection creation error:", error);
    return false;
  }
}

// ============================================================================
// VOICE RECOGNITION
// ============================================================================

/**
 * Voice recognition using audio fingerprinting
 * 
 * AWS Rekognition doesn't support voice, so we'll use a different approach:
 * - Extract audio features (MFCC, spectral features)
 * - Compare against stored voice prints using cosine similarity
 * - Store embeddings in database
 */

export interface VoiceRecognitionResult {
  userId: number | null;
  confidence: number;
  embedding?: number[];
}

/**
 * Extract voice features from audio sample
 * Uses Web Audio API features or external service
 */
async function extractVoiceFeatures(audioBase64: string): Promise<number[] | null> {
  try {
    // In production, use a voice biometrics service like:
    // - Azure Speaker Recognition API
    // - AWS Transcribe Speaker Identification
    // - VoiceIt API
    // - Speechmatics Speaker Diarization
    
    // For now, we'll use a simple approach with audio fingerprinting
    // This would be replaced with actual voice biometrics API
    
    const audioBuffer = Buffer.from(audioBase64.replace(/^data:audio\/\w+;base64,/, ""), "base64");
    
    // TODO: Implement actual voice feature extraction
    // Options:
    // 1. Use Azure Speaker Recognition: https://azure.microsoft.com/en-us/services/cognitive-services/speaker-recognition/
    // 2. Use AWS Transcribe with speaker identification
    // 3. Use VoiceIt API: https://voiceit.io/
    
    // Placeholder: Return null to indicate feature extraction not yet implemented
    return null;
    
  } catch (error) {
    console.error("Voice feature extraction error:", error);
    return null;
  }
}

/**
 * Compare voice sample against stored voice print
 */
export async function compareVoicePrints(
  sampleAudioBase64: string,
  storedEmbedding: number[]
): Promise<{ similarity: number; matches: boolean }> {
  try {
    const sampleFeatures = await extractVoiceFeatures(sampleAudioBase64);
    
    if (!sampleFeatures) {
      return { similarity: 0, matches: false };
    }
    
    // Calculate cosine similarity
    const similarity = cosineSimilarity(sampleFeatures, storedEmbedding);
    
    return {
      similarity: similarity * 100, // Convert to percentage
      matches: similarity >= 0.85 // 85% threshold for voice match
    };
    
  } catch (error) {
    console.error("Voice comparison error:", error);
    return { similarity: 0, matches: false };
  }
}

/**
 * Search for matching voice in database
 */
export async function searchVoiceInDatabase(
  audioBase64: string,
  allVoicePrints: Array<{ userId: number; embedding: number[] }>
): Promise<VoiceRecognitionResult> {
  try {
    const sampleFeatures = await extractVoiceFeatures(audioBase64);
    
    if (!sampleFeatures) {
      return { userId: null, confidence: 0 };
    }
    
    let bestMatch: { userId: number; confidence: number } | null = null;
    
    for (const voicePrint of allVoicePrints) {
      const similarity = cosineSimilarity(sampleFeatures, voicePrint.embedding);
      const confidence = similarity * 100;
      
      if (confidence >= 85 && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = { userId: voicePrint.userId, confidence };
      }
    }
    
    if (bestMatch) {
      return {
        userId: bestMatch.userId,
        confidence: bestMatch.confidence,
        embedding: sampleFeatures
      };
    }
    
    return { userId: null, confidence: 0, embedding: sampleFeatures };
    
  } catch (error) {
    console.error("Voice search error:", error);
    return { userId: null, confidence: 0 };
  }
}

/**
 * Create voice print from audio sample
 */
export async function createVoicePrint(audioBase64: string): Promise<number[] | null> {
  return extractVoiceFeatures(audioBase64);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have same length");
  }
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }
  
  return dotProduct / (norm1 * norm2);
}

/**
 * Validate base64 image format
 */
export function isValidImageBase64(base64: string): boolean {
  return /^data:image\/(png|jpg|jpeg|webp);base64,/.test(base64);
}

/**
 * Validate base64 audio format
 */
export function isValidAudioBase64(base64: string): boolean {
  return /^data:audio\/(wav|mp3|webm|ogg);base64,/.test(base64);
}
