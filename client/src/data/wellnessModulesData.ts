// Wellness Modules Data
// This file contains all the wellness module content including lessons, videos, and assessments

const R2_BASE_URL = "https://pub-bcca76051b654756be8514e67a819c51.r2.dev";

export const wellnessModules = [
  {
    id: "nutrition",
    title: "Nutrition & Healthy Eating",
    description: "Learn evidence-based nutrition principles to fuel your body optimally and build sustainable healthy eating habits.",
    icon: "🥗",
    color: "from-green-500 to-emerald-600",
    lessons: [
      {
        id: 1,
        title: "Nutrition Fundamentals",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/NutritionLesson1(1).mp4`,
        description: "Master the foundational principles of nutrition, including macronutrients, micronutrients, and their roles in optimal health.",
        keyPoints: [
          "Understanding macronutrients: proteins, carbohydrates, and fats",
          "The role of micronutrients in bodily functions",
          "How to read and interpret nutrition labels",
          "Building a balanced plate for optimal nutrition"
        ]
      },
      {
        id: 2,
        title: "Meal Planning Mastery",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/Nutrition-Lesson2.mp4`,
        description: "Develop practical meal planning skills to save time, reduce stress, and ensure consistent healthy eating.",
        keyPoints: [
          "Creating weekly meal plans that fit your lifestyle",
          "Batch cooking and meal prep strategies",
          "Shopping lists and grocery store navigation",
          "Budget-friendly healthy eating tips"
        ]
      },
      {
        id: 3,
        title: "Intuitive Eating Principles",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/Nutrition-Lesson3.mp4`,
        description: "Learn to honor your body's hunger and fullness cues while building a healthy relationship with food.",
        keyPoints: [
          "Recognizing true hunger vs. emotional eating",
          "Honoring fullness and satisfaction",
          "Rejecting diet culture and food rules",
          "Making peace with all foods"
        ]
      },
      {
        id: 4,
        title: "Nutrition for Performance",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/Nutrition-Lesson4.mp4`,
        description: "Optimize your nutrition to enhance physical performance, recovery, and overall energy levels.",
        keyPoints: [
          "Pre-workout and post-workout nutrition",
          "Hydration strategies for performance",
          "Timing nutrients for optimal results",
          "Supplements: what works and what doesn't"
        ]
      },
      {
        id: 5,
        title: "Supplements and Superfoods",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/Nutrition-Lesson5.mp4`,
        description: "Navigate the world of supplements and superfoods with evidence-based guidance on what's worth your investment.",
        keyPoints: [
          "Essential vs. optional supplements",
          "Understanding supplement quality and safety",
          "Superfoods: separating hype from science",
          "Building a personalized supplement protocol"
        ]
      }
    ]
  },
  {
    id: "physical-fitness",
    title: "Physical Fitness",
    description: "Build strength, endurance, and mobility through evidence-based exercise programming tailored to your goals.",
    icon: "💪",
    color: "from-blue-500 to-cyan-600",
    lessons: [
      {
        id: 1,
        title: "Fitness Fundamentals",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/PhysicalFitness-Lesson1.mp4`,
        description: "Build a strong foundation in fitness principles that will serve you for life, regardless of your current fitness level.",
        keyPoints: [
          "Understanding the components of fitness",
          "Setting realistic and achievable fitness goals",
          "The importance of progressive overload",
          "How to prevent common exercise injuries"
        ]
      },
      {
        id: 2,
        title: "Strength Training Basics",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/PhysicalFitness-Lesson2.mp4`,
        description: "Learn proper strength training techniques to build muscle, increase metabolism, and improve functional fitness.",
        keyPoints: [
          "Fundamental movement patterns and exercises",
          "Proper form and technique for safety",
          "Designing an effective strength training program",
          "Progressive overload strategies for continuous gains"
        ]
      },
      {
        id: 3,
        title: "Cardio for Health",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/PhysicalFitness-Lesson3.mp4`,
        description: "Discover how to use cardiovascular exercise to improve heart health, endurance, and overall fitness.",
        keyPoints: [
          "Types of cardio: LISS, HIIT, and steady-state",
          "Heart rate zones and training intensity",
          "Balancing cardio with strength training",
          "Choosing cardio activities you'll actually enjoy"
        ]
      },
      {
        id: 4,
        title: "Recovery and Rest",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/PhysicalFitness-Lesson4.mp4`,
        description: "Master the often-overlooked aspects of fitness: recovery, rest, and regeneration for optimal results.",
        keyPoints: [
          "The science of muscle recovery and adaptation",
          "Active recovery vs. complete rest",
          "Sleep's critical role in fitness progress",
          "Recognizing and preventing overtraining"
        ]
      },
      {
        id: 5,
        title: "Mobility and Flexibility",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/PhysicalFitness-Lesson5.mp4`,
        description: "Improve your range of motion, reduce injury risk, and enhance performance through targeted mobility work.",
        keyPoints: [
          "Difference between mobility and flexibility",
          "Essential mobility exercises for daily life",
          "Stretching protocols that actually work",
          "Incorporating mobility into your routine"
        ]
      }
    ]
  },
  {
    id: "emotional-wellness",
    title: "Emotional Wellness",
    description: "Develop emotional intelligence and resilience to navigate life's challenges with grace and authenticity.",
    icon: "❤️",
    color: "from-pink-500 to-rose-600",
    lessons: [
      {
        id: 1,
        title: "Understanding Your Emotions",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/EmotionalWellness-Lesson1.mp4`,
        description: "Learn the fundamental nature of emotions, their purpose in human experience, and how to identify and name your emotional states accurately.",
        keyPoints: [
          "The science of emotions and their biological purpose",
          "Developing emotional vocabulary and awareness",
          "Distinguishing between primary and secondary emotions",
          "The connection between thoughts, emotions, and behaviors"
        ]
      },
      {
        id: 2,
        title: "Building Emotional Resilience",
        duration: "15 min",
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/36ad1523-eb44-4674-853f-cacd8b4d3579/transfers/rendered_video.mp4",
        description: "Discover evidence-based strategies for bouncing back from emotional setbacks and building long-term emotional strength.",
        keyPoints: [
          "Understanding resilience as a learnable skill",
          "Cognitive reframing techniques",
          "Building a support network",
          "Post-traumatic growth and finding meaning"
        ]
      },
      {
        id: 3,
        title: "Emotional Regulation Techniques",
        duration: "15 min",
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/09d303d0-848a-4e8e-a67c-b15ae968a1f8/transfers/rendered_video.mp4",
        description: "Master evidence-based techniques for managing intense emotions and returning to emotional balance.",
        keyPoints: [
          "The window of tolerance concept",
          "Grounding and centering techniques",
          "Breathing exercises for emotional regulation",
          "When and how to seek professional support"
        ]
      }
    ]
  },
  {
    id: "spiritual-wellness",
    title: "Spiritual Wellness",
    description: "Explore meaning, purpose, and connection to cultivate a deeper sense of fulfillment and inner peace.",
    icon: "🕉️",
    color: "from-purple-500 to-indigo-600",
    lessons: [
      {
        id: 1,
        title: "Finding Your Purpose",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/SpiritualWellness-Lesson1.mp4`,
        description: "Discover your unique purpose and learn how to align your daily life with your deepest values and aspirations.",
        keyPoints: [
          "Exploring your core values and beliefs",
          "Identifying your unique gifts and talents",
          "Creating a personal mission statement",
          "Aligning actions with purpose"
        ]
      },
      {
        id: 2,
        title: "Mindfulness and Presence",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/SpiritualWellness-Lesson2.mp4`,
        description: "Develop the practice of mindfulness to reduce stress, increase awareness, and find peace in the present moment.",
        keyPoints: [
          "Introduction to mindfulness meditation",
          "Bringing mindfulness to daily activities",
          "The neuroscience of mindfulness",
          "Overcoming common meditation obstacles"
        ]
      },
      {
        id: 3,
        title: "Gratitude and Appreciation",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/SpiritualWellness-Lesson3.mp4`,
        description: "Cultivate a gratitude practice that transforms your perspective and enhances overall well-being.",
        keyPoints: [
          "The science of gratitude and its benefits",
          "Gratitude journaling techniques",
          "Expressing appreciation to others",
          "Finding gratitude in difficult times"
        ]
      },
      {
        id: 4,
        title: "Connection and Belonging",
        duration: "15 min",
        videoUrl: `${R2_BASE_URL}/SpiritualWellness-Lesson4.mp4`,
        description: "Explore the human need for connection and learn how to build meaningful relationships and community.",
        keyPoints: [
          "The importance of social connection for well-being",
          "Building authentic relationships",
          "Finding and creating community",
          "Balancing solitude and connection"
        ]
      }
    ]
  },
  {
    id: "mental-health",
    title: "Mental Health",
    description: "Understand and optimize your mental health through evidence-based strategies and self-awareness practices.",
    icon: "🧠",
    color: "from-indigo-500 to-purple-600",
    lessons: [
      {
        id: 1,
        title: "Understanding Mental Health",
        duration: "15 min",
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/6e4e0a7f-2b4c-4e8f-a1c5-3d9f8e7c6b5a/transfers/rendered_video.mp4",
        description: "Gain a comprehensive understanding of mental health, common conditions, and the importance of mental wellness.",
        keyPoints: [
          "Defining mental health and mental illness",
          "Common mental health conditions and their symptoms",
          "The biopsychosocial model of mental health",
          "Reducing stigma and seeking help"
        ]
      },
      {
        id: 2,
        title: "Cognitive Behavioral Techniques",
        duration: "15 min",
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/d6f8dd8b-d632-4916-a013-bbf1f080e105/transfers/rendered_video.mp4",
        description: "Master the core CBT technique of identifying and challenging unhelpful thought patterns to improve your mental health.",
        keyPoints: [
          "The cognitive model: thoughts, feelings, and behaviors",
          "Identifying cognitive distortions",
          "Thought challenging and reframing",
          "Behavioral activation for depression"
        ]
      },
      {
        id: 3,
        title: "Stress Management",
        duration: "15 min",
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/8a9b0c1d-2e3f-4g5h-6i7j-8k9l0m1n2o3p/transfers/rendered_video.mp4",
        description: "Learn practical strategies to manage and reduce stress in your daily life for improved mental and physical health.",
        keyPoints: [
          "Understanding the stress response",
          "Identifying your personal stress triggers",
          "Effective stress management techniques",
          "Building long-term stress resilience"
        ]
      }
    ]
  }
];
