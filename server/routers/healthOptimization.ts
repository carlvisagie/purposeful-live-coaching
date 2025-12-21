/**
 * HEALTH OPTIMIZATION ROUTER
 * Evidence-based health assessment and tracking
 * Research: Peter Attia (longevity), David Sinclair (aging), Andrew Huberman (protocols)
 * 
 * This router exposes the health optimization schema for:
 * - Health intake questionnaire
 * - Biomarker tracking
 * - Daily health metrics
 * - Health protocols and interventions
 * - Mortality risk assessment
 */

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { db } from "../db";
import { 
  healthOptimizationProfiles, 
  biomarkers, 
  dailyHealthMetrics,
  healthProtocols,
  sleepSessions,
  stressRecoveryLogs,
  healthScreenings,
  longevityPractices,
  healthMilestones
} from "../../drizzle/healthOptimizationSchema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import ProfileGuard from "../profileGuard";
import SelfLearning from "../selfLearningIntegration";

// Health Intake Questionnaire Schema
const healthIntakeSchema = z.object({
  // Demographics
  dateOfBirth: z.string().optional(),
  biologicalSex: z.enum(["male", "female", "other"]).optional(),
  height: z.number().optional(), // cm
  weight: z.number().optional(), // kg
  
  // Current Health Status
  overallHealth: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(10),
  sleepQuality: z.number().min(1).max(10),
  stressLevel: z.number().min(1).max(10),
  
  // Health Goals
  primaryGoal: z.enum([
    "longevity",
    "weight_loss",
    "muscle_gain",
    "energy",
    "mental_clarity",
    "stress_reduction",
    "sleep_improvement",
    "disease_prevention",
    "athletic_performance",
    "hormone_optimization"
  ]),
  
  // Medical History
  currentConditions: z.array(z.string()).optional(),
  familyHistory: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  
  // Lifestyle
  smokingStatus: z.enum(["never", "former", "current"]).optional(),
  alcoholConsumption: z.enum(["none", "occasional", "moderate", "heavy"]).optional(),
  exerciseFrequency: z.enum(["none", "1-2_weekly", "3-4_weekly", "5+_weekly"]).optional(),
  dietType: z.enum(["standard", "vegetarian", "vegan", "keto", "paleo", "mediterranean", "other"]).optional(),
  
  // Sleep
  averageSleepHours: z.number().optional(),
  sleepIssues: z.array(z.string()).optional(),
  
  // Mental Health
  mentalHealthConcerns: z.array(z.string()).optional(),
  currentlyInTherapy: z.boolean().optional(),
  
  // Risk Factors
  hasRecentBloodwork: z.boolean().optional(),
  lastPhysicalExam: z.string().optional(),
  
  // Consent
  consentToHealthTracking: z.boolean(),
  understandsNotMedicalAdvice: z.boolean(),
});

// Biomarker Entry Schema
const biomarkerEntrySchema = z.object({
  testDate: z.string(),
  testSource: z.string().optional(),
  
  // Metabolic
  fastingGlucose: z.number().optional(),
  hbA1c: z.number().optional(),
  fastingInsulin: z.number().optional(),
  
  // Lipids
  totalCholesterol: z.number().optional(),
  ldlCholesterol: z.number().optional(),
  hdlCholesterol: z.number().optional(),
  triglycerides: z.number().optional(),
  apoB: z.number().optional(),
  
  // Inflammation
  hsCRP: z.number().optional(),
  
  // Liver
  alt: z.number().optional(),
  ast: z.number().optional(),
  
  // Kidney
  creatinine: z.number().optional(),
  eGFR: z.number().optional(),
  
  // Thyroid
  tsh: z.number().optional(),
  freeT3: z.number().optional(),
  freeT4: z.number().optional(),
  
  // Hormones
  testosterone: z.number().optional(),
  estradiol: z.number().optional(),
  cortisol: z.number().optional(),
  
  // Vitamins
  vitaminD: z.number().optional(),
  vitaminB12: z.number().optional(),
  
  // CBC
  hemoglobin: z.number().optional(),
  
  notes: z.string().optional(),
});

// Daily Metrics Schema
const dailyMetricsSchema = z.object({
  metricDate: z.string(),
  
  // Vitals
  restingHeartRate: z.number().optional(),
  hrv: z.number().optional(),
  bloodPressureSystolic: z.number().optional(),
  bloodPressureDiastolic: z.number().optional(),
  
  // Weight
  weight: z.number().optional(),
  bodyFat: z.number().optional(),
  
  // Sleep
  sleepDuration: z.number().optional(),
  sleepQuality: z.number().min(1).max(10).optional(),
  
  // Energy
  energyLevel: z.number().min(1).max(10).optional(),
  mentalClarity: z.number().min(1).max(10).optional(),
  
  // Stress
  stressLevel: z.number().min(1).max(10).optional(),
  
  // Symptoms
  symptoms: z.array(z.string()).optional(),
});

export const healthOptimizationRouter = router({
  /**
   * Check if user has completed health intake
   */
  hasCompletedIntake: protectedProcedure
    .input(z.object({ userId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "health_optimization",
        logAccess: true,
      });
      
      const profile = await db
        .select()
        .from(healthOptimizationProfiles)
        .where(eq(healthOptimizationProfiles.userId, userId))
      .limit(1);
    
    return {
      hasCompleted: profile.length > 0,
      profile: profile[0] || null,
    };
  }),

  /**
   * Submit health intake questionnaire
   */
  submitHealthIntake: protectedProcedure
    .input(healthIntakeSchema.extend({ userId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "health_optimization",
        logAccess: true,
      });
      
      const profileId = uuidv4();
      
      // Calculate chronological age if DOB provided
      let chronologicalAge: number | undefined;
      if (input.dateOfBirth) {
        const dob = new Date(input.dateOfBirth);
        const today = new Date();
        chronologicalAge = Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      }
      
      // Create health profile
      await db.insert(healthOptimizationProfiles).values({
        id: profileId,
        userId: userId,
        overallHealth: input.overallHealth,
        chronologicalAge,
        primaryGoal: input.primaryGoal,
        familyHistory: input.familyHistory ? JSON.stringify(input.familyHistory) : null,
        currentConditions: input.currentConditions ? JSON.stringify(input.currentConditions) : null,
        currentMedications: input.currentMedications ? JSON.stringify(input.currentMedications) : null,
        smokingStatus: input.smokingStatus,
        alcoholConsumption: input.alcoholConsumption,
        riskFactors: JSON.stringify({
          exerciseFrequency: input.exerciseFrequency,
          dietType: input.dietType,
          sleepIssues: input.sleepIssues,
          mentalHealthConcerns: input.mentalHealthConcerns,
        }),
      });
      
      // Create initial daily metrics
      if (input.weight || input.sleepQuality || input.stressLevel) {
        await db.insert(dailyHealthMetrics).values({
          id: uuidv4(),
          profileId,
          userId: userId,
          metricDate: new Date(),
          weight: input.weight?.toString(),
          sleepQuality: input.sleepQuality,
          stressLevel: input.stressLevel,
          energyLevel: input.energyLevel,
        });
      }
      
      return {
        success: true,
        profileId,
        message: "Health profile created successfully",
      };
    }),

  /**
   * Get user's health profile
   */
  getHealthProfile: protectedProcedure
    .input(z.object({ userId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "health_optimization",
        logAccess: true,
      });
      
      const profile = await db
        .select()
        .from(healthOptimizationProfiles)
        .where(eq(healthOptimizationProfiles.userId, userId))
      .limit(1);
    
    if (!profile.length) {
      return null;
    }
    
    // Parse JSON fields
    const p = profile[0];
    return {
      ...p,
      familyHistory: p.familyHistory ? JSON.parse(p.familyHistory) : [],
      currentConditions: p.currentConditions ? JSON.parse(p.currentConditions) : [],
      currentMedications: p.currentMedications ? JSON.parse(p.currentMedications) : [],
      riskFactors: p.riskFactors ? JSON.parse(p.riskFactors) : {},
    };
  }),

  /**
   * Add biomarker entry (lab results)
   */
  addBiomarkers: protectedProcedure
    .input(biomarkerEntrySchema.extend({ userId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "health_optimization",
        logAccess: true,
      });
      
      // Get profile
      const profile = await db
        .select()
        .from(healthOptimizationProfiles)
        .where(eq(healthOptimizationProfiles.userId, userId))
        .limit(1);
      
      if (!profile.length) {
        throw new Error("Please complete health intake first");
      }
      
      await db.insert(biomarkers).values({
        id: uuidv4(),
        profileId: profile[0].id,
        userId: userId,
        testDate: new Date(input.testDate),
        testSource: input.testSource,
        fastingGlucose: input.fastingGlucose?.toString(),
        hbA1c: input.hbA1c?.toString(),
        fastingInsulin: input.fastingInsulin?.toString(),
        totalCholesterol: input.totalCholesterol,
        ldlCholesterol: input.ldlCholesterol,
        hdlCholesterol: input.hdlCholesterol,
        triglycerides: input.triglycerides,
        apoB: input.apoB,
        hsCRP: input.hsCRP?.toString(),
        alt: input.alt,
        ast: input.ast,
        creatinine: input.creatinine?.toString(),
        eGFR: input.eGFR,
        tsh: input.tsh?.toString(),
        freeT3: input.freeT3?.toString(),
        freeT4: input.freeT4?.toString(),
        testosterone: input.testosterone,
        estradiol: input.estradiol,
        cortisol: input.cortisol?.toString(),
        vitaminD: input.vitaminD?.toString(),
        vitaminB12: input.vitaminB12,
        hemoglobin: input.hemoglobin?.toString(),
        notes: input.notes,
      });
      
      return { success: true };
    }),

  /**
   * Get biomarker history
   */
  getBiomarkers: protectedProcedure
    .input(z.object({ userId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "health_optimization",
        logAccess: true,
      });
      
      const results = await db
        .select()
        .from(biomarkers)
        .where(eq(biomarkers.userId, userId))
      .orderBy(desc(biomarkers.testDate));
    
    return results;
  }),

  /**
   * Log daily health metrics
   */
  logDailyMetrics: protectedProcedure
    .input(dailyMetricsSchema.extend({ userId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "health_optimization",
        logAccess: true,
      });
      
      const profile = await db
        .select()
        .from(healthOptimizationProfiles)
        .where(eq(healthOptimizationProfiles.userId, userId))
        .limit(1);
      
      if (!profile.length) {
        throw new Error("Please complete health intake first");
      }
      
      await db.insert(dailyHealthMetrics).values({
        id: uuidv4(),
        profileId: profile[0].id,
        userId: userId,
        metricDate: new Date(input.metricDate),
        restingHeartRate: input.restingHeartRate,
        hrv: input.hrv,
        bloodPressureSystolic: input.bloodPressureSystolic,
        bloodPressureDiastolic: input.bloodPressureDiastolic,
        weight: input.weight?.toString(),
        bodyFat: input.bodyFat?.toString(),
        sleepDuration: input.sleepDuration?.toString(),
        sleepQuality: input.sleepQuality,
        energyLevel: input.energyLevel,
        mentalClarity: input.mentalClarity,
        stressLevel: input.stressLevel,
        symptoms: input.symptoms ? JSON.stringify(input.symptoms) : null,
      });
      
      return { success: true };
    }),

  /**
   * Get daily metrics history
   */
  getDailyMetrics: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
      userId: z.number().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "health_optimization",
        logAccess: true,
      });
      
      const days = input?.days || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const results = await db
        .select()
        .from(dailyHealthMetrics)
        .where(
          and(
            eq(dailyHealthMetrics.userId, userId),
            gte(dailyHealthMetrics.metricDate, startDate)
          )
        )
        .orderBy(desc(dailyHealthMetrics.metricDate));
      
      return results;
    }),

  /**
   * Get health summary for AI Coach context
   * This is what gets passed to the AI before each session
   */
  getHealthSummaryForAI: protectedProcedure
    .input(z.object({ userId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "health_optimization",
        logAccess: true,
      });
      
      // Get profile
      const profile = await db
        .select()
        .from(healthOptimizationProfiles)
        .where(eq(healthOptimizationProfiles.userId, userId))
      .limit(1);
    
    if (!profile.length) {
      return {
        hasHealthProfile: false,
        summary: "Client has not completed health intake. Recommend completing health assessment for personalized coaching.",
      };
    }
    
    const p = profile[0];
    
    // Get latest metrics
    const latestMetrics = await db
      .select()
      .from(dailyHealthMetrics)
      .where(eq(dailyHealthMetrics.userId, userId))
      .orderBy(desc(dailyHealthMetrics.metricDate))
      .limit(1);
    
    // Get latest biomarkers
    const latestBiomarkers = await db
      .select()
      .from(biomarkers)
      .where(eq(biomarkers.userId, userId))
      .orderBy(desc(biomarkers.testDate))
      .limit(1);
    
    // Build summary
    const conditions = p.currentConditions ? JSON.parse(p.currentConditions) : [];
    const medications = p.currentMedications ? JSON.parse(p.currentMedications) : [];
    const riskFactors = p.riskFactors ? JSON.parse(p.riskFactors) : {};
    
    let summary = `CLIENT HEALTH PROFILE:\n`;
    summary += `- Age: ${p.chronologicalAge || "Not provided"}\n`;
    summary += `- Overall Health: ${p.overallHealth}/10\n`;
    summary += `- Primary Goal: ${p.primaryGoal?.replace(/_/g, " ")}\n`;
    
    if (conditions.length) {
      summary += `- Current Conditions: ${conditions.join(", ")}\n`;
    }
    if (medications.length) {
      summary += `- Medications: ${medications.join(", ")}\n`;
    }
    if (p.smokingStatus) {
      summary += `- Smoking: ${p.smokingStatus}\n`;
    }
    if (p.alcoholConsumption) {
      summary += `- Alcohol: ${p.alcoholConsumption}\n`;
    }
    if (riskFactors.exerciseFrequency) {
      summary += `- Exercise: ${riskFactors.exerciseFrequency.replace(/_/g, " ")}\n`;
    }
    if (riskFactors.sleepIssues?.length) {
      summary += `- Sleep Issues: ${riskFactors.sleepIssues.join(", ")}\n`;
    }
    if (riskFactors.mentalHealthConcerns?.length) {
      summary += `- Mental Health Concerns: ${riskFactors.mentalHealthConcerns.join(", ")}\n`;
    }
    
    if (latestMetrics.length) {
      const m = latestMetrics[0];
      summary += `\nLATEST DAILY METRICS:\n`;
      if (m.energyLevel) summary += `- Energy: ${m.energyLevel}/10\n`;
      if (m.stressLevel) summary += `- Stress: ${m.stressLevel}/10\n`;
      if (m.sleepQuality) summary += `- Sleep Quality: ${m.sleepQuality}/10\n`;
      if (m.sleepDuration) summary += `- Sleep Duration: ${m.sleepDuration} hours\n`;
    }
    
    summary += `\nCOACHING CONSIDERATIONS:\n`;
    summary += `- Tailor advice to their goal of ${p.primaryGoal?.replace(/_/g, " ")}\n`;
    summary += `- Be aware of any conditions/medications when suggesting interventions\n`;
    summary += `- This is coaching, not medical advice - refer to healthcare providers for medical concerns\n`;
    
    return {
      hasHealthProfile: true,
      profile: p,
      latestMetrics: latestMetrics[0] || null,
      latestBiomarkers: latestBiomarkers[0] || null,
      summary,
    };
  }),

  /**
   * Calculate mortality risk factors (simplified)
   * Based on research from Peter Attia's "Outlive"
   */
  getMortalityRiskAssessment: protectedProcedure
    .input(z.object({ userId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "health_optimization",
        logAccess: true,
      });
      
      const profile = await db
        .select()
        .from(healthOptimizationProfiles)
        .where(eq(healthOptimizationProfiles.userId, userId))
      .limit(1);
    
    if (!profile.length) {
      return { hasProfile: false };
    }
    
    const p = profile[0];
    const riskFactors = p.riskFactors ? JSON.parse(p.riskFactors) : {};
    const conditions = p.currentConditions ? JSON.parse(p.currentConditions) : [];
    
    // Risk factors based on research
    const risks: { factor: string; level: "low" | "moderate" | "high"; recommendation: string }[] = [];
    
    // Smoking
    if (p.smokingStatus === "current") {
      risks.push({
        factor: "Smoking",
        level: "high",
        recommendation: "Smoking is the #1 modifiable risk factor for early death. Consider smoking cessation support.",
      });
    }
    
    // Exercise
    if (riskFactors.exerciseFrequency === "none") {
      risks.push({
        factor: "Physical Inactivity",
        level: "high",
        recommendation: "Sedentary lifestyle increases mortality risk by 30-50%. Even 20 min of walking daily helps.",
      });
    } else if (riskFactors.exerciseFrequency === "1-2_weekly") {
      risks.push({
        factor: "Low Exercise",
        level: "moderate",
        recommendation: "Aim for 150+ minutes of moderate exercise weekly for optimal health.",
      });
    }
    
    // Sleep
    if (riskFactors.sleepIssues?.length > 0) {
      risks.push({
        factor: "Sleep Issues",
        level: "moderate",
        recommendation: "Poor sleep is linked to increased mortality. Address sleep hygiene and consider sleep study if severe.",
      });
    }
    
    // Alcohol
    if (p.alcoholConsumption === "heavy") {
      risks.push({
        factor: "Heavy Alcohol Use",
        level: "high",
        recommendation: "Heavy drinking significantly increases mortality risk. Consider reducing or seeking support.",
      });
    }
    
    // Mental Health
    if (riskFactors.mentalHealthConcerns?.length > 0) {
      risks.push({
        factor: "Mental Health",
        level: "moderate",
        recommendation: "Mental health impacts physical health. Ensure you have adequate support and treatment.",
      });
    }
    
    // Chronic conditions
    const highRiskConditions = ["diabetes", "heart disease", "hypertension", "obesity"];
    const hasHighRiskCondition = conditions.some((c: string) => 
      highRiskConditions.some(hr => c.toLowerCase().includes(hr))
    );
    
    if (hasHighRiskCondition) {
      risks.push({
        factor: "Chronic Condition",
        level: "moderate",
        recommendation: "Work closely with healthcare providers to manage chronic conditions optimally.",
      });
    }
    
    // Overall assessment
    const highRiskCount = risks.filter(r => r.level === "high").length;
    const moderateRiskCount = risks.filter(r => r.level === "moderate").length;
    
    let overallRisk: "low" | "moderate" | "high" = "low";
    if (highRiskCount >= 2 || (highRiskCount >= 1 && moderateRiskCount >= 2)) {
      overallRisk = "high";
    } else if (highRiskCount >= 1 || moderateRiskCount >= 2) {
      overallRisk = "moderate";
    }
    
    return {
      hasProfile: true,
      overallRisk,
      riskFactors: risks,
      recommendations: [
        "Regular health screenings (annual physical, bloodwork)",
        "Maintain healthy body composition",
        "Prioritize sleep (7-9 hours)",
        "Regular exercise (cardio + strength)",
        "Manage stress effectively",
        "Build strong social connections",
      ],
    };
  }),
});
