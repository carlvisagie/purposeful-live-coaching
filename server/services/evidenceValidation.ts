/**
 * KEEPERS OF THE TRUTH - Evidence Validation Engine
 * 
 * Core service for validating, rating, and managing scientific evidence
 * that backs all recommendations on the platform.
 */

import type { EvidenceSource, EvidenceRecommendation } from "../db/schema/evidence";

/**
 * Evidence Strength Rating (ESR) System
 */
export enum EvidenceLevel {
  STRONG = 1,        // ⭐⭐⭐⭐⭐ Multiple high-quality RCTs, meta-analyses
  MODERATE = 2,      // ⭐⭐⭐⭐ Some RCTs, systematic reviews
  PRELIMINARY = 3,   // ⭐⭐⭐ Observational studies, small RCTs
  EMERGING = 4,      // ⭐⭐ Case studies, pilot studies
  ANECDOTAL = 5,     // ⭐ Expert opinion, anecdotal reports
}

export const EVIDENCE_LEVEL_LABELS = {
  [EvidenceLevel.STRONG]: "Strong Evidence",
  [EvidenceLevel.MODERATE]: "Moderate Evidence",
  [EvidenceLevel.PRELIMINARY]: "Preliminary Evidence",
  [EvidenceLevel.EMERGING]: "Emerging Evidence",
  [EvidenceLevel.ANECDOTAL]: "Anecdotal Evidence",
};

export const EVIDENCE_LEVEL_STARS = {
  [EvidenceLevel.STRONG]: "⭐⭐⭐⭐⭐",
  [EvidenceLevel.MODERATE]: "⭐⭐⭐⭐",
  [EvidenceLevel.PRELIMINARY]: "⭐⭐⭐",
  [EvidenceLevel.EMERGING]: "⭐⭐",
  [EvidenceLevel.ANECDOTAL]: "⭐",
};

export const EVIDENCE_LEVEL_DESCRIPTIONS = {
  [EvidenceLevel.STRONG]: "Multiple high-quality randomized controlled trials (RCTs) or meta-analyses with consistent findings. Very high confidence in the recommendation.",
  [EvidenceLevel.MODERATE]: "Some RCTs or systematic reviews with generally consistent findings. Moderate confidence in the recommendation.",
  [EvidenceLevel.PRELIMINARY]: "Observational studies or small RCTs with promising but not definitive results. Preliminary support for the recommendation.",
  [EvidenceLevel.EMERGING]: "Case studies, pilot studies, or early research. Emerging evidence that requires further validation.",
  [EvidenceLevel.ANECDOTAL]: "Expert opinion, clinical experience, or anecdotal reports. Limited scientific evidence.",
};

/**
 * Study Type Quality Weights
 * Used to calculate overall evidence level from multiple sources
 */
const STUDY_TYPE_WEIGHTS = {
  "Meta-Analysis": 1.0,
  "Systematic Review": 0.9,
  "RCT": 0.8,
  "Cohort Study": 0.6,
  "Case-Control Study": 0.5,
  "Cross-Sectional Study": 0.4,
  "Case Series": 0.3,
  "Case Study": 0.2,
  "Expert Opinion": 0.1,
};

/**
 * Calculate evidence level from a set of sources
 */
export function calculateEvidenceLevel(sources: EvidenceSource[]): EvidenceLevel {
  if (sources.length === 0) {
    return EvidenceLevel.ANECDOTAL;
  }

  // Filter out retracted sources
  const validSources = sources.filter(s => !s.isRetracted);
  
  if (validSources.length === 0) {
    return EvidenceLevel.ANECDOTAL;
  }

  // Calculate weighted average
  let totalWeight = 0;
  let weightedSum = 0;

  for (const source of validSources) {
    const weight = STUDY_TYPE_WEIGHTS[source.studyType as keyof typeof STUDY_TYPE_WEIGHTS] || 0.1;
    const qualityFactor = source.peerReviewed ? 1.0 : 0.7;
    const sampleSizeFactor = source.sampleSize ? Math.min(1.0, source.sampleSize / 1000) : 0.5;
    
    const adjustedWeight = weight * qualityFactor * sampleSizeFactor;
    
    totalWeight += adjustedWeight;
    weightedSum += source.evidenceLevel * adjustedWeight;
  }

  const averageLevel = weightedSum / totalWeight;

  // Round to nearest evidence level
  if (averageLevel <= 1.5) return EvidenceLevel.STRONG;
  if (averageLevel <= 2.5) return EvidenceLevel.MODERATE;
  if (averageLevel <= 3.5) return EvidenceLevel.PRELIMINARY;
  if (averageLevel <= 4.5) return EvidenceLevel.EMERGING;
  return EvidenceLevel.ANECDOTAL;
}

/**
 * Calculate confidence score (0-100) based on evidence quality
 */
export function calculateConfidenceScore(sources: EvidenceSource[], evidenceLevel: EvidenceLevel): number {
  if (sources.length === 0) return 0;

  const validSources = sources.filter(s => !s.isRetracted);
  if (validSources.length === 0) return 0;

  // Base score from evidence level
  const baseScore = {
    [EvidenceLevel.STRONG]: 90,
    [EvidenceLevel.MODERATE]: 75,
    [EvidenceLevel.PRELIMINARY]: 60,
    [EvidenceLevel.EMERGING]: 40,
    [EvidenceLevel.ANECDOTAL]: 20,
  }[evidenceLevel];

  // Adjust for number of sources (more sources = higher confidence)
  const sourceBonus = Math.min(10, validSources.length * 2);

  // Adjust for peer review (all peer-reviewed = bonus)
  const peerReviewedCount = validSources.filter(s => s.peerReviewed).length;
  const peerReviewBonus = (peerReviewedCount / validSources.length) * 5;

  // Adjust for recency (sources within 5 years = bonus)
  const recentSources = validSources.filter(s => {
    if (!s.publicationDate) return false;
    const yearsSince = (Date.now() - s.publicationDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return yearsSince <= 5;
  }).length;
  const recencyBonus = (recentSources / validSources.length) * 5;

  return Math.min(100, Math.round(baseScore + sourceBonus + peerReviewBonus + recencyBonus));
}

/**
 * Check if evidence is controversial (conflicting studies)
 */
export function detectControversy(sources: EvidenceSource[]): { isControversial: boolean; reason?: string } {
  if (sources.length < 2) {
    return { isControversial: false };
  }

  const validSources = sources.filter(s => !s.isRetracted);
  
  // Check for wide variation in evidence levels
  const levels = validSources.map(s => s.evidenceLevel);
  const minLevel = Math.min(...levels);
  const maxLevel = Math.max(...levels);
  
  if (maxLevel - minLevel >= 3) {
    return {
      isControversial: true,
      reason: "Studies show widely varying quality and conclusions. Some high-quality evidence conflicts with lower-quality studies.",
    };
  }

  // Check for explicit contradictions in key findings
  // (This would require NLP analysis in production - simplified for MVP)
  
  return { isControversial: false };
}

/**
 * Format evidence for display to users
 */
export interface FormattedEvidence {
  level: EvidenceLevel;
  stars: string;
  label: string;
  description: string;
  confidenceScore: number;
  isControversial: boolean;
  controversyReason?: string;
  sourceCount: number;
  sources: Array<{
    id: string;
    title: string;
    authors: string;
    journal?: string;
    year?: number;
    url: string;
    studyType: string;
  }>;
}

export function formatEvidenceForDisplay(
  recommendation: EvidenceRecommendation,
  sources: EvidenceSource[]
): FormattedEvidence {
  const level = recommendation.overallEvidenceLevel as EvidenceLevel;
  
  return {
    level,
    stars: EVIDENCE_LEVEL_STARS[level],
    label: EVIDENCE_LEVEL_LABELS[level],
    description: EVIDENCE_LEVEL_DESCRIPTIONS[level],
    confidenceScore: recommendation.confidenceScore,
    isControversial: recommendation.isControversial || false,
    controversyReason: recommendation.controversyReason || undefined,
    sourceCount: sources.length,
    sources: sources.map(s => ({
      id: s.id,
      title: s.title,
      authors: s.authors,
      journal: s.journal || undefined,
      year: s.publicationDate ? new Date(s.publicationDate).getFullYear() : undefined,
      url: s.url,
      studyType: s.studyType,
    })),
  };
}

/**
 * Validate a new source before adding to database
 */
export interface SourceValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateNewSource(source: Partial<EvidenceSource>): SourceValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!source.title || source.title.trim().length === 0) {
    errors.push("Title is required");
  }
  if (!source.authors || source.authors.trim().length === 0) {
    errors.push("Authors are required");
  }
  if (!source.url || source.url.trim().length === 0) {
    errors.push("URL is required");
  }
  if (!source.studyType || source.studyType.trim().length === 0) {
    errors.push("Study type is required");
  }
  if (source.evidenceLevel === undefined || source.evidenceLevel < 1 || source.evidenceLevel > 5) {
    errors.push("Evidence level must be between 1 and 5");
  }

  // Warnings
  if (!source.doi && !source.pmid) {
    warnings.push("No DOI or PMID provided - source may be harder to verify");
  }
  if (!source.publicationDate) {
    warnings.push("No publication date provided");
  }
  if (!source.peerReviewed) {
    warnings.push("Source is not peer-reviewed - evidence quality may be lower");
  }
  if (!source.abstract || source.abstract.trim().length === 0) {
    warnings.push("No abstract provided");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
