# AI Coaching Quality Monitoring Guide
**Platform:** PurposefulLive Coaching  
**Date:** December 3, 2025  
**Version:** 1.0  

---

## Overview

This guide explains how to monitor and maintain AI coaching quality to ensure customer safety and satisfaction.

---

## 🎯 Quality Monitoring System

### What We Built

1. **Conversation Rating System**
   - Thumbs up/down for quick feedback
   - 1-5 star ratings for detailed assessment
   - Optional text feedback
   - Feedback categorization (helpful, unhelpful, inappropriate, technical_error, other)

2. **Admin Dashboard** (`/admin/ai-monitoring`)
   - Real-time quality metrics
   - Conversation review interface
   - Flagged conversation queue
   - Admin notes capability

3. **Database Tracking**
   - All ratings stored in `aiChatConversations` table
   - Fields: `rating`, `wasHelpful`, `feedbackText`, `feedbackCategory`
   - Admin review status: `reviewedByAdmin`, `adminNotes`

---

## 📊 Key Metrics to Track

### 1. Average Rating
**Target:** 4.0+ out of 5 stars  
**Warning:** < 3.5 stars  
**Critical:** < 3.0 stars  

**What to do if low:**
- Review recent conversations with low ratings
- Identify common issues (unhelpful advice, inappropriate responses, technical errors)
- Adjust AI prompts to address issues
- Consider adding more specific guidance to system prompt

### 2. Helpful Rate
**Target:** 80%+ helpful  
**Warning:** < 70% helpful  
**Critical:** < 60% helpful  

**What to do if low:**
- Check feedback categories to identify patterns
- Review "unhelpful" conversations to understand why
- Update AI coaching strategies
- Consider adding more training examples

### 3. Rating Percentage
**Target:** 30%+ of conversations rated  
**Current:** Users can rate after each conversation  

**What to do if low:**
- Encourage ratings with better UI placement
- Add incentives for feedback
- Make rating process easier

### 4. Conversations Needing Review
**Target:** 0 unreviewed flagged conversations  
**Action:** Review daily  

**Priority levels:**
- **Critical:** Crisis flags, inappropriate content
- **High:** 1-2 star ratings, "inappropriate" category
- **Medium:** 3 stars, "unhelpful" category
- **Low:** "technical_error", "other" category

---

## 🔍 Daily Monitoring Routine

### Morning Check (5-10 minutes)
1. Open `/admin/ai-monitoring` dashboard
2. Check key metrics:
   - Average rating trend
   - Helpful rate
   - Conversations needing review count
3. Review any **critical** flagged conversations immediately
4. Note any sudden metric changes

### Daily Review (15-30 minutes)
1. Filter conversations by "needs_review"
2. Review all flagged conversations from past 24 hours
3. For each conversation:
   - Read full conversation transcript
   - Assess AI response quality
   - Check for safety issues
   - Add admin notes
   - Mark as reviewed
4. Identify patterns in low-rated conversations

### Weekly Analysis (1-2 hours)
1. Export conversation data for analysis
2. Calculate weekly averages:
   - Average rating
   - Helpful percentage
   - Most common feedback categories
3. Identify trends:
   - Are ratings improving or declining?
   - What types of issues are most common?
   - Are there specific topics where AI struggles?
4. Update AI prompts based on learnings
5. Document improvements made

---

## 🚨 Red Flags & Immediate Actions

### Critical Issues (Act Immediately)

#### 1. AI Gives Medical Advice
**Example:** "You should take [specific medication]" or "You have [diagnosis]"  
**Action:**
- Mark conversation for review
- Add admin note: "Medical advice given - CRITICAL"
- Update system prompt to explicitly forbid medical advice
- Consider reaching out to user to clarify

#### 2. AI Dismisses Crisis Situations
**Example:** User mentions suicide, AI responds with generic advice  
**Action:**
- Verify crisis detection is working
- Check if owner was notified
- Reach out to user immediately if needed
- Update crisis detection logic

#### 3. AI Provides Contradictory Advice
**Example:** Says "do X" then later says "don't do X"  
**Action:**
- Review conversation for context issues
- Check if AI is maintaining conversation history
- Update prompts for consistency

#### 4. AI Hallucinates Facts
**Example:** Makes up statistics, resources, or phone numbers  
**Action:**
- Mark conversation for review
- Update prompts to avoid specific claims
- Add disclaimer about verifying information

### High Priority Issues (Review Same Day)

- 1-2 star ratings
- "Inappropriate" feedback category
- Multiple negative ratings from same user
- Conversations longer than 50 messages (user frustrated?)

### Medium Priority Issues (Review Within 3 Days)

- 3 star ratings
- "Unhelpful" feedback category
- Technical errors reported
- Conversations with no AI response

---

## 📈 How to Improve AI Quality

### 1. Analyze Feedback Patterns

**Monthly Review Process:**
1. Export all feedback from past month
2. Group by category:
   - Helpful feedback: What's working well?
   - Unhelpful feedback: What's not working?
   - Inappropriate feedback: What crossed the line?
3. Identify top 3 issues
4. Create action plan to address each

### 2. Update System Prompts

**When to update:**
- Pattern of similar issues (3+ conversations)
- New type of user need identified
- Regulatory/safety concern

**How to update:**
1. Edit `server/routers/aiChat.ts` → `SYSTEM_PROMPT`
2. Test changes with sample conversations
3. Monitor impact on ratings for 1 week
4. Revert if ratings decline

**Example updates:**
```
// Add more specific crisis guidance
**CRISIS PROTOCOL:**
If they express suicidal thoughts, self-harm, or severe distress:
1. Express immediate concern
2. Direct them to 988 Suicide & Crisis Lifeline or 911
3. Notify their coach immediately
4. Provide grounding protocol
5. NEVER minimize their feelings
6. NEVER suggest they "just think positive"
```

### 3. A/B Test Prompt Changes

**Process:**
1. Create two versions of system prompt
2. Randomly assign 50% of new conversations to each
3. Track ratings for 1 week
4. Keep the version with higher ratings

### 4. Learn from High-Rated Conversations

**Monthly Process:**
1. Filter conversations by 5-star ratings
2. Read 10-20 high-rated conversations
3. Identify what made them successful:
   - Specific techniques used
   - Tone and language
   - Structure of responses
4. Incorporate learnings into prompts

---

## 🛠️ Admin Dashboard Guide

### Accessing the Dashboard
1. Log in as admin user
2. Navigate to `/admin/ai-monitoring`
3. (Only users with `role = "admin"` can access)

### Dashboard Sections

#### 1. Metrics Overview (Top Cards)
- **Total Conversations:** All AI chat conversations ever
- **Average Rating:** Mean of all star ratings (1-5)
- **Helpful Rate:** % of thumbs up vs thumbs down
- **Needs Review:** Count of unreviewed flagged conversations

#### 2. Feedback Categories
- Shows distribution of feedback by category
- Helps identify most common issues

#### 3. Conversations Table
**Filters:**
- All Conversations
- Needs Review (unreviewed flagged conversations)
- Rated (has star rating or thumbs up/down)
- Unrated (no rating yet)
- Helpful (thumbs up)
- Not Helpful (thumbs down)

**Columns:**
- Title: Auto-generated conversation title
- Rating: Star rating or thumbs up/down
- Feedback: User's text feedback
- Category: Feedback category
- Date: When conversation started
- Status: Reviewed or Pending
- Actions: Review button

#### 4. Review Dialog
**When reviewing a conversation:**
1. Click "Review" button (eye icon)
2. See conversation details:
   - Title, date, rating, category
   - User's feedback text
3. Add admin notes (optional):
   - What you observed
   - Actions taken
   - Follow-up needed
4. Click "Mark as Reviewed"

**Admin notes examples:**
- "Good response, user was satisfied"
- "AI gave generic advice, needs more personalization"
- "Crisis detected correctly, owner notified"
- "Updated system prompt to address this issue"

---

## 📋 Weekly Checklist

### Monday
- [ ] Review weekend conversations (filter by date)
- [ ] Check for any crisis flags
- [ ] Review all "needs review" conversations
- [ ] Note any new patterns

### Wednesday
- [ ] Mid-week metrics check
- [ ] Review any 1-2 star ratings
- [ ] Follow up on previous issues

### Friday
- [ ] Weekly metrics summary
- [ ] Calculate average rating for week
- [ ] Identify top 3 issues
- [ ] Plan prompt updates if needed
- [ ] Document learnings

### Monthly
- [ ] Export all conversation data
- [ ] Calculate monthly averages
- [ ] Compare to previous month
- [ ] Update system prompts based on learnings
- [ ] Create quality report for stakeholders

---

## 🎓 Training New Reviewers

### Week 1: Observation
- Read this guide thoroughly
- Shadow existing reviewer for 5 days
- Review 20+ conversations together
- Learn to identify red flags

### Week 2: Supervised Review
- Review conversations independently
- Discuss findings with senior reviewer
- Practice writing admin notes
- Learn when to escalate

### Week 3: Independent Review
- Review conversations solo
- Weekly check-in with senior reviewer
- Start identifying patterns
- Suggest prompt improvements

### Week 4: Full Responsibility
- Own daily monitoring routine
- Escalate only critical issues
- Contribute to weekly analysis
- Propose system improvements

---

## 📞 Escalation Procedures

### When to Escalate to Owner

**Immediately:**
- User expresses imminent self-harm
- AI gives dangerous medical advice
- Multiple users report same critical issue
- System-wide AI failure

**Within 24 hours:**
- Consistent pattern of low ratings (3+ days)
- New type of inappropriate response
- Legal/compliance concern
- Major bug affecting conversations

**Weekly:**
- Metrics trending downward
- Suggested prompt improvements
- Feature requests from users
- Training needs for AI

### How to Escalate
1. Document the issue clearly
2. Include examples (conversation IDs)
3. Suggest potential solutions
4. Indicate urgency level
5. Send via owner notification system

---

## 🔧 Troubleshooting Common Issues

### Issue: Low Rating Percentage
**Symptoms:** < 20% of conversations rated  
**Causes:**
- Rating UI not prominent enough
- Users don't see value in rating
- Rating process too complex

**Solutions:**
- Move rating UI to more visible location
- Add prompt: "Help us improve - rate this conversation"
- Simplify to just thumbs up/down
- Add incentive (e.g., "Your feedback helps us serve you better")

### Issue: High "Unhelpful" Rate
**Symptoms:** > 30% thumbs down  
**Causes:**
- AI responses too generic
- Not understanding user context
- Repeating same advice
- Tone mismatch

**Solutions:**
- Review unhelpful conversations for patterns
- Update prompts for more personalization
- Add context-awareness instructions
- Adjust tone in system prompt

### Issue: Many "Technical Error" Reports
**Symptoms:** Multiple technical_error feedback  
**Causes:**
- AI not responding
- Responses cut off mid-sentence
- Formatting issues
- Slow response times

**Solutions:**
- Check server logs for errors
- Verify LLM API is working
- Check token limits
- Monitor response times

### Issue: Conversations Not Being Rated
**Symptoms:** 0% rating rate  
**Causes:**
- Rating component not showing
- JavaScript error
- Users not seeing rating UI

**Solutions:**
- Check browser console for errors
- Verify ConversationRating component is rendering
- Test in different browsers
- Check if subscription gate is blocking

---

## 📊 Sample Quality Report Template

```markdown
# AI Coaching Quality Report
**Week of:** [Date Range]  
**Prepared by:** [Your Name]  

## Summary
- Total Conversations: [X]
- Average Rating: [X.X] / 5.0 (↑/↓ from last week)
- Helpful Rate: [X]% (↑/↓ from last week)
- Conversations Reviewed: [X]

## Top 3 Issues This Week
1. [Issue description] - [X] occurrences
2. [Issue description] - [X] occurrences
3. [Issue description] - [X] occurrences

## Actions Taken
- [Action 1]
- [Action 2]
- [Action 3]

## Prompt Updates Made
- [Update description and reasoning]

## Metrics Trends
- Rating trend: [Improving/Stable/Declining]
- Helpful rate trend: [Improving/Stable/Declining]
- Most common feedback category: [Category]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

## Next Week Focus
- [Priority 1]
- [Priority 2]
- [Priority 3]
```

---

## 🎯 Success Metrics

### Short-term (First Month)
- ✅ 20%+ rating rate
- ✅ 3.5+ average rating
- ✅ 70%+ helpful rate
- ✅ All flagged conversations reviewed within 24 hours

### Medium-term (3 Months)
- ✅ 30%+ rating rate
- ✅ 4.0+ average rating
- ✅ 80%+ helpful rate
- ✅ < 5% "inappropriate" feedback

### Long-term (6+ Months)
- ✅ 40%+ rating rate
- ✅ 4.5+ average rating
- ✅ 90%+ helpful rate
- ✅ Automated quality monitoring alerts
- ✅ AI self-improvement based on feedback

---

## 🚀 Future Enhancements

### Planned Features
1. **Automated Quality Alerts**
   - Email when average rating drops below threshold
   - Slack notification for critical issues
   - Daily quality summary

2. **Conversation Export**
   - Export conversations to CSV
   - Filter by date, rating, category
   - Include user feedback

3. **AI Performance Analytics**
   - Sentiment analysis of conversations
   - Topic modeling (what users talk about most)
   - Response time tracking
   - Conversation length analysis

4. **A/B Testing Framework**
   - Test multiple system prompts
   - Automatically track which performs better
   - Gradual rollout of improvements

5. **User Feedback Loop**
   - Ask users "Was this response helpful?" after each message
   - Real-time feedback to improve conversation
   - Learn from in-conversation corrections

---

## 📚 Additional Resources

### Internal Documentation
- `SYSTEM_READINESS_AUDIT.md` - Full platform audit
- `SUBSCRIPTION_SETUP_GUIDE.md` - Stripe setup instructions
- `YEARLY_PRICING_SETUP.md` - Pricing configuration

### External Resources
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [Crisis Intervention Guidelines](https://988lifeline.org/)
- [Mental Health First Aid](https://www.mentalhealthfirstaid.org/)

### Support
- Technical issues: Check server logs
- AI behavior issues: Review system prompts
- User safety concerns: Escalate to owner immediately

---

## ✅ Quick Reference

**Access Admin Dashboard:**  
`/admin/ai-monitoring` (admin role required)

**Review Flagged Conversations:**  
Dashboard → Filter: "Needs Review" → Click eye icon

**Update AI Prompts:**  
`server/routers/aiChat.ts` → Edit `SYSTEM_PROMPT`

**Check Metrics:**  
Dashboard → Top cards (Total, Rating, Helpful Rate, Needs Review)

**Escalate Critical Issue:**  
Document → Include examples → Notify owner

**Weekly Report:**  
Export data → Calculate averages → Identify patterns → Document actions

---

**Remember:** You're not just monitoring an AI - you're protecting people's mental health. Take this responsibility seriously, but don't let it overwhelm you. When in doubt, escalate.
