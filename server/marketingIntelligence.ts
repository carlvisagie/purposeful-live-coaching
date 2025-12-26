/**
 * MARKETING INTELLIGENCE MODULE
 * 
 * Self-learning system for:
 * - Email campaigns (open rates, click rates, conversions)
 * - YouTube/Podcast content (views, engagement, retention)
 * - Content performance (quality, engagement, virality)
 * - Marketing campaigns (ROI, conversion funnels)
 * 
 * Learns what works and continuously improves marketing effectiveness.
 */

import { SelfLearning } from "./selfLearningIntegration.js";
import PlatformIntelligence from "./platformIntelligence.js";

// ============================================================================
// EMAIL MARKETING INTELLIGENCE
// ============================================================================

export interface EmailPerformance {
  emailId: string;
  emailType: string;
  subject: string;
  sentAt: Date;
  
  // Metrics
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  bounced: number;
  unsubscribed: number;
  
  // Rates
  openRate: number; // 0-100
  clickRate: number; // 0-100
  conversionRate: number; // 0-100
  
  // Metadata
  segmentId?: string;
  campaignId?: string;
  metadata?: any;
}

export interface EmailLearning {
  emailType: string;
  
  // Performance
  totalSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageConversionRate: number;
  
  // Best performing
  bestSubjectLines: Array<{ subject: string; openRate: number }>;
  bestSendTimes: Array<{ hour: number; dayOfWeek: number; openRate: number }>;
  bestSegments: Array<{ segmentId: string; conversionRate: number }>;
  
  // Patterns
  effectiveWords: string[];
  ineffectiveWords: string[];
  optimalLength: number; // characters
  
  lastAnalyzed: Date;
}

// In-memory storage (would be database in production)
const emailPerformanceStore: EmailPerformance[] = [];
const emailLearningStore = new Map<string, EmailLearning>();

/**
 * Track email performance
 */
export function trackEmailPerformance(performance: EmailPerformance) {
  emailPerformanceStore.push(performance);
  
  // Calculate rates
  performance.openRate = (performance.opened / performance.delivered) * 100;
  performance.clickRate = (performance.clicked / performance.delivered) * 100;
  performance.conversionRate = (performance.converted / performance.delivered) * 100;
  
  // Track in self-learning system
  SelfLearning.trackInteraction({
    moduleType: "coaching_techniques",
    action: `email_${performance.emailType}`,
    wasSuccessful: performance.openRate > 20, // Industry average is ~20%
    userSatisfaction: Math.round(performance.openRate / 10), // Convert to 1-10 scale
    metadata: {
      emailId: performance.emailId,
      subject: performance.subject,
      openRate: performance.openRate,
      clickRate: performance.clickRate,
      conversionRate: performance.conversionRate,
    },
  });
  
  console.log(`[MarketingIntelligence] Email tracked: ${performance.emailType} - Open: ${performance.openRate.toFixed(1)}%, Click: ${performance.clickRate.toFixed(1)}%`);
}

/**
 * Analyze email performance and generate learnings
 */
export function analyzeEmailPerformance(emailType: string): EmailLearning {
  const emails = emailPerformanceStore.filter(e => e.emailType === emailType);
  
  if (emails.length === 0) {
    return {
      emailType,
      totalSent: 0,
      averageOpenRate: 0,
      averageClickRate: 0,
      averageConversionRate: 0,
      bestSubjectLines: [],
      bestSendTimes: [],
      bestSegments: [],
      effectiveWords: [],
      ineffectiveWords: [],
      optimalLength: 50,
      lastAnalyzed: new Date(),
    };
  }
  
  // Calculate averages
  const totalSent = emails.reduce((sum, e) => sum + e.sent, 0);
  const averageOpenRate = emails.reduce((sum, e) => sum + e.openRate, 0) / emails.length;
  const averageClickRate = emails.reduce((sum, e) => sum + e.clickRate, 0) / emails.length;
  const averageConversionRate = emails.reduce((sum, e) => sum + e.conversionRate, 0) / emails.length;
  
  // Find best subject lines
  const bestSubjectLines = emails
    .sort((a, b) => b.openRate - a.openRate)
    .slice(0, 10)
    .map(e => ({ subject: e.subject, openRate: e.openRate }));
  
  // Analyze effective words
  const highPerformers = emails.filter(e => e.openRate > averageOpenRate * 1.2);
  const lowPerformers = emails.filter(e => e.openRate < averageOpenRate * 0.8);
  
  const effectiveWords = extractCommonWords(highPerformers.map(e => e.subject));
  const ineffectiveWords = extractCommonWords(lowPerformers.map(e => e.subject));
  
  const learning: EmailLearning = {
    emailType,
    totalSent,
    averageOpenRate,
    averageClickRate,
    averageConversionRate,
    bestSubjectLines,
    bestSendTimes: [],
    bestSegments: [],
    effectiveWords,
    ineffectiveWords,
    optimalLength: Math.round(bestSubjectLines.reduce((sum, s) => sum + s.subject.length, 0) / bestSubjectLines.length),
    lastAnalyzed: new Date(),
  };
  
  emailLearningStore.set(emailType, learning);
  
  return learning;
}

/**
 * Get email recommendations based on learning
 */
export function getEmailRecommendations(emailType: string): {
  subjectLineGuidelines: string[];
  sendTimeRecommendations: string[];
  contentGuidelines: string[];
} {
  const learning = emailLearningStore.get(emailType);
  
  if (!learning) {
    return {
      subjectLineGuidelines: ["Not enough data yet - send more emails to learn"],
      sendTimeRecommendations: ["Not enough data yet"],
      contentGuidelines: ["Not enough data yet"],
    };
  }
  
  const subjectLineGuidelines = [];
  
  if (learning.effectiveWords.length > 0) {
    subjectLineGuidelines.push(`Use these effective words: ${learning.effectiveWords.slice(0, 5).join(", ")}`);
  }
  
  if (learning.ineffectiveWords.length > 0) {
    subjectLineGuidelines.push(`Avoid these words: ${learning.ineffectiveWords.slice(0, 5).join(", ")}`);
  }
  
  subjectLineGuidelines.push(`Optimal length: ${learning.optimalLength} characters`);
  subjectLineGuidelines.push(`Current average open rate: ${learning.averageOpenRate.toFixed(1)}%`);
  
  return {
    subjectLineGuidelines,
    sendTimeRecommendations: ["Best times will be determined after more data"],
    contentGuidelines: [`Target click rate: ${(learning.averageClickRate * 1.2).toFixed(1)}%`],
  };
}

// ============================================================================
// YOUTUBE/PODCAST INTELLIGENCE
// ============================================================================

export interface VideoPerformance {
  videoId: string;
  title: string;
  publishedAt: Date;
  
  // Metrics
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  watchTime: number; // seconds
  averageViewDuration: number; // seconds
  videoDuration: number; // seconds
  
  // Rates
  engagementRate: number; // (likes + comments + shares) / views * 100
  retentionRate: number; // averageViewDuration / videoDuration * 100
  likeRatio: number; // likes / (likes + dislikes) * 100
  
  // Metadata
  tags: string[];
  category: string;
  thumbnail?: string;
  metadata?: any;
}

export interface VideoLearning {
  category: string;
  
  // Performance
  totalVideos: number;
  averageViews: number;
  averageEngagementRate: number;
  averageRetentionRate: number;
  
  // Best performing
  bestTitles: Array<{ title: string; views: number }>;
  bestTags: Array<{ tag: string; averageViews: number }>;
  optimalDuration: number; // seconds
  bestPublishTimes: Array<{ hour: number; dayOfWeek: number; averageViews: number }>;
  
  // Patterns
  effectiveTitleWords: string[];
  ineffectiveTitleWords: string[];
  highRetentionPatterns: string[];
  
  lastAnalyzed: Date;
}

// In-memory storage
const videoPerformanceStore: VideoPerformance[] = [];
const videoLearningStore = new Map<string, VideoLearning>();

/**
 * Track video performance
 */
export function trackVideoPerformance(performance: VideoPerformance) {
  videoPerformanceStore.push(performance);
  
  // Calculate rates
  performance.engagementRate = ((performance.likes + performance.comments + performance.shares) / performance.views) * 100;
  performance.retentionRate = (performance.averageViewDuration / performance.videoDuration) * 100;
  performance.likeRatio = (performance.likes / (performance.likes + performance.dislikes)) * 100;
  
  // Track in self-learning system
  SelfLearning.trackInteraction({
    moduleType: "coaching_techniques",
    action: `video_${performance.category}`,
    wasSuccessful: performance.retentionRate > 50, // Good retention is >50%
    userSatisfaction: Math.round(performance.engagementRate * 2), // Convert to 1-10 scale
    metadata: {
      videoId: performance.videoId,
      title: performance.title,
      views: performance.views,
      engagementRate: performance.engagementRate,
      retentionRate: performance.retentionRate,
    },
  });
  
  console.log(`[MarketingIntelligence] Video tracked: ${performance.title} - Views: ${performance.views}, Engagement: ${performance.engagementRate.toFixed(1)}%, Retention: ${performance.retentionRate.toFixed(1)}%`);
}

/**
 * Analyze video performance and generate learnings
 */
export function analyzeVideoPerformance(category: string): VideoLearning {
  const videos = videoPerformanceStore.filter(v => v.category === category);
  
  if (videos.length === 0) {
    return {
      category,
      totalVideos: 0,
      averageViews: 0,
      averageEngagementRate: 0,
      averageRetentionRate: 0,
      bestTitles: [],
      bestTags: [],
      optimalDuration: 600, // 10 minutes default
      bestPublishTimes: [],
      effectiveTitleWords: [],
      ineffectiveTitleWords: [],
      highRetentionPatterns: [],
      lastAnalyzed: new Date(),
    };
  }
  
  // Calculate averages
  const totalVideos = videos.length;
  const averageViews = videos.reduce((sum, v) => sum + v.views, 0) / videos.length;
  const averageEngagementRate = videos.reduce((sum, v) => sum + v.engagementRate, 0) / videos.length;
  const averageRetentionRate = videos.reduce((sum, v) => sum + v.retentionRate, 0) / videos.length;
  
  // Find best titles
  const bestTitles = videos
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map(v => ({ title: v.title, views: v.views }));
  
  // Analyze effective title words
  const highPerformers = videos.filter(v => v.views > averageViews * 1.2);
  const lowPerformers = videos.filter(v => v.views < averageViews * 0.8);
  
  const effectiveTitleWords = extractCommonWords(highPerformers.map(v => v.title));
  const ineffectiveTitleWords = extractCommonWords(lowPerformers.map(v => v.title));
  
  // Find optimal duration
  const highRetentionVideos = videos.filter(v => v.retentionRate > 60);
  const optimalDuration = highRetentionVideos.length > 0
    ? Math.round(highRetentionVideos.reduce((sum, v) => sum + v.videoDuration, 0) / highRetentionVideos.length)
    : 600;
  
  const learning: VideoLearning = {
    category,
    totalVideos,
    averageViews,
    averageEngagementRate,
    averageRetentionRate,
    bestTitles,
    bestTags: [],
    optimalDuration,
    bestPublishTimes: [],
    effectiveTitleWords,
    ineffectiveTitleWords,
    highRetentionPatterns: [],
    lastAnalyzed: new Date(),
  };
  
  videoLearningStore.set(category, learning);
  
  return learning;
}

/**
 * Get video recommendations based on learning
 */
export function getVideoRecommendations(category: string): {
  titleGuidelines: string[];
  durationRecommendations: string[];
  contentGuidelines: string[];
} {
  const learning = videoLearningStore.get(category);
  
  if (!learning) {
    return {
      titleGuidelines: ["Not enough data yet - publish more videos to learn"],
      durationRecommendations: ["Aim for 8-12 minutes for optimal retention"],
      contentGuidelines: ["Focus on engagement in first 30 seconds"],
    };
  }
  
  const titleGuidelines = [];
  
  if (learning.effectiveTitleWords.length > 0) {
    titleGuidelines.push(`Use these effective words: ${learning.effectiveTitleWords.slice(0, 5).join(", ")}`);
  }
  
  if (learning.ineffectiveTitleWords.length > 0) {
    titleGuidelines.push(`Avoid these words: ${learning.ineffectiveTitleWords.slice(0, 5).join(", ")}`);
  }
  
  titleGuidelines.push(`Average views: ${Math.round(learning.averageViews)}`);
  
  const durationMinutes = Math.round(learning.optimalDuration / 60);
  
  return {
    titleGuidelines,
    durationRecommendations: [
      `Optimal duration: ${durationMinutes} minutes`,
      `Current average retention: ${learning.averageRetentionRate.toFixed(1)}%`,
    ],
    contentGuidelines: [
      `Target engagement rate: ${(learning.averageEngagementRate * 1.2).toFixed(1)}%`,
      `Focus on retention - current average: ${learning.averageRetentionRate.toFixed(1)}%`,
    ],
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract common words from text array
 */
function extractCommonWords(texts: string[]): string[] {
  const wordCounts = new Map<string, number>();
  
  // Common stop words to ignore
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "is", "are", "was", "were", "be", "been", "being"]);
  
  for (const text of texts) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    for (const word of words) {
      if (word.length > 3 && !stopWords.has(word)) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    }
  }
  
  // Return top words
  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// ============================================================================
// EXPORT MARKETING INTELLIGENCE API
// ============================================================================

export const MarketingIntelligence = {
  // Email
  trackEmailPerformance,
  analyzeEmailPerformance,
  getEmailRecommendations,
  getEmailLearning: (emailType: string) => emailLearningStore.get(emailType),
  
  // Video
  trackVideoPerformance,
  analyzeVideoPerformance,
  getVideoRecommendations,
  getVideoLearning: (category: string) => videoLearningStore.get(category),
  
  // Summary
  getSummary: () => ({
    email: {
      totalEmailTypes: emailLearningStore.size,
      totalEmailsSent: emailPerformanceStore.length,
      averageOpenRate: emailPerformanceStore.length > 0
        ? emailPerformanceStore.reduce((sum, e) => sum + e.openRate, 0) / emailPerformanceStore.length
        : 0,
    },
    video: {
      totalCategories: videoLearningStore.size,
      totalVideos: videoPerformanceStore.length,
      averageViews: videoPerformanceStore.length > 0
        ? videoPerformanceStore.reduce((sum, v) => sum + v.views, 0) / videoPerformanceStore.length
        : 0,
    },
  }),
};

export default MarketingIntelligence;
