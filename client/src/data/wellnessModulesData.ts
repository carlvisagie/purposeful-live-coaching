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
      { 
        title: "Understanding Your Emotions", 
        duration: "15 min", 
        type: "video",
        description: "Learn the fundamental nature of emotions, their purpose in human experience, and how to identify and name your emotional states accurately.",
        keyPoints: [
          "Emotions are information - they tell us what matters",
          "All emotions are valid, even uncomfortable ones",
          "The emotion wheel helps identify nuanced feelings",
          "Emotional awareness is the first step to emotional intelligence"
        ],
        content: "Emotions are complex psychological states that involve three distinct components: a subjective experience, a physiological response, and a behavioral or expressive response. Understanding emotions begins with recognizing that they serve an important evolutionary purpose - they provide rapid information about our environment and motivate us to take action. In this lesson, you'll learn to identify your emotions with precision using the emotion wheel, understand the difference between primary and secondary emotions, and develop the foundational skill of emotional awareness that underlies all emotional intelligence."
      },
      { 
        title: "The Emotion Wheel Exercise", 
        duration: "10 min", 
        type: "exercise",
        description: "Practice using the emotion wheel to identify and articulate your feelings with greater precision and nuance.",
        keyPoints: [
          "Move from basic emotions (happy, sad, angry) to nuanced feelings",
          "Practice naming emotions in real-time",
          "Notice physical sensations associated with each emotion",
          "Build emotional vocabulary"
        ],
        content: "The Emotion Wheel, developed by psychologist Robert Plutchik, is a powerful tool for developing emotional granularity - the ability to make fine-grained distinctions among emotions. Research shows that people with higher emotional granularity experience better mental health outcomes and more effective emotion regulation. In this exercise, you'll practice moving from basic emotion categories (like 'bad') to more specific feelings (like 'disappointed,' 'embarrassed,' or 'overwhelmed'). You'll learn to notice the physical sensations, thoughts, and action urges that accompany different emotions, building a rich emotional vocabulary that enhances self-awareness."
      },
      { 
        title: "Building Emotional Resilience", 
        duration: "20 min", 
        type: "video",
        description: "Discover evidence-based strategies for bouncing back from emotional setbacks and building long-term emotional strength.",
        keyPoints: [
          "Resilience is a skill that can be developed",
          "The role of cognitive flexibility in resilience",
          "Building a resilience toolkit",
          "Post-traumatic growth and finding meaning"
        ],
        content: "Emotional resilience is the ability to adapt to stressful situations and bounce back from adversity. It's not about avoiding difficult emotions or 'toughening up' - it's about developing the psychological flexibility to experience the full range of human emotions while maintaining your well-being. This lesson explores the key components of resilience: realistic optimism, cognitive flexibility, strong social connections, and a sense of purpose. You'll learn practical strategies from positive psychology and cognitive behavioral therapy, including reframing techniques, self-compassion practices, and meaning-making exercises that help you not just survive challenges, but grow from them."
      },
      { 
        title: "Daily Emotional Check-in Practice", 
        duration: "5 min", 
        type: "practice",
        description: "Establish a simple daily practice for monitoring your emotional state and building emotional awareness.",
        keyPoints: [
          "Quick daily emotional assessment",
          "Notice patterns over time",
          "Identify triggers and trends",
          "Build emotional self-awareness habit"
        ],
        content: "Daily emotional check-ins are a cornerstone practice for developing emotional intelligence. This brief 5-minute practice involves pausing to notice and name your current emotional state, rating its intensity, identifying any physical sensations, and noting what might have triggered the emotion. Over time, this practice helps you recognize patterns in your emotional life - you might notice that certain situations, people, or times of day consistently affect your mood. This awareness is the foundation for effective emotion regulation. The practice also helps you catch emotional states early, before they intensify, giving you more options for responding skillfully."
      },
      { 
        title: "Emotion Regulation Techniques", 
        duration: "25 min", 
        type: "video",
        description: "Master evidence-based techniques for managing intense emotions and returning to emotional balance.",
        keyPoints: [
          "The STOP technique for emotional pausing",
          "Opposite action for changing emotional states",
          "Grounding techniques for overwhelming emotions",
          "Building distress tolerance skills"
        ],
        content: "Emotion regulation is the ability to influence which emotions you have, when you have them, and how you experience and express them. This comprehensive lesson teaches you multiple evidence-based techniques from Dialectical Behavior Therapy (DBT) and other therapeutic approaches. You'll learn the STOP technique (Stop, Take a breath, Observe, Proceed) for creating space between emotion and action. You'll discover 'opposite action' - a powerful DBT skill where you act opposite to your emotional urge to change the emotion itself. You'll practice grounding techniques like the 5-4-3-2-1 method for overwhelming emotions, and learn to build distress tolerance through self-soothing and radical acceptance. These skills don't eliminate difficult emotions, but they give you choice in how you respond."
      }
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
      { 
        title: "Understanding Your Mind", 
        duration: "18 min", 
        type: "video",
        description: "Explore how your mind works, the relationship between thoughts and emotions, and the foundations of mental well-being.",
        keyPoints: [
          "The mind-body connection and its impact on health",
          "How thoughts create emotions and drive behavior",
          "The difference between mind and brain",
          "Neuroplasticity: your brain's ability to change"
        ],
        content: "Your mind is not your brain, though they're intimately connected. The mind encompasses your thoughts, beliefs, memories, and consciousness, while the brain is the physical organ that supports mental processes. Understanding this distinction is crucial for mental health because it reveals that you have agency over your mental states. This lesson explores the cognitive model: thoughts → emotions → behaviors. You'll learn how automatic thoughts shape your emotional experience and discover the revolutionary concept of neuroplasticity - your brain's ability to form new neural pathways throughout life. This means that mental patterns aren't fixed; with practice, you can literally rewire your brain for better mental health."
      },
      { 
        title: "Cognitive Restructuring Basics", 
        duration: "22 min", 
        type: "video",
        description: "Master the core CBT technique of identifying and challenging unhelpful thought patterns to improve your mental health.",
        keyPoints: [
          "Identifying automatic negative thoughts",
          "Common cognitive distortions (all-or-nothing thinking, catastrophizing, etc.)",
          "The ABC model: Activating event, Belief, Consequence",
          "Generating alternative, balanced thoughts"
        ],
        content: "Cognitive restructuring is the cornerstone technique of Cognitive Behavioral Therapy (CBT), one of the most evidence-based approaches to mental health. The premise is simple but powerful: it's not events themselves that cause emotional distress, but our interpretations of those events. This lesson teaches you to catch automatic negative thoughts - those rapid, often unconscious interpretations that pop into your mind. You'll learn to identify cognitive distortions like catastrophizing ('This will be a disaster'), all-or-nothing thinking ('I'm a complete failure'), and mind-reading ('They think I'm stupid'). Most importantly, you'll practice the skill of generating alternative, more balanced thoughts that are both realistic and helpful. This isn't positive thinking - it's accurate thinking."
      },
      { 
        title: "Anxiety Management Techniques", 
        duration: "15 min", 
        type: "exercise",
        description: "Practice evidence-based techniques for reducing anxiety in the moment and building long-term anxiety resilience.",
        keyPoints: [
          "Box breathing for immediate anxiety relief",
          "Progressive muscle relaxation",
          "The 5-4-3-2-1 grounding technique",
          "Worry time scheduling"
        ],
        content: "Anxiety is one of the most common mental health challenges, affecting millions of people worldwide. While some anxiety is normal and even helpful, excessive anxiety can be debilitating. This practical exercise teaches you multiple techniques for managing anxiety. Box breathing (4-4-4-4 pattern) activates your parasympathetic nervous system, triggering a relaxation response. Progressive muscle relaxation helps release physical tension that accompanies anxiety. The 5-4-3-2-1 technique grounds you in the present moment when anxiety pulls you into future worries. And worry time scheduling - a counterintuitive technique where you designate a specific time each day for worrying - helps contain anxious thoughts. Practice these techniques regularly, not just when you're anxious, to build your anxiety management skills."
      },
      { 
        title: "Thought Pattern Recognition", 
        duration: "12 min", 
        type: "practice",
        description: "Develop the skill of noticing your habitual thought patterns and their impact on your mood and behavior.",
        keyPoints: [
          "Keeping a thought record",
          "Identifying your most common cognitive distortions",
          "Noticing thought-emotion-behavior connections",
          "Building metacognitive awareness"
        ],
        content: "Metacognition - thinking about thinking - is a powerful skill for mental health. Most people go through life on autopilot, unaware of the constant stream of thoughts running through their minds. This practice helps you develop the observer stance: the ability to notice your thoughts without being swept away by them. You'll learn to keep a thought record, documenting situations that trigger strong emotions, the automatic thoughts that arise, and the emotions and behaviors that follow. Over time, patterns emerge. You might notice that you consistently catastrophize about work situations, or that you often engage in black-and-white thinking about relationships. Recognizing these patterns is the first step to changing them. This practice builds the foundation for lasting mental health improvements."
      },
      { 
        title: "Building Mental Resilience", 
        duration: "20 min", 
        type: "video",
        description: "Develop psychological strength and the ability to bounce back from mental health challenges.",
        keyPoints: [
          "The three pillars of mental resilience",
          "Stress inoculation and controlled exposure",
          "Developing a growth mindset",
          "Building psychological flexibility"
        ],
        content: "Mental resilience is the capacity to maintain mental health in the face of adversity and to recover quickly from difficulties. It's not about being invulnerable or never experiencing mental health struggles - it's about having the skills and resources to navigate challenges effectively. This lesson explores the three pillars of mental resilience: cognitive flexibility (the ability to adapt your thinking), emotional regulation (managing intense feelings), and social connection (having supportive relationships). You'll learn about stress inoculation - the idea that controlled exposure to manageable stressors can build resilience, much like a vaccine. You'll discover how a growth mindset (believing abilities can be developed) protects mental health. And you'll understand psychological flexibility - the ability to stay present, open up to difficult emotions, and take action aligned with your values even when it's hard. These skills transform mental health challenges from threats into opportunities for growth."
      }
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
      { 
        title: "Fitness Fundamentals", 
        duration: "16 min", 
        type: "video",
        description: "Build a strong foundation in fitness principles that will serve you for life, regardless of your current fitness level.",
        keyPoints: [
          "The four pillars of fitness: strength, cardio, flexibility, and recovery",
          "Progressive overload: the key to continuous improvement",
          "Form over ego: why technique matters more than weight",
          "Consistency beats intensity: building sustainable habits"
        ],
        content: "Physical fitness is not about achieving a perfect body or competing with others - it's about building strength, energy, and vitality that enhance every area of your life. This foundational lesson introduces the four essential components of complete fitness: strength training (building muscle and bone density), cardiovascular exercise (heart and lung health), flexibility and mobility (range of motion and injury prevention), and recovery (allowing your body to adapt and grow stronger). You'll learn the principle of progressive overload - gradually increasing the demands on your body to stimulate adaptation. Most importantly, you'll understand that perfect form and consistent practice matter far more than lifting heavy weights or running fast. Fitness is a lifelong journey, not a destination. This lesson gives you the roadmap to build a body that serves you well for decades to come."
      },
      { 
        title: "Creating Your Workout Plan", 
        duration: "20 min", 
        type: "exercise",
        description: "Design a personalized workout plan that fits your goals, schedule, and current fitness level.",
        keyPoints: [
          "Assessing your current fitness level honestly",
          "Setting SMART fitness goals",
          "Balancing different types of exercise",
          "Scheduling workouts you'll actually do"
        ],
        content: "Generic workout plans fail because they don't account for your unique life, goals, and constraints. This practical exercise guides you through creating a personalized fitness plan that works for YOU. You'll start with an honest assessment of your current fitness level - not to judge yourself, but to establish a realistic starting point. You'll set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) that motivate rather than overwhelm you. You'll learn to balance strength training, cardio, and flexibility work in a way that supports your goals - whether that's fat loss, muscle gain, athletic performance, or simply feeling better in your body. Most crucially, you'll schedule workouts at times when you're actually likely to do them, accounting for your energy levels, work schedule, and family commitments. The best workout plan is the one you'll actually follow. This exercise helps you create exactly that."
      },
      { 
        title: "Strength Training Basics", 
        duration: "25 min", 
        type: "video",
        description: "Master the fundamental movement patterns and principles of strength training for lifelong strength and health.",
        keyPoints: [
          "The six fundamental movement patterns",
          "Progressive resistance: starting light and building up",
          "Proper form for key exercises (squat, hinge, push, pull)",
          "Why strength training is essential for everyone, not just bodybuilders"
        ],
        content: "Strength training is perhaps the single most important type of exercise for long-term health and quality of life. It builds muscle mass (which declines with age), increases bone density (preventing osteoporosis), boosts metabolism, improves insulin sensitivity, and enhances functional capacity for daily activities. This comprehensive lesson teaches you the six fundamental movement patterns that form the foundation of all strength training: squat (sitting and standing), hinge (bending and lifting), push (pressing away), pull (drawing toward), carry (holding and moving with load), and core stability (resisting unwanted movement). You'll learn proper form for essential exercises like bodyweight squats, deadlifts, push-ups, and rows. You'll understand the principle of progressive resistance - starting with manageable weights and gradually increasing over time. Whether you train with barbells, dumbbells, resistance bands, or just your bodyweight, these principles remain constant. Strength training isn't about vanity - it's about building a resilient, capable body that serves you well throughout life."
      },
      { 
        title: "Cardio for Health", 
        duration: "18 min", 
        type: "video",
        description: "Discover how to use cardiovascular exercise to build heart health, endurance, and metabolic fitness.",
        keyPoints: [
          "The difference between LISS, MISS, and HIIT cardio",
          "Heart rate zones and why they matter",
          "Finding cardio activities you actually enjoy",
          "Balancing cardio with strength training"
        ],
        content: "Cardiovascular exercise strengthens your heart, improves lung capacity, enhances endurance, and supports metabolic health. But not all cardio is created equal, and more isn't always better. This lesson explores three types of cardio training: LISS (Low-Intensity Steady State) like walking or easy cycling, which builds aerobic base and aids recovery; MISS (Moderate-Intensity Steady State) like jogging or swimming, which improves cardiovascular fitness; and HIIT (High-Intensity Interval Training), which maximizes calorie burn and metabolic benefits in minimal time. You'll learn about heart rate zones - how to calculate your max heart rate and train in different zones for different benefits. Most importantly, you'll discover that the best cardio is the kind you'll actually do consistently. Hate running? Try cycling, swimming, rowing, dancing, or hiking. Love team sports? Basketball and soccer provide excellent cardio. The key is finding movement you enjoy enough to sustain long-term. You'll also learn how to balance cardio with strength training - they're complementary, not competing priorities."
      },
      { 
        title: "Recovery and Rest", 
        duration: "12 min", 
        type: "video",
        description: "Understand why recovery is when your body actually gets stronger, and learn to optimize rest for maximum results.",
        keyPoints: [
          "Muscle growth happens during rest, not during workouts",
          "Active recovery vs. complete rest",
          "Sleep: the most powerful recovery tool",
          "Recognizing and preventing overtraining"
        ],
        content: "Here's a truth that surprises many people: you don't get stronger during workouts - you get stronger during recovery. Exercise creates micro-tears in muscle fibers and stresses your cardiovascular system. It's during rest that your body repairs this damage and adapts by building back stronger. This lesson teaches you to view recovery not as laziness, but as an essential component of your fitness program. You'll learn the difference between active recovery (light movement like walking or yoga that promotes blood flow and healing) and complete rest (days off from structured exercise). You'll discover why sleep is the most powerful recovery tool available - during deep sleep, your body releases growth hormone, repairs tissue, and consolidates motor learning. You'll understand the signs of overtraining: persistent fatigue, declining performance, increased injury risk, mood changes, and elevated resting heart rate. Most people don't train too hard - they recover too little. This lesson helps you optimize recovery so your hard work in the gym actually translates to results."
      }
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
      { 
        title: "Nutrition Fundamentals", 
        duration: "20 min", 
        type: "video",
        description: "Master the foundational principles of nutrition science to make informed food choices that support your health and goals.",
        keyPoints: [
          "Macronutrients: protein, carbohydrates, and fats - what they do and how much you need",
          "Micronutrients: vitamins and minerals that power your body",
          "Caloric balance: understanding energy in vs. energy out",
          "Bio-individuality: why one-size-fits-all diets fail"
        ],
        content: "Nutrition is simultaneously simple and complex. At its core, food provides energy (measured in calories) and nutrients (vitamins, minerals, and compounds) that your body needs to function. This lesson demystifies nutrition science, starting with the three macronutrients: protein (builds and repairs tissue, 4 calories per gram), carbohydrates (primary energy source, 4 calories per gram), and fats (hormone production and nutrient absorption, 9 calories per gram). You'll learn that no macronutrient is inherently 'bad' - each serves essential functions. You'll discover micronutrients - vitamins and minerals that don't provide energy but enable countless bodily processes. You'll understand caloric balance: eat more than you burn and you gain weight; eat less and you lose weight; eat about the same and you maintain. But here's the crucial insight: optimal nutrition isn't just about calories and macros. It's about food quality, nutrient density, timing, and bio-individuality - your unique needs based on genetics, activity level, health status, and goals. This lesson gives you the foundational knowledge to cut through diet fads and make informed choices."
      },
      { 
        title: "Building Your Plate", 
        duration: "15 min", 
        type: "exercise",
        description: "Learn to construct balanced, nutritious meals using simple visual guidelines that work for any eating style.",
        keyPoints: [
          "The plate method: visual portion control without measuring",
          "Protein at every meal for satiety and muscle maintenance",
          "Colorful vegetables for micronutrients and fiber",
          "Smart carbohydrate choices based on activity level"
        ],
        content: "Counting calories and weighing food works, but it's tedious and unsustainable for most people. This practical exercise teaches you the plate method - a simple visual system for building balanced meals without measuring. Picture your plate: fill half with non-starchy vegetables (leafy greens, broccoli, peppers, etc.) for volume, fiber, and micronutrients. Fill one quarter with lean protein (chicken, fish, tofu, legumes) for satiety and muscle maintenance. Fill the remaining quarter with quality carbohydrates - the amount and type depend on your activity level. Very active? Choose starchy carbs like rice, potatoes, or oats. Sedentary? Opt for more vegetables or smaller portions of whole grains. Add a serving of healthy fats (olive oil, avocado, nuts) and you have a complete, balanced meal. This method works for any dietary preference - omnivore, vegetarian, vegan, paleo, keto (adjust the ratios). You'll practice building sample meals for breakfast, lunch, and dinner, learning to eyeball portions and make smart substitutions based on what's available."
      },
      { 
        title: "Meal Planning Mastery", 
        duration: "18 min", 
        type: "video",
        description: "Develop a sustainable meal planning system that saves time, reduces stress, and ensures you eat well consistently.",
        keyPoints: [
          "Weekly planning: the key to consistent nutrition",
          "Batch cooking and meal prep strategies",
          "Building a rotation of go-to meals",
          "Flexible planning that accommodates life's unpredictability"
        ],
        content: "The difference between people who eat well consistently and those who don't usually isn't willpower - it's planning. This lesson teaches you to create a meal planning system that works with your life, not against it. You'll learn to dedicate 30 minutes each week to planning your meals, creating a shopping list, and preparing for the week ahead. You'll discover batch cooking strategies: cook once, eat multiple times. Prepare a large batch of protein (grilled chicken, ground turkey, baked tofu), chop vegetables for the week, cook a big pot of grains, and you have mix-and-match components for quick meals. You'll build a rotation of 10-15 go-to meals that you can make without thinking - this eliminates decision fatigue. Crucially, you'll learn flexible planning: have backup options for busy days (healthy frozen meals, simple scrambled eggs, pre-made salads), and don't aim for perfection. If you eat well 80% of the time, you'll see results. This lesson transforms meal planning from an overwhelming chore into a simple weekly habit that sets you up for success."
      },
      { 
        title: "Intuitive Eating Principles", 
        duration: "16 min", 
        type: "video",
        description: "Heal your relationship with food by learning to trust your body's hunger and fullness signals.",
        keyPoints: [
          "Rejecting diet mentality and food rules",
          "Honoring hunger and respecting fullness",
          "Making peace with food - no foods are forbidden",
          "Coping with emotions without using food"
        ],
        content: "Decades of dieting have disconnected many people from their body's natural hunger and fullness signals. Intuitive eating is an evidence-based approach that helps you rebuild trust with your body and develop a peaceful relationship with food. This lesson introduces the core principles: reject the diet mentality (diets don't work long-term and damage your relationship with food), honor your hunger (don't let yourself get ravenously hungry), feel your fullness (eat until satisfied, not stuffed), challenge the food police (no foods are 'good' or 'bad'), discover satisfaction (eat foods you actually enjoy), cope with emotions without food (find non-food ways to comfort yourself), respect your body (accept your genetic blueprint), and honor your health with gentle nutrition (you don't have to eat perfectly to be healthy). Intuitive eating isn't a free-for-all - it's about tuning into your body's wisdom. When you stop restricting and labeling foods as forbidden, you often find that you naturally gravitate toward foods that make you feel good. This approach is particularly powerful for people who've struggled with yo-yo dieting, disordered eating, or chronic restriction."
      },
      { 
        title: "Nutrition for Performance", 
        duration: "22 min", 
        type: "video",
        description: "Optimize your nutrition to support athletic performance, recovery, and body composition goals.",
        keyPoints: [
          "Fueling before, during, and after exercise",
          "Protein timing for muscle growth and recovery",
          "Carbohydrate cycling based on training intensity",
          "Hydration and electrolyte balance"
        ],
        content: "If you're physically active - whether you're a competitive athlete or just someone who works out regularly - strategic nutrition can significantly enhance your performance and results. This advanced lesson teaches you to fuel your training intelligently. You'll learn pre-workout nutrition: eat a meal with carbs and protein 2-3 hours before training for sustained energy, or a small snack 30-60 minutes before for quick fuel. You'll discover intra-workout nutrition: for sessions longer than 90 minutes, consume easily digestible carbs to maintain performance. You'll master post-workout nutrition: the 'anabolic window' isn't as narrow as once believed, but eating protein and carbs within a few hours supports recovery. You'll understand protein timing: distribute protein intake across 3-5 meals (20-40g per meal) to maximize muscle protein synthesis. You'll learn carbohydrate cycling: eat more carbs on high-intensity training days, fewer on rest or low-intensity days. And you'll grasp hydration: drink enough that your urine is pale yellow, and replace electrolytes (sodium, potassium, magnesium) during long or intense sessions. Performance nutrition isn't about supplements and complicated protocols - it's about consistent fundamentals applied intelligently."
      }
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
