# 🛑🛑🛑 **STOP. READ THIS FIRST.** 🛑🛑🛑

## **YOU ARE WORKING ON A LIVE, REVENUE-GENERATING PRODUCTION PLATFORM.**

This is not a sandbox. This is not a test environment. This is a **real business** that a person depends on for their livelihood. Your actions have **immediate, real-world consequences**.

---

## **BEFORE YOU WRITE A SINGLE LINE OF CODE:**

### ✅ **MANDATORY CHECKLIST**

- [ ] **I have read `MASTER_GUIDE.md` completely.** (It's long, but it's the single source of truth.)
- [ ] **I have verified the feature I'm building doesn't already exist.** (Check Part 4: Feature Inventory in the Master Guide.)
- [ ] **I understand the `ProfileGuard` system and will integrate with it.** (If my feature interacts with a user, I MUST call `ProfileGuard.getClientContext()`.)
- [ ] **I will not refactor, rebuild, or "improve" existing working code** unless explicitly asked to do so.
- [ ] **I will prioritize revenue-blocking bugs** over all other tasks.

---

## **THE GOLDEN RULES**

1.  **READ FIRST, CODE SECOND.** The platform is more complete than you think. Assume it's already built until you prove otherwise.
2.  **DO NOT REBUILD WHAT WORKS.** This is the most common mistake. Focus on the *specific task* you were given.
3.  **PROFILEGUARD IS SACRED.** It's the "brain" of the platform. Every user-facing feature must integrate with it. No exceptions.
4.  **REVENUE IS PARAMOUNT.** If something is blocking payments, subscriptions, or user sign-ups, fix it first.
5.  **WHEN IN DOUBT, ASK.** Do not make assumptions. Ask the user for clarification before making potentially breaking changes.

---

## **WHAT HAPPENS IF YOU DON'T FOLLOW THESE RULES?**

- **You will break the live site.** Real users will see errors.
- **You will cause financial harm.** The owner loses revenue.
- **You will waste time.** The owner will have to spend hours fixing your mistakes.
- **You will erode trust.** The owner relies on AI agents to help, not hinder.

---

## **HOW TO CONFIRM YOU'VE READ THIS**

Before proceeding with any task, state the following in your first message:

> **"I have read and understood the Agent Instructions and the Master Guide. I confirm this is a live production platform and I will proceed with caution. My task is: [describe task]."**

---

## **KEY FILES TO KNOW**

| File | Purpose |
|---|---|
| `MASTER_GUIDE.md` | **THE SINGLE SOURCE OF TRUTH.** Contains vision, architecture, feature inventory, and everything else. |
| `server/profileGuard.ts` | The central client context system. **MUST** be integrated into all user-facing features. |
| `server/selfLearningIntegration.ts` | Used to extract and update client profiles from interactions. |
| `server/routers/` | All backend API routes. Check here before building a new feature. |
| `client/src/pages/` | All frontend pages. Check here before building a new UI. |

---

## **THANK YOU FOR BEING CAREFUL.**

Your diligence protects a real person's business and the well-being of their clients.
