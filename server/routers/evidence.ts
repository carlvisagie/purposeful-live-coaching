/**
 * Evidence Validation Router
 * Keepers of the Truth - Evidence Strength Rating System
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { evidenceRecords, evidenceSources } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { 
  calculateEvidenceLevel, 
  calculateConfidenceScore, 
  detectControversy,
  validateNewSource,
  formatEvidenceForDisplay,
  EvidenceLevel 
} from "../services/evidenceValidation";

export const evidenceRouter = router({
  /**
   * Get evidence for a specific recommendation
   */
  getEvidenceForRecommendation: publicProcedure
    .input(
      z.object({
        recommendationId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const evidence = await db
        .select()
        .from(evidenceRecords)
        .where(eq(evidenceRecords.recommendationId, input.recommendationId))
        .limit(1);

      if (evidence.length === 0) {
        return null;
      }

      const record = evidence[0];

      // Get all sources for this evidence
      const sources = await db
        .select()
        .from(evidenceSources)
        .where(eq(evidenceSources.evidenceId, record.id))
        .orderBy(desc(evidenceSources.quality));

      return {
        ...record,
        sources,
      };
    }),

  /**
   * Get all evidence records with pagination
   */
  getAllEvidence: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;

      let query = db.select().from(evidenceRecords);

      if (input.category) {
        query = query.where(eq(evidenceRecords.category, input.category));
      }

      const records = await query
        .orderBy(desc(evidenceRecords.lastUpdated))
        .limit(input.limit)
        .offset(offset);

      return records;
    }),

  /**
   * Add or update evidence for a recommendation
   */
  upsertEvidence: publicProcedure
    .input(
      z.object({
        recommendationId: z.string(),
        recommendationText: z.string(),
        category: z.string(),
        sources: z.array(
          z.object({
            title: z.string(),
            authors: z.array(z.string()),
            journal: z.string().optional(),
            year: z.number(),
            doi: z.string().optional(),
            pubmedId: z.string().optional(),
            url: z.string().url(),
            studyType: z.string(),
            sampleSize: z.number().optional(),
            quality: z.number().min(1).max(5),
            peerReviewed: z.boolean().default(true),
            publicationDate: z.date().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // Map input sources to EvidenceSource format for validation
      const sourcesForValidation = input.sources.map(s => ({
        ...s,
        evidenceLevel: s.quality, // Map quality to evidenceLevel
        isRetracted: false,
        publicationDate: s.publicationDate || new Date(s.year, 0, 1),
      }));

      // Calculate evidence level from sources
      const evidenceLevel = calculateEvidenceLevel(sourcesForValidation as any);
      
      // Calculate confidence score
      const confidenceScore = calculateConfidenceScore(sourcesForValidation as any, evidenceLevel);
      
      // Detect controversy
      const controversy = detectControversy(sourcesForValidation as any);

      // Check if evidence record already exists
      const existing = await db
        .select()
        .from(evidenceRecords)
        .where(eq(evidenceRecords.recommendationId, input.recommendationId))
        .limit(1);

      let evidenceId: string;

      if (existing.length > 0) {
        // Update existing record
        await db
          .update(evidenceRecords)
          .set({
            recommendationText: input.recommendationText,
            category: input.category,
            evidenceStrength: evidenceLevel,
            confidenceScore: confidenceScore,
            sourceCount: input.sources.length,
            lastUpdated: new Date(),
            controversyFlag: controversy.isControversial,
            qualityAssessment: `Evidence Level: ${evidenceLevel}, Confidence: ${confidenceScore}%`,
          })
          .where(eq(evidenceRecords.id, existing[0].id));

        evidenceId = existing[0].id;

        // Delete old sources
        await db
          .delete(evidenceSources)
          .where(eq(evidenceSources.evidenceId, evidenceId));
      } else {
        // Create new record
        const [newRecord] = await db
          .insert(evidenceRecords)
          .values({
            recommendationId: input.recommendationId,
            recommendationText: input.recommendationText,
            category: input.category,
            evidenceStrength: evidenceLevel,
            confidenceScore: confidenceScore,
            sourceCount: input.sources.length,
            lastUpdated: new Date(),
            controversyFlag: controversy.isControversial,
            qualityAssessment: `Evidence Level: ${evidenceLevel}, Confidence: ${confidenceScore}%`,
          })
          .returning();

        evidenceId = newRecord.id;
      }

      // Insert new sources
      for (const source of input.sources) {
        await db.insert(evidenceSources).values({
          evidenceId,
          title: source.title,
          authors: source.authors,
          journal: source.journal,
          year: source.year,
          doi: source.doi,
          pubmedId: source.pubmedId,
          url: source.url,
          studyType: source.studyType,
          sampleSize: source.sampleSize,
          quality: source.quality,
        });
      }

      return {
        success: true,
        evidenceId,
        evidenceStrength: evidenceLevel,
        confidenceScore: confidenceScore,
        controversy: controversy.isControversial ? controversy.reason : null,
      };
    }),

  /**
   * Get evidence statistics
   */
  getEvidenceStats: publicProcedure.query(async () => {
    const allEvidence = await db.select().from(evidenceRecords);

    const stats = {
      total: allEvidence.length,
      byStrength: {
        [EvidenceLevel.STRONG]: allEvidence.filter((e) => e.evidenceStrength === EvidenceLevel.STRONG).length,
        [EvidenceLevel.MODERATE]: allEvidence.filter((e) => e.evidenceStrength === EvidenceLevel.MODERATE).length,
        [EvidenceLevel.PRELIMINARY]: allEvidence.filter((e) => e.evidenceStrength === EvidenceLevel.PRELIMINARY).length,
        [EvidenceLevel.EMERGING]: allEvidence.filter((e) => e.evidenceStrength === EvidenceLevel.EMERGING).length,
        [EvidenceLevel.ANECDOTAL]: allEvidence.filter((e) => e.evidenceStrength === EvidenceLevel.ANECDOTAL).length,
      },
      withControversy: allEvidence.filter((e) => e.controversyFlag).length,
      averageConfidence:
        allEvidence.length > 0
          ? allEvidence.reduce((sum, e) => sum + e.confidenceScore, 0) / allEvidence.length
          : 0,
    };

    return stats;
  }),
});
