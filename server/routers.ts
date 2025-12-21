import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  coachesRouter,
  clientsRouter,
  journalRouter,
  emotionLogsRouter,
  copingStrategiesRouter,
  sessionsRouter,
} from "./routers/coaching";
import { aiInsightsRouter } from "./routers/aiInsights";
import { stripeRouter } from "./routers/stripe";
import { schedulingRouter } from "./routers/scheduling";
import { sessionTypesRouter } from "./routers/sessionTypes";
import { sessionPaymentsRouter } from "./routers/sessionPayments";
import { aiChatRouter } from "./routers/aiChat";
import { aiChatFeedbackRouter } from "./routers/aiChatFeedback";
import { coachClientHistoryRouter } from "./routers/coachClientHistory";
import { clientFilesRouter } from "./routers/clientFiles";
import { profileExtractionRouter } from "./routers/profileExtraction";
import { platformSettingsRouter } from "./routers/platformSettings";
import { socialProofRouter } from "./routers/socialProof";
import { aiFeedbackRouter } from "./routers/aiFeedback";
import { emailCaptureRouter } from "./routers/emailCapture";
import { abTestingRouter } from "./routers/abTesting";
import { chatRouter } from "./routers/chat";
import { analyticsRouter } from "./routers/analytics";
import { videoTestimonialsRouter } from "./routers/videoTestimonials";
import { identityRouter } from "./routers/identity";
// import { adaptiveLearningRouter } from "./routers/adaptiveLearning"; // Temporarily disabled - needs schema migration
import { autismRouter } from "./routers/autism";
import { liveSessionRouter } from "./routers/liveSession";
import { subscriptionsRouter } from "./routers/subscriptions";
import { subscriptionWebhookRouter } from "./routers/subscriptionWebhook";
import { emailAutomationRouter } from "./routers/emailAutomation";
import { coachDashboardRouter } from "./routers/coachDashboard";
import { adminRouter } from "./routers/admin";
import { goalsRouter } from "./routers/goals";
import { habitFormationRouter } from "./routers/habitFormation";
import { audioUploadRouter } from "./routers/audioUpload";
import { ttsRouter } from "./routers/tts";
import { voiceRecognitionRouter } from "./routers/voiceRecognition";
import { faceRecognitionRouter } from "./routers/faceRecognition";
import { dailyCheckInsRouter } from "./routers/dailyCheckIns";
import { healthRouter } from "./routers/health";
import { migrationsRouter } from "./routers/migrations";
import { dbHealthRouter } from "./routers/dbHealth";
import { trialRouter } from "./routers/trial";
import { aiCoachRouter } from "./routers/aiCoach";
import { sessionAnalysisRouter } from "./routers/sessionAnalysis";
import { speakerTrainingRouter } from "./routers/speakerTraining";
import { aviationKnowledgeRouter } from "./routers/aviationKnowledge";
import { comprehensiveComplianceRouter } from "./routers/comprehensiveCompliance";
import { realtimeVoiceRouter } from "./routers/realtimeVoice";
import { platformIntelligenceRouter } from "./routers/platformIntelligence";
import { healthOptimizationRouter } from "./routers/healthOptimization";
import { voiceCoachingPreferencesRouter } from "./routers/voiceCoachingPreferences";
import { sessionProfileExtractionRouter } from "./routers/sessionProfileExtraction";
import { clientProfileExportRouter } from "./routers/clientProfileExport";
import { aiCoachPerformanceRouter } from "./routers/aiCoachPerformance";
import { pushNotificationsRouter } from "./routers/pushNotifications";
import { structuredProgramsRouter } from "./routers/structuredPrograms";
import { justTalkRouter } from "./routers/justTalk";
import { sleepStoriesRouter } from "./routers/sleepStories";
import { focusCoachRouter } from "./routers/focusCoach";
import { aiMeditationRouter } from "./routers/aiMeditation";
import { clientRecognitionRouter } from "./routers/clientRecognition";
import { profileGuardMonitorRouter } from "./routers/profileGuardMonitor";
import { perpetualUpgradeRouter } from "./routers/perpetualUpgrade";
import { contentStudioRouter } from "./routers/contentStudio";
import { contentPipelineRouter } from "./routers/contentPipeline";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Coaching platform routers
  coaches: coachesRouter,
  clients: clientsRouter,
  journal: journalRouter,
  emotionLogs: emotionLogsRouter,
  copingStrategies: copingStrategiesRouter,
  aiInsights: aiInsightsRouter,
  sessions: sessionsRouter,
  stripe: stripeRouter,
  scheduling: schedulingRouter,
  sessionTypes: sessionTypesRouter,
  sessionPayments: sessionPaymentsRouter,
  aiChat: aiChatRouter,
  aiChatFeedback: aiChatFeedbackRouter,
  coachClientHistory: coachClientHistoryRouter,
  clientFiles: clientFilesRouter,
  profileExtraction: profileExtractionRouter,
  liveSession: liveSessionRouter,
  platformSettings: platformSettingsRouter,
  socialProof: socialProofRouter,
  aiFeedback: aiFeedbackRouter,
  emailCapture: emailCaptureRouter,
  abTesting: abTestingRouter,
  chat: chatRouter,
  analytics: analyticsRouter,
  videoTestimonials: videoTestimonialsRouter,
  identity: identityRouter,
  // adaptiveLearning: adaptiveLearningRouter, // Temporarily disabled - needs schema migration
  autism: autismRouter,
  subscriptions: subscriptionsRouter,
  subscriptionWebhook: subscriptionWebhookRouter,
  emailAutomation: emailAutomationRouter,
  coachDashboard: coachDashboardRouter,
  admin: adminRouter,
  goals: goalsRouter,
  habits: habitFormationRouter,
  audioUpload: audioUploadRouter,
  tts: ttsRouter,
  voiceRecognition: voiceRecognitionRouter,
  faceRecognition: faceRecognitionRouter,
  dailyCheckIns: dailyCheckInsRouter,
  health: healthRouter,
  migrations: migrationsRouter,
  dbHealth: dbHealthRouter,
  trial: trialRouter,
  aiCoach: aiCoachRouter,
  sessionAnalysis: sessionAnalysisRouter,
  speakerTraining: speakerTrainingRouter,
  aviationKnowledge: aviationKnowledgeRouter,
  compliance: comprehensiveComplianceRouter,
  realtimeVoice: realtimeVoiceRouter,
  platformIntelligence: platformIntelligenceRouter,
  healthOptimization: healthOptimizationRouter,
  voiceCoachingPreferences: voiceCoachingPreferencesRouter,
  sessionProfileExtraction: sessionProfileExtractionRouter,
  clientProfileExport: clientProfileExportRouter,
  aiCoachPerformance: aiCoachPerformanceRouter,
  
  // New competitive gap features
  pushNotifications: pushNotificationsRouter,
  structuredPrograms: structuredProgramsRouter,
  justTalk: justTalkRouter,
  
  // 10X Enhanced Modules (Better than Calm/Headspace)
  sleepStories: sleepStoriesRouter,
  focusCoach: focusCoachRouter,
  aiMeditation: aiMeditationRouter,
  clientRecognition: clientRecognitionRouter,
  
  // Profile Guard - Ensures perfect continuity (never forget a client)
  profileGuard: profileGuardMonitorRouter,
  
  // Perpetual Upgrade - Self-improving code system
  perpetualUpgrade: perpetualUpgradeRouter,
  
  // Content Studio - AI-powered content generation for YouTube/Podcast/Shorts
  contentStudio: contentStudioRouter,
  
  // Autonomous Content Pipeline - Session-to-Content automation
  contentPipeline: contentPipelineRouter,
});

export type AppRouter = typeof appRouter;
