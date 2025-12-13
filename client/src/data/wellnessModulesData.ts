import {
  Heart, Brain, Activity, Apple, Sparkles, Users, DollarSign, Target,
  Flame, Moon, Zap, BookOpen, TrendingUp, Shield, Lightbulb, Clock,
  Home, Briefcase, MessageCircle, Award, Eye, Smile, Coffee, Wind,
  Droplet, Sun, Star, Leaf, Mountain, Waves, TreePine, Dumbbell,
  HeartPulse
} from "lucide-react";

export const wellnessModulesData: Record<string, any> = {
  // CORE MODULES (5)
  "emotional-wellness": {
    icon: Heart,
    title: "Emotional Wellness",
    description: "Master your emotions and build resilience through evidence-based techniques",
    category: "Core",
    color: "text-red-500",
    bgColor: "bg-red-50",
    longDescription: "Emotional wellness is the foundation of a fulfilling life. Learn to understand, express, and regulate your emotions effectively. Build resilience to handle life's challenges with grace and strength.",
    benefits: [
      "Develop emotional intelligence and self-awareness",
      "Build resilience to bounce back from setbacks",
      "Improve relationships through better emotional regulation",
      "Reduce anxiety and emotional overwhelm",
      "Cultivate inner peace and emotional balance"
    ],
    lessons: [
      { title: "Understanding Your Emotions", duration: "15 min", type: "video" },
      { title: "The Emotion Wheel Exercise", duration: "10 min", type: "exercise" },
      { title: "Building Emotional Resilience", duration: "20 min", type: "video" },
      { title: "Daily Emotional Check-in Practice", duration: "5 min", type: "practice" },
      { title: "Emotion Regulation Techniques", duration: "25 min", type: "video" }
    ],
    exercises: [
      "Emotion Journaling Template",
      "Resilience Building Worksheet",
      "Emotional Triggers Tracker",
      "Self-Compassion Practice Guide"
    ]
  },
  
  "mental-health": {
    icon: Brain,
    title: "Mental Health",
    description: "Clarity, focus, and peace of mind using cognitive behavioral strategies",
    category: "Core",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    longDescription: "Your mental health is your most valuable asset. Discover evidence-based strategies from cognitive behavioral therapy to achieve clarity, reduce anxiety, and cultivate lasting peace of mind.",
    benefits: [
      "Reduce anxiety and negative thought patterns",
      "Improve focus and mental clarity",
      "Develop healthy coping mechanisms",
      "Build cognitive resilience",
      "Enhance overall psychological well-being"
    ],
    lessons: [
      { title: "Understanding Your Mind", duration: "18 min", type: "video" },
      { title: "Cognitive Restructuring Basics", duration: "22 min", type: "video" },
      { title: "Anxiety Management Techniques", duration: "15 min", type: "exercise" },
      { title: "Thought Pattern Recognition", duration: "12 min", type: "practice" },
      { title: "Building Mental Resilience", duration: "20 min", type: "video" }
    ],
    exercises: [
      "Thought Record Worksheet",
      "Anxiety Reduction Toolkit",
      "Cognitive Distortions Guide",
      "Mental Health Self-Assessment"
    ]
  },

  "physical-fitness": {
    icon: Activity,
    title: "Physical Fitness",
    description: "Strength, energy, and vitality through personalized movement plans",
    category: "Core",
    color: "text-green-500",
    bgColor: "bg-green-50",
    longDescription: "Transform your body and energy levels through sustainable fitness practices. Whether you're a beginner or advanced, discover personalized movement strategies that fit your lifestyle.",
    benefits: [
      "Increase strength and endurance",
      "Boost daily energy levels",
      "Improve body composition",
      "Enhance mobility and flexibility",
      "Build sustainable fitness habits"
    ],
    lessons: [
      { title: "Fitness Fundamentals", duration: "16 min", type: "video" },
      { title: "Creating Your Workout Plan", duration: "20 min", type: "exercise" },
      { title: "Strength Training Basics", duration: "25 min", type: "video" },
      { title: "Cardio for Health", duration: "18 min", type: "video" },
      { title: "Recovery and Rest", duration: "12 min", type: "video" }
    ],
    exercises: [
      "Personalized Workout Template",
      "Progress Tracking Sheet",
      "Exercise Form Guide",
      "Mobility Routine Checklist"
    ]
  },

  "nutrition": {
    icon: Apple,
    title: "Nutrition",
    description: "Fuel your body for optimal performance with science-backed nutrition",
    category: "Core",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    longDescription: "Nutrition is medicine. Learn evidence-based nutritional strategies to fuel your body, optimize energy, and prevent disease. No fad diets—just sustainable, science-backed eating habits.",
    benefits: [
      "Understand macronutrients and micronutrients",
      "Create sustainable meal plans that work for your lifestyle",
      "Optimize energy levels through strategic nutrition",
      "Develop a healthy relationship with food",
      "Prevent chronic disease through dietary choices"
    ],
    lessons: [
      { title: "Nutrition Fundamentals", duration: "20 min", type: "video" },
      { title: "Building Your Plate", duration: "15 min", type: "exercise" },
      { title: "Meal Planning Mastery", duration: "18 min", type: "video" },
      { title: "Intuitive Eating Principles", duration: "16 min", type: "video" },
      { title: "Nutrition for Performance", duration: "22 min", type: "video" }
    ],
    exercises: [
      "Food Journal Template",
      "Meal Planning Worksheet",
      "Macronutrient Calculator",
      "Healthy Recipe Collection"
    ]
  },

  "spiritual-wellness": {
    icon: Sparkles,
    title: "Spiritual Wellness",
    description: "Purpose, meaning, and inner peace through mindful practices",
    category: "Core",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    longDescription: "Spiritual wellness transcends religion—it's about finding purpose, meaning, and connection. Explore practices that cultivate inner peace, gratitude, and a sense of belonging in the universe.",
    benefits: [
      "Discover your life's purpose and values",
      "Cultivate inner peace and contentment",
      "Develop a gratitude practice",
      "Connect with something greater than yourself",
      "Find meaning in daily experiences"
    ],
    lessons: [
      { title: "Exploring Your Values", duration: "17 min", type: "video" },
      { title: "Gratitude Practice Foundations", duration: "12 min", type: "exercise" },
      { title: "Meditation for Beginners", duration: "20 min", type: "practice" },
      { title: "Finding Your Purpose", duration: "25 min", type: "video" },
      { title: "Spiritual Rituals and Practices", duration: "15 min", type: "video" }
    ],
    exercises: [
      "Values Clarification Worksheet",
      "Gratitude Journal Template",
      "Purpose Discovery Guide",
      "Daily Spiritual Practice Planner"
    ]
  },

  // LIFESTYLE MODULES (12)
  "relationships": {
    icon: Users,
    title: "Relationships",
    description: "Build meaningful connections and healthy communication patterns",
    category: "Lifestyle",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    longDescription: "Relationships are the cornerstone of happiness. Learn to build deep, authentic connections through effective communication, boundary-setting, and emotional intelligence.",
    benefits: [
      "Improve communication skills in all relationships",
      "Set healthy boundaries without guilt",
      "Resolve conflicts constructively",
      "Build deeper emotional intimacy",
      "Attract and maintain healthy relationships"
    ],
    lessons: [
      { title: "Communication Fundamentals", duration: "19 min", type: "video" },
      { title: "Active Listening Practice", duration: "14 min", type: "exercise" },
      { title: "Healthy Boundaries 101", duration: "21 min", type: "video" },
      { title: "Conflict Resolution Strategies", duration: "18 min", type: "video" },
      { title: "Building Emotional Intimacy", duration: "16 min", type: "video" }
    ],
    exercises: [
      "Communication Style Assessment",
      "Boundary Setting Worksheet",
      "Conflict Resolution Template",
      "Relationship Values Clarifier"
    ]
  },

  "financial-wellness": {
    icon: DollarSign,
    title: "Financial Wellness",
    description: "Money mindset and financial freedom strategies",
    category: "Lifestyle",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    longDescription: "Financial stress affects every area of life. Transform your relationship with money, build wealth sustainably, and achieve financial freedom through proven strategies and mindset shifts.",
    benefits: [
      "Develop a healthy money mindset",
      "Create and stick to a realistic budget",
      "Build emergency savings and investments",
      "Eliminate debt strategically",
      "Plan for long-term financial security"
    ],
    lessons: [
      { title: "Money Mindset Transformation", duration: "20 min", type: "video" },
      { title: "Budgeting That Actually Works", duration: "22 min", type: "exercise" },
      { title: "Debt Elimination Strategies", duration: "18 min", type: "video" },
      { title: "Investing for Beginners", duration: "25 min", type: "video" },
      { title: "Building Passive Income", duration: "23 min", type: "video" }
    ],
    exercises: [
      "Money Mindset Assessment",
      "Budget Planning Template",
      "Debt Payoff Calculator",
      "Investment Goal Worksheet"
    ]
  },

  "goal-achievement": {
    icon: Target,
    title: "Goal Achievement",
    description: "Set and achieve your biggest goals with proven frameworks",
    category: "Lifestyle",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    longDescription: "Most goals fail due to poor planning and lack of systems. Learn science-backed goal-setting frameworks, accountability strategies, and execution systems that guarantee success.",
    benefits: [
      "Set SMART goals that inspire action",
      "Break down big goals into manageable steps",
      "Build accountability systems",
      "Overcome procrastination and resistance",
      "Celebrate wins and maintain momentum"
    ],
    lessons: [
      { title: "The Science of Goal Setting", duration: "17 min", type: "video" },
      { title: "SMART Goals Workshop", duration: "15 min", type: "exercise" },
      { title: "Creating Your Action Plan", duration: "20 min", type: "video" },
      { title: "Overcoming Obstacles", duration: "18 min", type: "video" },
      { title: "Accountability Systems", duration: "14 min", type: "video" }
    ],
    exercises: [
      "Goal Setting Worksheet",
      "90-Day Action Plan Template",
      "Obstacle Anticipation Guide",
      "Weekly Progress Tracker"
    ]
  },

  "habit-formation": {
    icon: Flame,
    title: "Habit Formation",
    description: "Build lasting positive habits using behavioral science",
    category: "Lifestyle",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    longDescription: "Habits shape your destiny. Master the science of habit formation to build positive routines that stick and eliminate destructive patterns that hold you back.",
    benefits: [
      "Understand the psychology of habit formation",
      "Build keystone habits that transform your life",
      "Break bad habits permanently",
      "Create habit stacking systems",
      "Design your environment for success"
    ],
    lessons: [
      { title: "The Habit Loop Explained", duration: "16 min", type: "video" },
      { title: "Identifying Your Keystone Habits", duration: "12 min", type: "exercise" },
      { title: "Habit Stacking Mastery", duration: "18 min", type: "video" },
      { title: "Breaking Bad Habits", duration: "20 min", type: "video" },
      { title: "Environment Design for Habits", duration: "15 min", type: "video" }
    ],
    exercises: [
      "Habit Tracker Template",
      "Habit Stacking Worksheet",
      "Bad Habit Elimination Plan",
      "Environment Audit Checklist"
    ]
  },

  "sleep-optimization": {
    icon: Moon,
    title: "Sleep Optimization",
    description: "Restorative sleep for peak performance and recovery",
    category: "Lifestyle",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    longDescription: "Sleep is the foundation of health, performance, and longevity. Optimize your sleep quality and quantity through science-backed strategies for better rest and recovery.",
    benefits: [
      "Fall asleep faster and stay asleep longer",
      "Wake up feeling refreshed and energized",
      "Improve cognitive function and memory",
      "Enhance athletic recovery and performance",
      "Reduce stress and improve mood"
    ],
    lessons: [
      { title: "The Science of Sleep", duration: "19 min", type: "video" },
      { title: "Creating Your Sleep Sanctuary", duration: "14 min", type: "exercise" },
      { title: "Sleep Hygiene Essentials", duration: "17 min", type: "video" },
      { title: "Overcoming Insomnia", duration: "21 min", type: "video" },
      { title: "Power Napping Strategies", duration: "10 min", type: "video" }
    ],
    exercises: [
      "Sleep Quality Assessment",
      "Bedroom Environment Checklist",
      "Sleep Routine Template",
      "Insomnia Troubleshooting Guide"
    ]
  },

  "stress-management": {
    icon: Zap,
    title: "Stress Management",
    description: "Reduce stress and increase calm through proven techniques",
    category: "Lifestyle",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    longDescription: "Chronic stress destroys health and happiness. Learn evidence-based stress reduction techniques including breathwork, mindfulness, and cognitive reframing to find calm amidst chaos.",
    benefits: [
      "Reduce cortisol and stress hormones",
      "Develop quick stress-relief techniques",
      "Build long-term stress resilience",
      "Improve stress-related health markers",
      "Cultivate inner calm and peace"
    ],
    lessons: [
      { title: "Understanding Stress Response", duration: "18 min", type: "video" },
      { title: "Box Breathing Technique", duration: "8 min", type: "practice" },
      { title: "Cognitive Stress Reframing", duration: "20 min", type: "video" },
      { title: "Progressive Muscle Relaxation", duration: "15 min", type: "practice" },
      { title: "Building Stress Resilience", duration: "22 min", type: "video" }
    ],
    exercises: [
      "Stress Trigger Tracker",
      "Breathwork Practice Guide",
      "Relaxation Technique Library",
      "Stress Management Action Plan"
    ]
  },

  "journaling": {
    icon: BookOpen,
    title: "Journaling",
    description: "Self-reflection and personal growth through structured writing",
    category: "Lifestyle",
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    longDescription: "Journaling is one of the most powerful tools for self-discovery and growth. Learn structured journaling techniques to process emotions, clarify thinking, and track progress.",
    benefits: [
      "Process emotions and reduce anxiety",
      "Gain clarity on goals and values",
      "Track personal growth over time",
      "Improve self-awareness and insight",
      "Enhance creativity and problem-solving"
    ],
    lessons: [
      { title: "Why Journaling Works", duration: "14 min", type: "video" },
      { title: "Morning Pages Practice", duration: "10 min", type: "exercise" },
      { title: "Gratitude Journaling", duration: "12 min", type: "practice" },
      { title: "Reflective Journaling Prompts", duration: "16 min", type: "video" },
      { title: "Building a Journaling Habit", duration: "15 min", type: "video" }
    ],
    exercises: [
      "Journaling Prompt Library",
      "Morning Pages Template",
      "Gratitude Journal Format",
      "Weekly Reflection Questions"
    ]
  },

  "work-life-balance": {
    icon: Home,
    title: "Work-Life Balance",
    description: "Harmony between work and personal life for sustainable success",
    category: "Lifestyle",
    color: "text-teal-500",
    bgColor: "bg-teal-50",
    longDescription: "Burnout is epidemic. Learn to set boundaries, prioritize what matters, and create sustainable success without sacrificing your health, relationships, or happiness.",
    benefits: [
      "Set clear work-life boundaries",
      "Prevent and recover from burnout",
      "Prioritize what truly matters",
      "Increase productivity without overwork",
      "Enjoy life while building your career"
    ],
    lessons: [
      { title: "The Burnout Epidemic", duration: "17 min", type: "video" },
      { title: "Setting Healthy Boundaries", duration: "19 min", type: "exercise" },
      { title: "Time Blocking for Balance", duration: "16 min", type: "video" },
      { title: "Saying No Without Guilt", duration: "14 min", type: "video" },
      { title: "Sustainable Success Strategies", duration: "21 min", type: "video" }
    ],
    exercises: [
      "Boundary Setting Worksheet",
      "Time Audit Template",
      "Priority Matrix Guide",
      "Weekly Balance Scorecard"
    ]
  },

  "energy-management": {
    icon: Coffee,
    title: "Energy Management",
    description: "Optimize your daily energy levels for peak productivity",
    category: "Lifestyle",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    longDescription: "Time management is outdated—energy management is the key to peak performance. Learn to align your tasks with your natural energy rhythms for maximum productivity and minimal burnout.",
    benefits: [
      "Identify your peak performance hours",
      "Match tasks to energy levels",
      "Eliminate energy drains",
      "Boost sustained energy naturally",
      "Prevent afternoon crashes"
    ],
    lessons: [
      { title: "Understanding Your Energy Rhythms", duration: "18 min", type: "video" },
      { title: "Energy Audit Exercise", duration: "15 min", type: "exercise" },
      { title: "Ultradian Rhythm Optimization", duration: "20 min", type: "video" },
      { title: "Natural Energy Boosters", duration: "14 min", type: "video" },
      { title: "Recovery and Renewal", duration: "16 min", type: "video" }
    ],
    exercises: [
      "Energy Audit Worksheet",
      "Peak Performance Schedule",
      "Energy Drain Eliminator",
      "Daily Energy Tracker"
    ]
  },

  "circadian-rhythm": {
    icon: Sun,
    title: "Circadian Rhythm",
    description: "Align with your natural rhythms for better health",
    category: "Lifestyle",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    longDescription: "Your body has an internal clock that regulates sleep, energy, hormones, and metabolism. Learn to align your lifestyle with your circadian rhythm for optimal health and performance.",
    benefits: [
      "Optimize sleep-wake cycles",
      "Improve hormone balance",
      "Enhance metabolic health",
      "Boost energy and alertness",
      "Reduce jet lag and shift work issues"
    ],
    lessons: [
      { title: "What is Circadian Rhythm?", duration: "16 min", type: "video" },
      { title: "Light Exposure Optimization", duration: "14 min", type: "exercise" },
      { title: "Meal Timing for Health", duration: "18 min", type: "video" },
      { title: "Exercise Timing Strategies", duration: "15 min", type: "video" },
      { title: "Circadian Rhythm Reset", duration: "20 min", type: "video" }
    ],
    exercises: [
      "Circadian Assessment Quiz",
      "Light Exposure Tracker",
      "Meal Timing Planner",
      "Rhythm Reset Protocol"
    ]
  },

  "hydration-detox": {
    icon: Droplet,
    title: "Hydration & Detox",
    description: "Cleanse and nourish your body from the inside out",
    category: "Lifestyle",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    longDescription: "Proper hydration and natural detoxification are essential for optimal health. Learn evidence-based strategies to support your body's natural cleansing processes and stay optimally hydrated.",
    benefits: [
      "Optimize hydration for performance",
      "Support natural detoxification pathways",
      "Improve skin health and appearance",
      "Boost energy and mental clarity",
      "Enhance digestive health"
    ],
    lessons: [
      { title: "Hydration Science", duration: "15 min", type: "video" },
      { title: "Calculating Your Water Needs", duration: "10 min", type: "exercise" },
      { title: "Natural Detox Strategies", duration: "19 min", type: "video" },
      { title: "Electrolyte Balance", duration: "14 min", type: "video" },
      { title: "Detox Myths vs Facts", duration: "17 min", type: "video" }
    ],
    exercises: [
      "Hydration Calculator",
      "Daily Water Tracker",
      "Detox Food Guide",
      "Hydration Habit Builder"
    ]
  },

  "environmental-wellness": {
    icon: Leaf,
    title: "Environmental Wellness",
    description: "Create a healthy living space that supports your wellbeing",
    category: "Lifestyle",
    color: "text-green-500",
    bgColor: "bg-green-50",
    longDescription: "Your environment shapes your health, mood, and productivity. Learn to design living and working spaces that promote wellbeing, reduce toxins, and inspire your best self.",
    benefits: [
      "Reduce environmental toxins",
      "Optimize air and water quality",
      "Design spaces for productivity",
      "Create calming environments",
      "Support sustainable living"
    ],
    lessons: [
      { title: "Environmental Health Basics", duration: "17 min", type: "video" },
      { title: "Home Toxin Audit", duration: "20 min", type: "exercise" },
      { title: "Air Quality Optimization", duration: "15 min", type: "video" },
      { title: "Biophilic Design Principles", duration: "18 min", type: "video" },
      { title: "Sustainable Living Practices", duration: "16 min", type: "video" }
    ],
    exercises: [
      "Environmental Audit Checklist",
      "Toxin Swap Guide",
      "Space Design Worksheet",
      "Sustainability Action Plan"
    ]
  },

  // GROWTH MODULES (8)
  "career-development": {
    icon: Briefcase,
    title: "Career Development",
    description: "Advance your professional life with strategic planning",
    category: "Growth",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    longDescription: "Your career is a journey, not a destination. Learn strategic career planning, personal branding, networking, and advancement strategies to build a fulfilling professional life.",
    benefits: [
      "Clarify your career vision and goals",
      "Develop a personal brand that stands out",
      "Build a powerful professional network",
      "Navigate career transitions successfully",
      "Negotiate salary and promotions confidently"
    ],
    lessons: [
      { title: "Career Vision Mapping", duration: "20 min", type: "video" },
      { title: "Personal Branding Workshop", duration: "22 min", type: "exercise" },
      { title: "Strategic Networking", duration: "18 min", type: "video" },
      { title: "Career Transition Strategies", duration: "21 min", type: "video" },
      { title: "Negotiation Mastery", duration: "24 min", type: "video" }
    ],
    exercises: [
      "Career Vision Worksheet",
      "Personal Brand Canvas",
      "Networking Action Plan",
      "Negotiation Prep Template"
    ]
  },

  "communication-skills": {
    icon: MessageCircle,
    title: "Communication Skills",
    description: "Express yourself clearly and confidently in any situation",
    category: "Growth",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    longDescription: "Communication is the #1 skill for success in life and work. Master verbal, non-verbal, and written communication to influence, persuade, and connect authentically.",
    benefits: [
      "Speak with confidence and clarity",
      "Read and use body language effectively",
      "Write persuasively and professionally",
      "Handle difficult conversations gracefully",
      "Build rapport and influence others"
    ],
    lessons: [
      { title: "Communication Fundamentals", duration: "19 min", type: "video" },
      { title: "Public Speaking Confidence", duration: "23 min", type: "exercise" },
      { title: "Non-Verbal Communication", duration: "16 min", type: "video" },
      { title: "Difficult Conversations", duration: "21 min", type: "video" },
      { title: "Persuasion and Influence", duration: "20 min", type: "video" }
    ],
    exercises: [
      "Communication Style Assessment",
      "Public Speaking Practice Guide",
      "Body Language Decoder",
      "Difficult Conversation Script"
    ]
  },

  "leadership": {
    icon: Award,
    title: "Leadership",
    description: "Develop your leadership potential and influence",
    category: "Growth",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    longDescription: "Leadership isn't a title—it's a skill. Whether you manage a team or lead yourself, develop the mindsets, behaviors, and strategies of exceptional leaders.",
    benefits: [
      "Develop authentic leadership presence",
      "Inspire and motivate others",
      "Make better decisions under pressure",
      "Build high-performing teams",
      "Lead with emotional intelligence"
    ],
    lessons: [
      { title: "Leadership Foundations", duration: "21 min", type: "video" },
      { title: "Your Leadership Style", duration: "17 min", type: "exercise" },
      { title: "Emotional Intelligence for Leaders", duration: "23 min", type: "video" },
      { title: "Decision-Making Frameworks", duration: "19 min", type: "video" },
      { title: "Building Team Culture", duration: "22 min", type: "video" }
    ],
    exercises: [
      "Leadership Style Assessment",
      "Vision Statement Template",
      "Decision-Making Matrix",
      "Team Culture Builder"
    ]
  },

  "creativity": {
    icon: Lightbulb,
    title: "Creativity",
    description: "Unlock your creative potential and innovative thinking",
    category: "Growth",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    longDescription: "Creativity isn't just for artists—it's essential for problem-solving, innovation, and fulfillment. Learn to unlock your creative potential and think outside the box.",
    benefits: [
      "Overcome creative blocks",
      "Generate innovative ideas on demand",
      "Develop creative confidence",
      "Apply creativity to problem-solving",
      "Build a sustainable creative practice"
    ],
    lessons: [
      { title: "The Creative Mindset", duration: "18 min", type: "video" },
      { title: "Brainstorming Techniques", duration: "15 min", type: "exercise" },
      { title: "Overcoming Creative Blocks", duration: "20 min", type: "video" },
      { title: "Design Thinking Process", duration: "24 min", type: "video" },
      { title: "Creative Habit Building", duration: "16 min", type: "video" }
    ],
    exercises: [
      "Creativity Assessment",
      "Brainstorming Toolkit",
      "Creative Block Buster",
      "Daily Creative Practice"
    ]
  },

  "time-management": {
    icon: Clock,
    title: "Time Management",
    description: "Master your schedule and priorities for maximum impact",
    category: "Growth",
    color: "text-red-600",
    bgColor: "bg-red-50",
    longDescription: "Time is your most valuable resource. Learn proven time management systems, prioritization frameworks, and productivity strategies to achieve more with less stress.",
    benefits: [
      "Prioritize what truly matters",
      "Eliminate time-wasting activities",
      "Increase productivity without burnout",
      "Master calendar and task management",
      "Create time for what you love"
    ],
    lessons: [
      { title: "Time Management Fundamentals", duration: "19 min", type: "video" },
      { title: "The Eisenhower Matrix", duration: "14 min", type: "exercise" },
      { title: "Time Blocking Mastery", duration: "21 min", type: "video" },
      { title: "Defeating Procrastination", duration: "18 min", type: "video" },
      { title: "Productivity Systems", duration: "23 min", type: "video" }
    ],
    exercises: [
      "Time Audit Worksheet",
      "Priority Matrix Template",
      "Time Blocking Schedule",
      "Procrastination Eliminator"
    ]
  },

  "personal-development": {
    icon: TrendingUp,
    title: "Personal Development",
    description: "Continuous self-improvement and growth mindset",
    category: "Growth",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    longDescription: "Personal development is a lifelong journey. Cultivate a growth mindset, embrace continuous learning, and become the best version of yourself through deliberate practice.",
    benefits: [
      "Develop a growth mindset",
      "Create a personal development plan",
      "Build self-awareness and insight",
      "Embrace lifelong learning",
      "Track and celebrate growth"
    ],
    lessons: [
      { title: "Growth vs Fixed Mindset", duration: "17 min", type: "video" },
      { title: "Self-Assessment Exercise", duration: "20 min", type: "exercise" },
      { title: "Creating Your Development Plan", duration: "22 min", type: "video" },
      { title: "Learning How to Learn", duration: "19 min", type: "video" },
      { title: "Measuring Progress", duration: "15 min", type: "video" }
    ],
    exercises: [
      "Self-Assessment Tool",
      "Development Plan Template",
      "Learning Strategy Guide",
      "Progress Tracking System"
    ]
  },

  "adventure-growth": {
    icon: Mountain,
    title: "Adventure & Growth",
    description: "Step outside your comfort zone and embrace challenges",
    category: "Growth",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    longDescription: "Growth happens outside your comfort zone. Learn to embrace challenges, take calculated risks, and use adventure as a catalyst for personal transformation.",
    benefits: [
      "Build courage and confidence",
      "Overcome fear and self-doubt",
      "Develop resilience through challenges",
      "Expand your comfort zone",
      "Create memorable life experiences"
    ],
    lessons: [
      { title: "The Power of Discomfort", duration: "18 min", type: "video" },
      { title: "Fear Setting Exercise", duration: "16 min", type: "exercise" },
      { title: "Calculated Risk-Taking", duration: "20 min", type: "video" },
      { title: "Building Courage", duration: "17 min", type: "video" },
      { title: "Adventure Planning", duration: "15 min", type: "video" }
    ],
    exercises: [
      "Fear Setting Worksheet",
      "Comfort Zone Expander",
      "Risk Assessment Tool",
      "Adventure Bucket List"
    ]
  },

  "purpose-meaning": {
    icon: Star,
    title: "Purpose & Meaning",
    description: "Discover your life's purpose and live with intention",
    category: "Growth",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    longDescription: "Living with purpose creates fulfillment and direction. Discover your unique calling, align your life with your values, and create meaningful impact in the world.",
    benefits: [
      "Discover your life's purpose",
      "Align actions with values",
      "Create meaningful impact",
      "Find direction and clarity",
      "Live with intention and fulfillment"
    ],
    lessons: [
      { title: "What is Purpose?", duration: "19 min", type: "video" },
      { title: "Purpose Discovery Workshop", duration: "25 min", type: "exercise" },
      { title: "Values Alignment", duration: "18 min", type: "video" },
      { title: "Creating Your Mission Statement", duration: "20 min", type: "exercise" },
      { title: "Living with Intention", duration: "17 min", type: "video" }
    ],
    exercises: [
      "Purpose Discovery Guide",
      "Values Clarification Tool",
      "Mission Statement Builder",
      "Intentional Living Planner"
    ]
  },

  // ADVANCED MODULES (8)
  "resilience-building": {
    icon: Shield,
    title: "Resilience Building",
    description: "Bounce back stronger from setbacks and adversity",
    category: "Advanced",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    longDescription: "Resilience is the ability to bounce back from adversity stronger than before. Develop mental toughness, emotional regulation, and adaptive coping strategies for life's challenges.",
    benefits: [
      "Develop mental toughness",
      "Recover faster from setbacks",
      "Build stress tolerance",
      "Maintain optimism during challenges",
      "Grow through adversity"
    ],
    lessons: [
      { title: "The Science of Resilience", duration: "20 min", type: "video" },
      { title: "Adversity Inventory", duration: "18 min", type: "exercise" },
      { title: "Cognitive Reframing", duration: "22 min", type: "video" },
      { title: "Building Mental Toughness", duration: "21 min", type: "video" },
      { title: "Post-Traumatic Growth", duration: "19 min", type: "video" }
    ],
    exercises: [
      "Resilience Assessment",
      "Adversity Response Plan",
      "Reframing Worksheet",
      "Growth Mindset Journal"
    ]
  },

  "mindfulness": {
    icon: Eye,
    title: "Mindfulness",
    description: "Present moment awareness and meditation practices",
    category: "Advanced",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    longDescription: "Mindfulness is the practice of present-moment awareness without judgment. Learn meditation, mindful living, and contemplative practices to reduce stress and enhance wellbeing.",
    benefits: [
      "Reduce anxiety and rumination",
      "Improve focus and concentration",
      "Enhance emotional regulation",
      "Increase self-awareness",
      "Cultivate inner peace"
    ],
    lessons: [
      { title: "What is Mindfulness?", duration: "16 min", type: "video" },
      { title: "Basic Meditation Practice", duration: "20 min", type: "practice" },
      { title: "Mindful Breathing", duration: "12 min", type: "practice" },
      { title: "Body Scan Meditation", duration: "25 min", type: "practice" },
      { title: "Mindfulness in Daily Life", duration: "18 min", type: "video" }
    ],
    exercises: [
      "Meditation Timer Guide",
      "Mindfulness Tracker",
      "Body Scan Script",
      "Daily Mindfulness Practices"
    ]
  },

  "positive-psychology": {
    icon: Smile,
    title: "Positive Psychology",
    description: "Cultivate happiness and well-being scientifically",
    category: "Advanced",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    longDescription: "Positive psychology is the scientific study of human flourishing. Learn evidence-based practices to increase happiness, build strengths, and create lasting wellbeing.",
    benefits: [
      "Increase baseline happiness",
      "Identify and use character strengths",
      "Build optimism and hope",
      "Cultivate positive emotions",
      "Create lasting wellbeing"
    ],
    lessons: [
      { title: "The Science of Happiness", duration: "21 min", type: "video" },
      { title: "Character Strengths Assessment", duration: "15 min", type: "exercise" },
      { title: "Three Good Things Practice", duration: "10 min", type: "practice" },
      { title: "Savoring Techniques", duration: "17 min", type: "video" },
      { title: "Building Optimism", duration: "19 min", type: "video" }
    ],
    exercises: [
      "VIA Character Strengths Survey",
      "Gratitude Journal Template",
      "Savoring Worksheet",
      "Optimism Builder"
    ]
  },

  "breathwork": {
    icon: Wind,
    title: "Breathwork",
    description: "Harness the power of your breath for transformation",
    category: "Advanced",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    longDescription: "Your breath is a powerful tool for regulating your nervous system, emotions, and energy. Learn advanced breathwork techniques for stress relief, performance, and transformation.",
    benefits: [
      "Regulate nervous system on demand",
      "Reduce stress and anxiety instantly",
      "Increase energy and focus",
      "Process emotions and trauma",
      "Enhance athletic performance"
    ],
    lessons: [
      { title: "The Science of Breathwork", duration: "18 min", type: "video" },
      { title: "Box Breathing Technique", duration: "10 min", type: "practice" },
      { title: "Wim Hof Method", duration: "22 min", type: "video" },
      { title: "Alternate Nostril Breathing", duration: "12 min", type: "practice" },
      { title: "Transformational Breathwork", duration: "30 min", type: "practice" }
    ],
    exercises: [
      "Breathwork Practice Library",
      "Breathing Pattern Tracker",
      "Stress Relief Protocol",
      "Performance Breathing Guide"
    ]
  },

  "emotional-intelligence": {
    icon: Waves,
    title: "Emotional Intelligence",
    description: "Understand and manage emotions effectively",
    category: "Advanced",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    longDescription: "Emotional intelligence (EQ) is more important than IQ for success and happiness. Develop self-awareness, empathy, and social skills to navigate life's complexities with grace.",
    benefits: [
      "Increase self-awareness",
      "Improve emotional regulation",
      "Develop empathy and compassion",
      "Enhance social skills",
      "Build stronger relationships"
    ],
    lessons: [
      { title: "The Four Components of EQ", duration: "19 min", type: "video" },
      { title: "Self-Awareness Assessment", duration: "17 min", type: "exercise" },
      { title: "Emotion Regulation Strategies", duration: "21 min", type: "video" },
      { title: "Developing Empathy", duration: "18 min", type: "video" },
      { title: "Social Skills Mastery", duration: "20 min", type: "video" }
    ],
    exercises: [
      "EQ Assessment Tool",
      "Emotion Regulation Toolkit",
      "Empathy Building Exercises",
      "Social Skills Practice Guide"
    ]
  },

  "nature-connection": {
    icon: TreePine,
    title: "Nature Connection",
    description: "Reconnect with the natural world for healing",
    category: "Advanced",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    longDescription: "Nature connection is essential for mental and physical health. Learn forest bathing, earthing, and nature-based practices to reduce stress and restore vitality.",
    benefits: [
      "Reduce stress and cortisol levels",
      "Boost immune system function",
      "Improve mood and mental health",
      "Enhance creativity and focus",
      "Deepen environmental awareness"
    ],
    lessons: [
      { title: "The Healing Power of Nature", duration: "17 min", type: "video" },
      { title: "Forest Bathing Practice", duration: "25 min", type: "practice" },
      { title: "Earthing and Grounding", duration: "15 min", type: "video" },
      { title: "Nature Meditation", duration: "20 min", type: "practice" },
      { title: "Outdoor Movement Practices", duration: "18 min", type: "video" }
    ],
    exercises: [
      "Nature Connection Tracker",
      "Forest Bathing Guide",
      "Earthing Protocol",
      "Outdoor Practice Ideas"
    ]
  },

  "strength-training": {
    icon: Dumbbell,
    title: "Strength Training",
    description: "Build physical and mental strength systematically",
    category: "Advanced",
    color: "text-red-600",
    bgColor: "bg-red-50",
    longDescription: "Strength training builds muscle, bone density, metabolism, and confidence. Learn progressive overload, proper form, and programming to build strength safely and effectively.",
    benefits: [
      "Increase muscle mass and strength",
      "Boost metabolism and fat loss",
      "Improve bone density",
      "Enhance functional fitness",
      "Build confidence and discipline"
    ],
    lessons: [
      { title: "Strength Training Fundamentals", duration: "22 min", type: "video" },
      { title: "Progressive Overload Principles", duration: "18 min", type: "video" },
      { title: "Exercise Form Mastery", duration: "25 min", type: "video" },
      { title: "Program Design", duration: "20 min", type: "exercise" },
      { title: "Recovery and Adaptation", duration: "16 min", type: "video" }
    ],
    exercises: [
      "Strength Assessment Test",
      "Program Design Template",
      "Exercise Form Checklist",
      "Progress Tracking Log"
    ]
  },

  "cardiovascular-health": {
    icon: HeartPulse,
    title: "Cardiovascular Health",
    description: "Optimize heart health and endurance for longevity",
    category: "Advanced",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    longDescription: "Cardiovascular health is the foundation of longevity. Learn to optimize heart health, build endurance, and prevent disease through strategic cardio training and lifestyle practices.",
    benefits: [
      "Strengthen heart and cardiovascular system",
      "Improve endurance and stamina",
      "Reduce risk of heart disease",
      "Enhance recovery and resilience",
      "Increase lifespan and healthspan"
    ],
    lessons: [
      { title: "Cardiovascular Health Basics", duration: "19 min", type: "video" },
      { title: "Heart Rate Zone Training", duration: "21 min", type: "video" },
      { title: "HIIT vs Steady State", duration: "17 min", type: "video" },
      { title: "Building Endurance", duration: "20 min", type: "video" },
      { title: "Heart Health Lifestyle", duration: "18 min", type: "video" }
    ],
    exercises: [
      "Heart Health Assessment",
      "Heart Rate Zone Calculator",
      "Cardio Program Template",
      "Lifestyle Optimization Checklist"
    ]
  },
};
