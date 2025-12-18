# Comprehensive Compliance Suite

## Overview

The Purposeful Live Coaching platform includes a research-backed compliance system that monitors coaching sessions in real-time to ensure ethical, effective, and legally compliant communication. This system protects both coaches and clients while improving coaching quality.

## Compliance Categories

### 1. Legal Compliance

Prevents coaches from inadvertently providing advice outside their scope of practice.

| Detection Type | Examples | Response |
|---------------|----------|----------|
| Medical Advice | "You have depression", "Take this medication" | Immediate alert + referral language |
| Legal Advice | "You should sue them", "That's illegal" | Immediate alert + referral language |
| Financial Advice | "Invest in this stock", "Buy cryptocurrency" | Immediate alert + referral language |

**Research Basis:** ICF Code of Ethics Section 4.1 - Coaches must operate within their competency and not diagnose or prescribe.

### 2. Banned Words & Phrases

Identifies language patterns that trigger defensiveness or resistance in clients.

| Pattern | Problem | Better Alternative |
|---------|---------|-------------------|
| "Why did you...?" | Sounds accusatory | "Help me understand what led to..." |
| "You always/never..." | Absolute statements trigger defense | "I've noticed sometimes..." |
| "Just calm down" | Dismissive of emotions | "I can see this is affecting you. What would help?" |
| "To be honest..." | Implies previous dishonesty | State directly without preamble |
| "Actually..." | Can sound condescending | Offer information without correction framing |

**Research Basis:** 
- Psychology Today - "10 Phrases That Create Defensiveness" (Dr. Randi Gunther)
- Gottman Institute - The Four Horsemen research
- Nonviolent Communication (Marshall Rosenberg)

### 3. Ethical Compliance

Ensures alignment with professional coaching ethics standards.

| Issue | Detection | Guidance |
|-------|-----------|----------|
| Outcome Promises | "I guarantee results" | Coaching supports growth but cannot promise specific outcomes |
| Boundary Violations | "Let's meet outside sessions" | Maintain professional context for all interactions |
| Scope Creep | "Let me give you therapy" | Coaching is distinct from therapy/counseling |

**Research Basis:** ICF Code of Ethics (2025) - Core values of Professionalism, Collaboration, Humanity, and Equity.

### 4. Social Compliance

Promotes cultural sensitivity and inclusive communication.

| Area | What to Avoid | What to Do |
|------|--------------|------------|
| Cultural Assumptions | "In your culture, people always..." | Ask about individual experiences |
| Gender Stereotypes | "As a man, you should..." | Focus on individual values and goals |
| Spiritual Imposition | "God wants you to..." | Respect diverse beliefs; ask about client's framework |

**Research Basis:** Multicultural Counseling Competencies (AMCD) - Cultural humility and awareness of one's own cultural lens.

### 5. Wisdom Compliance

Applies research-backed communication principles.

| Principle | Application | Research Source |
|-----------|-------------|-----------------|
| Ask Permission | "Would you like to explore some options?" | Motivational Interviewing |
| Understand First | "What have you already tried?" | Active Listening research |
| Allow Processing | 3-second pause before responding | Communication effectiveness studies |

**Research Basis:** Cialdini's Principles of Ethical Persuasion, Motivational Interviewing techniques.

### 6. Interpersonal Skills Compliance

Aligns communication with basic psychological needs.

| Need | Threat | Support |
|------|--------|---------|
| Autonomy | "You have to do this" | "You could try X or Y - what feels right?" |
| Competence | "That's easy/obvious" | Acknowledge challenges, celebrate progress |
| Relatedness | "That's not my problem" | "I want to support you in the best way I can" |

**Research Basis:** Self-Determination Theory (Deci & Ryan) - Autonomy, Competence, and Relatedness as basic psychological needs.

## Crisis Detection

The system includes immediate detection and response for safety concerns:

| Indicator | Response | Resources |
|-----------|----------|-----------|
| Suicide Risk | Immediate alert, provide crisis resources | 988 Suicide & Crisis Lifeline |
| Self-Harm | Safety assessment, crisis resources | Crisis Text Line: text HOME to 741741 |
| Harm to Others | Duty to warn assessment | Consult supervisor, appropriate authorities |
| Abuse Disclosure | Validate, assess safety, provide resources | National DV Hotline: 1-800-799-7233 |

## Real-Time Integration

### How It Works

1. **Continuous Monitoring**: The system analyzes coach speech in real-time during sessions
2. **Instant Alerts**: Violations trigger immediate audio alerts through the coach's headset
3. **Severity Levels**: Alerts are prioritized by severity (info → warning → moderate → severe → critical)
4. **Alternative Suggestions**: The system provides better phrasing options
5. **Session Scoring**: Overall compliance score tracks session quality

### Voice Feedback

When enabled, the AI co-pilot will:
- Speak corrections immediately when violations are detected
- Provide alternative phrasing suggestions
- Offer encouragement for good communication
- Alert immediately for crisis situations

## API Endpoints

### Check Compliance
```typescript
trpc.compliance.checkCompliance.mutate({
  text: "Your message to check",
  isCoachSpeaking: true,
  sessionType: "live_client"
})
```

### Stream Compliance (Real-time)
```typescript
trpc.compliance.streamComplianceCheck.mutate({
  text: "Current transcript",
  previousViolations: [] // Avoid duplicate alerts
})
```

### Get Category Guidance
```typescript
trpc.compliance.getCategoryGuidance.query({
  category: "legal" | "banned_words" | "ethical" | "social" | "wisdom" | "interpersonal" | "crisis"
})
```

## Best Practices for Coaches

### Before Sessions
1. Review compliance guidelines for your session type
2. Ensure AI co-pilot is enabled and audio is working
3. Have crisis resources readily accessible

### During Sessions
1. Listen for AI alerts through your headset
2. Pause and rephrase when alerted
3. Use suggested alternatives
4. If in doubt, ask permission before offering input

### After Sessions
1. Review session compliance summary
2. Note areas for improvement
3. Practice alternative phrasings
4. Celebrate compliance wins

## Compliance Score Interpretation

| Score | Interpretation | Action |
|-------|---------------|--------|
| 90-100 | Excellent | Maintain current practices |
| 70-89 | Good | Minor adjustments recommended |
| 50-69 | Needs Improvement | Review specific violation categories |
| Below 50 | Concerning | Immediate review and training recommended |

## Continuous Improvement

The compliance system is designed to:
- Learn from session patterns
- Adapt to individual coaching styles
- Provide personalized improvement recommendations
- Track progress over time

## Support

For questions about compliance guidelines or system functionality:
- Review the in-app guidance for each category
- Consult the ICF Code of Ethics
- Contact platform support for technical issues
