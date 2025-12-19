/**
 * CLIENT PROFILE EXPORT ROUTER
 * 
 * Generates comprehensive, printable/emailable client profile documents.
 * Everything in one place - demographics, goals, sessions, media, progress.
 * 
 * Export formats:
 * - PDF (for printing/emailing)
 * - JSON (for data portability)
 * - HTML (for web viewing)
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { 
  users, 
  clients, 
  sessionSummaries, 
  coachPrivateNotes,
  clientFiles,
  journalEntries,
  voiceCoachingSessionLogs,
  voiceCoachingPreferences,
  aiChatConversations,
  aiChatMessages
} from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// =============================================================================
// TYPES
// =============================================================================

interface ClientProfileExport {
  // Header
  exportDate: string;
  exportedBy: string;
  
  // Client Info
  client: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    age?: number;
    location?: string;
    status?: string;
    startDate: string;
    profileCompleteness: number;
  };
  
  // Professional Info
  professional: {
    jobTitle?: string;
    company?: string;
    industry?: string;
    careerGoals?: string;
  };
  
  // Personal Info
  personal: {
    relationshipStatus?: string;
    hasChildren?: string;
    livingArrangement?: string;
  };
  
  // Goals & Motivation
  goals: {
    primaryGoal?: string;
    secondaryGoals?: string[];
    motivation?: string;
    timeline?: string;
    progressPercent: number;
    milestones: Array<{
      title: string;
      achieved: boolean;
      date?: string;
    }>;
  };
  
  // Identity Architecture
  identity: {
    currentIdentity?: string[];
    targetIdentity?: string[];
    identityGap?: string;
    coreValues?: string[];
    lifeMission?: string;
  };
  
  // Behavioral Patterns
  behavioral: {
    procrastinationTriggers?: string[];
    energyPattern?: string;
    stressResponses?: string[];
    communicationStyle?: string;
  };
  
  // Health & Wellness
  health: {
    sleepHours?: number;
    exerciseFrequency?: string;
    dietPattern?: string;
    mentalHealthNotes?: string;
  };
  
  // Session History
  sessions: Array<{
    id: number;
    date: string;
    type: string;
    duration?: number;
    summary?: string;
    keyMoments?: string[];
    techniques?: string[];
    homework?: string;
    emotionalJourney?: string;
    progressNotes?: string;
  }>;
  
  // Voice Coaching Sessions
  voiceSessions: Array<{
    id: number;
    date: string;
    mode: string;
    duration: number;
    emotionalJourney?: string;
    breakthroughMoments?: string[];
    transcriptSummary?: string;
  }>;
  
  // Media Files
  media: {
    audio: Array<{
      id: number;
      fileName: string;
      uploadDate: string;
      duration?: number;
      transcription?: string;
      url?: string;
    }>;
    video: Array<{
      id: number;
      fileName: string;
      uploadDate: string;
      duration?: number;
      transcription?: string;
      url?: string;
    }>;
    documents: Array<{
      id: number;
      fileName: string;
      uploadDate: string;
      category?: string;
      url?: string;
    }>;
  };
  
  // AI Conversations Summary
  aiConversations: {
    totalConversations: number;
    totalMessages: number;
    recentTopics: string[];
    lastConversationDate?: string;
  };
  
  // Journal Entries Summary
  journal: {
    totalEntries: number;
    averageMood?: number;
    commonEmotions?: string[];
    recentEntries: Array<{
      date: string;
      mood?: string;
      excerpt: string;
    }>;
  };
  
  // Coaching Preferences
  preferences: {
    preferredCoachingStyle?: string;
    preferredPace?: string;
    preferredFeedbackType?: string;
    effectiveApproaches?: string[];
    ineffectiveApproaches?: string[];
  };
  
  // Risk Indicators
  risk: {
    suicideRiskLevel?: string;
    crisisFlags?: string[];
    lastCrisisCheck?: string;
  };
  
  // Next Session Prep (CliffsNotes)
  nextSession: {
    summary: string;
    whereWeLeftOff: string;
    recommendedFocus: string[];
    questionsToExplore: string[];
    thingsToAvoid: string[];
    winsToAcknowledge: string[];
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function parseJsonField(field: string | null | undefined): any {
  if (!field) return null;
  try {
    return JSON.parse(field);
  } catch {
    return field;
  }
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function generatePDFHTML(profile: ClientProfileExport): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Client Profile - ${profile.client.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 { color: #6366f1; font-size: 28px; margin-bottom: 5px; }
    .header .subtitle { color: #666; font-size: 14px; }
    .header .export-info { color: #999; font-size: 12px; margin-top: 10px; }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #6366f1;
      font-size: 18px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .info-item {
      padding: 8px 0;
    }
    .info-label {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
    }
    .info-value {
      color: #333;
      font-size: 14px;
    }
    
    .progress-bar {
      background: #e5e7eb;
      border-radius: 10px;
      height: 20px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-fill {
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 600;
    }
    
    .session-card {
      background: #f9fafb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      border-left: 4px solid #6366f1;
    }
    .session-date {
      font-weight: 600;
      color: #6366f1;
    }
    .session-type {
      background: #6366f1;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      margin-left: 10px;
    }
    
    .media-item {
      display: flex;
      align-items: center;
      padding: 10px;
      background: #f9fafb;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .media-icon {
      width: 40px;
      height: 40px;
      background: #6366f1;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-right: 12px;
    }
    
    .cliffsnotes {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-radius: 12px;
      padding: 20px;
      margin-top: 30px;
    }
    .cliffsnotes h2 {
      color: #92400e;
      border-bottom-color: #f59e0b;
    }
    
    .tag {
      display: inline-block;
      background: #e0e7ff;
      color: #4338ca;
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 12px;
      margin: 3px;
    }
    
    .risk-alert {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 15px;
      margin-top: 15px;
    }
    .risk-alert h3 {
      color: #dc2626;
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📋 Unified Client Profile</h1>
    <div class="subtitle">${profile.client.name}</div>
    <div class="export-info">
      Exported: ${profile.exportDate} | By: ${profile.exportedBy}
    </div>
  </div>
  
  <!-- Client Overview -->
  <div class="section">
    <h2>👤 Client Overview</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Name</div>
        <div class="info-value">${profile.client.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${profile.client.email || 'Not provided'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Phone</div>
        <div class="info-value">${profile.client.phone || 'Not provided'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Age</div>
        <div class="info-value">${profile.client.age || 'Not provided'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Location</div>
        <div class="info-value">${profile.client.location || 'Not provided'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">${profile.client.status || 'Active'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Start Date</div>
        <div class="info-value">${profile.client.startDate}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Profile Completeness</div>
        <div class="info-value">${profile.client.profileCompleteness}%</div>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${profile.client.profileCompleteness}%">
        ${profile.client.profileCompleteness}% Complete
      </div>
    </div>
  </div>
  
  <!-- Professional Info -->
  ${profile.professional.jobTitle || profile.professional.company ? `
  <div class="section">
    <h2>💼 Professional</h2>
    <div class="info-grid">
      ${profile.professional.jobTitle ? `
      <div class="info-item">
        <div class="info-label">Job Title</div>
        <div class="info-value">${profile.professional.jobTitle}</div>
      </div>` : ''}
      ${profile.professional.company ? `
      <div class="info-item">
        <div class="info-label">Company</div>
        <div class="info-value">${profile.professional.company}</div>
      </div>` : ''}
      ${profile.professional.industry ? `
      <div class="info-item">
        <div class="info-label">Industry</div>
        <div class="info-value">${profile.professional.industry}</div>
      </div>` : ''}
    </div>
    ${profile.professional.careerGoals ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Career Goals</div>
      <div class="info-value">${profile.professional.careerGoals}</div>
    </div>` : ''}
  </div>` : ''}
  
  <!-- Goals & Progress -->
  <div class="section">
    <h2>🎯 Goals & Progress</h2>
    ${profile.goals.primaryGoal ? `
    <div class="info-item">
      <div class="info-label">Primary Goal</div>
      <div class="info-value" style="font-size: 16px; font-weight: 500;">${profile.goals.primaryGoal}</div>
    </div>` : ''}
    ${profile.goals.motivation ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Why This Matters</div>
      <div class="info-value">${profile.goals.motivation}</div>
    </div>` : ''}
    ${profile.goals.timeline ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Timeline</div>
      <div class="info-value">${profile.goals.timeline}</div>
    </div>` : ''}
    <div style="margin-top: 15px;">
      <div class="info-label">Goal Progress</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${profile.goals.progressPercent}%">
          ${profile.goals.progressPercent}%
        </div>
      </div>
    </div>
  </div>
  
  <!-- Identity Architecture -->
  ${profile.identity.coreValues?.length || profile.identity.lifeMission ? `
  <div class="section">
    <h2>🌟 Identity & Values</h2>
    ${profile.identity.coreValues?.length ? `
    <div class="info-item">
      <div class="info-label">Core Values</div>
      <div>${profile.identity.coreValues.map(v => `<span class="tag">${v}</span>`).join('')}</div>
    </div>` : ''}
    ${profile.identity.lifeMission ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Life Mission</div>
      <div class="info-value">${profile.identity.lifeMission}</div>
    </div>` : ''}
    ${profile.identity.targetIdentity?.length ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Target Identity</div>
      <div>${profile.identity.targetIdentity.map(i => `<span class="tag">${i}</span>`).join('')}</div>
    </div>` : ''}
  </div>` : ''}
  
  <!-- Behavioral Patterns -->
  ${profile.behavioral.communicationStyle || profile.behavioral.energyPattern ? `
  <div class="section">
    <h2>🧠 Behavioral Patterns</h2>
    <div class="info-grid">
      ${profile.behavioral.communicationStyle ? `
      <div class="info-item">
        <div class="info-label">Communication Style</div>
        <div class="info-value">${profile.behavioral.communicationStyle}</div>
      </div>` : ''}
      ${profile.behavioral.energyPattern ? `
      <div class="info-item">
        <div class="info-label">Energy Pattern</div>
        <div class="info-value">${profile.behavioral.energyPattern}</div>
      </div>` : ''}
    </div>
    ${profile.behavioral.stressResponses?.length ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Stress Responses</div>
      <div>${profile.behavioral.stressResponses.map(s => `<span class="tag">${s}</span>`).join('')}</div>
    </div>` : ''}
  </div>` : ''}
  
  <!-- Session History -->
  ${profile.sessions.length > 0 ? `
  <div class="section">
    <h2>📅 Session History (${profile.sessions.length} sessions)</h2>
    ${profile.sessions.slice(0, 5).map(session => `
    <div class="session-card">
      <div style="margin-bottom: 8px;">
        <span class="session-date">${session.date}</span>
        <span class="session-type">${session.type}</span>
        ${session.duration ? `<span style="color: #666; font-size: 12px; margin-left: 10px;">${session.duration} min</span>` : ''}
      </div>
      ${session.summary ? `<div style="margin-bottom: 8px;">${session.summary}</div>` : ''}
      ${session.keyMoments?.length ? `
      <div style="margin-top: 8px;">
        <strong style="font-size: 12px; color: #666;">Key Moments:</strong>
        <ul style="margin-left: 20px; font-size: 13px;">
          ${session.keyMoments.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>` : ''}
      ${session.homework ? `
      <div style="margin-top: 8px; background: #fef3c7; padding: 8px; border-radius: 4px; font-size: 13px;">
        <strong>Homework:</strong> ${session.homework}
      </div>` : ''}
    </div>`).join('')}
    ${profile.sessions.length > 5 ? `<p style="color: #666; font-style: italic;">+ ${profile.sessions.length - 5} more sessions...</p>` : ''}
  </div>` : ''}
  
  <!-- Voice Coaching Sessions -->
  ${profile.voiceSessions.length > 0 ? `
  <div class="section">
    <h2>🎙️ Voice Coaching Sessions (${profile.voiceSessions.length} sessions)</h2>
    ${profile.voiceSessions.slice(0, 3).map(session => `
    <div class="session-card">
      <div style="margin-bottom: 8px;">
        <span class="session-date">${session.date}</span>
        <span class="session-type">${session.mode}</span>
        <span style="color: #666; font-size: 12px; margin-left: 10px;">${Math.round(session.duration / 60)} min</span>
      </div>
      ${session.emotionalJourney ? `<div style="margin-bottom: 8px;"><strong>Emotional Journey:</strong> ${session.emotionalJourney}</div>` : ''}
      ${session.breakthroughMoments?.length ? `
      <div style="margin-top: 8px;">
        <strong style="font-size: 12px; color: #666;">Breakthroughs:</strong>
        <ul style="margin-left: 20px; font-size: 13px;">
          ${session.breakthroughMoments.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>` : ''}
    </div>`).join('')}
  </div>` : ''}
  
  <!-- Media Files -->
  ${profile.media.audio.length > 0 || profile.media.video.length > 0 || profile.media.documents.length > 0 ? `
  <div class="section">
    <h2>📁 Media Files</h2>
    
    ${profile.media.audio.length > 0 ? `
    <h3 style="font-size: 14px; color: #666; margin: 15px 0 10px;">🎵 Audio Files (${profile.media.audio.length})</h3>
    ${profile.media.audio.map(file => `
    <div class="media-item">
      <div class="media-icon">🎵</div>
      <div>
        <div style="font-weight: 500;">${file.fileName}</div>
        <div style="font-size: 12px; color: #666;">${file.uploadDate}${file.duration ? ` • ${Math.round(file.duration / 60)} min` : ''}</div>
        ${file.transcription ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">"${file.transcription.substring(0, 100)}..."</div>` : ''}
      </div>
    </div>`).join('')}` : ''}
    
    ${profile.media.video.length > 0 ? `
    <h3 style="font-size: 14px; color: #666; margin: 15px 0 10px;">🎬 Video Files (${profile.media.video.length})</h3>
    ${profile.media.video.map(file => `
    <div class="media-item">
      <div class="media-icon">🎬</div>
      <div>
        <div style="font-weight: 500;">${file.fileName}</div>
        <div style="font-size: 12px; color: #666;">${file.uploadDate}${file.duration ? ` • ${Math.round(file.duration / 60)} min` : ''}</div>
      </div>
    </div>`).join('')}` : ''}
    
    ${profile.media.documents.length > 0 ? `
    <h3 style="font-size: 14px; color: #666; margin: 15px 0 10px;">📄 Documents (${profile.media.documents.length})</h3>
    ${profile.media.documents.map(file => `
    <div class="media-item">
      <div class="media-icon">📄</div>
      <div>
        <div style="font-weight: 500;">${file.fileName}</div>
        <div style="font-size: 12px; color: #666;">${file.uploadDate}${file.category ? ` • ${file.category}` : ''}</div>
      </div>
    </div>`).join('')}` : ''}
  </div>` : ''}
  
  <!-- AI Conversations -->
  ${profile.aiConversations.totalConversations > 0 ? `
  <div class="section">
    <h2>💬 AI Coaching Summary</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Total Conversations</div>
        <div class="info-value">${profile.aiConversations.totalConversations}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Total Messages</div>
        <div class="info-value">${profile.aiConversations.totalMessages}</div>
      </div>
    </div>
    ${profile.aiConversations.recentTopics.length > 0 ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Recent Topics</div>
      <div>${profile.aiConversations.recentTopics.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    </div>` : ''}
  </div>` : ''}
  
  <!-- Risk Indicators -->
  ${profile.risk.crisisFlags?.length || profile.risk.suicideRiskLevel ? `
  <div class="risk-alert">
    <h3>⚠️ Risk Indicators</h3>
    ${profile.risk.suicideRiskLevel ? `<p><strong>Risk Level:</strong> ${profile.risk.suicideRiskLevel}</p>` : ''}
    ${profile.risk.crisisFlags?.length ? `
    <p><strong>Flags:</strong></p>
    <ul style="margin-left: 20px;">
      ${profile.risk.crisisFlags.map(f => `<li>${f}</li>`).join('')}
    </ul>` : ''}
    ${profile.risk.lastCrisisCheck ? `<p style="font-size: 12px; color: #666; margin-top: 8px;">Last checked: ${profile.risk.lastCrisisCheck}</p>` : ''}
  </div>` : ''}
  
  <!-- CliffsNotes for Next Session -->
  <div class="cliffsnotes">
    <h2>📝 CliffsNotes for Next Session</h2>
    
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Quick Summary</div>
      <div class="info-value">${profile.nextSession.summary || 'No previous sessions yet.'}</div>
    </div>
    
    ${profile.nextSession.whereWeLeftOff ? `
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Where We Left Off</div>
      <div class="info-value">${profile.nextSession.whereWeLeftOff}</div>
    </div>` : ''}
    
    ${profile.nextSession.recommendedFocus.length > 0 ? `
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Recommended Focus</div>
      <ul style="margin-left: 20px;">
        ${profile.nextSession.recommendedFocus.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>` : ''}
    
    ${profile.nextSession.winsToAcknowledge.length > 0 ? `
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">🌟 Wins to Celebrate</div>
      <ul style="margin-left: 20px;">
        ${profile.nextSession.winsToAcknowledge.map(w => `<li>${w}</li>`).join('')}
      </ul>
    </div>` : ''}
    
    ${profile.nextSession.thingsToAvoid.length > 0 ? `
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">⚠️ Things to Avoid</div>
      <ul style="margin-left: 20px;">
        ${profile.nextSession.thingsToAvoid.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>` : ''}
  </div>
  
  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px;">
    Generated by PurposefulLive Coaching Platform<br>
    ${profile.exportDate}
  </div>
</body>
</html>`;
}

// =============================================================================
// ROUTER
// =============================================================================

export const clientProfileExportRouter = router({
  /**
   * Get comprehensive client profile data
   */
  getFullProfile: protectedProcedure
    .input(z.object({
      clientId: z.number().optional(),
      userId: z.number().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const targetUserId = input.userId || ctx.user?.id;
      
      if (!targetUserId && !input.clientId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must provide clientId or userId",
        });
      }
      
      // Get user data
      let userData = null;
      if (targetUserId) {
        const [user] = await db.select().from(users).where(eq(users.id, targetUserId)).limit(1);
        userData = user;
      }
      
      // Get client data if clientId provided
      let clientData = null;
      if (input.clientId) {
        const [client] = await db.select().from(clients).where(eq(clients.id, input.clientId)).limit(1);
        clientData = client;
      }
      
      // Get session summaries
      const sessions = input.clientId 
        ? await db.select().from(sessionSummaries).where(eq(sessionSummaries.clientId, input.clientId)).orderBy(desc(sessionSummaries.sessionDate)).limit(20)
        : [];
      
      // Get voice coaching sessions
      const voiceSessions = targetUserId
        ? await db.select().from(voiceCoachingSessionLogs).where(eq(voiceCoachingSessionLogs.userId, targetUserId)).orderBy(desc(voiceCoachingSessionLogs.startedAt)).limit(10)
        : [];
      
      // Get client files
      const files = targetUserId
        ? await db.select().from(clientFiles).where(eq(clientFiles.userId, targetUserId)).orderBy(desc(clientFiles.uploadedAt)).limit(50)
        : [];
      
      // Get AI conversations
      const conversations = targetUserId
        ? await db.select().from(aiChatConversations).where(eq(aiChatConversations.userId, targetUserId)).orderBy(desc(aiChatConversations.updatedAt)).limit(10)
        : [];
      
      // Count total messages
      let totalMessages = 0;
      for (const conv of conversations) {
        const messages = await db.select().from(aiChatMessages).where(eq(aiChatMessages.conversationId, conv.id));
        totalMessages += messages.length;
      }
      
      // Get coaching preferences
      const [preferences] = targetUserId
        ? await db.select().from(voiceCoachingPreferences).where(eq(voiceCoachingPreferences.userId, targetUserId)).limit(1)
        : [null];
      
      // Build the export object
      const profile: ClientProfileExport = {
        exportDate: formatDate(new Date()),
        exportedBy: ctx.user?.name || 'System',
        
        client: {
          id: clientData?.id || userData?.id || 0,
          name: clientData?.name || userData?.name || 'Unknown',
          email: clientData?.email || userData?.email || undefined,
          phone: clientData?.phone || undefined,
          dateOfBirth: clientData?.dateOfBirth ? formatDate(clientData.dateOfBirth) : undefined,
          age: clientData?.age || undefined,
          location: clientData ? [clientData.locationCity, clientData.locationState, clientData.locationCountry].filter(Boolean).join(', ') : undefined,
          status: clientData?.status || 'Active',
          startDate: formatDate(clientData?.startDate || userData?.createdAt || new Date()),
          profileCompleteness: clientData?.profileCompleteness || userData?.profileCompleteness || 0,
        },
        
        professional: {
          jobTitle: clientData?.jobTitle || undefined,
          company: clientData?.company || undefined,
          industry: clientData?.industry || undefined,
          careerGoals: clientData?.careerGoals || undefined,
        },
        
        personal: {
          relationshipStatus: clientData?.relationshipStatus || undefined,
          hasChildren: clientData?.hasChildren || undefined,
        },
        
        goals: {
          primaryGoal: clientData?.primaryGoal || userData?.primaryGoal || undefined,
          secondaryGoals: userData?.secondaryGoal ? [userData.secondaryGoal] : undefined,
          motivation: clientData?.motivation || undefined,
          timeline: clientData?.goalTimeline || undefined,
          progressPercent: 0, // TODO: Calculate from sessions
          milestones: [],
        },
        
        identity: {
          currentIdentity: parseJsonField(clientData?.currentIdentity) || undefined,
          targetIdentity: parseJsonField(clientData?.targetIdentity) || undefined,
          identityGap: clientData?.identityGap || undefined,
          coreValues: parseJsonField(clientData?.coreValues) || undefined,
          lifeMission: clientData?.lifeMission || undefined,
        },
        
        behavioral: {
          procrastinationTriggers: parseJsonField(clientData?.procrastinationTriggers) || undefined,
          energyPattern: clientData?.energyPattern || undefined,
          stressResponses: parseJsonField(clientData?.stressResponses) || undefined,
          communicationStyle: clientData?.communicationStyle || userData?.communicationStyle || undefined,
        },
        
        health: {
          sleepHours: clientData?.sleepHours ? Number(clientData.sleepHours) : undefined,
          exerciseFrequency: clientData?.exerciseFrequency || undefined,
          dietPattern: clientData?.dietPattern || undefined,
          mentalHealthNotes: clientData?.mentalHealthNotes || undefined,
        },
        
        sessions: sessions.map(s => ({
          id: s.id,
          date: formatDate(s.sessionDate),
          type: s.sessionType || 'Coaching',
          duration: s.duration || undefined,
          summary: s.summary || undefined,
          keyMoments: parseJsonField(s.keyMoments) || undefined,
          techniques: parseJsonField(s.techniquesUsed) || undefined,
          homework: s.homework || undefined,
          emotionalJourney: undefined,
          progressNotes: s.progressNotes || undefined,
        })),
        
        voiceSessions: voiceSessions.map(s => ({
          id: s.id,
          date: formatDate(s.startedAt),
          mode: s.sessionMode || 'coaching',
          duration: s.durationSeconds || 0,
          emotionalJourney: s.emotionalJourney || undefined,
          breakthroughMoments: parseJsonField(s.breakthroughMoments) || undefined,
          transcriptSummary: s.transcriptSummary || undefined,
        })),
        
        media: {
          audio: files.filter(f => f.fileType === 'audio').map(f => ({
            id: f.id,
            fileName: f.fileName,
            uploadDate: formatDate(f.uploadedAt),
            duration: f.duration || undefined,
            transcription: f.transcriptionText || undefined,
            url: f.fileUrl || undefined,
          })),
          video: files.filter(f => f.fileType === 'video').map(f => ({
            id: f.id,
            fileName: f.fileName,
            uploadDate: formatDate(f.uploadedAt),
            duration: f.duration || undefined,
            transcription: f.transcriptionText || undefined,
            url: f.fileUrl || undefined,
          })),
          documents: files.filter(f => f.fileType === 'document' || f.fileType === 'transcript').map(f => ({
            id: f.id,
            fileName: f.fileName,
            uploadDate: formatDate(f.uploadedAt),
            category: f.fileCategory || undefined,
            url: f.fileUrl || undefined,
          })),
        },
        
        aiConversations: {
          totalConversations: conversations.length,
          totalMessages: totalMessages,
          recentTopics: conversations.map(c => c.title).filter(Boolean) as string[],
          lastConversationDate: conversations[0] ? formatDate(conversations[0].updatedAt) : undefined,
        },
        
        journal: {
          totalEntries: 0,
          averageMood: undefined,
          commonEmotions: undefined,
          recentEntries: [],
        },
        
        preferences: {
          preferredCoachingStyle: preferences?.preferredCoachingStyle || undefined,
          preferredPace: preferences?.preferredPace || undefined,
          preferredFeedbackType: preferences?.preferredFeedbackType || undefined,
          effectiveApproaches: parseJsonField(preferences?.effectiveApproaches) || undefined,
          ineffectiveApproaches: parseJsonField(preferences?.ineffectiveApproaches) || undefined,
        },
        
        risk: {
          suicideRiskLevel: clientData?.suicideRiskLevel || undefined,
          crisisFlags: parseJsonField(clientData?.crisisFlags) || undefined,
          lastCrisisCheck: clientData?.lastCrisisCheck ? formatDate(clientData.lastCrisisCheck) : undefined,
        },
        
        nextSession: {
          summary: sessions[0]?.summary || 'No previous sessions recorded.',
          whereWeLeftOff: sessions[0]?.homework || 'Start fresh!',
          recommendedFocus: [],
          questionsToExplore: [],
          thingsToAvoid: [],
          winsToAcknowledge: [],
        },
      };
      
      return profile;
    }),
  
  /**
   * Export profile as HTML (for PDF generation)
   */
  exportAsHTML: protectedProcedure
    .input(z.object({
      clientId: z.number().optional(),
      userId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Get the full profile first
      const targetUserId = input.userId || ctx.user?.id;
      
      if (!targetUserId && !input.clientId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must provide clientId or userId",
        });
      }
      
      // Reuse the getFullProfile logic
      // ... (simplified - in production, refactor to share code)
      
      // For now, return a placeholder
      return {
        html: "<html><body>Profile export coming soon</body></html>",
        fileName: `client-profile-${Date.now()}.html`,
      };
    }),
  
  /**
   * Export profile as JSON
   */
  exportAsJSON: protectedProcedure
    .input(z.object({
      clientId: z.number().optional(),
      userId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // This would call getFullProfile and return as JSON
      return {
        message: "Use getFullProfile endpoint for JSON data",
      };
    }),
});
