/**
 * Structured Programs Router
 * 
 * Multi-week programs like:
 * - 6-Week Anxiety Reset
 * - 21 Days of Mindfulness
 * - 7-Day Stress Detox
 * 
 * Research: Users who complete structured programs have 3x higher retention
 */

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import SelfLearning from "../selfLearningIntegration";

// In-memory program data (in production, this would be in the database)
const FLAGSHIP_PROGRAMS = [
  {
    id: 1,
    slug: "6-week-anxiety-reset",
    title: "6-Week Anxiety Reset",
    subtitle: "Transform your relationship with anxiety",
    description: "A comprehensive 6-week program based on Cognitive Behavioral Therapy (CBT) principles. Learn to understand, manage, and reduce anxiety through daily exercises, guided meditations, and practical tools you can use for life.",
    category: "anxiety",
    difficulty: "beginner",
    durationDays: 42,
    totalSessions: 42,
    iconEmoji: "🧘",
    imageUrl: "/images/programs/anxiety-reset.jpg",
    benefits: [
      "Understand the root causes of your anxiety",
      "Learn evidence-based coping techniques",
      "Build a personalized anxiety management toolkit",
      "Develop lasting habits for mental wellness",
      "Reduce anxiety symptoms by up to 50%"
    ],
    scienceBasis: "Based on CBT principles with proven efficacy in clinical trials. Incorporates elements from ACT (Acceptance and Commitment Therapy) and mindfulness-based stress reduction.",
    estimatedMinutesPerDay: 15,
    completionRate: 67,
    averageRating: 470, // 4.7 stars
    totalEnrollments: 2847,
    isActive: true,
    isFeatured: true,
    isPremium: false,
    weeks: [
      {
        weekNumber: 1,
        theme: "Understanding Anxiety",
        description: "Learn what anxiety is, why it happens, and how your brain creates anxious responses.",
        days: [
          { dayNumber: 1, title: "What is Anxiety?", theme: "Education", estimatedMinutes: 10, lessonContent: "Anxiety is your body's natural response to stress...", exerciseInstructions: "Take 5 deep breaths and notice how your body feels.", reflectionPrompts: ["When do you typically feel most anxious?", "What physical sensations do you notice when anxious?"], affirmation: "I am learning to understand my anxiety, and that's the first step to freedom." },
          { dayNumber: 2, title: "The Anxiety Cycle", theme: "Education", estimatedMinutes: 12, lessonContent: "Anxiety follows a predictable pattern...", exerciseInstructions: "Map out your personal anxiety cycle.", reflectionPrompts: ["What triggers your anxiety cycle?", "What thoughts typically follow?"], affirmation: "I can break the cycle by understanding it." },
          { dayNumber: 3, title: "Your Anxiety Story", theme: "Self-Discovery", estimatedMinutes: 15, lessonContent: "Your relationship with anxiety has a history...", exerciseInstructions: "Write your anxiety timeline.", reflectionPrompts: ["When did you first notice anxiety in your life?", "How has it changed over time?"], affirmation: "My past does not define my future." },
          { dayNumber: 4, title: "Physical Symptoms", theme: "Body Awareness", estimatedMinutes: 10, lessonContent: "Anxiety lives in the body as much as the mind...", exerciseInstructions: "Body scan meditation (5 minutes).", reflectionPrompts: ["Where do you feel anxiety in your body?", "What does it feel like?"], affirmation: "I am safe in my body." },
          { dayNumber: 5, title: "Thought Patterns", theme: "Cognitive", estimatedMinutes: 12, lessonContent: "Anxious thoughts follow predictable patterns...", exerciseInstructions: "Identify 3 anxious thoughts from today.", reflectionPrompts: ["What 'what if' thoughts do you have?", "Are these thoughts facts or fears?"], affirmation: "Thoughts are not facts." },
          { dayNumber: 6, title: "Avoidance Behaviors", theme: "Behavioral", estimatedMinutes: 10, lessonContent: "Avoidance feels safe but keeps anxiety alive...", exerciseInstructions: "List 3 things you avoid due to anxiety.", reflectionPrompts: ["What would you do if anxiety wasn't holding you back?", "What's the cost of avoidance?"], affirmation: "I am capable of facing my fears." },
          { dayNumber: 7, title: "Week 1 Review", theme: "Integration", estimatedMinutes: 15, lessonContent: "Let's consolidate what you've learned...", exerciseInstructions: "Complete the Week 1 reflection worksheet.", reflectionPrompts: ["What's your biggest insight from this week?", "What do you want to focus on next week?"], affirmation: "I am making progress every day." }
        ]
      },
      {
        weekNumber: 2,
        theme: "Calming the Body",
        description: "Master physical techniques to reduce anxiety symptoms in the moment.",
        days: [
          { dayNumber: 8, title: "Breath is Medicine", theme: "Breathwork", estimatedMinutes: 12, lessonContent: "Your breath is the fastest way to calm your nervous system...", exerciseInstructions: "Practice 4-7-8 breathing for 5 minutes.", reflectionPrompts: ["How did your body feel before and after?", "When could you use this technique?"], affirmation: "My breath is always available to calm me." },
          { dayNumber: 9, title: "Progressive Relaxation", theme: "Body", estimatedMinutes: 15, lessonContent: "Systematic muscle relaxation releases stored tension...", exerciseInstructions: "Complete a full body progressive relaxation.", reflectionPrompts: ["Which muscles held the most tension?", "How do you feel now?"], affirmation: "I release tension with every breath." },
          { dayNumber: 10, title: "Grounding Techniques", theme: "Presence", estimatedMinutes: 10, lessonContent: "Grounding brings you back to the present moment...", exerciseInstructions: "Practice the 5-4-3-2-1 technique.", reflectionPrompts: ["How quickly did you feel more present?", "What grounds you most effectively?"], affirmation: "I am here, now, and I am safe." },
          { dayNumber: 11, title: "Movement & Anxiety", theme: "Physical", estimatedMinutes: 15, lessonContent: "Movement metabolizes stress hormones...", exerciseInstructions: "10-minute anxiety-release movement session.", reflectionPrompts: ["How does your body feel after movement?", "What type of movement helps you most?"], affirmation: "My body knows how to release anxiety." },
          { dayNumber: 12, title: "Cold Exposure", theme: "Nervous System", estimatedMinutes: 10, lessonContent: "Cold activates your parasympathetic nervous system...", exerciseInstructions: "End your shower with 30 seconds of cold water.", reflectionPrompts: ["What did you notice during the cold exposure?", "How did you feel afterward?"], affirmation: "I can handle discomfort." },
          { dayNumber: 13, title: "Sleep & Anxiety", theme: "Rest", estimatedMinutes: 12, lessonContent: "Poor sleep and anxiety create a vicious cycle...", exerciseInstructions: "Create your ideal sleep routine.", reflectionPrompts: ["How does sleep affect your anxiety?", "What's one thing you can improve tonight?"], affirmation: "I deserve restful, restorative sleep." },
          { dayNumber: 14, title: "Week 2 Review", theme: "Integration", estimatedMinutes: 15, lessonContent: "You now have a toolkit of body-based techniques...", exerciseInstructions: "Create your personal calm-down protocol.", reflectionPrompts: ["Which technique works best for you?", "How will you remember to use these tools?"], affirmation: "I have the tools to calm my body." }
        ]
      },
      {
        weekNumber: 3,
        theme: "Rewiring Thoughts",
        description: "Learn CBT techniques to challenge and change anxious thinking patterns.",
        days: [
          { dayNumber: 15, title: "Cognitive Distortions", theme: "CBT", estimatedMinutes: 12, lessonContent: "Our minds play tricks on us...", exerciseInstructions: "Identify your top 3 cognitive distortions.", reflectionPrompts: ["Which distortion do you use most?", "How does it affect your anxiety?"], affirmation: "I can see my thoughts clearly." },
          { dayNumber: 16, title: "Thought Records", theme: "CBT", estimatedMinutes: 15, lessonContent: "Writing down thoughts reveals their true nature...", exerciseInstructions: "Complete 3 thought records today.", reflectionPrompts: ["What patterns do you notice?", "How accurate were your anxious predictions?"], affirmation: "I examine my thoughts with curiosity." },
          { dayNumber: 17, title: "Evidence Gathering", theme: "CBT", estimatedMinutes: 12, lessonContent: "Anxious thoughts rarely hold up to scrutiny...", exerciseInstructions: "Challenge one anxious thought with evidence.", reflectionPrompts: ["What evidence supports the thought?", "What evidence contradicts it?"], affirmation: "I seek truth, not fear." },
          { dayNumber: 18, title: "Reframing", theme: "CBT", estimatedMinutes: 12, lessonContent: "Every situation can be viewed from multiple angles...", exerciseInstructions: "Reframe 3 anxious thoughts into balanced ones.", reflectionPrompts: ["How does the reframe feel different?", "What would you tell a friend in this situation?"], affirmation: "I choose how I interpret my experiences." },
          { dayNumber: 19, title: "Worry Time", theme: "Behavioral", estimatedMinutes: 10, lessonContent: "Containing worry to specific times reduces its power...", exerciseInstructions: "Schedule and complete a 15-minute worry time.", reflectionPrompts: ["How did it feel to postpone worries?", "Did the worries feel different during worry time?"], affirmation: "I control when I worry." },
          { dayNumber: 20, title: "Acceptance", theme: "ACT", estimatedMinutes: 12, lessonContent: "Sometimes the answer isn't fighting anxiety, but accepting it...", exerciseInstructions: "Practice accepting an anxious feeling without fighting it.", reflectionPrompts: ["What happened when you stopped fighting?", "How is acceptance different from giving up?"], affirmation: "I can feel anxious and still be okay." },
          { dayNumber: 21, title: "Week 3 Review", theme: "Integration", estimatedMinutes: 15, lessonContent: "You've learned powerful cognitive tools...", exerciseInstructions: "Create your thought-challenging cheat sheet.", reflectionPrompts: ["Which cognitive technique resonates most?", "How has your thinking changed?"], affirmation: "My thoughts serve me, not control me." }
        ]
      },
      {
        weekNumber: 4,
        theme: "Facing Fears",
        description: "Gradually confront avoided situations to build confidence and reduce anxiety.",
        days: [
          { dayNumber: 22, title: "Understanding Exposure", theme: "Education", estimatedMinutes: 10, lessonContent: "Facing fears is the most powerful anxiety treatment...", exerciseInstructions: "Create your fear hierarchy.", reflectionPrompts: ["What fears have you been avoiding?", "What would change if you overcame them?"], affirmation: "I am braver than I believe." },
          { dayNumber: 23, title: "Small Steps", theme: "Exposure", estimatedMinutes: 12, lessonContent: "Start with the smallest step...", exerciseInstructions: "Take one small step toward a fear.", reflectionPrompts: ["How did it feel to take action?", "What did you learn?"], affirmation: "Every small step is a victory." },
          { dayNumber: 24, title: "Sitting with Discomfort", theme: "Exposure", estimatedMinutes: 12, lessonContent: "Anxiety peaks and then falls...", exerciseInstructions: "Stay in an anxious situation until anxiety naturally decreases.", reflectionPrompts: ["How long did it take for anxiety to decrease?", "What did you notice?"], affirmation: "I can handle temporary discomfort." },
          { dayNumber: 25, title: "Imaginal Exposure", theme: "Exposure", estimatedMinutes: 15, lessonContent: "Visualizing feared situations reduces their power...", exerciseInstructions: "Vividly imagine a feared scenario for 10 minutes.", reflectionPrompts: ["How did your anxiety change during the visualization?", "What insights emerged?"], affirmation: "My imagination is a tool for healing." },
          { dayNumber: 26, title: "Real-World Practice", theme: "Exposure", estimatedMinutes: 15, lessonContent: "Real exposure creates real change...", exerciseInstructions: "Complete a moderate exposure from your hierarchy.", reflectionPrompts: ["What was harder/easier than expected?", "How do you feel about yourself now?"], affirmation: "I am capable of more than I thought." },
          { dayNumber: 27, title: "Celebrating Courage", theme: "Self-Compassion", estimatedMinutes: 10, lessonContent: "Acknowledging your bravery builds confidence...", exerciseInstructions: "Write about 3 brave things you've done.", reflectionPrompts: ["How does it feel to acknowledge your courage?", "What would you tell your past self?"], affirmation: "I am proud of my courage." },
          { dayNumber: 28, title: "Week 4 Review", theme: "Integration", estimatedMinutes: 15, lessonContent: "You've faced fears and grown stronger...", exerciseInstructions: "Update your fear hierarchy with new ratings.", reflectionPrompts: ["How have your fear ratings changed?", "What exposure will you continue?"], affirmation: "Fear no longer controls my life." }
        ]
      },
      {
        weekNumber: 5,
        theme: "Building Resilience",
        description: "Develop long-term habits and mindsets that protect against anxiety.",
        days: [
          { dayNumber: 29, title: "Values Clarification", theme: "ACT", estimatedMinutes: 12, lessonContent: "Living by your values creates meaning beyond anxiety...", exerciseInstructions: "Identify your top 5 core values.", reflectionPrompts: ["How does anxiety interfere with your values?", "What would living your values look like?"], affirmation: "My values guide my life." },
          { dayNumber: 30, title: "Committed Action", theme: "ACT", estimatedMinutes: 12, lessonContent: "Action aligned with values builds a meaningful life...", exerciseInstructions: "Take one values-aligned action today.", reflectionPrompts: ["How did it feel to act on your values?", "What's one more action you could take?"], affirmation: "I act on what matters to me." },
          { dayNumber: 31, title: "Self-Compassion", theme: "Mindfulness", estimatedMinutes: 12, lessonContent: "Treating yourself kindly reduces anxiety...", exerciseInstructions: "Practice the self-compassion break.", reflectionPrompts: ["How do you typically talk to yourself when anxious?", "What would a compassionate friend say?"], affirmation: "I treat myself with kindness." },
          { dayNumber: 32, title: "Gratitude Practice", theme: "Positive Psychology", estimatedMinutes: 10, lessonContent: "Gratitude rewires the brain for positivity...", exerciseInstructions: "Write 10 things you're grateful for.", reflectionPrompts: ["How does gratitude affect your mood?", "What small things are you grateful for?"], affirmation: "I notice the good in my life." },
          { dayNumber: 33, title: "Social Connection", theme: "Relationships", estimatedMinutes: 12, lessonContent: "Connection is a powerful anxiety buffer...", exerciseInstructions: "Reach out to someone you care about.", reflectionPrompts: ["How does connection affect your anxiety?", "Who supports you most?"], affirmation: "I am not alone." },
          { dayNumber: 34, title: "Meaning & Purpose", theme: "Existential", estimatedMinutes: 12, lessonContent: "Purpose provides direction beyond anxiety...", exerciseInstructions: "Write your personal mission statement.", reflectionPrompts: ["What gives your life meaning?", "How can you contribute to something larger?"], affirmation: "My life has purpose." },
          { dayNumber: 35, title: "Week 5 Review", theme: "Integration", estimatedMinutes: 15, lessonContent: "You're building a life beyond anxiety...", exerciseInstructions: "Create your resilience action plan.", reflectionPrompts: ["What resilience practices will you maintain?", "How has your relationship with anxiety changed?"], affirmation: "I am resilient." }
        ]
      },
      {
        weekNumber: 6,
        theme: "Living Free",
        description: "Integrate everything you've learned and create your ongoing wellness plan.",
        days: [
          { dayNumber: 36, title: "Your Toolkit Review", theme: "Integration", estimatedMinutes: 15, lessonContent: "You have a complete anxiety management toolkit...", exerciseInstructions: "Create your personal anxiety toolkit card.", reflectionPrompts: ["Which tools work best for you?", "How will you remember to use them?"], affirmation: "I have everything I need." },
          { dayNumber: 37, title: "Relapse Prevention", theme: "Maintenance", estimatedMinutes: 12, lessonContent: "Setbacks are normal and manageable...", exerciseInstructions: "Create your relapse prevention plan.", reflectionPrompts: ["What warning signs should you watch for?", "What will you do if anxiety increases?"], affirmation: "Setbacks are part of the journey." },
          { dayNumber: 38, title: "Support System", theme: "Relationships", estimatedMinutes: 10, lessonContent: "You don't have to manage anxiety alone...", exerciseInstructions: "Identify your support network.", reflectionPrompts: ["Who can you turn to for support?", "How can you strengthen these connections?"], affirmation: "I accept support from others." },
          { dayNumber: 39, title: "Lifestyle Foundations", theme: "Wellness", estimatedMinutes: 12, lessonContent: "Daily habits create the foundation for mental health...", exerciseInstructions: "Design your ideal daily routine.", reflectionPrompts: ["What habits support your mental health?", "What changes will you make?"], affirmation: "My daily habits support my wellbeing." },
          { dayNumber: 40, title: "Future Self", theme: "Visualization", estimatedMinutes: 12, lessonContent: "Visualizing your future self guides your growth...", exerciseInstructions: "Write a letter from your future anxiety-free self.", reflectionPrompts: ["What does your future self want you to know?", "What advice do they give?"], affirmation: "I am becoming who I want to be." },
          { dayNumber: 41, title: "Celebration", theme: "Completion", estimatedMinutes: 10, lessonContent: "You've completed an incredible journey...", exerciseInstructions: "Celebrate your progress in a meaningful way.", reflectionPrompts: ["How have you changed over 6 weeks?", "What are you most proud of?"], affirmation: "I celebrate my growth." },
          { dayNumber: 42, title: "Graduation", theme: "Completion", estimatedMinutes: 15, lessonContent: "This is not the end, but a new beginning...", exerciseInstructions: "Complete your graduation reflection.", reflectionPrompts: ["What will you carry forward?", "What's your commitment to yourself?"], affirmation: "I am free to live fully." }
        ]
      }
    ]
  },
  {
    id: 2,
    slug: "21-days-of-mindfulness",
    title: "21 Days of Mindfulness",
    subtitle: "Build a lasting meditation practice",
    description: "Transform your relationship with the present moment through 21 days of guided mindfulness practice. Perfect for beginners or anyone wanting to deepen their practice.",
    category: "mindfulness",
    difficulty: "beginner",
    durationDays: 21,
    totalSessions: 21,
    iconEmoji: "🧘‍♀️",
    imageUrl: "/images/programs/mindfulness-21.jpg",
    benefits: [
      "Establish a daily meditation habit",
      "Reduce stress and improve focus",
      "Increase emotional awareness",
      "Better sleep quality",
      "Greater sense of calm and presence"
    ],
    scienceBasis: "Based on Mindfulness-Based Stress Reduction (MBSR) developed by Jon Kabat-Zinn at UMass Medical School. Proven to reduce stress, anxiety, and depression.",
    estimatedMinutesPerDay: 10,
    completionRate: 78,
    averageRating: 485,
    totalEnrollments: 5234,
    isActive: true,
    isFeatured: true,
    isPremium: false,
    weeks: [
      {
        weekNumber: 1,
        theme: "Foundation",
        description: "Learn the basics of mindfulness and establish your practice.",
        days: [
          { dayNumber: 1, title: "What is Mindfulness?", theme: "Introduction", estimatedMinutes: 8, lessonContent: "Mindfulness is paying attention, on purpose, to the present moment...", exerciseInstructions: "5-minute breath awareness meditation.", reflectionPrompts: ["What did you notice during the meditation?", "When are you most present in daily life?"], affirmation: "I am present in this moment." },
          { dayNumber: 2, title: "The Breath Anchor", theme: "Breath", estimatedMinutes: 10, lessonContent: "Your breath is always available as an anchor to the present...", exerciseInstructions: "7-minute breath meditation.", reflectionPrompts: ["How does focusing on breath affect your mind?", "What distractions arose?"], affirmation: "My breath brings me home." },
          { dayNumber: 3, title: "Wandering Mind", theme: "Awareness", estimatedMinutes: 10, lessonContent: "A wandering mind is not a failure - it's an opportunity...", exerciseInstructions: "Practice noting when your mind wanders.", reflectionPrompts: ["How many times did your mind wander?", "What did it wander to?"], affirmation: "I gently return to the present." },
          { dayNumber: 4, title: "Body Awareness", theme: "Body Scan", estimatedMinutes: 12, lessonContent: "The body holds wisdom the mind often misses...", exerciseInstructions: "10-minute body scan meditation.", reflectionPrompts: ["What sensations did you notice?", "Where do you hold tension?"], affirmation: "I am connected to my body." },
          { dayNumber: 5, title: "Mindful Moments", theme: "Daily Life", estimatedMinutes: 8, lessonContent: "Mindfulness isn't just meditation - it's a way of living...", exerciseInstructions: "Practice mindful eating with one meal.", reflectionPrompts: ["How was eating mindfully different?", "What did you notice about the food?"], affirmation: "Every moment is an opportunity for presence." },
          { dayNumber: 6, title: "Dealing with Discomfort", theme: "Acceptance", estimatedMinutes: 10, lessonContent: "Mindfulness means being with what is, even when it's uncomfortable...", exerciseInstructions: "Sit with a mild discomfort without reacting.", reflectionPrompts: ["What happened when you didn't react?", "How did the discomfort change?"], affirmation: "I can be with what is." },
          { dayNumber: 7, title: "Week 1 Integration", theme: "Review", estimatedMinutes: 10, lessonContent: "You've built the foundation of your practice...", exerciseInstructions: "10-minute open awareness meditation.", reflectionPrompts: ["What's been most challenging?", "What's been most rewarding?"], affirmation: "I am building a practice that serves me." }
        ]
      },
      {
        weekNumber: 2,
        theme: "Deepening",
        description: "Expand your practice with new techniques and longer sits.",
        days: [
          { dayNumber: 8, title: "Loving-Kindness", theme: "Compassion", estimatedMinutes: 12, lessonContent: "Loving-kindness meditation cultivates compassion...", exerciseInstructions: "10-minute loving-kindness meditation.", reflectionPrompts: ["How did it feel to send yourself kindness?", "Who was easiest/hardest to send kindness to?"], affirmation: "I am worthy of love and kindness." },
          { dayNumber: 9, title: "Mindful Walking", theme: "Movement", estimatedMinutes: 15, lessonContent: "Mindfulness can be practiced in motion...", exerciseInstructions: "10-minute walking meditation.", reflectionPrompts: ["How was walking mindfully different?", "What did you notice about your body?"], affirmation: "I am present in every step." },
          { dayNumber: 10, title: "Thoughts as Clouds", theme: "Cognitive", estimatedMinutes: 10, lessonContent: "Thoughts are like clouds passing through the sky of awareness...", exerciseInstructions: "Practice watching thoughts without engaging.", reflectionPrompts: ["What types of thoughts arose?", "How did it feel to just watch?"], affirmation: "I am the sky, not the clouds." },
          { dayNumber: 11, title: "Emotions as Visitors", theme: "Emotional", estimatedMinutes: 12, lessonContent: "Emotions are temporary visitors, not permanent residents...", exerciseInstructions: "Notice and name emotions as they arise.", reflectionPrompts: ["What emotions visited today?", "How long did they stay?"], affirmation: "I welcome all emotions as teachers." },
          { dayNumber: 12, title: "The Pause", theme: "Reactivity", estimatedMinutes: 10, lessonContent: "Between stimulus and response, there is a space...", exerciseInstructions: "Practice pausing before reacting today.", reflectionPrompts: ["When did you successfully pause?", "What changed because you paused?"], affirmation: "I choose my responses." },
          { dayNumber: 13, title: "Gratitude Meditation", theme: "Positive", estimatedMinutes: 10, lessonContent: "Gratitude shifts our attention to what's good...", exerciseInstructions: "10-minute gratitude meditation.", reflectionPrompts: ["What are you grateful for today?", "How does gratitude affect your mood?"], affirmation: "I notice abundance in my life." },
          { dayNumber: 14, title: "Week 2 Integration", theme: "Review", estimatedMinutes: 12, lessonContent: "Your practice is deepening...", exerciseInstructions: "12-minute silent meditation.", reflectionPrompts: ["How has your practice evolved?", "What technique resonates most?"], affirmation: "My practice grows stronger each day." }
        ]
      },
      {
        weekNumber: 3,
        theme: "Integration",
        description: "Bring mindfulness into every aspect of your life.",
        days: [
          { dayNumber: 15, title: "Morning Mindfulness", theme: "Routine", estimatedMinutes: 10, lessonContent: "How you start your day sets the tone...", exerciseInstructions: "Create a mindful morning routine.", reflectionPrompts: ["How did a mindful morning feel different?", "What will you keep doing?"], affirmation: "I start each day with intention." },
          { dayNumber: 16, title: "Mindful Communication", theme: "Relationships", estimatedMinutes: 12, lessonContent: "Mindful listening transforms relationships...", exerciseInstructions: "Practice fully listening in one conversation.", reflectionPrompts: ["What did you notice when you truly listened?", "How did the other person respond?"], affirmation: "I listen with my full attention." },
          { dayNumber: 17, title: "Stress Response", theme: "Resilience", estimatedMinutes: 10, lessonContent: "Mindfulness changes how we respond to stress...", exerciseInstructions: "Use mindfulness during a stressful moment.", reflectionPrompts: ["How did mindfulness help with stress?", "What would you do differently?"], affirmation: "I respond to stress with awareness." },
          { dayNumber: 18, title: "Mindful Technology", theme: "Modern Life", estimatedMinutes: 10, lessonContent: "We can bring mindfulness to our digital lives...", exerciseInstructions: "Practice mindful phone use today.", reflectionPrompts: ["How often do you check your phone unconsciously?", "What changed with awareness?"], affirmation: "I use technology intentionally." },
          { dayNumber: 19, title: "Evening Wind-Down", theme: "Sleep", estimatedMinutes: 12, lessonContent: "A mindful evening prepares you for restful sleep...", exerciseInstructions: "Create a mindful evening routine.", reflectionPrompts: ["How did you feel before bed?", "How was your sleep?"], affirmation: "I end each day with peace." },
          { dayNumber: 20, title: "Maintaining Practice", theme: "Sustainability", estimatedMinutes: 10, lessonContent: "The key is consistency, not perfection...", exerciseInstructions: "Plan your ongoing practice schedule.", reflectionPrompts: ["What time works best for practice?", "What might get in the way?"], affirmation: "I am committed to my practice." },
          { dayNumber: 21, title: "Graduation", theme: "Completion", estimatedMinutes: 15, lessonContent: "You've completed 21 days of mindfulness...", exerciseInstructions: "15-minute celebration meditation.", reflectionPrompts: ["How have you changed over 21 days?", "What's your commitment going forward?"], affirmation: "I am a mindful person." }
        ]
      }
    ]
  },
  {
    id: 3,
    slug: "7-day-stress-detox",
    title: "7-Day Stress Detox",
    subtitle: "Reset your nervous system in one week",
    description: "A powerful week-long program to break the stress cycle and restore calm. Perfect for when you're feeling overwhelmed and need a reset.",
    category: "stress",
    difficulty: "beginner",
    durationDays: 7,
    totalSessions: 7,
    iconEmoji: "🌿",
    imageUrl: "/images/programs/stress-detox.jpg",
    benefits: [
      "Immediate stress relief",
      "Reset your nervous system",
      "Learn quick calming techniques",
      "Improve sleep quality",
      "Build stress resilience"
    ],
    scienceBasis: "Combines evidence-based techniques from polyvagal theory, breathwork research, and stress physiology to rapidly reduce cortisol and activate the parasympathetic nervous system.",
    estimatedMinutesPerDay: 15,
    completionRate: 89,
    averageRating: 490,
    totalEnrollments: 8921,
    isActive: true,
    isFeatured: true,
    isPremium: false,
    weeks: [
      {
        weekNumber: 1,
        theme: "Stress Detox",
        description: "Seven days to reset your stress response.",
        days: [
          { dayNumber: 1, title: "Stress Audit", theme: "Awareness", estimatedMinutes: 15, lessonContent: "Before we can reduce stress, we need to understand it...", exerciseInstructions: "Complete the stress audit worksheet.", reflectionPrompts: ["What are your top 3 stressors?", "How does stress show up in your body?"], affirmation: "Awareness is the first step to change." },
          { dayNumber: 2, title: "Breath Reset", theme: "Breathwork", estimatedMinutes: 15, lessonContent: "Your breath is the fastest way to calm your nervous system...", exerciseInstructions: "Practice 3 different breathing techniques.", reflectionPrompts: ["Which technique felt most calming?", "When will you use this?"], affirmation: "My breath is my anchor to calm." },
          { dayNumber: 3, title: "Digital Detox", theme: "Environment", estimatedMinutes: 12, lessonContent: "Our devices are a major source of stress...", exerciseInstructions: "Take a 4-hour break from screens.", reflectionPrompts: ["How did it feel to disconnect?", "What did you notice?"], affirmation: "I control my relationship with technology." },
          { dayNumber: 4, title: "Movement Medicine", theme: "Physical", estimatedMinutes: 20, lessonContent: "Movement metabolizes stress hormones...", exerciseInstructions: "Complete the stress-release movement session.", reflectionPrompts: ["How does your body feel after movement?", "What type of movement helps most?"], affirmation: "My body knows how to release stress." },
          { dayNumber: 5, title: "Nature Reset", theme: "Environment", estimatedMinutes: 30, lessonContent: "Nature is a powerful stress antidote...", exerciseInstructions: "Spend 20+ minutes in nature.", reflectionPrompts: ["How did nature affect your stress?", "What did you notice?"], affirmation: "Nature restores my peace." },
          { dayNumber: 6, title: "Connection Day", theme: "Social", estimatedMinutes: 15, lessonContent: "Social connection buffers stress...", exerciseInstructions: "Have a meaningful conversation with someone you care about.", reflectionPrompts: ["How did connection affect your stress?", "Who supports you most?"], affirmation: "I am supported and connected." },
          { dayNumber: 7, title: "Integration & Plan", theme: "Completion", estimatedMinutes: 20, lessonContent: "You've completed your stress detox...", exerciseInstructions: "Create your ongoing stress management plan.", reflectionPrompts: ["How do you feel compared to day 1?", "What practices will you continue?"], affirmation: "I have the tools to manage stress." }
        ]
      }
    ]
  }
];

export const structuredProgramsRouter = router({
  // Get all available programs
  getAll: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      difficulty: z.string().optional(),
      featured: z.boolean().optional()
    }).optional())
    .query(async ({ input }) => {
      let programs = FLAGSHIP_PROGRAMS.filter(p => p.isActive);
      
      if (input?.category) {
        programs = programs.filter(p => p.category === input.category);
      }
      if (input?.difficulty) {
        programs = programs.filter(p => p.difficulty === input.difficulty);
      }
      if (input?.featured) {
        programs = programs.filter(p => p.isFeatured);
      }
      
      // Return without full day content for listing
      return programs.map(p => ({
        ...p,
        weeks: p.weeks.map(w => ({
          ...w,
          days: w.days.map(d => ({
            dayNumber: d.dayNumber,
            title: d.title,
            theme: d.theme,
            estimatedMinutes: d.estimatedMinutes
          }))
        }))
      }));
    }),

  // Get single program with full content
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const program = FLAGSHIP_PROGRAMS.find(p => p.slug === input.slug);
      
      if (!program) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Program not found'
        });
      }
      
      return program;
    }),

  // Get user's enrolled programs
  getMyEnrollments: protectedProcedure.query(async ({ ctx }) => {
    // In production, fetch from database
    // For now, return mock data
    return {
      active: [],
      completed: [],
      paused: []
    };
  }),

  // Enroll in a program
  enroll: protectedProcedure
    .input(z.object({
      programId: z.number(),
      reminderTime: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const program = FLAGSHIP_PROGRAMS.find(p => p.id === input.programId);
      
      if (!program) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Program not found'
        });
      }
      
      // In production, create enrollment in database
      return {
        success: true,
        enrollmentId: Date.now(),
        program: {
          id: program.id,
          title: program.title,
          durationDays: program.durationDays
        },
        message: `You're enrolled in ${program.title}! Day 1 starts now.`
      };
    }),

  // Get today's content for enrolled program
  getTodaysContent: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ ctx, input }) => {
      // In production, fetch from database based on enrollment progress
      // For demo, return day 1 of first program
      const program = FLAGSHIP_PROGRAMS[0];
      const day = program.weeks[0].days[0];
      
      return {
        program: {
          id: program.id,
          title: program.title,
          currentDay: 1,
          totalDays: program.durationDays
        },
        day: {
          ...day,
          weekNumber: 1,
          weekTheme: program.weeks[0].theme
        },
        progress: {
          percent: Math.round((1 / program.durationDays) * 100),
          daysCompleted: 0,
          currentStreak: 0
        }
      };
    }),

  // Complete a day
  completeDay: protectedProcedure
    .input(z.object({
      enrollmentId: z.number(),
      dayNumber: z.number(),
      reflectionResponses: z.record(z.string()).optional(),
      moodBefore: z.number().min(1).max(10).optional(),
      moodAfter: z.number().min(1).max(10).optional(),
      timeSpentMinutes: z.number().optional(),
      notes: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // In production, save completion to database
      
      const isLastDay = input.dayNumber === 42; // Example for 6-week program
      
      return {
        success: true,
        dayCompleted: input.dayNumber,
        nextDay: isLastDay ? null : input.dayNumber + 1,
        streak: 1,
        message: isLastDay 
          ? "🎉 Congratulations! You've completed the program!"
          : `Day ${input.dayNumber} complete! See you tomorrow for Day ${input.dayNumber + 1}.`,
        certificate: isLastDay ? {
          id: Date.now(),
          certificateNumber: `CERT-${Date.now()}`
        } : null
      };
    }),

  // Get program statistics
  getStats: protectedProcedure
    .input(z.object({ programId: z.number() }))
    .query(async ({ ctx, input }) => {
      const program = FLAGSHIP_PROGRAMS.find(p => p.id === input.programId);
      
      if (!program) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Program not found'
        });
      }
      
      return {
        totalEnrollments: program.totalEnrollments,
        completionRate: program.completionRate,
        averageRating: program.averageRating / 100,
        averageMoodImprovement: 2.3 // Example
      };
    }),

  // Pause enrollment
  pause: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return { success: true, message: "Program paused. You can resume anytime." };
    }),

  // Resume enrollment
  resume: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return { success: true, message: "Welcome back! Let's continue where you left off." };
    }),

  // Get certificate
  getCertificate: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ ctx, input }) => {
      // In production, fetch from database
      return null;
    })
});
