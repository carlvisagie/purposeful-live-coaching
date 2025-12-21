/**
 * Voice Analysis Service
 * 
 * Real-time analysis of voice characteristics for instant rapport building.
 * Analyzes speech patterns, cadence, intensity, mood, and emotional nuances
 * to help Sage match and mirror the client for deep connection.
 * 
 * CRITICAL: This enables Sage to "read" the client from the first second
 * and adapt her communication style for maximum rapport and trust.
 */

import { db } from '../../drizzle/db';
import { eq, and, desc } from 'drizzle-orm';

// Voice characteristic types
export interface VoiceCharacteristics {
  // Speech patterns
  speechRate: 'very_slow' | 'slow' | 'moderate' | 'fast' | 'very_fast';
  articulationClarity: 'mumbled' | 'casual' | 'clear' | 'precise' | 'crisp';
  vocabularyLevel: 'simple' | 'conversational' | 'professional' | 'sophisticated' | 'academic';
  sentenceComplexity: 'short_direct' | 'moderate' | 'complex' | 'elaborate';
  
  // Cadence and rhythm
  cadencePattern: 'steady' | 'varied' | 'rhythmic' | 'staccato' | 'flowing';
  pauseFrequency: 'rare' | 'occasional' | 'frequent' | 'thoughtful';
  breathingPattern: 'shallow_quick' | 'normal' | 'deep_slow' | 'irregular';
  
  // Intensity and energy
  energyLevel: 'low' | 'calm' | 'moderate' | 'high' | 'intense';
  volumePattern: 'soft' | 'moderate' | 'loud' | 'variable';
  emphasisStyle: 'flat' | 'subtle' | 'expressive' | 'dramatic';
  
  // Emotional state
  primaryMood: 'anxious' | 'sad' | 'neutral' | 'hopeful' | 'excited' | 'frustrated' | 'overwhelmed' | 'determined' | 'vulnerable' | 'guarded';
  emotionalIntensity: 'suppressed' | 'controlled' | 'moderate' | 'open' | 'heightened';
  emotionalStability: 'volatile' | 'fluctuating' | 'stable' | 'very_stable';
  
  // Communication style
  communicationStyle: 'analytical' | 'driver' | 'amiable' | 'expressive';
  processingStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  decisionStyle: 'quick' | 'deliberate' | 'collaborative' | 'cautious';
  
  // Nuances
  confidenceLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  trustIndicators: 'guarded' | 'cautious' | 'neutral' | 'opening_up' | 'trusting';
  engagementLevel: 'disengaged' | 'passive' | 'attentive' | 'engaged' | 'highly_engaged';
  stressIndicators: 'relaxed' | 'mild_tension' | 'moderate_stress' | 'high_stress' | 'crisis';
  
  // Detected needs
  primaryNeed: 'validation' | 'direction' | 'support' | 'challenge' | 'information' | 'connection' | 'space';
  secondaryNeed?: string;
  
  // Raw analysis data
  rawAnalysis?: string;
  confidence: number; // 0-1 confidence in analysis
}

export interface RapportStrategy {
  // How Sage should adapt
  matchSpeechRate: string;
  matchEnergyLevel: string;
  toneGuidance: string;
  languageStyle: string;
  responseLength: string;
  emotionalApproach: string;
  mirroringTechniques: string[];
  connectionOpeners: string[];
  validationPhrases: string[];
  transitionPhrases: string[];
  avoidPhrases: string[];
  
  // Specific adaptations
  paceInstructions: string;
  warmthLevel: string;
  directnessLevel: string;
  questionStyle: string;
  
  // Full guidance for Sage
  fullGuidance: string;
}

/**
 * Analyze voice characteristics from transcript and call metadata
 */
export async function analyzeVoiceCharacteristics(
  transcript: string,
  callMetadata?: {
    duration?: number;
    silenceDuration?: number;
    averageWordsPerMinute?: number;
    emotionScores?: Record<string, number>;
    backgroundNoise?: string;
  }
): Promise<VoiceCharacteristics> {
  
  // Analyze speech patterns from transcript
  const words = transcript.split(/\s+/).filter(w => w.length > 0);
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  
  // Determine speech rate from metadata or estimate
  let speechRate: VoiceCharacteristics['speechRate'] = 'moderate';
  if (callMetadata?.averageWordsPerMinute) {
    const wpm = callMetadata.averageWordsPerMinute;
    if (wpm < 100) speechRate = 'very_slow';
    else if (wpm < 130) speechRate = 'slow';
    else if (wpm < 160) speechRate = 'moderate';
    else if (wpm < 190) speechRate = 'fast';
    else speechRate = 'very_fast';
  }
  
  // Analyze vocabulary sophistication
  const complexWords = words.filter(w => w.length > 8).length;
  const complexRatio = complexWords / Math.max(words.length, 1);
  let vocabularyLevel: VoiceCharacteristics['vocabularyLevel'] = 'conversational';
  if (complexRatio < 0.05) vocabularyLevel = 'simple';
  else if (complexRatio < 0.1) vocabularyLevel = 'conversational';
  else if (complexRatio < 0.15) vocabularyLevel = 'professional';
  else if (complexRatio < 0.2) vocabularyLevel = 'sophisticated';
  else vocabularyLevel = 'academic';
  
  // Analyze sentence complexity
  let sentenceComplexity: VoiceCharacteristics['sentenceComplexity'] = 'moderate';
  if (avgWordsPerSentence < 8) sentenceComplexity = 'short_direct';
  else if (avgWordsPerSentence < 15) sentenceComplexity = 'moderate';
  else if (avgWordsPerSentence < 25) sentenceComplexity = 'complex';
  else sentenceComplexity = 'elaborate';
  
  // Detect emotional indicators from language
  const anxiousIndicators = ['worried', 'anxious', 'nervous', 'scared', 'afraid', 'panic', 'stress', 'overwhelm', 'cant cope', "can't cope", 'too much'];
  const sadIndicators = ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lost', 'alone', 'lonely', 'grief', 'miss'];
  const frustratedIndicators = ['frustrated', 'angry', 'annoyed', 'irritated', 'fed up', 'sick of', 'tired of', 'cant believe', "can't believe"];
  const hopefulIndicators = ['hope', 'maybe', 'trying', 'want to', 'working on', 'getting better', 'progress', 'improve'];
  const excitedIndicators = ['excited', 'amazing', 'great', 'wonderful', 'fantastic', 'love', 'cant wait', "can't wait"];
  const vulnerableIndicators = ['help', 'need', 'struggling', 'hard', 'difficult', 'dont know', "don't know", 'confused', 'lost'];
  
  const lowerTranscript = transcript.toLowerCase();
  
  const countIndicators = (indicators: string[]) => 
    indicators.filter(ind => lowerTranscript.includes(ind)).length;
  
  const emotionScores = {
    anxious: countIndicators(anxiousIndicators),
    sad: countIndicators(sadIndicators),
    frustrated: countIndicators(frustratedIndicators),
    hopeful: countIndicators(hopefulIndicators),
    excited: countIndicators(excitedIndicators),
    vulnerable: countIndicators(vulnerableIndicators),
  };
  
  // Determine primary mood
  let primaryMood: VoiceCharacteristics['primaryMood'] = 'neutral';
  const maxScore = Math.max(...Object.values(emotionScores));
  if (maxScore > 0) {
    const topEmotion = Object.entries(emotionScores).find(([_, score]) => score === maxScore)?.[0];
    if (topEmotion) primaryMood = topEmotion as VoiceCharacteristics['primaryMood'];
  }
  
  // Detect stress level
  const stressWords = ['stress', 'overwhelm', 'cant', "can't", 'too much', 'breaking', 'falling apart', 'crisis', 'emergency', 'urgent'];
  const stressCount = countIndicators(stressWords);
  let stressIndicators: VoiceCharacteristics['stressIndicators'] = 'relaxed';
  if (stressCount >= 4) stressIndicators = 'crisis';
  else if (stressCount >= 3) stressIndicators = 'high_stress';
  else if (stressCount >= 2) stressIndicators = 'moderate_stress';
  else if (stressCount >= 1) stressIndicators = 'mild_tension';
  
  // Detect confidence level
  const lowConfidenceWords = ['maybe', 'i guess', 'i think', 'not sure', 'probably', 'might', 'kind of', 'sort of'];
  const highConfidenceWords = ['definitely', 'absolutely', 'certainly', 'i know', 'i will', 'i am', 'for sure'];
  const lowConfCount = countIndicators(lowConfidenceWords);
  const highConfCount = countIndicators(highConfidenceWords);
  let confidenceLevel: VoiceCharacteristics['confidenceLevel'] = 'moderate';
  if (highConfCount > lowConfCount + 2) confidenceLevel = 'very_high';
  else if (highConfCount > lowConfCount) confidenceLevel = 'high';
  else if (lowConfCount > highConfCount + 2) confidenceLevel = 'very_low';
  else if (lowConfCount > highConfCount) confidenceLevel = 'low';
  
  // Detect communication style (DISC-like)
  const analyticalWords = ['analyze', 'data', 'research', 'evidence', 'logic', 'reason', 'understand', 'why', 'how'];
  const driverWords = ['results', 'goal', 'achieve', 'win', 'fast', 'now', 'action', 'do', 'get'];
  const amiableWords = ['feel', 'team', 'together', 'help', 'support', 'care', 'relationship', 'people'];
  const expressiveWords = ['amazing', 'love', 'hate', 'exciting', 'fun', 'creative', 'idea', 'vision'];
  
  const styleScores = {
    analytical: countIndicators(analyticalWords),
    driver: countIndicators(driverWords),
    amiable: countIndicators(amiableWords),
    expressive: countIndicators(expressiveWords),
  };
  
  const topStyle = Object.entries(styleScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const communicationStyle = topStyle as VoiceCharacteristics['communicationStyle'];
  
  // Detect primary need
  let primaryNeed: VoiceCharacteristics['primaryNeed'] = 'support';
  if (lowerTranscript.includes('what should i') || lowerTranscript.includes('tell me what')) {
    primaryNeed = 'direction';
  } else if (lowerTranscript.includes('am i') || lowerTranscript.includes('is it normal') || lowerTranscript.includes('is that okay')) {
    primaryNeed = 'validation';
  } else if (lowerTranscript.includes('push me') || lowerTranscript.includes('challenge') || lowerTranscript.includes('hold me accountable')) {
    primaryNeed = 'challenge';
  } else if (lowerTranscript.includes('how do') || lowerTranscript.includes('what is') || lowerTranscript.includes('explain')) {
    primaryNeed = 'information';
  } else if (lowerTranscript.includes('lonely') || lowerTranscript.includes('alone') || lowerTranscript.includes('no one')) {
    primaryNeed = 'connection';
  } else if (emotionScores.vulnerable > 1 || emotionScores.anxious > 1 || emotionScores.sad > 1) {
    primaryNeed = 'support';
  }
  
  // Detect engagement level from question marks and response length
  const questionMarks = (transcript.match(/\?/g) || []).length;
  let engagementLevel: VoiceCharacteristics['engagementLevel'] = 'attentive';
  if (words.length < 10) engagementLevel = 'passive';
  else if (questionMarks > 2 || words.length > 100) engagementLevel = 'highly_engaged';
  else if (questionMarks > 0 || words.length > 50) engagementLevel = 'engaged';
  
  // Detect trust indicators
  let trustIndicators: VoiceCharacteristics['trustIndicators'] = 'neutral';
  const personalSharing = lowerTranscript.includes('never told') || lowerTranscript.includes('first time') || 
    lowerTranscript.includes('honestly') || lowerTranscript.includes('truth is') || lowerTranscript.includes('between us');
  const guardedLanguage = lowerTranscript.includes('not sure if') || lowerTranscript.includes('dont want to') || 
    lowerTranscript.includes("don't want to") || lowerTranscript.includes('rather not');
  
  if (personalSharing) trustIndicators = 'opening_up';
  else if (guardedLanguage) trustIndicators = 'guarded';
  else if (words.length > 80) trustIndicators = 'trusting';
  else if (words.length < 20) trustIndicators = 'cautious';
  
  return {
    speechRate,
    articulationClarity: 'clear', // Would need audio analysis
    vocabularyLevel,
    sentenceComplexity,
    cadencePattern: 'varied', // Would need audio analysis
    pauseFrequency: 'occasional', // Would need audio analysis
    breathingPattern: 'normal', // Would need audio analysis
    energyLevel: stressIndicators === 'crisis' || stressIndicators === 'high_stress' ? 'intense' : 
                 primaryMood === 'excited' ? 'high' :
                 primaryMood === 'sad' ? 'low' : 'moderate',
    volumePattern: 'moderate', // Would need audio analysis
    emphasisStyle: communicationStyle === 'expressive' ? 'dramatic' : 
                   communicationStyle === 'analytical' ? 'subtle' : 'expressive',
    primaryMood,
    emotionalIntensity: maxScore > 3 ? 'heightened' : maxScore > 1 ? 'open' : 'moderate',
    emotionalStability: stressIndicators === 'crisis' ? 'volatile' : 
                        stressIndicators === 'high_stress' ? 'fluctuating' : 'stable',
    communicationStyle,
    processingStyle: communicationStyle === 'analytical' ? 'visual' :
                     communicationStyle === 'amiable' ? 'kinesthetic' :
                     communicationStyle === 'expressive' ? 'auditory' : 'mixed',
    decisionStyle: communicationStyle === 'driver' ? 'quick' :
                   communicationStyle === 'analytical' ? 'deliberate' :
                   communicationStyle === 'amiable' ? 'collaborative' : 'cautious',
    confidenceLevel,
    trustIndicators,
    engagementLevel,
    stressIndicators,
    primaryNeed,
    confidence: 0.7, // Moderate confidence without audio analysis
  };
}

/**
 * Generate rapport-building strategy based on voice characteristics
 */
export function generateRapportStrategy(characteristics: VoiceCharacteristics): RapportStrategy {
  const strategy: RapportStrategy = {
    matchSpeechRate: '',
    matchEnergyLevel: '',
    toneGuidance: '',
    languageStyle: '',
    responseLength: '',
    emotionalApproach: '',
    mirroringTechniques: [],
    connectionOpeners: [],
    validationPhrases: [],
    transitionPhrases: [],
    avoidPhrases: [],
    paceInstructions: '',
    warmthLevel: '',
    directnessLevel: '',
    questionStyle: '',
    fullGuidance: '',
  };
  
  // Match speech rate
  switch (characteristics.speechRate) {
    case 'very_slow':
      strategy.matchSpeechRate = 'Speak slowly and deliberately. Allow long pauses. Never rush.';
      strategy.paceInstructions = 'Take your time. Pause between thoughts. Let silence be comfortable.';
      break;
    case 'slow':
      strategy.matchSpeechRate = 'Speak at a relaxed pace. Pause thoughtfully between ideas.';
      strategy.paceInstructions = 'Maintain a calm, unhurried rhythm.';
      break;
    case 'moderate':
      strategy.matchSpeechRate = 'Match their natural conversational pace.';
      strategy.paceInstructions = 'Keep a steady, comfortable rhythm.';
      break;
    case 'fast':
      strategy.matchSpeechRate = 'Keep up with their energy. Be responsive and quick.';
      strategy.paceInstructions = 'Stay engaged and responsive. Match their momentum.';
      break;
    case 'very_fast':
      strategy.matchSpeechRate = 'Match their rapid pace. Be energetic and direct.';
      strategy.paceInstructions = 'Keep up! Be concise and punchy.';
      break;
  }
  
  // Match energy level
  switch (characteristics.energyLevel) {
    case 'low':
      strategy.matchEnergyLevel = 'Gentle, soft energy. Meet them where they are.';
      strategy.warmthLevel = 'Warm and nurturing, like a cozy blanket.';
      break;
    case 'calm':
      strategy.matchEnergyLevel = 'Calm, centered presence. Peaceful energy.';
      strategy.warmthLevel = 'Warm and steady, reassuring.';
      break;
    case 'moderate':
      strategy.matchEnergyLevel = 'Balanced, engaged energy.';
      strategy.warmthLevel = 'Friendly and approachable.';
      break;
    case 'high':
      strategy.matchEnergyLevel = 'Enthusiastic, vibrant energy. Match their excitement.';
      strategy.warmthLevel = 'Energetic warmth, celebratory.';
      break;
    case 'intense':
      strategy.matchEnergyLevel = 'Meet their intensity with calm strength. Be a grounding force.';
      strategy.warmthLevel = 'Strong, steady warmth. Anchor them.';
      break;
  }
  
  // Tone guidance based on mood
  switch (characteristics.primaryMood) {
    case 'anxious':
      strategy.toneGuidance = 'Calm, reassuring, grounding. Slow down slightly. Be the steady presence.';
      strategy.emotionalApproach = 'Acknowledge the anxiety without amplifying it. Normalize their feelings. Offer stability.';
      strategy.validationPhrases = [
        "It makes complete sense that you're feeling this way",
        "Your nervous system is trying to protect you",
        "What you're experiencing is so valid",
        "I hear the weight of this in your voice",
      ];
      break;
    case 'sad':
      strategy.toneGuidance = 'Gentle, compassionate, present. Dont try to fix. Just be with them.';
      strategy.emotionalApproach = 'Hold space for their sadness. Validate the pain. Be a witness.';
      strategy.validationPhrases = [
        "I'm here with you in this",
        "Your feelings matter",
        "It's okay to feel this deeply",
        "Thank you for trusting me with this",
      ];
      break;
    case 'frustrated':
      strategy.toneGuidance = 'Acknowledge the frustration. Validate before redirecting. Dont dismiss.';
      strategy.emotionalApproach = 'Let them vent. Mirror their frustration briefly. Then gently shift.';
      strategy.validationPhrases = [
        "That sounds incredibly frustrating",
        "I can hear how much this is bothering you",
        "You have every right to feel this way",
        "That would frustrate anyone",
      ];
      break;
    case 'hopeful':
      strategy.toneGuidance = 'Nurture the hope. Build on it. Be encouraging without being dismissive.';
      strategy.emotionalApproach = 'Celebrate their hope. Reinforce their progress. Build momentum.';
      strategy.validationPhrases = [
        "I love that you can see possibility here",
        "That hope is so important - hold onto it",
        "You're already moving in the right direction",
        "This optimism will serve you well",
      ];
      break;
    case 'excited':
      strategy.toneGuidance = 'Match their excitement! Celebrate with them. Be enthusiastic.';
      strategy.emotionalApproach = 'Share in their joy. Amplify the positive. Channel the energy.';
      strategy.validationPhrases = [
        "I can feel your excitement!",
        "This is wonderful!",
        "You should be excited about this",
        "Let's ride this wave together",
      ];
      break;
    case 'overwhelmed':
      strategy.toneGuidance = 'Be the calm in their storm. Slow, steady, grounding.';
      strategy.emotionalApproach = 'Help them feel less alone. Break things down. One thing at a time.';
      strategy.validationPhrases = [
        "That's a lot to carry",
        "No wonder you're feeling overwhelmed",
        "Let's take this one piece at a time",
        "You don't have to figure it all out right now",
      ];
      break;
    case 'determined':
      strategy.toneGuidance = 'Match their determination. Be their ally. Fuel the fire.';
      strategy.emotionalApproach = 'Support their drive. Help channel it productively. Be a partner.';
      strategy.validationPhrases = [
        "I love this energy",
        "Your determination is powerful",
        "Let's make this happen",
        "You've got this, and I've got you",
      ];
      break;
    case 'vulnerable':
      strategy.toneGuidance = 'Extra gentle. Honor their courage in opening up. Be trustworthy.';
      strategy.emotionalApproach = 'Create safety. Move slowly. Earn their trust moment by moment.';
      strategy.validationPhrases = [
        "Thank you for sharing that with me",
        "It takes courage to be this open",
        "I'm honored you trust me with this",
        "You're safe here",
      ];
      break;
    case 'guarded':
      strategy.toneGuidance = 'Patient, non-pushy. Respect their boundaries. Build trust slowly.';
      strategy.emotionalApproach = 'Dont push. Let them lead. Prove you can be trusted.';
      strategy.validationPhrases = [
        "Take your time",
        "Share only what feels comfortable",
        "There's no pressure here",
        "I'm here whenever you're ready",
      ];
      break;
    default:
      strategy.toneGuidance = 'Warm, engaged, present. Read and respond to their cues.';
      strategy.emotionalApproach = 'Stay attuned. Follow their lead. Be adaptable.';
      strategy.validationPhrases = [
        "I hear you",
        "That makes sense",
        "Tell me more",
        "I'm with you",
      ];
  }
  
  // Language style based on vocabulary and communication style
  switch (characteristics.communicationStyle) {
    case 'analytical':
      strategy.languageStyle = 'Clear, logical, evidence-based. Use frameworks and structure.';
      strategy.directnessLevel = 'Direct but thorough. Explain the why.';
      strategy.questionStyle = 'Thoughtful, probing questions. Ask about their analysis.';
      strategy.avoidPhrases = ['Just trust me', 'Dont overthink it', 'Go with your gut'];
      break;
    case 'driver':
      strategy.languageStyle = 'Concise, action-oriented, results-focused. Get to the point.';
      strategy.directnessLevel = 'Very direct. No fluff. Bottom line up front.';
      strategy.questionStyle = 'Direct questions about goals and actions.';
      strategy.avoidPhrases = ['Let me tell you a long story', 'We should explore all options', 'Take your time'];
      break;
    case 'amiable':
      strategy.languageStyle = 'Warm, relational, supportive. Focus on feelings and relationships.';
      strategy.directnessLevel = 'Gentle, indirect. Soften directness with warmth.';
      strategy.questionStyle = 'Feeling-focused questions. How does this affect you and others?';
      strategy.avoidPhrases = ['Just do it', 'Stop worrying about others', 'Toughen up'];
      break;
    case 'expressive':
      strategy.languageStyle = 'Enthusiastic, creative, story-based. Paint pictures with words.';
      strategy.directnessLevel = 'Expressive and animated. Share the vision.';
      strategy.questionStyle = 'Open-ended, imaginative questions. What would be amazing?';
      strategy.avoidPhrases = ['Let me give you the data', 'Be realistic', 'Stick to the facts'];
      break;
  }
  
  // Response length based on their style
  switch (characteristics.sentenceComplexity) {
    case 'short_direct':
      strategy.responseLength = 'Keep responses brief and punchy. Match their directness.';
      break;
    case 'moderate':
      strategy.responseLength = 'Balanced responses. Not too short, not too long.';
      break;
    case 'complex':
      strategy.responseLength = 'Fuller responses are okay. They appreciate depth.';
      break;
    case 'elaborate':
      strategy.responseLength = 'Match their elaboration. Rich, detailed responses welcome.';
      break;
  }
  
  // Mirroring techniques
  strategy.mirroringTechniques = [
    'Use similar vocabulary level and word choices',
    'Match their sentence length and complexity',
    'Reflect their emotional tone back to them',
    'Use their exact words when acknowledging what they said',
    'Match their energy level - dont be too up or too down',
    'Mirror their pace - if they pause, you pause',
  ];
  
  // Connection openers based on their need
  switch (characteristics.primaryNeed) {
    case 'validation':
      strategy.connectionOpeners = [
        "What you're feeling is completely valid",
        "You're not wrong for feeling this way",
        "Many people in your situation feel exactly the same",
        "Your instincts here are good",
      ];
      break;
    case 'direction':
      strategy.connectionOpeners = [
        "Let me help you think through this",
        "Here's what I'm seeing",
        "Based on what you've shared, I'd suggest",
        "Let's create a clear path forward",
      ];
      break;
    case 'support':
      strategy.connectionOpeners = [
        "I'm here for you",
        "You don't have to face this alone",
        "Let's work through this together",
        "I've got your back",
      ];
      break;
    case 'challenge':
      strategy.connectionOpeners = [
        "I believe you can do more than you think",
        "Let's push past this comfort zone",
        "You're ready for the next level",
        "Time to raise the bar",
      ];
      break;
    case 'information':
      strategy.connectionOpeners = [
        "Great question - let me explain",
        "Here's what you need to know",
        "Let me break this down for you",
        "The key thing to understand is",
      ];
      break;
    case 'connection':
      strategy.connectionOpeners = [
        "I'm so glad you reached out",
        "You matter to me",
        "I'm here, and I'm listening",
        "Let's talk - I want to hear everything",
      ];
      break;
    case 'space':
      strategy.connectionOpeners = [
        "Take all the time you need",
        "There's no rush here",
        "I'm here when you're ready",
        "Just being here together is enough",
      ];
      break;
  }
  
  // Transition phrases
  strategy.transitionPhrases = [
    "Building on what you just said...",
    "I'm curious about something you mentioned...",
    "That connects to something important...",
    "Let me reflect back what I'm hearing...",
    "There's something powerful in what you just shared...",
  ];
  
  // Build full guidance
  strategy.fullGuidance = `
## VOICE ANALYSIS - INSTANT RAPPORT STRATEGY

### DETECTED CHARACTERISTICS
- **Primary Mood**: ${characteristics.primaryMood} (${characteristics.emotionalIntensity} intensity)
- **Communication Style**: ${characteristics.communicationStyle}
- **Energy Level**: ${characteristics.energyLevel}
- **Confidence**: ${characteristics.confidenceLevel}
- **Primary Need**: ${characteristics.primaryNeed}
- **Trust Level**: ${characteristics.trustIndicators}
- **Stress Level**: ${characteristics.stressIndicators}

### MATCHING INSTRUCTIONS
**Speech Rate**: ${strategy.matchSpeechRate}
**Energy**: ${strategy.matchEnergyLevel}
**Tone**: ${strategy.toneGuidance}
**Language**: ${strategy.languageStyle}
**Response Length**: ${strategy.responseLength}
**Directness**: ${strategy.directnessLevel}
**Warmth**: ${strategy.warmthLevel}

### EMOTIONAL APPROACH
${strategy.emotionalApproach}

### MIRRORING TECHNIQUES
${strategy.mirroringTechniques.map(t => `- ${t}`).join('\n')}

### VALIDATION PHRASES TO USE
${strategy.validationPhrases.map(p => `- "${p}"`).join('\n')}

### CONNECTION OPENERS
${strategy.connectionOpeners.map(o => `- "${o}"`).join('\n')}

### PHRASES TO AVOID
${strategy.avoidPhrases.map(p => `- "${p}"`).join('\n')}

### KEY REMINDERS
- Match their pace exactly - if they speak slowly, you speak slowly
- Use their exact words when reflecting back
- Honor their emotional state before trying to shift it
- Build trust through consistent attunement
- Make them feel like the only person in the world right now
`.trim();
  
  return strategy;
}

/**
 * Quick analysis for real-time call adaptation
 * Returns concise guidance for immediate use
 */
export function getQuickRapportGuidance(transcript: string): string {
  const characteristics = analyzeVoiceCharacteristics(transcript);
  const strategy = generateRapportStrategy(characteristics);
  
  // Return concise, actionable guidance
  return `
[INSTANT RAPPORT GUIDANCE]
Mood: ${characteristics.primaryMood} | Need: ${characteristics.primaryNeed} | Style: ${characteristics.communicationStyle}
Pace: ${strategy.paceInstructions}
Tone: ${strategy.toneGuidance}
Approach: ${strategy.emotionalApproach}
Open with: "${strategy.connectionOpeners[0]}"
Validate with: "${strategy.validationPhrases[0]}"
`.trim();
}

/**
 * Update client profile with voice characteristics for future calls
 */
export async function saveVoiceProfile(
  userId: string,
  characteristics: VoiceCharacteristics
): Promise<void> {
  // This would save to the client profile for future reference
  // For now, we'll log it - actual implementation depends on schema
  console.log(`[VoiceAnalysis] Saving voice profile for user ${userId}:`, {
    communicationStyle: characteristics.communicationStyle,
    primaryMood: characteristics.primaryMood,
    primaryNeed: characteristics.primaryNeed,
    confidenceLevel: characteristics.confidenceLevel,
  });
}

/**
 * Get returning caller's voice profile for instant recognition
 */
export async function getVoiceProfile(userId: string): Promise<VoiceCharacteristics | null> {
  // This would retrieve from the client profile
  // For now, return null - actual implementation depends on schema
  return null;
}

export default {
  analyzeVoiceCharacteristics,
  generateRapportStrategy,
  getQuickRapportGuidance,
  saveVoiceProfile,
  getVoiceProfile,
};
