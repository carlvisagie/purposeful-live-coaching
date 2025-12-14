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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/b5fe8344-6d4b-4081-806a-075ff07c7ca3/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Emotional%20Wellness%20-%20Lesson%201.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=WjXNc1pBBSMNjBaR%2FLGn5Ph0Lq8%3D&Expires=1766351243",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/36ad1523-eb44-4674-853f-cacd8b4d3579/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Emotional%20Wellness%20-%20Lesson%202.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=z2b3N50LpmtRU6HakRsp7Zba1s4%3D&Expires=1766351243",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/09d303d0-848a-4e8e-a67c-b15ae968a1f8/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Emotional-Wellness%20Lesson%203.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=3Tjp5CQZAaOMxH%2FiXa6BJrMDE5E%3D&Expires=1766327824",
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
        type: "reading",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/d6f8dd8b-d632-4916-a013-bbf1f080e105/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Mental%20Health%20-%20Lesson%202.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=6mPArP8%2BqB2sfddo1UKtZSJXnn8%3D&Expires=1766351243",
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/d6f8dd8b-d632-4916-a013-bbf1f080e105/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Mental%20Health%20-%20Lesson%202.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=6mPArP8%2BqB2sfddo1UKtZSJXnn8%3D&Expires=1766351243",
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
        type: "reading",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/5f6671a1-66ae-4897-988f-865952c2f481/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Physical%20Fitness%20-%20Lesson%201.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=cRKGbHgawFV0njGpcpdP0NDiJb0%3D&Expires=1766351243",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/a30aaa46-42a4-47fe-b28b-701f85fd2e3d/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Physical%20Fitness%20-%20Lesson%202.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=6pNvdyeJ2ThnKecOD2hV0awek0M%3D&Expires=1766351243",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/82f24a0d-a2e6-4bb2-b1b1-fccef38cf946/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Physical%20Fitness%20-%20Lesson%203.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=1dyIbm6gz0lnZakgWbNgNHoX9aE%3D&Expires=1766351243",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/13a2bdc2-0f35-4b48-b678-ff05ba6e542d/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Physical%20Fitness%20-%20Lesson%204.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=Kp0zo2q1v40gU1XNWXJNLHbKE6E%3D&Expires=1766351243",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/57b2735d-f58a-494b-99a1-2dbc4395497d/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Nutrition%20-%20Lesson%201.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=lTvbgIs9KrwFWFgyz4oA6w5C9kw%3D&Expires=1766351243",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/22ef3b7a-bde1-4f44-9e94-bafbf3ae7062/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Nutrition%20-%20Lesson%202.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=ES75GpJq3rtUCqxv6un4HUVC6jw%3D&Expires=1766351243",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/7feea566-9c00-4aa1-9a2c-f77f815aa6a6/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Nutrition%20-%20Lesson%203.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=n6VKjYgGtw3iyB6mUG1VOAtwJuk%3D&Expires=1766351243",
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
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/fa8fcf0b-f75d-408d-880c-7f23cc19ad47/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Nutrition%20-%20Lesson%204.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=hrU1I9nqTiQ7u0hl7LhrWWaWlmU%3D&Expires=1766351242",
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
      { 
        title: "Exploring Your Values", 
        duration: "17 min", 
        type: "video",
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/241b76bf-0cc6-4e47-ab86-c7e6d568f7a5/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Spiritual%20Wellness%20-%20Lesson%201.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=1UcY7Rpi4a%2BOldOTTd3DwnZ0t14%3D&Expires=1766351242",
        description: "Discover the core values that guide your decisions and define what truly matters to you.",
        keyPoints: [
          "Values vs. goals: understanding the difference",
          "Identifying your top 5 core values",
          "Living in alignment vs. values conflict",
          "Using values as a decision-making compass"
        ],
        content: "Values are the principles and qualities that matter most to you - they're your internal compass for navigating life's decisions. Unlike goals (which you achieve and move past), values are ongoing directions you move toward. This profound lesson guides you through discovering your authentic values, not the ones society, family, or culture imposed on you. You'll explore common value categories: connection (love, family, friendship), growth (learning, achievement, creativity), contribution (service, impact, legacy), security (safety, stability, health), and freedom (autonomy, adventure, independence). You'll learn to distinguish between values you genuinely hold and values you think you 'should' have. The values clarification exercise helps you identify your top 5 core values - the non-negotiables that define who you are. You'll discover the concept of values alignment: when your daily actions reflect your values, you feel fulfilled and authentic. When there's misalignment - working a job that conflicts with your values, maintaining relationships that violate your principles - you experience chronic dissatisfaction and inner conflict. You'll learn to use your values as a decision-making compass: when faced with choices, ask 'which option honors my values?' This lesson is transformational because living in alignment with your values is the foundation of authentic happiness and meaning."
      },
      { 
        title: "Gratitude Practice Foundations", 
        duration: "12 min", 
        type: "exercise",
        description: "Build a sustainable gratitude practice that rewires your brain for positivity and contentment.",
        keyPoints: [
          "The neuroscience of gratitude: how it changes your brain",
          "Three good things: the simplest effective practice",
          "Gratitude journaling: depth vs. breadth",
          "Expressing gratitude to others: strengthening relationships"
        ],
        content: "Gratitude is not toxic positivity or denying life's difficulties - it's the practice of intentionally noticing and appreciating the good in your life, even amid challenges. Research shows gratitude practices literally rewire your brain, strengthening neural pathways associated with positive emotions and weakening those linked to negative rumination. This practical exercise teaches you to build a sustainable gratitude practice. The simplest evidence-based practice: each evening, write down three good things that happened today and why they happened. This trains your brain to notice positive experiences throughout the day. Gratitude journaling: research shows that depth matters more than frequency. Writing detailed reflections about one thing you're grateful for once a week is more effective than superficial daily lists. You'll learn to go beyond surface gratitude ('I'm grateful for my family') to specific, vivid appreciation ('I'm grateful for the way my daughter laughed when we played together this morning - her joy reminded me what matters most'). Expressing gratitude to others: write gratitude letters to people who've impacted your life. You don't have to send them (though doing so strengthens relationships), but the act of articulating appreciation is powerfully healing. You'll discover that gratitude isn't about pretending everything is perfect - it's about training your attention to notice the good that coexists with the difficult. This practice is transformational for mental health, relationships, and life satisfaction."
      },
      { 
        title: "Meditation for Beginners", 
        duration: "20 min", 
        type: "practice",
        description: "Learn accessible meditation techniques that calm your mind and connect you to the present moment.",
        keyPoints: [
          "Meditation myths: you don't need to 'clear your mind'",
          "Breath awareness: the foundational practice",
          "Working with wandering thoughts: the practice IS noticing",
          "Starting small: 5 minutes is enough"
        ],
        content: "Meditation is one of the most misunderstood practices. Many people try it, think they're 'doing it wrong' because their mind won't stop thinking, and give up. This lesson demystifies meditation and teaches you a simple, accessible practice. First, let's dispel the biggest myth: meditation is NOT about clearing your mind or stopping thoughts. That's impossible and not the goal. Meditation is about training your attention - noticing when your mind wanders (which it will, constantly) and gently bringing it back to your chosen focus. The practice IS the noticing and returning. This lesson teaches breath awareness meditation: sit comfortably, close your eyes, and bring your attention to the physical sensation of breathing. Notice the air entering your nostrils, your chest or belly rising and falling. Within seconds, your mind will wander to thoughts, plans, worries. When you notice this (and you will, repeatedly), gently return your attention to the breath. No judgment, no frustration - just notice and return. This simple practice, done for just 5-10 minutes daily, has profound effects: reduced anxiety and stress, improved focus and emotional regulation, increased self-awareness, and a sense of inner calm. You'll learn that meditation isn't about achieving a special state - it's about being present with whatever is. This lesson includes a guided 10-minute meditation you can practice immediately. Meditation is a skill that develops with practice, like learning an instrument. Be patient with yourself."
      },
      { 
        title: "Finding Your Purpose", 
        duration: "25 min", 
        type: "video",
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/d43f5303-eb57-4ba2-bbdf-bc2fba1f7db9/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Spiritual%20Wellness%20-%20Lesson%202.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=OXmfT5hkKEKD%2BB5XtJ8S%2FfpRV%2BQ%3D&Expires=1766351242",
        description: "Discover your unique purpose through deep self-reflection and practical exercises.",
        keyPoints: [
          "Purpose is not one grand mission - it evolves",
          "The intersection of passion, skill, and service",
          "Your purpose statement: a living document",
          "Living purposefully: daily actions aligned with meaning"
        ],
        content: "The question 'What is my purpose?' can feel overwhelming, even paralyzing. This lesson reframes purpose in a way that's accessible and actionable. First, understand that purpose is not one grand, fixed mission you must discover. Purpose evolves as you grow and change. It's not something you find 'out there' - it emerges from self-knowledge and lived experience. This lesson guides you through discovering your purpose at the intersection of three elements: what you're passionate about (what energizes and excites you), what you're skilled at (your natural talents and developed abilities), and how you can serve others (the needs you can meet in the world). You'll explore powerful questions: What problems do you feel called to solve? What activities make you lose track of time? What would you do if money were no object? When have you felt most alive and fulfilled? What do people consistently come to you for help with? You'll craft a purpose statement - not a rigid declaration, but a living document that articulates your current understanding of why you're here and what you're called to do. Most importantly, you'll learn that purpose isn't just about your career or one area of life. You can live purposefully as a parent, friend, community member, artist, or volunteer. Purpose is about bringing intentionality and meaning to your daily actions. This lesson is deeply transformational because living with purpose - even if that purpose evolves - provides resilience, direction, and deep fulfillment."
      },
      { 
        title: "Spiritual Rituals and Practices", 
        duration: "15 min", 
        type: "video",
        videoUrl: "https://synthesia-ttv-data.s3.amazonaws.com/video_data/b8939d25-810f-4bbf-a6f1-4daffbc589f8/transfers/rendered_video.mp4?response-content-disposition=attachment%3Bfilename%3D%22Spiritual%20Wellness%20-%20Lesson%203.mp4%22&AWSAccessKeyId=AKIA32NGJ5TSW5HNK25Z&Signature=bOPAmE6%2BoxQE2aKQwykaD%2FwRYKU%3D&Expires=1766351242",
        description: "Create personal rituals that connect you to something greater and infuse daily life with meaning.",
        keyPoints: [
          "Rituals vs. routines: intention makes the difference",
          "Morning rituals: setting intention for the day",
          "Evening rituals: reflection and gratitude",
          "Creating rituals around transitions and milestones"
        ],
        content: "Rituals are intentional practices that connect you to something beyond the mundane - whether that's your values, a sense of the sacred, nature, or a higher power. Unlike routines (which are functional), rituals are infused with meaning and presence. This lesson teaches you to create personal spiritual practices that resonate with you, regardless of religious background. Morning rituals: begin your day with intention. This might include meditation, journaling, reading inspirational text, stretching, or simply sitting with a cup of tea in silence. The key is presence and intention - you're not just going through motions, you're consciously setting the tone for your day. Evening rituals: close your day with reflection. Review your day with compassion, note what you're grateful for, release what didn't serve you, and set intentions for tomorrow. This practice prevents rumination and promotes restful sleep. Transition rituals: create practices around life transitions - changing seasons, birthdays, new jobs, endings and beginnings. These rituals help you process change and mark important moments. Nature connection: spend time in nature with intention - not exercising or socializing, but simply being present with the natural world. This cultivates awe and perspective. The beauty of personal spiritual practices is that they're entirely yours - you can draw from religious traditions, create your own, or blend practices that resonate. This lesson helps you design rituals that feel authentic and sustainable, infusing your daily life with meaning and connection."
      }
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
      { 
        title: "Communication Fundamentals", 
        duration: "19 min", 
        type: "reading",
        description: "Master the essential communication skills that transform relationships from surface-level to deeply connected.",
        keyPoints: [
          "The four communication styles: passive, aggressive, passive-aggressive, assertive",
          "'I' statements: expressing needs without blame",
          "Nonverbal communication: body language speaks louder than words",
          "The 5:1 ratio: positive to negative interactions in healthy relationships"
        ],
        content: "Communication is the foundation of every relationship - romantic, family, friendship, professional. Yet most of us never learned how to communicate effectively. This lesson teaches you the core skills. First, understand the four communication styles: Passive (avoiding conflict, suppressing needs, saying 'yes' when you mean 'no'), Aggressive (demanding, blaming, dominating), Passive-Aggressive (indirect hostility, sarcasm, silent treatment), and Assertive (clear, direct, respectful expression of needs and boundaries). Assertive communication is the goal - it honors both your needs and the other person's. You'll learn 'I' statements: instead of 'You never listen to me' (blame), say 'I feel unheard when I'm interrupted' (ownership of your experience). This reduces defensiveness and opens dialogue. Nonverbal communication: your tone, facial expressions, and body language convey more than your words. Crossed arms, lack of eye contact, or a dismissive tone can contradict your verbal message. Practice congruence - ensure your nonverbal cues match your words. The Gottman Institute's research shows that healthy relationships have a 5:1 ratio of positive to negative interactions. For every criticism or conflict, you need five positive interactions (appreciation, affection, humor, support) to maintain relationship health. This lesson transforms how you communicate, leading to deeper understanding, less conflict, and stronger connections."
      },
      { 
        title: "Active Listening Practice", 
        duration: "14 min", 
        type: "exercise",
        description: "Develop the powerful skill of truly hearing others - the foundation of connection and trust.",
        keyPoints: [
          "Listening to understand vs. listening to respond",
          "Reflective listening: mirroring back what you heard",
          "Validating emotions: you don't have to agree to acknowledge",
          "Avoiding common listening blocks: advising, one-upping, fixing"
        ],
        content: "Most people don't listen to understand - they listen to respond. While the other person is talking, they're formulating their reply, waiting for their turn to speak. This isn't listening; it's a conversation transaction. Active listening is the practice of fully focusing on understanding the other person's perspective, emotions, and needs. This transformational exercise teaches you how. First, set the intention to understand, not to fix, advise, or judge. When someone shares with you, your job is to hear them, not solve their problem (unless they explicitly ask for advice). Reflective listening: periodically mirror back what you heard: 'It sounds like you're feeling overwhelmed by work demands and frustrated that your manager doesn't recognize your efforts.' This shows you're listening and allows them to clarify if you misunderstood. Validating emotions: you don't have to agree with someone's perspective to acknowledge their feelings. 'That sounds really difficult' or 'I can see why you'd feel that way' validates their experience. Validation is profoundly healing. Avoid common listening blocks: Advising ('Here's what you should do...'), One-upping ('That's nothing, let me tell you what happened to me...'), Fixing ('Don't feel that way'), Interrogating (rapid-fire questions), or Minimizing ('It's not that bad'). These blocks shut down connection. This exercise includes partner practice: one person shares for 3 minutes while the other practices active listening, then switch. Active listening is a skill that transforms all your relationships - people feel seen, heard, and valued."
      },
      { 
        title: "Healthy Boundaries 101", 
        duration: "21 min", 
        type: "reading",
        description: "Learn to set clear boundaries that protect your well-being while maintaining healthy relationships.",
        keyPoints: [
          "Boundaries are not walls - they're guidelines for how you want to be treated",
          "The six types of boundaries: physical, emotional, time, sexual, intellectual, material",
          "How to communicate boundaries clearly and compassionately",
          "Dealing with boundary violations: consequences, not punishment"
        ],
        content: "Boundaries are the invisible lines that define where you end and another person begins. They protect your physical space, emotional energy, time, values, and resources. Healthy boundaries are essential for self-respect and healthy relationships. This lesson teaches you to identify, set, and maintain boundaries. First, understand that boundaries are not selfish or mean - they're necessary. Boundaries are not walls that keep people out; they're guidelines for how you want to be treated. The six types of boundaries: Physical (personal space, touch), Emotional (not taking responsibility for others' feelings, not allowing others to dump their emotions on you), Time (how you spend your time, saying no to commitments), Sexual (consent, comfort level), Intellectual (respecting differing opinions), and Material (money, possessions). You'll assess your current boundaries: Do you say 'yes' when you mean 'no'? Do you feel responsible for others' emotions? Do you tolerate disrespectful treatment? Weak boundaries lead to resentment, exhaustion, and loss of self. Setting boundaries: be clear, direct, and unapologetic. 'I'm not available to talk after 9 PM' or 'I need you to ask before borrowing my things.' You don't need to justify or over-explain. Dealing with violations: boundaries without consequences are just suggestions. If someone repeatedly violates your boundary, enforce a consequence: 'I asked you not to criticize my parenting. If you do it again, I'll end the conversation.' This lesson is transformational because boundaries are an act of self-love that paradoxically improve relationships."
      },
      { 
        title: "Conflict Resolution Strategies", 
        duration: "18 min", 
        type: "reading",
        description: "Transform conflicts from destructive battles into opportunities for deeper understanding and growth.",
        keyPoints: [
          "Conflict is inevitable and not inherently bad",
          "The four horsemen of relationship apocalypse: criticism, contempt, defensiveness, stonewalling",
          "The repair attempt: de-escalating before damage is done",
          "Win-win solutions: collaborative problem-solving"
        ],
        content: "Conflict is inevitable in any relationship. The question isn't whether you'll have conflict, but how you'll handle it. Handled poorly, conflict erodes trust and connection. Handled well, conflict deepens understanding and strengthens bonds. This lesson teaches you to navigate conflict constructively. First, reframe conflict: it's not a battle to win or lose, it's a problem to solve together. The goal isn't to prove you're right; it's to understand each other and find a solution that works for both of you. The Gottman Institute identified the 'four horsemen' that predict relationship failure: Criticism (attacking character, not behavior: 'You're so selfish'), Contempt (disrespect, mockery, sarcasm - the most toxic), Defensiveness (playing the victim, making excuses), and Stonewalling (shutting down, refusing to engage). Avoid these at all costs. Instead, practice: Complaining without criticizing ('I felt hurt when you forgot our anniversary' vs. 'You don't care about me'), Expressing appreciation even in conflict, Taking responsibility for your part, and Staying engaged even when it's uncomfortable. The repair attempt: when conflict escalates, make a bid to de-escalate: 'I'm sorry, I'm getting too heated. Can we take a break and come back to this?' or even humor: 'We're both being ridiculous right now.' Repair attempts prevent lasting damage. Collaborative problem-solving: state the problem from both perspectives, brainstorm solutions together, choose one to try, and agree to revisit if it doesn't work. This lesson transforms conflict from something to avoid into an opportunity for growth."
      },
      { 
        title: "Building Emotional Intimacy", 
        duration: "16 min", 
        type: "reading",
        description: "Cultivate deep emotional connection through vulnerability, trust, and authentic sharing.",
        keyPoints: [
          "Emotional intimacy vs. physical intimacy: both are essential",
          "Vulnerability: the courage to be seen",
          "The 36 questions that lead to love: accelerating connection",
          "Rituals of connection: daily practices that maintain intimacy"
        ],
        content: "Emotional intimacy is the feeling of being truly known and accepted by another person. It's created through vulnerability, trust, and authentic sharing. Many relationships have physical intimacy but lack emotional intimacy, leaving partners feeling lonely despite being together. This lesson teaches you to build and maintain deep emotional connection. Emotional intimacy requires vulnerability - the willingness to share your true thoughts, feelings, fears, and desires, even when it's uncomfortable. Brené Brown defines vulnerability as 'uncertainty, risk, and emotional exposure.' It's scary because you risk rejection, but it's also the birthplace of love, belonging, and connection. You cannot have intimacy without vulnerability. Start small: share something you're proud of, something you're worried about, a childhood memory. Notice how it feels to be seen. The 36 questions that lead to love: psychologist Arthur Aron created a series of increasingly personal questions that accelerate intimacy. Questions like 'If you could wake up tomorrow having gained one quality, what would it be?' or 'When did you last cry in front of another person?' These questions bypass small talk and create real connection. Rituals of connection: daily practices that maintain intimacy. This might be a morning coffee together without phones, a nightly check-in where you each share a high and low from your day, or a weekly date night. Consistency matters more than grand gestures. This lesson is transformational because emotional intimacy is what makes relationships deeply fulfilling and resilient."
      }
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
      { 
        title: "Money Mindset Transformation", 
        duration: "20 min", 
        type: "reading",
        description: "Transform your relationship with money by identifying and shifting limiting beliefs that keep you stuck financially.",
        keyPoints: [
          "Common money scripts: scarcity vs. abundance mindset",
          "Your money story: how childhood experiences shape adult finances",
          "Reframing money as a tool, not a measure of worth",
          "The psychology of enough: contentment without complacency"
        ],
        content: "Your relationship with money is shaped by beliefs formed in childhood - what psychologists call 'money scripts.' These unconscious beliefs drive your financial behaviors, often sabotaging your best intentions. This transformational lesson helps you identify and shift limiting money beliefs. Common money scripts: 'Money is the root of all evil' (money avoidance), 'More money will solve all my problems' (money worship), 'I don't deserve to be wealthy' (money status), or 'There's never enough' (scarcity mindset). These scripts operate unconsciously, creating self-sabotaging patterns. You'll explore your money story: What did your parents teach you about money? Was money a source of stress or security in your childhood? Did you grow up with scarcity or abundance? These experiences shape your adult relationship with money. Reframing money: money is not good or evil - it's a neutral tool that amplifies your values. Money can fund your freedom, support causes you care about, provide security for your family, and create opportunities. It's also not a measure of your worth as a person. Abundance vs. scarcity: scarcity mindset believes resources are limited, creating anxiety and hoarding. Abundance mindset recognizes that wealth can be created, fostering generosity and opportunity-seeking. The psychology of enough: contentment doesn't mean complacency. You can be grateful for what you have while working toward financial goals. This lesson is transformational because shifting your money mindset is the foundation of financial wellness."
      },
      { 
        title: "Budgeting That Actually Works", 
        duration: "22 min", 
        type: "exercise",
        description: "Create a realistic, sustainable budget that aligns with your values and goals without feeling restrictive.",
        keyPoints: [
          "The 50/30/20 rule: a simple framework for allocating income",
          "Values-based budgeting: spending on what matters most",
          "Tracking systems: finding what works for you",
          "Building in flexibility: budgets aren't straitjackets"
        ],
        content: "Most budgets fail because they're too restrictive, complicated, or don't align with your values. This practical exercise teaches you to create a budget that actually works. The 50/30/20 rule: allocate 50% of after-tax income to needs (housing, food, utilities, transportation, minimum debt payments), 30% to wants (dining out, entertainment, hobbies), and 20% to savings and debt payoff. This is a starting framework - adjust based on your situation. Values-based budgeting: instead of cutting everything, identify what truly matters to you. If travel is a core value, budget generously for it and cut elsewhere. If dining out brings you joy, keep it. Cut spending that doesn't align with your values. This makes budgeting sustainable. Tracking systems: choose a method that fits your personality. Options include: budgeting apps (Mint, YNAB), spreadsheets, envelope system (cash for different categories), or zero-based budgeting (every dollar has a job). The best system is the one you'll actually use. Building in flexibility: life is unpredictable. Build a 'miscellaneous' category for unexpected expenses. If you overspend in one category, adjust another. Review and adjust your budget monthly - it's a living document, not a rigid rule. This exercise includes a step-by-step budget creation worksheet. A good budget isn't about restriction - it's about intentionally directing your money toward what matters most."
      },
      { 
        title: "Debt Elimination Strategies", 
        duration: "18 min", 
        type: "reading",
        description: "Develop a strategic plan to eliminate debt using proven methods while maintaining financial stability.",
        keyPoints: [
          "Good debt vs. bad debt: understanding the difference",
          "Debt snowball vs. debt avalanche: choosing your strategy",
          "Negotiating with creditors: lowering interest rates",
          "Avoiding debt while paying off debt: breaking the cycle"
        ],
        content: "Debt can feel overwhelming and hopeless, but with a strategic plan, you can become debt-free. This lesson teaches proven debt elimination strategies. First, understand good debt vs. bad debt. Good debt: low-interest loans that build wealth or increase earning potential (mortgage, student loans for valuable degrees, business loans). Bad debt: high-interest consumer debt for depreciating assets (credit cards, car loans for expensive vehicles, payday loans). Prioritize eliminating bad debt. Two proven strategies: Debt snowball (Dave Ramsey method): list debts from smallest to largest balance, pay minimums on all, put extra money toward the smallest debt. When it's paid off, roll that payment to the next smallest. This creates psychological wins and momentum. Debt avalanche (mathematically optimal): list debts by interest rate (highest to lowest), pay minimums on all, put extra money toward the highest interest debt. This saves the most money in interest. Choose based on your personality - snowball for motivation, avalanche for math. Negotiating with creditors: call credit card companies and ask for lower interest rates. If you have a good payment history, they often agree. Consolidate high-interest debt with a lower-interest personal loan or balance transfer card (watch for fees). Avoiding new debt: identify triggers that lead to overspending. Use cash or debit cards instead of credit. Implement a 24-hour rule for non-essential purchases. Build an emergency fund (even $500-$1000) to avoid using credit for unexpected expenses. This lesson provides a clear path to financial freedom."
      },
      { 
        title: "Investing for Beginners", 
        duration: "25 min", 
        type: "reading",
        description: "Demystify investing and learn to build wealth through simple, proven strategies accessible to everyone.",
        keyPoints: [
          "Compound interest: the eighth wonder of the world",
          "Index funds vs. individual stocks: simplicity wins",
          "Asset allocation: balancing risk and growth",
          "Starting small: you don't need a lot to begin"
        ],
        content: "Investing can feel intimidating, but it's essential for building wealth and financial security. This lesson demystifies investing with simple, proven strategies. Compound interest: Albert Einstein allegedly called it 'the eighth wonder of the world.' When you invest, you earn returns. Those returns earn returns. Over time, this exponential growth creates significant wealth. Example: investing $200/month at 8% annual return for 30 years yields $300,000. The key is starting early and staying consistent. Index funds vs. individual stocks: research shows that 90% of professional fund managers don't beat the market long-term. Instead of trying to pick winning stocks, invest in low-cost index funds that track the entire market (S&P 500, total stock market index). This provides instant diversification and historically averages 10% annual returns. Asset allocation: balance risk and growth based on your age and goals. A common rule: subtract your age from 110 to determine your stock percentage (e.g., at age 30, hold 80% stocks, 20% bonds). Stocks offer growth but volatility; bonds offer stability but lower returns. Rebalance annually. Tax-advantaged accounts: prioritize 401(k) (especially if employer matches - free money), Roth IRA (tax-free growth), and HSA (triple tax advantage). Starting small: you don't need thousands to start. Many brokerages allow fractional shares - invest with as little as $10. The important thing is to start. Automate investments so you're consistently building wealth. This lesson empowers you to take control of your financial future."
      },
      { 
        title: "Building Passive Income", 
        duration: "23 min", 
        type: "reading",
        description: "Explore proven strategies for creating income streams that generate money while you sleep.",
        keyPoints: [
          "Passive income myths: it requires upfront work",
          "Dividend investing: earning income from stock ownership",
          "Real estate: rental properties and REITs",
          "Digital products: creating once, selling repeatedly"
        ],
        content: "Passive income - earning money without active work - is the key to financial freedom. But it's often misunderstood. This lesson explores realistic passive income strategies. First, dispel the myth: passive income isn't effortless. It requires significant upfront work (creating a product, building a rental property portfolio, etc.) before it becomes passive. But once established, it generates income with minimal ongoing effort. Dividend investing: buy stocks in established companies that pay dividends (quarterly cash payments to shareholders). Dividend aristocrats (companies that have increased dividends for 25+ years) provide reliable income. Reinvest dividends to compound growth. With a large enough portfolio, dividends can fund your lifestyle. Real estate: rental properties generate monthly income. Challenges include upfront capital, property management, and market risk. Alternative: Real Estate Investment Trusts (REITs) - companies that own income-producing real estate. You can invest in REITs like stocks, earning dividends without managing properties. Digital products: create once, sell repeatedly. Options include: online courses (teach your expertise), ebooks (self-publish on Amazon), stock photography, music, software, templates, or membership sites. Requires upfront creation effort but can generate income indefinitely. Affiliate marketing: promote others' products and earn commissions. Build an audience (blog, YouTube, social media), provide value, recommend products you genuinely use. Peer-to-peer lending: lend money through platforms like LendingClub, earning interest. Higher risk than savings accounts but potentially higher returns. This lesson provides a roadmap to building income streams that create financial freedom."
      }
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
      { 
        title: "The Science of Goal Setting", 
        duration: "17 min", 
        type: "reading",
        description: "Understand the neuroscience and psychology behind effective goal-setting and why most goals fail.",
        keyPoints: [
          "Why 92% of New Year's resolutions fail",
          "The neuroscience of motivation and reward",
          "Approach goals vs. avoidance goals",
          "The power of implementation intentions"
        ],
        content: "Research shows that 92% of New Year's resolutions fail. But it's not because people lack willpower - it's because they use ineffective goal-setting strategies. This lesson teaches the science of what actually works. Why goals fail: vague goals ('get healthier'), outcome-only focus (ignoring the process), unrealistic timelines, lack of systems, and no accountability. The neuroscience of motivation: your brain's reward system (dopamine) drives goal pursuit. But dopamine spikes when you anticipate reward, not when you achieve it. This is why starting feels exciting but following through is hard. Solution: create small wins along the way to maintain dopamine. Approach vs. avoidance goals: approach goals (what you want to achieve) are more motivating than avoidance goals (what you want to stop). 'Exercise 3x per week' beats 'stop being lazy.' Frame goals positively. Implementation intentions: research by Peter Gollwitzer shows that specifying when, where, and how you'll act dramatically increases success. Instead of 'I'll exercise more,' say 'I'll go to the gym Monday, Wednesday, Friday at 6 AM before work.' This pre-commitment reduces decision fatigue. Identity-based goals: James Clear's research shows that goals tied to identity ('I'm a runner') are more sustainable than outcome goals ('I want to run a marathon'). When your goal aligns with who you are, you're intrinsically motivated. This lesson transforms how you approach goals."
      },
      { 
        title: "SMART Goals Workshop", 
        duration: "15 min", 
        type: "exercise",
        description: "Transform vague aspirations into Specific, Measurable, Achievable, Relevant, and Time-bound goals.",
        keyPoints: [
          "Specific: crystal clear, no ambiguity",
          "Measurable: track progress objectively",
          "Achievable: challenging but realistic",
          "Relevant: aligned with your values and bigger vision",
          "Time-bound: clear deadline creates urgency"
        ],
        content: "SMART goals are a proven framework for turning vague wishes into achievable outcomes. This workshop guides you through creating SMART goals. Specific: vague goals like 'get fit' fail because your brain doesn't know what to do. Specific goals like 'lose 15 pounds by exercising 4x per week and eating 1800 calories daily' give your brain a clear target. Ask: What exactly do I want to achieve? Why is it important? Who is involved? Where will it happen? Measurable: you need objective criteria to track progress. 'Lose 15 pounds' is measurable. 'Feel better' is not. Measurable goals let you celebrate progress and adjust course. Ask: How will I know when I've achieved this? What metrics will I track? Achievable: goals should stretch you but not break you. Setting an impossible goal (lose 50 pounds in a month) leads to failure and demotivation. Consider your resources, constraints, and current situation. Ask: Is this realistic given my circumstances? What obstacles might I face? Relevant: goals should align with your values and long-term vision. A goal to 'make $1 million' is irrelevant if you value time freedom over money. Ask: Does this goal matter to me? Does it align with my values and bigger vision? Time-bound: deadlines create urgency and prevent procrastination. 'Someday' never comes. 'By December 31' forces action. Include milestones for long-term goals. Ask: When will I achieve this? What are my milestones? This workshop includes a step-by-step SMART goal template. You'll leave with crystal-clear, actionable goals."
      },
      { 
        title: "Creating Your Action Plan", 
        duration: "20 min", 
        type: "reading",
        description: "Break down big goals into daily actions using proven project management and productivity frameworks.",
        keyPoints: [
          "Reverse engineering: start with the end in mind",
          "The 90-day sprint: balancing urgency and sustainability",
          "Daily non-negotiables: the actions that move the needle",
          "Tracking and reviewing: weekly check-ins for course correction"
        ],
        content: "A goal without a plan is just a wish. This lesson teaches you to create actionable plans that bridge the gap between where you are and where you want to be. Reverse engineering: start with your goal and work backwards. If your goal is to run a marathon in 6 months, what needs to happen in month 5? Month 3? This week? This creates a roadmap. The 90-day sprint: long-term goals (1 year+) feel abstract and distant. Break them into 90-day sprints. What can you achieve in the next 90 days that moves you toward your goal? This creates urgency without burnout. Quarterly planning is used by top companies and high performers because it balances short-term focus with long-term vision. Breaking down goals: use the chunking method. If your goal is to write a book (overwhelming), break it down: 50,000 words ÷ 90 days = 555 words/day (manageable). Big goals become doable when broken into daily actions. Daily non-negotiables: identify the 1-3 actions that, if done daily, guarantee progress. For weight loss, it might be: track calories, exercise 30 minutes, drink 8 glasses of water. These become your daily non-negotiables - you do them no matter what. Tracking and reviewing: what gets measured gets managed. Track your daily actions and review weekly. Ask: What worked? What didn't? What do I need to adjust? This prevents you from staying on a failing path for months. This lesson provides templates for 90-day plans, weekly reviews, and daily action trackers. You'll have a clear roadmap to your goal."
      },
      { 
        title: "Overcoming Obstacles", 
        duration: "18 min", 
        type: "reading",
        description: "Anticipate and overcome common obstacles that derail goal achievement using mental contrasting and contingency planning.",
        keyPoints: [
          "Mental contrasting: visualizing success AND obstacles",
          "If-then planning: pre-deciding how you'll handle challenges",
          "The fresh start effect: using new beginnings to reset",
          "Self-compassion: bouncing back from setbacks"
        ],
        content: "Every goal faces obstacles. The difference between success and failure is how you handle them. This lesson teaches evidence-based strategies for overcoming obstacles. Mental contrasting: research by Gabriele Oettingen shows that positive visualization alone doesn't work - it can actually reduce motivation by making you feel like you've already succeeded. Instead, use mental contrasting: visualize your desired outcome, then visualize the obstacles you'll face. This creates realistic optimism and prepares you for challenges. If-then planning (implementation intentions): pre-decide how you'll handle obstacles. 'If I feel too tired to exercise, then I'll do a 10-minute walk instead.' 'If I'm tempted by junk food, then I'll eat an apple first.' This removes decision-making in the moment when willpower is low. Common obstacles: lack of time (solution: schedule it like an appointment), lack of motivation (solution: focus on identity, not outcomes), lack of support (solution: find an accountability partner), unexpected life events (solution: build flexibility into your plan). The fresh start effect: research shows that people are more likely to pursue goals after temporal landmarks (New Year, birthdays, Mondays). Use these as reset points. If you fall off track, don't wait until next year - use the next Monday as a fresh start. Self-compassion: research by Kristin Neff shows that self-compassion (treating yourself kindly after setbacks) predicts goal achievement better than self-criticism. When you stumble, acknowledge it without judgment, learn from it, and move forward. Beating yourself up leads to giving up. This lesson helps you anticipate obstacles and build resilience."
      },
      { 
        title: "Accountability Systems", 
        duration: "14 min", 
        type: "reading",
        description: "Build external accountability structures that dramatically increase your odds of achieving goals.",
        keyPoints: [
          "The power of social accountability: you're 65% more likely to achieve goals when accountable to someone",
          "Finding the right accountability partner: characteristics that matter",
          "Commitment devices: making it costly to quit",
          "Public declarations: the power of going public"
        ],
        content: "Research shows you're 65% more likely to achieve a goal if you commit to someone, and 95% more likely if you have ongoing accountability check-ins. This lesson teaches you to build accountability systems. Why accountability works: when you're only accountable to yourself, it's easy to rationalize excuses. External accountability creates social pressure (in a good way) and makes quitting harder. Finding an accountability partner: choose someone who: is also pursuing goals (mutual accountability), will be honest and supportive (not just cheerleading), is reliable (shows up for check-ins), and ideally has achieved similar goals. This could be a friend, colleague, or coach. Structure: meet weekly (in-person, phone, or video). Share what you committed to last week, what you actually did, what you learned, and what you're committing to this week. Keep it short (15-30 minutes) and consistent. Commitment devices: these are strategies that make quitting costly. Examples: financial stakes (bet money you'll achieve your goal using apps like StickK), public declarations (announce your goal on social media), prepayment (pay for a gym membership or course upfront), or accountability groups (join a mastermind or group program). The key is making the cost of quitting higher than the cost of continuing. Public declarations: research shows that publicly stating your goal increases commitment. Tell friends, family, or social media. The fear of public failure motivates action. But be careful: some research suggests that talking about goals can give you a premature sense of accomplishment. Balance public declaration with private execution. This lesson provides templates for accountability partnerships and commitment contracts. You'll build a system that keeps you on track."
      }
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
      { 
        title: "The Habit Loop Explained", 
        duration: "16 min", 
        type: "reading",
        description: "Understand the neurological pattern that drives all habits and how to rewire it for lasting change.",
        keyPoints: [
          "The habit loop: cue, craving, response, reward",
          "How habits are stored in the basal ganglia",
          "Why willpower fails and systems succeed",
          "The role of dopamine in habit formation"
        ],
        content: "Every habit follows a neurological pattern called the habit loop, discovered by MIT researchers. Understanding this loop is the key to building good habits and breaking bad ones. The habit loop has four stages: Cue (trigger that initiates the behavior), Craving (the motivational force - you don't crave the habit itself, you crave the change in state it delivers), Response (the actual habit you perform), and Reward (the end goal - it satisfies your craving and teaches your brain to remember this loop for the future). Example: Your phone buzzes (cue), you feel curious about the notification (craving), you check your phone (response), you satisfy your curiosity (reward). Your brain logs this: 'When phone buzzes, check it for satisfaction.' The neuroscience: habits are stored in the basal ganglia, a primitive part of your brain. This is why habits feel automatic - they literally bypass your conscious decision-making. Your prefrontal cortex (willpower center) has limited capacity, but your basal ganglia can run unlimited habits simultaneously. This is why 'just use willpower' fails. Why systems beat willpower: willpower is finite and depletes throughout the day. Systems (automatic habits) don't require willpower. The goal isn't to eliminate bad habits through sheer force - it's to redesign the habit loop. Dopamine's role: dopamine spikes when you anticipate reward, not when you receive it. This is why cravings drive behavior. Understanding this helps you engineer habits: make the cue obvious, the craving attractive, the response easy, and the reward satisfying. This lesson gives you the foundation for all habit change."
      },
      { 
        title: "Identifying Your Keystone Habits", 
        duration: "12 min", 
        type: "exercise",
        description: "Discover the small habits that create cascading positive changes across your entire life.",
        keyPoints: [
          "What makes a habit 'keystone': ripple effects across multiple areas",
          "Common keystone habits: exercise, sleep, meditation",
          "Identifying YOUR unique keystone habits",
          "Starting small: the 2-minute rule"
        ],
        content: "Not all habits are created equal. Keystone habits are small changes that trigger chain reactions, transforming multiple areas of your life. This exercise helps you identify yours. What makes a keystone habit: it creates a ripple effect. When you exercise regularly, you naturally start eating better, sleeping better, being more productive, and feeling more confident. One habit cascades into many positive changes. Common keystone habits: Exercise (improves mood, energy, sleep, confidence, discipline), Quality sleep (improves decision-making, emotional regulation, physical health), Meditation (improves focus, emotional control, stress management), Making your bed (starts your day with a win, creates order), Meal planning (improves nutrition, saves money, reduces decision fatigue), Journaling (increases self-awareness, emotional processing, clarity). Identifying YOUR keystone habits: reflect on your past. When have you felt your best? What habits were you practicing? What single habit, if established, would make the biggest difference in your life right now? Consider your current challenges - what habit would address multiple issues? The 2-minute rule: start ridiculously small. Want to build an exercise habit? Start with 2 minutes of movement. Want to meditate? Start with 2 minutes. The goal isn't the 2 minutes - it's to establish the identity ('I'm someone who exercises daily'). Once the habit is established, you can scale up. But most people fail because they start too big. This exercise includes a keystone habit identification worksheet. You'll leave with 1-3 keystone habits to focus on."
      },
      { 
        title: "Habit Stacking Mastery", 
        duration: "18 min", 
        type: "reading",
        description: "Build new habits by linking them to existing routines, creating automatic behavior chains.",
        keyPoints: [
          "The habit stacking formula: After [CURRENT HABIT], I will [NEW HABIT]",
          "Choosing the right anchor habit: frequency and consistency matter",
          "Stacking multiple habits: building powerful routines",
          "Common mistakes and how to avoid them"
        ],
        content: "Habit stacking is a powerful technique developed by BJ Fogg and popularized by James Clear. Instead of relying on motivation, you link new habits to existing ones, creating automatic chains. The formula: 'After [CURRENT HABIT], I will [NEW HABIT].' Examples: 'After I pour my morning coffee, I will meditate for 2 minutes.' 'After I sit down for dinner, I will say one thing I'm grateful for.' 'After I close my laptop at end of workday, I will do 10 pushups.' The power: your current habit serves as the cue for your new habit. You don't need to remember or rely on motivation - the existing habit triggers the new one automatically. Choosing anchor habits: pick habits you already do consistently (brushing teeth, pouring coffee, sitting down at your desk, getting in your car, etc.). The more consistent the anchor, the more reliable the stack. Frequency matters: if you want a daily habit, anchor it to a daily habit. Stacking multiple habits: you can create powerful routines by stacking several habits. Morning routine example: 'After my alarm goes off, I will drink a glass of water. After I drink water, I will do 5 minutes of stretching. After I stretch, I will meditate for 5 minutes. After I meditate, I will write 3 things I'm grateful for.' This creates an automatic sequence. Common mistakes: Stacking too many habits at once (start with 1-2), Choosing inconsistent anchors (habits you don't do reliably), Making the new habit too big (keep it small), Not being specific about the anchor (vague cues don't trigger behavior). This lesson includes habit stacking templates for morning, evening, and work routines. You'll build automatic behavior chains."
      },
      { 
        title: "Breaking Bad Habits", 
        duration: "20 min", 
        type: "reading",
        description: "Eliminate destructive habits by understanding their function and replacing them with healthier alternatives.",
        keyPoints: [
          "You can't eliminate a bad habit, you can only replace it",
          "Identifying the true craving: what need does this habit serve?",
          "Making bad habits invisible, unattractive, difficult, and unsatisfying",
          "Replacement habits: finding healthier alternatives"
        ],
        content: "Bad habits are hard to break because they serve a function. This lesson teaches you to eliminate destructive patterns by addressing their root cause. The replacement principle: neuroscience shows you can't simply delete a habit - the neural pathway remains. Instead, you must replace the bad habit with a better one that satisfies the same craving. Example: if you stress-eat, you can't just 'stop eating when stressed.' You need a replacement that relieves stress (walk, call a friend, deep breathing). Identifying the true craving: bad habits persist because they provide a reward. Smoking isn't about nicotine - it's about stress relief, social connection, or taking a break. Identify what your bad habit actually provides. Ask: What do I feel right before doing this habit? What do I feel after? What would I lose if I stopped? The four laws of breaking bad habits (inverse of building good habits): Make it invisible (remove cues - if you watch too much TV, unplug it and put the remote in another room), Make it unattractive (reframe it - instead of 'I can't have junk food,' say 'I don't eat junk food' - identity shift), Make it difficult (add friction - if you scroll social media too much, log out after each use and delete apps from your phone), Make it unsatisfying (accountability partner, habit tracker where you mark days you avoid the habit). Common bad habits and replacements: Stress eating → Stress walk or call a friend, Excessive social media → Read a book or call someone, Procrastination → 2-minute rule (just start for 2 minutes), Nail biting → Hold a stress ball, Smoking → Chew gum or do deep breathing. The key is finding a replacement that satisfies the same craving. This lesson provides a bad habit elimination worksheet. You'll identify the function of your bad habit and design a replacement strategy."
      },
      { 
        title: "Environment Design for Habits", 
        duration: "15 min", 
        type: "reading",
        description: "Engineer your physical environment to make good habits inevitable and bad habits impossible.",
        keyPoints: [
          "Environment is the invisible hand that shapes behavior",
          "The 20-second rule: reducing friction for good habits",
          "Visual cues: making good habits obvious",
          "Removing temptation: out of sight, out of mind"
        ],
        content: "Your environment shapes your behavior more than motivation or willpower. This lesson teaches you to design spaces that make success inevitable. Environment is the invisible hand: research shows that behavior is a function of the person AND the environment. You can have strong willpower, but if your environment works against you, you'll fail. Example: keeping junk food in your pantry and expecting willpower to resist is setting yourself up for failure. Remove the junk food (change environment) and you don't need willpower. The 20-second rule: Shawn Achor's research shows that reducing the activation energy for good habits by just 20 seconds dramatically increases follow-through. Examples: Want to exercise in the morning? Sleep in your workout clothes. Want to eat healthier? Pre-cut vegetables and put them at eye level in your fridge. Want to read more? Place a book on your pillow. The easier you make good habits, the more likely you'll do them. Increasing friction for bad habits: make bad habits 20 seconds harder. Want to watch less TV? Unplug it and put the remote in another room. Want to reduce social media? Delete apps from your phone (you can still access via browser, but the extra friction reduces mindless scrolling). Visual cues: make good habits obvious. Want to drink more water? Put a water bottle on your desk. Want to take vitamins? Put them next to your coffee maker. Want to practice guitar? Put your guitar in the middle of your living room. The more visible the cue, the more likely you'll act. Context matters: designate specific spaces for specific activities. Work at your desk, relax on your couch, sleep in your bed. Don't blur contexts (no working in bed) - this weakens the environmental cues. This lesson includes an environment audit checklist. You'll redesign your spaces for success."
      }
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
      { 
        title: "The Science of Sleep", 
        duration: "19 min", 
        type: "reading",
        description: "Understand the fascinating neuroscience of sleep and why it's the most powerful performance enhancer available.",
        keyPoints: [
          "The four stages of sleep and what happens in each",
          "REM vs. deep sleep: different functions, both essential",
          "Sleep cycles: why 7-9 hours matters",
          "The devastating effects of chronic sleep deprivation"
        ],
        content: "Sleep is not a luxury or a waste of time - it's a biological necessity as fundamental as food and water. This lesson reveals the remarkable neuroscience of sleep. You'll discover the four stages of sleep: N1 (light transition), N2 (deeper relaxation where most sleep occurs), N3 (deep slow-wave sleep where physical restoration happens), and REM (rapid eye movement sleep where memory consolidation and emotional processing occur). You cycle through these stages 4-6 times per night, each cycle lasting about 90 minutes. Deep sleep dominates the first half of the night (physical recovery, growth hormone release, immune system strengthening), while REM sleep dominates the second half (memory consolidation, learning, creativity, emotional regulation). Cut your sleep short and you disproportionately lose REM sleep. You'll learn why 7-9 hours is the sweet spot for most adults - less than 7 hours chronically impairs cognitive function, emotional regulation, immune function, and metabolic health. You'll understand that sleep deprivation is cumulative - you can't 'catch up' on weekends. Most powerfully, you'll discover that sleep is when your brain clears toxic waste products (including amyloid-beta, linked to Alzheimer's), consolidates memories, and integrates learning. No pill, supplement, or biohack can replace adequate sleep. This lesson will transform how you prioritize rest."
      },
      { 
        title: "Creating Your Sleep Sanctuary", 
        duration: "14 min", 
        type: "exercise",
        description: "Transform your bedroom into an environment optimized for deep, restorative sleep.",
        keyPoints: [
          "Temperature: cool is crucial (65-68°F ideal)",
          "Darkness: blocking all light for melatonin production",
          "Quiet: managing noise for uninterrupted sleep",
          "Comfort: mattress, pillows, and bedding that support you"
        ],
        content: "Your bedroom environment profoundly affects sleep quality. This practical exercise guides you through optimizing every aspect of your sleep sanctuary. Temperature: your body needs to drop its core temperature to initiate sleep - keep your room cool (65-68°F is ideal). Use breathable bedding, consider a fan, or adjust your thermostat. Darkness: even small amounts of light can suppress melatonin production and disrupt sleep. Install blackout curtains or use an eye mask. Cover or remove electronic lights (alarm clocks, chargers, etc.). Quiet: noise disruptions fragment sleep even if you don't fully wake. Use earplugs, a white noise machine, or a fan to mask disruptive sounds. If you live in a noisy environment, consider soundproofing. Comfort: invest in a quality mattress that supports your body (replace every 7-10 years), pillows that keep your spine aligned, and bedding that feels good against your skin. Remove clutter - your bedroom should be a calm, dedicated sleep space, not an office or entertainment center. Remove TVs, computers, and work materials if possible. This exercise includes a room-by-room checklist to systematically optimize your sleep environment. Small changes can yield dramatic improvements in sleep quality."
      },
      { 
        title: "Sleep Hygiene Essentials", 
        duration: "17 min", 
        type: "reading",
        description: "Master the daily habits and routines that set you up for consistently excellent sleep.",
        keyPoints: [
          "Consistent sleep schedule: same bedtime and wake time daily",
          "Morning sunlight exposure: setting your circadian rhythm",
          "Caffeine cutoff: no stimulants after 2 PM",
          "Wind-down routine: signaling your body it's time for sleep"
        ],
        content: "Sleep hygiene refers to the behaviors and environmental factors that prepare you for quality sleep. This lesson teaches the essential practices. Consistency: go to bed and wake up at the same time every day, including weekends. Your body craves predictability - irregular sleep schedules confuse your circadian rhythm. Morning sunlight: get bright light exposure (ideally sunlight) within 30-60 minutes of waking. This sets your circadian clock and promotes alertness during the day and sleepiness at night. Caffeine management: caffeine has a half-life of 5-6 hours. If you drink coffee at 4 PM, half the caffeine is still in your system at 10 PM. Cut off caffeine by early afternoon. Alcohol caution: while alcohol may help you fall asleep, it fragments sleep and suppresses REM sleep. Limit alcohol and avoid it close to bedtime. Exercise: regular physical activity improves sleep quality, but intense exercise too close to bedtime can be stimulating. Finish workouts at least 2-3 hours before bed. Wind-down routine: create a 30-60 minute pre-bed routine that signals your body it's time to sleep. This might include dimming lights, reading, gentle stretching, meditation, or journaling. Avoid screens (the blue light suppresses melatonin), stressful conversations, and stimulating activities. Your wind-down routine becomes a powerful sleep cue. These practices compound - each one makes a small difference, but together they transform your sleep."
      },
      { 
        title: "Overcoming Insomnia", 
        duration: "21 min", 
        type: "reading",
        description: "Evidence-based strategies to break the cycle of insomnia and reclaim restful sleep.",
        keyPoints: [
          "Understanding the insomnia cycle: anxiety about sleep perpetuates sleeplessness",
          "Cognitive behavioral therapy for insomnia (CBT-I): the gold standard treatment",
          "Sleep restriction therapy: counterintuitive but highly effective",
          "Thought reframing: changing your relationship with sleeplessness"
        ],
        content: "Insomnia - difficulty falling asleep, staying asleep, or waking too early - affects millions and can feel hopeless. But insomnia is highly treatable without medication. This lesson teaches cognitive behavioral therapy for insomnia (CBT-I), the gold standard treatment with better long-term outcomes than sleeping pills. You'll understand the insomnia cycle: you have trouble sleeping, which creates anxiety about sleep, which makes it harder to sleep, creating more anxiety. Breaking this cycle requires changing both behaviors and thoughts. Sleep restriction therapy: this counterintuitive technique involves initially limiting time in bed to match your actual sleep time (if you sleep 5 hours but spend 8 hours in bed, you'd limit bed time to 5-5.5 hours). This builds sleep pressure and consolidates sleep. As sleep improves, you gradually increase time in bed. Stimulus control: use your bed only for sleep and sex - no reading, TV, or phone use in bed. If you can't sleep after 20 minutes, get up and do a quiet activity until you feel sleepy. This strengthens the bed-sleep association. Cognitive reframing: challenge catastrophic thoughts about sleep ('I'll never sleep again,' 'I can't function without sleep'). The truth: humans are remarkably resilient, and one bad night won't ruin you. Paradoxically, accepting sleeplessness reduces the anxiety that perpetuates it. This lesson provides a structured program to overcome insomnia and reclaim restful sleep."
      },
      { 
        title: "Power Napping Strategies", 
        duration: "10 min", 
        type: "reading",
        description: "Learn to use strategic naps to boost alertness, performance, and creativity without disrupting nighttime sleep.",
        keyPoints: [
          "The optimal nap length: 10-20 minutes for alertness, 90 minutes for full cycle",
          "Timing your nap: early afternoon is ideal",
          "The caffeine nap: combining coffee and a short nap for maximum alertness",
          "When not to nap: if you have insomnia or sleep debt"
        ],
        content: "Napping is a powerful tool for boosting alertness, performance, and mood - if done correctly. This lesson teaches you to nap strategically. The power nap (10-20 minutes): this brief nap provides a quick boost in alertness and performance without entering deep sleep. You wake feeling refreshed, not groggy. Perfect for an afternoon energy dip. The full-cycle nap (90 minutes): this allows you to complete a full sleep cycle, including REM sleep. You wake at the end of a cycle feeling refreshed. Useful if you're sleep-deprived or need creative problem-solving. Avoid naps between 20-60 minutes - you'll wake during deep sleep feeling groggy (sleep inertia). Timing: nap in the early afternoon (1-3 PM) when there's a natural dip in circadian alertness. Napping too late can interfere with nighttime sleep. The caffeine nap: drink a cup of coffee, then immediately take a 15-20 minute nap. Caffeine takes about 20 minutes to kick in, so you wake as it's taking effect, feeling doubly alert. When not to nap: if you have insomnia, daytime naps can reduce sleep pressure and make it harder to fall asleep at night. If you're chronically sleep-deprived, naps are a band-aid - prioritize getting adequate nighttime sleep. This lesson helps you use naps as a strategic tool, not a crutch."
      }
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
      { 
        title: "Understanding Stress Response", 
        duration: "18 min", 
        type: "reading",
        description: "Learn how your body and brain respond to stress, and why chronic stress is so damaging.",
        keyPoints: [
          "The fight-or-flight response: evolutionary advantage, modern problem",
          "Acute vs. chronic stress: why chronic stress kills",
          "Cortisol and health: weight gain, inflammation, disease",
          "The stress-perception connection: it's not what happens, it's how you interpret it"
        ],
        content: "Stress is your body's response to perceived threats. Understanding this response is the first step to managing it. The fight-or-flight response: when you perceive danger, your amygdala (fear center) triggers a cascade of hormones - adrenaline and cortisol. Your heart rate increases, blood pressure rises, muscles tense, digestion stops, and your prefrontal cortex (rational thinking) shuts down. This was lifesaving when running from predators. But today, your brain can't distinguish between a lion and an angry email - it triggers the same response. Acute vs. chronic stress: acute stress (short-term) is healthy - it helps you perform under pressure. Chronic stress (constant activation) is deadly. When cortisol stays elevated, it causes: weight gain (especially belly fat), inflammation (root of most diseases), weakened immune system, high blood pressure, anxiety and depression, memory problems, and accelerated aging. The stress-perception connection: stress isn't caused by external events - it's caused by your perception of them. Two people can experience the same event (traffic jam) with different stress levels. One sees it as a disaster, the other as a chance to listen to a podcast. This is why stress management focuses on changing perception, not just circumstances. Common stress triggers: work pressure, financial worries, relationship conflict, health concerns, information overload, lack of control, uncertainty about the future. The good news: you can rewire your stress response through techniques taught in this module."
      },
      { 
        title: "Box Breathing Technique", 
        duration: "8 min", 
        type: "practice",
        description: "Master this Navy SEAL technique to instantly calm your nervous system and reduce stress in 2 minutes.",
        keyPoints: [
          "How breathwork activates the parasympathetic nervous system",
          "The box breathing pattern: inhale 4, hold 4, exhale 4, hold 4",
          "When to use it: before meetings, during anxiety, before sleep",
          "Why it works: CO2 tolerance and vagal tone"
        ],
        content: "Box breathing is a powerful technique used by Navy SEALs to stay calm under extreme pressure. It works by activating your parasympathetic nervous system (rest-and-digest mode), counteracting the stress response. How it works: when you're stressed, your breathing becomes shallow and rapid. This signals danger to your brain, perpetuating the stress cycle. Deep, slow breathing signals safety, activating the vagus nerve and calming your entire system. The technique: Inhale through your nose for 4 counts, Hold your breath for 4 counts, Exhale through your mouth for 4 counts, Hold empty for 4 counts. Repeat for 5-10 cycles (2-4 minutes). Why it works: the extended exhale and hold increases CO2 tolerance, which calms anxiety. The rhythmic pattern gives your mind something to focus on, interrupting anxious thoughts. The breath hold stimulates the vagus nerve, which controls your relaxation response. When to use it: Before stressful events (meetings, presentations, difficult conversations), During anxiety or panic attacks (it's impossible to have a panic attack while doing box breathing), Before sleep (it calms your nervous system), Anytime you need to reset. This practice includes a guided audio session. You'll learn to use your breath as an instant stress-relief tool."
      },
      { 
        title: "Cognitive Stress Reframing", 
        duration: "20 min", 
        type: "reading",
        description: "Change your relationship with stress by reframing how you interpret stressful situations.",
        keyPoints: [
          "The ABC model: Activating event, Belief, Consequence",
          "Common cognitive distortions that amplify stress",
          "Reframing techniques: finding alternative interpretations",
          "The stress-is-enhancing mindset: research by Alia Crum"
        ],
        content: "Your stress isn't caused by events - it's caused by your thoughts about events. This lesson teaches cognitive reframing to reduce stress. The ABC model (Albert Ellis): Activating event (something happens), Belief (your interpretation), Consequence (your emotional response). Example: A - Your boss emails 'We need to talk.' B - 'I'm getting fired!' C - Anxiety and panic. Different belief: 'Maybe it's about the project update.' Different consequence: Calm curiosity. Your belief determines your stress level, not the event. Common cognitive distortions: Catastrophizing ('This will be a disaster'), Black-and-white thinking ('I'm a total failure'), Mind reading ('They think I'm incompetent'), Fortune telling ('This will never work out'), Overgeneralization ('I always mess up'). These distortions amplify stress. Reframing techniques: Question your thoughts - 'Is this thought true? What evidence do I have?' Find alternative explanations - 'What are 3 other ways to interpret this?' Worst-case scenario - 'What's the worst that could happen? Could I handle it?' Best-case scenario - 'What's the best possible outcome?' Most likely scenario - 'What will probably happen?' This creates balanced thinking. The stress-is-enhancing mindset: research by Alia Crum shows that viewing stress as enhancing (rather than debilitating) improves performance and health. When you feel stress, tell yourself: 'This stress is preparing me to perform. My body is giving me energy to handle this challenge.' This reframe changes your physiology. This lesson includes a cognitive reframing worksheet. You'll learn to challenge stress-inducing thoughts."
      },
      { 
        title: "Progressive Muscle Relaxation", 
        duration: "15 min", 
        type: "practice",
        description: "Release physical tension stored in your body through systematic muscle relaxation.",
        keyPoints: [
          "The mind-body connection: how physical tension creates mental stress",
          "The tense-and-release technique: why it works",
          "Full-body PMR sequence: from toes to head",
          "When to practice: daily prevention vs. acute stress relief"
        ],
        content: "Stress lives in your body as muscle tension. Progressive Muscle Relaxation (PMR) is a proven technique to release this tension and calm your mind. The mind-body connection: your mind and body are interconnected. When you're stressed, your muscles tense (especially shoulders, neck, jaw). This tension signals danger to your brain, perpetuating stress. By releasing physical tension, you calm your mind. The technique: PMR involves systematically tensing and relaxing each muscle group. Why tense before relaxing? Tensing helps you notice where you hold tension, and the contrast makes relaxation deeper. The sequence: Start with your toes - curl them tightly for 5 seconds, then release and notice the relaxation for 10 seconds. Move up: feet, calves, thighs, glutes, stomach, chest, hands, arms, shoulders, neck, face. The entire sequence takes 10-15 minutes. Key principles: Focus on the contrast between tension and relaxation, Breathe deeply throughout, Don't tense so hard it hurts, Notice the feeling of relaxation spreading. When to practice: Daily prevention (before bed to improve sleep quality), Acute stress relief (during high-stress moments), Before important events (to calm pre-performance anxiety), After workouts (to enhance recovery). Benefits: Reduces muscle tension and pain, Lowers blood pressure and heart rate, Improves sleep quality, Increases body awareness, Provides a mental break from rumination. This practice includes a guided 15-minute PMR audio session. You'll learn to release stress stored in your body."
      },
      { 
        title: "Building Stress Resilience", 
        duration: "22 min", 
        type: "reading",
        description: "Develop long-term resilience to handle stress without breaking down.",
        keyPoints: [
          "Resilience is trainable: it's not a fixed trait",
          "The four pillars of resilience: physical, mental, emotional, spiritual",
          "Hormetic stress: how controlled stress builds resilience",
          "Recovery is as important as stress management"
        ],
        content: "Stress resilience is your ability to bounce back from adversity. This lesson teaches you to build unshakeable resilience. Resilience is trainable: some people seem naturally resilient, but research shows resilience is a set of skills you can develop. It's not about avoiding stress - it's about adapting to it. The four pillars of resilience: Physical (exercise, sleep, nutrition - a strong body handles stress better), Mental (cognitive flexibility, optimism, problem-solving - a flexible mind adapts to challenges), Emotional (emotional regulation, self-compassion, social support - healthy emotional processing prevents breakdown), Spiritual (purpose, meaning, values - a strong 'why' helps you endure hardship). Strengthen all four pillars. Hormetic stress: small doses of stress make you stronger (like exercise tears muscles to build them back stronger). Examples: Cold exposure (cold showers build stress tolerance), Exercise (physical stress improves resilience), Fasting (metabolic stress enhances cellular repair), Challenging conversations (social stress builds confidence). The key is controlled, recoverable stress. Recovery is crucial: stress isn't the problem - lack of recovery is. High performers alternate between stress and recovery. Build recovery into your day: breaks between meetings, walks after intense work, screen-free evenings, weekly rest days. Without recovery, stress accumulates and breaks you down. Building social support: resilient people have strong social connections. Cultivate relationships where you can be vulnerable. Join communities, maintain friendships, seek therapy or coaching when needed. Connection is a buffer against stress. This lesson provides a resilience-building action plan. You'll develop the capacity to handle whatever life throws at you."
      }
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
      { 
        title: "Why Journaling Works", 
        duration: "14 min", 
        type: "reading",
        description: "Understand the science behind journaling and why it's one of the most powerful tools for personal growth.",
        keyPoints: [
          "The neuroscience of expressive writing: how writing rewires your brain",
          "Journaling reduces anxiety and depression: research by James Pennebaker",
          "The clarifying effect: writing forces structured thinking",
          "Different journaling styles for different goals"
        ],
        content: "Journaling is one of the most researched and effective tools for mental health and personal growth. This lesson explains why it works. The neuroscience of expressive writing: when you write about your thoughts and emotions, you activate your prefrontal cortex (rational brain) while processing emotional content from your limbic system. This integration helps you make sense of experiences and reduces emotional reactivity. Writing literally rewires your brain. Research by James Pennebaker: psychologist James Pennebaker conducted groundbreaking research on expressive writing. He found that writing about traumatic or stressful experiences for just 15-20 minutes per day for 3-4 days led to: Reduced anxiety and depression, Improved immune function, Better physical health, Higher academic and work performance, Increased emotional well-being. The benefits lasted months after the writing stopped. The clarifying effect: thoughts in your head are often jumbled and overwhelming. Writing forces you to structure them into coherent sentences. This process clarifies your thinking. You gain perspective, identify patterns, and find solutions. It's like having a conversation with yourself. Different journaling styles: Stream of consciousness (Morning Pages - write whatever comes to mind, no filter), Gratitude journaling (list things you're grateful for), Reflective journaling (process experiences and emotions), Goal-oriented journaling (track progress toward goals), Prompted journaling (answer specific questions). Choose the style that fits your needs. When to journal: Morning (set intentions for the day), Evening (reflect on the day), After stressful events (process emotions), When making decisions (clarify thinking), Anytime you feel overwhelmed. This lesson provides guidance on choosing your journaling approach."
      },
      { 
        title: "Morning Pages Practice", 
        duration: "10 min", 
        type: "exercise",
        description: "Learn Julia Cameron's transformative practice of writing three pages of stream-of-consciousness every morning.",
        keyPoints: [
          "What are Morning Pages: 3 pages of longhand writing, first thing in the morning",
          "The rules: no editing, no judgment, no one else reads them",
          "What to write: whatever comes to mind - worries, dreams, to-do lists, anything",
          "The benefits: clears mental clutter, enhances creativity, reduces anxiety"
        ],
        content: "Morning Pages is a practice developed by Julia Cameron in 'The Artist's Way.' It's simple but transformative: write three pages of longhand, stream-of-consciousness writing every morning. The rules: Write first thing in the morning (before checking your phone or email), Write three pages (about 750 words), Write by hand (not typed - the physical act matters), Write whatever comes to mind (no editing, no judgment), Don't read what you wrote (at least not for several weeks). What to write: anything and everything. Your worries, your dreams, your to-do list, complaints, gratitudes, random thoughts. The content doesn't matter - the act of writing does. Most people start with 'I don't know what to write' and then fill three pages. Why it works: Morning Pages clears mental clutter. Your mind is full of thoughts, worries, and to-dos. Writing them down frees up mental space. It's like emptying your mental cache. This creates clarity and calm for the rest of your day. It also accesses your subconscious - before your rational mind fully wakes up, you can tap into deeper insights. Common objections: 'I don't have time' (it takes 20-30 minutes - wake up earlier or replace social media scrolling), 'I'm not a writer' (you don't need to be - no one will read this), 'I don't know what to write' (that's the point - write 'I don't know what to write' until something comes). The 30-day challenge: commit to Morning Pages for 30 days. Most people report: Reduced anxiety, Increased creativity, Better decision-making, More clarity on goals and values, Improved mood. This exercise includes a Morning Pages starter guide and prompts for when you're stuck."
      },
      { 
        title: "Gratitude Journaling", 
        duration: "12 min", 
        type: "practice",
        description: "Rewire your brain for positivity and happiness through daily gratitude practice.",
        keyPoints: [
          "The neuroscience of gratitude: how it rewires your brain for happiness",
          "The practice: write 3-5 things you're grateful for each day",
          "Going deeper: why you're grateful, not just what",
          "The timing debate: morning vs. evening gratitude"
        ],
        content: "Gratitude journaling is one of the most researched positive psychology interventions. It literally rewires your brain for happiness. The neuroscience: your brain has a negativity bias - it's wired to focus on threats and problems (evolutionary survival mechanism). Gratitude practice counteracts this by training your brain to notice positive things. Regular gratitude practice increases activity in the prefrontal cortex and decreases activity in the amygdala (fear center). Over time, you become naturally more positive. The practice: every day, write 3-5 things you're grateful for. They can be big ('my health') or small ('the barista smiled at me'). The key is consistency. Research shows that people who practice gratitude journaling for just 2 weeks report: Increased happiness, Better sleep, More optimism, Stronger relationships, Improved physical health. Going deeper: don't just list things - explain why you're grateful. 'I'm grateful for my partner' is good. 'I'm grateful for my partner because they listened to me vent about work without trying to fix it' is transformative. The specificity deepens the emotional impact. The timing debate: some people prefer morning gratitude (starts the day positively), others prefer evening gratitude (reflects on the day's blessings). Research suggests evening may be slightly more effective because you're reflecting on actual experiences, not anticipating them. Experiment to find what works for you. Avoiding gratitude fatigue: don't list the same things every day. Challenge yourself to find new things. This keeps the practice fresh and trains your brain to actively seek positive experiences. This practice includes a gratitude journal template and prompts for when you're stuck."
      },
      { 
        title: "Reflective Journaling Prompts", 
        duration: "16 min", 
        type: "reading",
        description: "Use powerful prompts to process emotions, gain self-awareness, and clarify your path forward.",
        keyPoints: [
          "Prompts for processing difficult emotions",
          "Prompts for decision-making and clarity",
          "Prompts for self-discovery and values",
          "Prompts for tracking personal growth"
        ],
        content: "Reflective journaling uses specific prompts to guide deep self-exploration. This lesson provides transformative prompts for different situations. Prompts for processing difficult emotions: 'What am I feeling right now? Where do I feel it in my body?' 'What triggered this emotion? What need is not being met?' 'What would I say to a friend feeling this way?' 'What can I control in this situation? What do I need to accept?' These prompts help you process emotions rather than suppress them. Prompts for decision-making: 'What are my options? What are the pros and cons of each?' 'What would my future self advise me to do?' 'What would I do if I weren't afraid?' 'What aligns with my values?' 'What's the worst that could happen? Could I handle it?' These prompts create clarity when you're stuck. Prompts for self-discovery: 'What are my core values? Am I living in alignment with them?' 'What brings me joy? When do I feel most alive?' 'What are my strengths? How can I use them more?' 'What limiting beliefs am I holding? Are they true?' 'Who do I want to become?' These prompts deepen self-awareness. Prompts for tracking growth: 'What did I learn today/this week/this month?' 'What am I proud of?' 'What challenged me? How did I handle it?' 'What do I want to improve?' 'How have I grown since last year?' These prompts help you recognize progress. Weekly reflection prompts: 'What went well this week?' 'What didn't go well? What can I learn from it?' 'What am I grateful for?' 'What's one thing I'll do differently next week?' Weekly reflection creates continuous improvement. This lesson includes a library of 100+ journaling prompts organized by category."
      },
      { 
        title: "Building a Journaling Habit", 
        duration: "15 min", 
        type: "reading",
        description: "Make journaling a consistent practice that sticks, even when motivation fades.",
        keyPoints: [
          "Start small: 5 minutes is better than nothing",
          "Anchor it to an existing habit: habit stacking for journaling",
          "Remove friction: keep your journal visible and accessible",
          "Track your streak: use a habit tracker for accountability"
        ],
        content: "Journaling is most effective when done consistently. This lesson teaches you to build a sustainable journaling habit. Start small: don't commit to 30 minutes of journaling if you've never journaled before. Start with 5 minutes. Write one paragraph. List 3 things you're grateful for. Small and consistent beats big and sporadic. Once the habit is established, you can expand. Anchor it to an existing habit: use habit stacking. 'After I pour my morning coffee, I will write in my journal for 5 minutes.' 'After I brush my teeth at night, I will write 3 things I'm grateful for.' Linking journaling to an existing habit makes it automatic. Choose your time: Morning journaling sets intentions for the day. Evening journaling processes the day's events. Experiment to find what works for you. Consistency matters more than timing. Remove friction: make journaling as easy as possible. Keep your journal and pen on your nightstand or desk (visible cue). Use a journal you enjoy (nice paper, good pen). Consider digital journaling if that's easier (apps like Day One, Journey). The easier it is, the more likely you'll do it. Track your streak: use a habit tracker (physical calendar, app, or journal). Mark each day you journal. Seeing your streak builds momentum and accountability. Don't break the chain. What if you miss a day: don't let one missed day become two. The goal isn't perfection - it's consistency. If you miss a day, journal the next day without guilt. Overcoming resistance: some days you won't feel like journaling. That's when it matters most. Commit to just one sentence. Usually, once you start, you'll write more. But even one sentence counts. This lesson includes a journaling habit starter kit with templates and trackers."
      }
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
      { 
        title: "The Burnout Epidemic", 
        duration: "17 min", 
        type: "reading",
        description: "Understand what burnout is, why it's epidemic, and how to recognize it before it destroys you.",
        keyPoints: [
          "What is burnout: physical, emotional, and mental exhaustion",
          "The three dimensions: exhaustion, cynicism, reduced efficacy",
          "Warning signs: chronic fatigue, detachment, decreased performance",
          "The cost: health problems, relationship damage, career derailment"
        ],
        content: "Burnout is epidemic in modern society. This lesson helps you understand and prevent it. What is burnout: burnout is a state of physical, emotional, and mental exhaustion caused by prolonged stress. It's not just being tired - it's a deep depletion that doesn't improve with rest. The World Health Organization officially recognizes burnout as an occupational phenomenon. The three dimensions (Christina Maslach): Exhaustion (feeling drained, depleted, unable to cope), Cynicism (detachment, negativity, loss of enthusiasm), Reduced efficacy (feeling incompetent, unproductive, like nothing you do matters). All three dimensions together indicate burnout. Warning signs: Physical (chronic fatigue, insomnia, frequent illness, headaches, muscle pain), Emotional (irritability, anxiety, depression, emotional numbness), Behavioral (withdrawing from responsibilities, procrastinating, using food/drugs/alcohol to cope, taking frustrations out on others), Cognitive (difficulty concentrating, forgetfulness, decreased creativity). If you have multiple signs, you may be burning out. The burnout progression: Stage 1 - Honeymoon (high enthusiasm, taking on too much), Stage 2 - Stress onset (fatigue, irritability, reduced sleep), Stage 3 - Chronic stress (persistent exhaustion, resentment, health issues), Stage 4 - Burnout (complete exhaustion, cynicism, feeling trapped), Stage 5 - Habitual burnout (chronic physical and mental health problems). Catch it early. Why it's epidemic: Always-on culture (emails at night, work on weekends), Lack of boundaries (can't separate work and personal life), Glorification of busy (wearing exhaustion as a badge of honor), Economic pressure (fear of losing job if you don't overwork), Technology (never truly disconnected). These factors create perfect conditions for burnout. The cost of burnout: Health (increased risk of heart disease, diabetes, depression, weakened immune system), Relationships (irritability and withdrawal damage connections), Career (decreased performance can lead to job loss), Life satisfaction (burnout steals joy from everything). Prevention is easier than recovery. This lesson includes a burnout assessment tool."
      },
      { 
        title: "Setting Healthy Boundaries", 
        duration: "19 min", 
        type: "exercise",
        description: "Learn to set and maintain boundaries that protect your time, energy, and wellbeing.",
        keyPoints: [
          "What are boundaries: limits you set to protect your wellbeing",
          "Types of boundaries: time, emotional, physical, digital",
          "Why we struggle with boundaries: people-pleasing, guilt, fear of conflict",
          "How to set boundaries: be clear, be consistent, be unapologetic"
        ],
        content: "Boundaries are essential for work-life balance. This lesson teaches you to set them. What are boundaries: boundaries are limits you set to protect your time, energy, and wellbeing. They define what you will and won't accept. Without boundaries, others' demands consume your life. Boundaries aren't selfish - they're self-preservation. Types of boundaries: Time (work hours, availability, response times - 'I don't check email after 7pm'), Emotional (what you'll discuss, how you'll be treated - 'I won't tolerate yelling'), Physical (personal space, touch - 'I need my own workspace'), Digital (social media limits, phone-free times - 'No phones at dinner'). You need boundaries in all areas. Why we struggle with boundaries: People-pleasing (wanting everyone to like you), Guilt (feeling selfish for prioritizing yourself), Fear of conflict (avoiding difficult conversations), Fear of consequences (worried you'll lose job/relationship), Unclear priorities (not knowing what matters most). These fears keep you boundary-less and burned out. The cost of no boundaries: Resentment (saying yes when you mean no builds bitterness), Exhaustion (overcommitting drains you), Poor performance (spreading yourself thin reduces quality), Damaged relationships (resentment poisons connections), Lost identity (living for others' expectations, not your values). Boundaries protect you from this. How to set boundaries: Be clear ('I'm available Monday-Friday, 9-5' not 'I'll try to be available'), Be consistent (enforce your boundaries every time, or they're meaningless), Be unapologetic ('I don't work weekends' not 'I'm sorry, but I can't work weekends'), Offer alternatives when possible ('I can't do that, but I can do this'). Clarity and consistency are key. Communicating boundaries: 'I've decided...' (not asking permission), 'My policy is...' (makes it less personal), 'I'm not available then. How about...' (offers alternative). Use 'I' statements, be direct, don't over-explain. Handling pushback: some people will test your boundaries. Stay firm. 'I understand this is inconvenient, but my decision stands.' Repeat as needed. People respect boundaries when you enforce them. This exercise includes a boundary-setting worksheet and scripts."
      },
      { 
        title: "Time Blocking for Balance", 
        duration: "16 min", 
        type: "reading",
        description: "Use time blocking to protect both work productivity and personal life.",
        keyPoints: [
          "Time blocking for work: focused productivity in defined hours",
          "Time blocking for life: scheduling personal priorities",
          "The danger of 'work expands to fill time': Parkinson's Law",
          "Creating hard stops: ending work at a set time"
        ],
        content: "Time blocking creates work-life balance by protecting both. This lesson shows you how. Time blocking for work: assign specific tasks to specific time blocks during work hours. Example: 9-11am: deep work on project, 11am-12pm: meetings, 1-3pm: emails and admin. This creates focused productivity. When work has defined boundaries, you accomplish more in less time. Time blocking for life: schedule personal priorities like you schedule work. Block time for: Exercise, Family dinner, Date night, Hobbies, Rest. If it's not on your calendar, it won't happen. Treat personal time blocks as non-negotiable as work meetings. Parkinson's Law: work expands to fill the time available. If you have all day to complete a task, it will take all day. If you have 2 hours, you'll finish in 2 hours. Time blocking creates urgency and focus. Without it, work bleeds into personal time. Creating hard stops: decide when work ends (e.g., 6pm). At that time, stop - even if tasks remain. This forces prioritization (you'll focus on what matters) and protects personal time. Hard stops prevent work from consuming your life. The evening routine: End work at set time, Close laptop and put it away (physical separation), Change clothes (psychological transition), Do something enjoyable (exercise, cook, read). This ritual signals 'work is over.' Without it, you mentally stay at work all evening. Weekend boundaries: decide if you'll work weekends. If yes, define specific hours (e.g., Saturday 9-12pm). If no, protect weekends completely. Don't check work email. Weekends are for recovery - without them, burnout is inevitable. This lesson includes time blocking templates for work-life balance."
      },
      { 
        title: "Saying No Without Guilt", 
        duration: "14 min", 
        type: "reading",
        description: "Master the art of saying no to protect your priorities without damaging relationships.",
        keyPoints: [
          "Why saying no is essential: every yes to something is a no to something else",
          "The guilt trap: why we say yes when we mean no",
          "How to say no: scripts and strategies",
          "Saying no at work vs. in personal life"
        ],
        content: "Saying no is essential for work-life balance. This lesson teaches you how. Why saying no is essential: you have limited time and energy. Every yes to something is a no to something else. Saying yes to extra work means saying no to family time. Saying yes to social obligations means saying no to rest. Choose your yeses carefully. The guilt trap: we say yes when we mean no because: We want to be liked, We feel obligated, We fear disappointing others, We don't want to seem lazy or uncommitted. But chronic yes-saying leads to resentment and burnout. Saying no protects your wellbeing. Reframing no: saying no isn't selfish - it's self-respect. It's not rejecting the person - it's declining the request. It's not being unhelpful - it's being honest about your capacity. This reframe reduces guilt. How to say no - direct approach: 'I can't commit to that right now.' 'That doesn't work for me.' 'I'm not available.' Simple, clear, no elaborate excuse needed. The more you explain, the more they'll try to problem-solve around your no. How to say no - softer approach: 'I appreciate you thinking of me, but I can't take that on.' 'That sounds great, but I'm at capacity.' 'Let me check my schedule... Unfortunately, I'm fully booked.' This acknowledges the request while declining. Offering alternatives: 'I can't do X, but I can do Y.' 'I can't help this week, but I could next month.' 'I can't lead the project, but I can contribute in this specific way.' This shows willingness while maintaining boundaries. Buying time: 'Let me check my schedule and get back to you.' This prevents pressure to say yes immediately. But don't use this as avoidance - actually get back to them with your answer. Saying no at work: 'I'm currently focused on X and Y. If I take on Z, which should I deprioritize?' This forces your manager to make the trade-off decision. Or: 'I can do that, but it will take X hours. Can we adjust my other deadlines?' Saying no in personal life: 'I'd love to, but I'm prioritizing family time this month.' 'I need to recharge this weekend, so I'm staying in.' No elaborate excuse needed. Real friends respect your boundaries. This lesson includes no-saying scripts for various situations."
      },
      { 
        title: "Sustainable Success Strategies", 
        duration: "21 min", 
        type: "reading",
        description: "Build a career and life that's successful and sustainable - without burning out.",
        keyPoints: [
          "Success without sacrifice: the myth of work-life balance vs. work-life integration",
          "The 4 pillars of sustainable success: health, relationships, work, personal growth",
          "Energy management over time management: work with your rhythms",
          "The power of recovery: rest is productive"
        ],
        content: "Sustainable success means achieving your goals without destroying your health and relationships. This lesson shows you how. The myth of work-life balance: 'balance' implies equal time to work and life. That's unrealistic. Some seasons require more work (launching a business, big project). Some require more life (new baby, family crisis). Instead of balance, aim for integration - aligning work and life with your values. The 4 pillars of sustainable success: Health (sleep, exercise, nutrition - without health, nothing else matters), Relationships (family, friends, community - success means nothing if you're alone), Work (career, finances, impact - provides purpose and security), Personal growth (learning, hobbies, spirituality - keeps life meaningful). Neglecting any pillar creates instability. Invest in all four. Energy management over time management: you can have time but lack energy. Work with your natural rhythms: Schedule high-priority work during peak energy hours (usually morning), Batch similar tasks (reduces context switching), Take breaks every 90 minutes (matches ultradian rhythms), Protect sleep (7-9 hours non-negotiable). Energy management is more important than time management. The power of recovery: high performers alternate between stress and recovery. Recovery isn't lazy - it's strategic. Without recovery, performance declines. Build recovery into your day (breaks, walks, lunch away from desk), week (evenings off, weekend rest), and year (vacations). Rest is productive. Defining success on your terms: society defines success as money, status, achievement. But true success is living according to your values. Define what success means to you: Time with family? Creative work? Financial freedom? Health? Adventure? Then build a life around that, not someone else's definition. Avoiding the hedonic treadmill: achieving goals feels good temporarily, then you adapt and want more. This is the hedonic treadmill. To sustain satisfaction: Appreciate what you have (gratitude practice), Enjoy the process, not just outcomes (find meaning in daily work), Connect achievements to values (why does this matter to you?). This prevents endless striving. This lesson includes a sustainable success planning template."
      }
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
    ],
    lessons: [
        {
          title: "The Four Dimensions of Energy",
          duration: "15 min",
          type: "reading",
          description: "Discover the four key dimensions of personal energy—physical, emotional, mental, and spiritual—and learn why managing energy, not just time, is the key to high performance and a fulfilling life.",
          keyPoints: [
            "Energy, not time, is the fundamental currency of high performance.", "There are four distinct but interconnected dimensions of energy: physical, emotional, mental, and spiritual.", "Balancing energy expenditure with energy renewal is critical for sustainable success.", "Small, intentional rituals can dramatically improve your energy levels."
          ],
          content: "We live in a world that glorifies the hustle, where time management is hailed as the ultimate productivity hack. But what if we've been focusing on the wrong metric? The truth is, you can have all the time in the world, but without the energy to engage with it, you'll still fall short of your potential. This lesson introduces a paradigm shift: managing your energy, not your time. We'll explore the four core dimensions of personal energy: **physical** (the quantity of your energy), **emotional** (the quality of your energy), **mental** (the focus of your energy), and **spiritual** (the force of your energy). You'll learn how these dimensions are interconnected and how neglecting one can drain the others. We'll also introduce the concept of strategic renewal—the idea that you must intentionally and systematically replenish your energy stores to perform at your best. This isn't about working less; it's about working smarter, with more focus, engagement, and purpose. By the end of this lesson, you'll have a new framework for understanding your personal energy and a clear path toward building a more energized and fulfilling life."
        }      ,
        {
          title: "Auditing Your Energy",
          duration: "20 min",
          type: "exercise",
          description: "Complete a comprehensive energy audit to identify your biggest energy drains and opportunities for renewal. Gain clarity on where your energy is going and how to reclaim it.",
          keyPoints: [
            "Awareness is the first step to change.", "Identify specific activities, people, and thoughts that drain your energy.", "Recognize the subtle but significant impact of your environment on your energy levels.", "Create a personalized energy map to guide your renewal strategies."
          ],
          content: "You can't manage what you don't measure. Before you can build a more energized life, you need to understand where your energy is currently being spent. This lesson guides you through a comprehensive energy audit, a powerful exercise designed to bring awareness to your unique energy patterns. You'll learn to identify your personal 'energy vampires'—the activities, relationships, and thought patterns that are draining your vitality. We'll also explore the concept of 'energy givers'—the things that truly nourish and replenish you. You'll create a personalized energy map, a visual representation of your energy flows, which will serve as your guide for the rest of this module. This isn't about judgment; it's about honest self-assessment. By the end of this exercise, you'll have a clear, data-driven understanding of your energy landscape, empowering you to make targeted changes that will have the biggest impact on your overall energy levels."
        }      ,
        {
          title: "The Power of Ultradian Rhythms",
          duration: "15 min",
          type: "reading",
          description: "Learn about the science of ultradian rhythms—the natural 90-120 minute cycles of energy and focus—and how to work with, not against, your body's natural rhythms to maximize productivity and prevent burnout.",
          keyPoints: [
            "Your body operates in natural 90-120 minute cycles of high and low energy.", "Working in focused sprints followed by short breaks is more effective than marathon sessions.", "Ignoring your body's need for rest leads to diminishing returns and burnout.", "Schedule your most important tasks during your peak energy cycles."
          ],
          content: "Our bodies have a natural, internal clock that governs our energy levels throughout the day. These are called ultradian rhythms, and they operate in 90-120 minute cycles. During each cycle, we move from a period of high energy and focus to a period of low energy and fatigue. The modern workday, with its expectation of constant, sustained effort, is in direct conflict with this biological reality. In this lesson, you'll learn to recognize the signs of your ultradian troughs—the moments when your body is telling you it's time to rest. We'll explore the science behind these rhythms and show you how to structure your day to align with them. You'll learn the power of the '90-minute focus block,' a strategy used by elite performers in every field to maximize their productivity. By working in focused sprints and then taking intentional breaks, you can achieve more in less time, all while feeling more energized and less stressed. This is the secret to sustainable high performance."
        }      ,
        {
          title: "Designing Your Energy Renewal Rituals",
          duration: "20 min",
          type: "exercise",
          description: "Design a personalized set of energy renewal rituals—small, intentional habits that you can integrate into your daily life to replenish your physical, emotional, mental, and spiritual energy.",
          keyPoints: [
            "Rituals are powerful because they are automatic and require little conscious effort.", "Create specific rituals for each of the four energy dimensions.", "Start small and build momentum over time.", "Your renewal rituals should be enjoyable and nourishing, not another chore."
          ],
          content: "Knowledge is not enough; it's the application of knowledge that creates change. In this lesson, you'll move from theory to practice by designing your own personalized energy renewal rituals. A ritual is a highly specific behavior that you do at a precise time, so that it becomes automatic and no longer requires conscious effort. We'll guide you through the process of creating a set of rituals tailored to your unique needs and preferences, covering all four dimensions of energy. For physical energy, this might be a 10-minute walk after lunch. For emotional energy, it could be a 2-minute gratitude practice. For mental energy, it might be turning off your phone for 30 minutes of focused work. And for spiritual energy, it could be a 5-minute journaling session at the end of the day. The key is to start small and be specific. By the end of this exercise, you'll have a concrete plan for integrating these powerful rituals into your daily life, creating a sustainable system for managing your energy and transforming your well-being."
        }      ,
        {
          title: "The Mind-Body Connection",
          duration: "15 min",
          type: "reading",
          description: "Explore the profound connection between your mind and body, and learn how practices like mindfulness, breathwork, and nutrition can be used to regulate your energy and improve your overall well-being.",
          keyPoints: [
            "Your thoughts and emotions have a direct impact on your physical energy.", "Mindfulness and breathwork are powerful tools for managing stress and boosting energy.", "The food you eat is not just fuel; it's information that tells your body how to function.", "A holistic approach to energy management is the most effective."
          ],
          content: "The mind and body are not separate entities; they are a deeply interconnected system. Your thoughts, emotions, and beliefs have a profound impact on your physical health and energy levels. In this final lesson, we'll explore the science behind the mind-body connection and provide you with practical tools to leverage this connection for greater well-being. You'll learn how mindfulness meditation can reduce stress and improve focus, how specific breathing techniques can instantly shift your energy state, and how the food you eat can either drain or energize you. We'll also discuss the importance of sleep and movement in maintaining optimal energy levels. This lesson brings together all the concepts from the module, reinforcing the idea that true energy management requires a holistic approach. By learning to care for your mind, body, and spirit in an integrated way, you can unlock a new level of vitality and live a more energized, purposeful life."
        }      
    ],
    lessons: [
      { title: "Understanding Your Energy Rhythms", duration: "18 min", type: "reading" },
      { title: "Energy Audit Exercise", duration: "15 min", type: "exercise" },
      { title: "Ultradian Rhythm Optimization", duration: "20 min", type: "reading" },
      { title: "Natural Energy Boosters", duration: "14 min", type: "reading" },
      { title: "Recovery and Renewal", duration: "16 min", type: "reading" }
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
      { title: "What is Circadian Rhythm?", duration: "16 min", type: "reading" }
,
      { title: "Light Exposure Optimization", duration: "14 min", type: "exercise" },
      { title: "Meal Timing for Health", duration: "18 min", type: "reading" },
      { title: "Exercise Timing Strategies", duration: "15 min", type: "reading" },
      { title: "Circadian Rhythm Reset", duration: "20 min", type: "reading" }
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
      { title: "Hydration Science", duration: "15 min", type: "reading" }
,
      { title: "Calculating Your Water Needs", duration: "10 min", type: "exercise" },
      { title: "Natural Detox Strategies", duration: "19 min", type: "reading" },
      { title: "Electrolyte Balance", duration: "14 min", type: "reading" },
      { title: "Detox Myths vs Facts", duration: "17 min", type: "reading" }
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
      { title: "Environmental Health Basics", duration: "17 min", type: "reading" }
,
      { title: "Home Toxin Audit", duration: "20 min", type: "exercise" },
      { title: "Air Quality Optimization", duration: "15 min", type: "reading" },
      { title: "Biophilic Design Principles", duration: "18 min", type: "reading" },
      { title: "Sustainable Living Practices", duration: "16 min", type: "reading" }
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
      { title: "Career Vision Mapping", duration: "20 min", type: "reading" }
,
      { title: "Personal Branding Workshop", duration: "22 min", type: "exercise" },
      { title: "Strategic Networking", duration: "18 min", type: "reading" },
      { title: "Career Transition Strategies", duration: "21 min", type: "reading" },
      { title: "Negotiation Mastery", duration: "24 min", type: "reading" }
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
      { 
        title: "Communication Fundamentals", 
        duration: "19 min", 
        type: "reading",
        description: "Master the core principles of effective communication that apply to every interaction.",
        keyPoints: [
          "The communication model: sender, message, receiver, feedback",
          "Active listening: the most underrated communication skill",
          "Clarity and conciseness: say more with fewer words",
          "Adapting your communication style to your audience"
        ],
        content: "Communication is the #1 skill for success in life and work. This lesson covers the fundamentals. The communication model: communication involves a sender (you), a message (what you're saying), a receiver (the other person), and feedback (their response). Breakdowns happen at any stage: unclear message, distracted receiver, no feedback loop. Effective communicators optimize each stage. Active listening: most people listen to respond, not to understand. Active listening means: giving full attention (no phone, no interrupting), reflecting back what you heard ('So what you're saying is...'), asking clarifying questions ('Can you tell me more about...'), validating emotions ('That sounds frustrating'). This makes people feel heard and builds trust. Clarity and conciseness: confused messages create confusion. Before speaking, know your main point. Use simple language. Avoid jargon. Be specific ('The report is due Friday at 5pm' vs. 'The report is due soon'). Respect people's time - say what needs to be said, then stop. Adapting your style: different people prefer different communication styles. Some want details, others want the bottom line. Some prefer direct feedback, others need it softened. Pay attention to how people communicate and mirror their style. This builds rapport. Common communication barriers: Assumptions (thinking you know what they mean without asking), Distractions (multitasking while talking), Emotional reactivity (getting defensive), Poor timing (having important conversations when stressed or rushed), Lack of feedback (not checking if your message was understood). Avoid these. The 7-38-55 rule: research by Albert Mehrabian suggests that communication is 7% words, 38% tone of voice, 55% body language. While this is often misinterpreted (it applies specifically to communicating feelings and attitudes), the point is clear: how you say something matters as much as what you say. This lesson provides a communication fundamentals checklist."
      },
      { 
        title: "Public Speaking Confidence", 
        duration: "23 min", 
        type: "exercise",
        description: "Overcome fear and speak confidently in front of any audience.",
        keyPoints: [
          "Why public speaking terrifies us: evolutionary psychology",
          "Preparation is confidence: the 10-1 rule",
          "Managing anxiety: reframe nervousness as excitement",
          "Delivery techniques: voice, pace, pauses, and presence"
        ],
        content: "Public speaking is the #1 fear for most people (above death!). This lesson teaches you to speak confidently. Why we fear public speaking: evolutionarily, being judged by the tribe meant life or death. Social rejection triggered the same brain regions as physical pain. Your fear is ancient wiring, not a personal flaw. Understanding this helps you reframe it. Preparation is confidence: the 10-1 rule says for every 1 minute of speaking, spend 10 minutes preparing. Know your material so well that you could give the talk in your sleep. This eliminates the fear of forgetting. Structure your talk: Opening (hook their attention with a story, question, or surprising fact), Body (3 main points - people can't remember more), Closing (call to action or memorable takeaway). This structure creates clarity. Managing anxiety: nervousness and excitement have the same physiology (increased heart rate, adrenaline). The difference is your interpretation. Instead of 'I'm nervous,' say 'I'm excited.' This reframe changes your experience. Use the anxiety as energy. Delivery techniques: Voice (speak from your diaphragm, project to the back of the room), Pace (slow down - nervous speakers rush), Pauses (silence is powerful - pause before and after key points), Eye contact (connect with individuals, not the crowd), Movement (purposeful movement keeps attention, nervous pacing distracts), Gestures (natural gestures emphasize points). Practice these. Handling mistakes: everyone makes mistakes. If you stumble, don't apologize profusely. Pause, smile, continue. The audience wants you to succeed. They're rooting for you. Confidence comes from repetition. The more you speak, the easier it gets. Start small: team meetings, toast at dinner, Toastmasters. Build the skill progressively. This exercise includes a public speaking practice framework and anxiety management techniques."
      },
      { 
        title: "Non-Verbal Communication", 
        duration: "16 min", 
        type: "reading",
        description: "Read and use body language to enhance your communication and influence.",
        keyPoints: [
          "The power of body language: it speaks louder than words",
          "Reading others: signs of engagement, discomfort, deception",
          "Projecting confidence: posture, eye contact, gestures",
          "Cultural differences in non-verbal communication"
        ],
        content: "Your body communicates constantly, often contradicting your words. This lesson teaches you to read and use body language. The power of body language: when your words and body language conflict, people believe your body. Saying 'I'm fine' with crossed arms and a frown sends a clear message: you're not fine. Alignment between verbal and non-verbal communication builds trust. Reading others - signs of engagement: Leaning in, Maintaining eye contact, Nodding, Open posture (uncrossed arms), Mirroring your gestures. These signals mean they're interested and receptive. Reading others - signs of discomfort: Crossed arms or legs, Avoiding eye contact, Touching face or neck, Fidgeting, Leaning away, Checking phone. These signals mean they're uncomfortable, bored, or disagreeing. Adjust your approach. Reading deception (with caution): Inconsistent body language (smiling while saying something sad), Excessive stillness (overcontrolling body), Touching face, especially mouth and nose, Avoiding eye contact or overcompensating with too much. Note: these are not definitive - context matters. Don't accuse based on body language alone. Projecting confidence: Posture (stand tall, shoulders back, chest open - this also increases testosterone and decreases cortisol), Eye contact (hold for 3-5 seconds, then break naturally), Gestures (use open palm gestures, avoid fidgeting), Facial expressions (smile genuinely, relax your face), Personal space (respect boundaries, but don't be too distant). These signals communicate confidence and competence. Power poses: research by Amy Cuddy (though controversial) suggests that holding confident poses for 2 minutes before important events can increase confidence. Try it: stand with hands on hips, chest open, chin up. Cultural differences: body language varies by culture. Eye contact is respectful in Western cultures but can be seen as aggressive in some Asian cultures. Personal space preferences vary. When communicating across cultures, research norms and watch for cues. This lesson includes a body language decoder guide."
      },
      { 
        title: "Difficult Conversations", 
        duration: "21 min", 
        type: "reading",
        description: "Navigate conflict and difficult conversations with grace and effectiveness.",
        keyPoints: [
          "Why we avoid difficult conversations: short-term relief, long-term damage",
          "The conversation framework: facts, feelings, ask",
          "Managing emotions: yours and theirs",
          "Finding resolution: focus on needs, not positions"
        ],
        content: "Difficult conversations are unavoidable in life and work. This lesson teaches you to handle them effectively. Why we avoid them: difficult conversations trigger anxiety. We fear conflict, rejection, or making things worse. So we avoid them. But avoidance causes resentment, misunderstanding, and relationship damage. The short-term relief of avoidance creates long-term problems. Facing difficult conversations is a skill. Preparation: Before the conversation, clarify: What's the issue? (Be specific, not vague), What's your goal? (What outcome do you want?), What's your contribution? (How did you contribute to the problem?), What emotions are you feeling? (Name them so they don't control you). This preparation prevents reactive, unproductive conversations. The conversation framework: Facts ('When you missed the deadline...'), Feelings ('I felt frustrated because...'), Ask ('Can we discuss how to prevent this?'). This structure is non-accusatory and solution-focused. Avoid: Blame ('You always...'), Assumptions ('You don't care about this project'), Generalizations ('You never listen'). These trigger defensiveness. Managing your emotions: If you're angry, wait until you calm down. Conversations from anger rarely go well. Use 'I' statements ('I feel...' not 'You make me feel...'). Take breaks if emotions escalate ('Let's pause and continue in 10 minutes'). Managing their emotions: If they get defensive, validate their feelings ('I understand this is hard to hear'), Stay calm (your calm can de-escalate their reactivity), Focus on the issue, not the person ('The behavior is the problem, not you'). Finding resolution: Focus on needs, not positions. Positions are what you want ('I want you to work late'). Needs are why you want it ('I need this project done on time'). When you understand each other's needs, you can find creative solutions. End with agreement: 'So we've agreed that...' Summarize the resolution. Confirm understanding. Follow up later to ensure the agreement is working. This lesson includes a difficult conversation script template."
      },
      { 
        title: "Persuasion and Influence", 
        duration: "20 min", 
        type: "reading",
        description: "Ethically influence others and get buy-in for your ideas.",
        keyPoints: [
          "The psychology of persuasion: Cialdini's 6 principles",
          "Building credibility: the foundation of influence",
          "Framing your message: benefits, not features",
          "Handling objections: the feel-felt-found technique"
        ],
        content: "Persuasion is not manipulation - it's helping people see the value of your idea. This lesson teaches ethical influence. Cialdini's 6 principles of persuasion: Reciprocity (people feel obligated to return favors - give first), Commitment and consistency (people want to act consistently with their commitments - get small yeses first), Social proof (people follow what others do - show testimonials, case studies), Authority (people trust experts - establish your credibility), Liking (people say yes to those they like - build rapport), Scarcity (people want what's limited - create urgency). Use these ethically. Building credibility: influence requires trust. Build credibility through: Expertise (demonstrate knowledge), Reliability (do what you say you'll do), Transparency (admit what you don't know), Results (show track record). Without credibility, persuasion is impossible. Framing your message: people don't care about features - they care about benefits. Don't say 'This software has advanced analytics.' Say 'This software helps you make better decisions faster.' Focus on what's in it for them. Use stories: facts tell, stories sell. Instead of statistics, share a story of someone who benefited from your idea. Stories create emotional connection and are more memorable than data. Handling objections: when someone objects, use the feel-felt-found technique: 'I understand how you feel. Others have felt the same way. What they found was...' This validates their concern while providing a new perspective. Timing matters: people are more persuadable when they're in a good mood, not rushed, and feel respected. Choose your moment. Don't push when they're stressed or distracted. The ethical line: persuasion becomes manipulation when you: Lie or deceive, Pressure or coerce, Exploit vulnerabilities, Prioritize your gain over their wellbeing. Always ask: 'Is this genuinely in their best interest?' If not, don't do it. This lesson includes a persuasion strategy template."
      }
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
      { title: "Leadership Foundations", duration: "21 min", type: "reading" }
,
      { title: "Your Leadership Style", duration: "17 min", type: "exercise" },
      { title: "Emotional Intelligence for Leaders", duration: "23 min", type: "reading" },
      { title: "Decision-Making Frameworks", duration: "19 min", type: "reading" },
      { title: "Building Team Culture", duration: "22 min", type: "reading" }
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
      { title: "The Creative Mindset", duration: "18 min", type: "reading" }

,
      { title: "Brainstorming Techniques", duration: "15 min", type: "exercise" },
      { title: "Overcoming Creative Blocks", duration: "20 min", type: "reading" },
      { title: "Design Thinking Process", duration: "24 min", type: "reading" },
      { title: "Creative Habit Building", duration: "16 min", type: "reading" }
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
      { 
        title: "Time Management Fundamentals", 
        duration: "19 min", 
        type: "reading",
        description: "Understand the core principles of managing your most valuable resource: time.",
        keyPoints: [
          "Time is finite: you can't make more, only choose how to use it",
          "The 80/20 rule: 20% of activities produce 80% of results",
          "Energy management matters as much as time management",
          "The myth of multitasking: why it destroys productivity"
        ],
        content: "Time management isn't about doing more - it's about doing what matters. This lesson covers the fundamentals. Time is finite: you have 168 hours per week. That's it. You can't make more time, but you can choose how to use it. Most people waste time on low-value activities while claiming they're 'too busy' for what matters. Time management is about intentional choices. The 80/20 rule (Pareto Principle): 20% of your activities produce 80% of your results. Identify your high-impact activities (the 20%) and prioritize them ruthlessly. Examples: 20% of clients generate 80% of revenue, 20% of your work creates 80% of your value, 20% of relationships provide 80% of support. Focus on the vital few, not the trivial many. Energy management matters: you can have time but lack energy. Working on important tasks when you're exhausted is inefficient. Identify your peak energy times (most people are sharpest in the morning) and schedule high-priority work then. Protect your energy through sleep, exercise, and breaks. The myth of multitasking: your brain can't actually multitask - it switches between tasks rapidly. Each switch has a cognitive cost (attention residue). Research shows multitasking reduces productivity by 40% and increases errors. Single-tasking is faster and higher quality. Common time wasters: Unstructured meetings (no agenda, no time limit), Social media and email (constant checking), Saying yes to everything (no boundaries), Perfectionism (diminishing returns), Lack of planning (reactive instead of proactive). Audit where your time goes and eliminate these. Time management is values management: how you spend your time reflects your priorities. If you say family is important but work 80 hours per week, your time doesn't match your values. Align your time with what truly matters. This lesson includes a time audit worksheet to identify where your time goes."
      },
      { 
        title: "The Eisenhower Matrix", 
        duration: "14 min", 
        type: "exercise",
        description: "Prioritize tasks using President Eisenhower's urgent vs. important framework.",
        keyPoints: [
          "The four quadrants: urgent/important, important/not urgent, urgent/not important, neither",
          "Quadrant 2 is where success happens: important but not urgent",
          "Most people live in Quadrant 1 (crisis mode) and Quadrant 3 (distractions)",
          "The goal: minimize Quadrants 1 and 3, eliminate Quadrant 4, maximize Quadrant 2"
        ],
        content: "The Eisenhower Matrix is a powerful prioritization tool. It categorizes tasks by urgency and importance. The four quadrants: Quadrant 1 - Urgent and Important (crises, deadlines, emergencies). Do these immediately. Quadrant 2 - Important but Not Urgent (planning, prevention, relationship building, skill development). Schedule these. Quadrant 3 - Urgent but Not Important (interruptions, some emails, other people's priorities). Delegate or minimize these. Quadrant 4 - Neither Urgent nor Important (time wasters, busywork, mindless scrolling). Eliminate these. Quadrant 2 is where success happens: most people spend their time in Quadrants 1 (crisis mode) and 3 (reacting to others). But Quadrant 2 - important but not urgent - is where you build the future. Examples: Exercise (prevents health crises), Relationship building (prevents loneliness), Strategic planning (prevents business failures), Skill development (prevents career stagnation). These activities don't scream for attention, but they create long-term success. Why we neglect Quadrant 2: Quadrant 2 activities don't have deadlines. No one is demanding them. They're easy to postpone. But postponing them creates Quadrant 1 crises. Example: neglecting exercise (Q2) leads to health emergencies (Q1). Neglecting relationship maintenance (Q2) leads to relationship crises (Q1). Prevention is easier than crisis management. How to use the matrix: List all your tasks, Categorize each into a quadrant, Do Q1 immediately, Schedule Q2 (this is most important), Delegate or minimize Q3, Eliminate Q4. Review weekly. The goal: minimize Quadrants 1 and 3, eliminate Quadrant 4, maximize Quadrant 2. When you invest in Q2, Q1 crises decrease. This exercise includes an Eisenhower Matrix template and examples."
      },
      { 
        title: "Time Blocking Mastery", 
        duration: "21 min", 
        type: "reading",
        description: "Schedule your day in focused blocks to maximize productivity and minimize distractions.",
        keyPoints: [
          "What is time blocking: assigning specific tasks to specific time slots",
          "Why it works: reduces decision fatigue and context switching",
          "How to time block: theme days, task batching, buffer time",
          "Protecting your blocks: treating calendar commitments as sacred"
        ],
        content: "Time blocking is a scheduling method where you assign specific tasks to specific time slots. This lesson teaches you to master it. What is time blocking: instead of a to-do list (tasks without time), you assign each task to a specific time block on your calendar. Example: Monday 9-11am: Write report, 11am-12pm: Team meeting, 1-3pm: Client calls. Your entire day is scheduled in advance. Why it works: Reduces decision fatigue (you don't waste energy deciding what to do next), Prevents context switching (you focus on one thing at a time), Creates realistic expectations (you see how much time you actually have), Protects important work (it's scheduled, not squeezed in). Research shows time blocking increases productivity by 50%. How to time block: Theme days (assign different themes to different days - Monday is strategy, Tuesday is meetings, etc.), Task batching (group similar tasks together - answer all emails in one block, make all calls in one block), Buffer time (schedule 15-30 minutes between blocks for overruns and transitions), Energy alignment (schedule high-priority work during your peak energy times). Example time-blocked day: 6-7am: Exercise, 7-8am: Morning routine, 8-9am: Email and planning, 9-12pm: Deep work (most important project), 12-1pm: Lunch and walk, 1-3pm: Meetings, 3-4pm: Admin tasks, 4-5pm: Planning tomorrow, 5pm+: Personal time. Every hour is assigned. Protecting your blocks: treat your calendar like a doctor's appointment - non-negotiable. When someone asks for your time, check your calendar. If that block is assigned, say 'I'm not available then. How about [alternative time]?' This prevents your day from being hijacked by others' priorities. Common objections: 'My day is too unpredictable' (start with 50% blocked, leave 50% flexible), 'I feel too constrained' (you can adjust blocks as needed - it's a guide, not a prison), 'Meetings disrupt my blocks' (batch meetings into specific days/times). Flexibility within structure: time blocking isn't rigid. If something urgent comes up, adjust. But without a plan, you're reactive all day. This lesson includes time blocking templates and examples."
      },
      { 
        title: "Defeating Procrastination", 
        duration: "18 min", 
        type: "reading",
        description: "Understand why you procrastinate and use proven strategies to overcome it.",
        keyPoints: [
          "Procrastination is emotion regulation, not laziness",
          "The procrastination equation: expectancy, value, impulsiveness, delay",
          "Strategies to beat procrastination: break it down, 2-minute rule, temptation bundling",
          "Addressing the root cause: fear of failure, perfectionism, lack of clarity"
        ],
        content: "Procrastination isn't a character flaw - it's a habit you can change. This lesson teaches you how. Procrastination is emotion regulation: you don't procrastinate because you're lazy. You procrastinate to avoid negative emotions (anxiety, boredom, overwhelm, fear of failure). The task triggers discomfort, so you seek short-term mood repair (social media, snacks, busywork). Understanding this is the first step to change. The procrastination equation (Piers Steel): Motivation = (Expectancy × Value) / (Impulsiveness × Delay). Expectancy (do you believe you can succeed?), Value (how rewarding is the task?), Impulsiveness (how easily distracted are you?), Delay (how far away is the reward?). To reduce procrastination, increase expectancy and value, decrease impulsiveness and delay. Strategies to beat procrastination: Break it down (overwhelming tasks trigger procrastination - break them into tiny steps. Instead of 'Write report,' start with 'Write one paragraph'), The 2-minute rule (commit to just 2 minutes. Starting is the hardest part. Once you start, you'll often continue), Temptation bundling (pair unpleasant tasks with pleasant ones - listen to your favorite podcast only while doing admin work), Implementation intentions ('If it's 9am, then I will work on the report' - removes decision-making), Accountability (tell someone your deadline or work with a body double). Addressing root causes: Fear of failure (you avoid starting because you're afraid it won't be good enough. Reframe: 'Done is better than perfect'), Perfectionism (you delay because you want it to be perfect. Reframe: 'Version 1 doesn't need to be perfect'), Lack of clarity (you don't know where to start. Solution: spend 5 minutes planning before starting), Low energy (you're exhausted. Solution: rest, then work). The cost of procrastination: increased stress, lower quality work, missed opportunities, damaged reputation, guilt and shame. Short-term relief creates long-term pain. The 10-minute rule: when you don't want to start, commit to just 10 minutes. Set a timer. After 10 minutes, you can stop guilt-free. But usually, you'll keep going. This lesson includes a procrastination troubleshooting guide."
      },
      { 
        title: "Productivity Systems", 
        duration: "23 min", 
        type: "reading",
        description: "Explore proven productivity systems and build one that works for you.",
        keyPoints: [
          "Getting Things Done (GTD): capture, clarify, organize, reflect, engage",
          "Pomodoro Technique: 25-minute focused sprints with breaks",
          "Eat the Frog: do your hardest task first thing in the morning",
          "Building your personal system: combine principles that work for you"
        ],
        content: "Productivity systems provide structure for managing tasks and time. This lesson explores proven systems. Getting Things Done (GTD) by David Allen: Capture (write down everything on your mind - tasks, ideas, commitments), Clarify (is it actionable? If yes, what's the next action? If no, trash it, file it, or someday/maybe it), Organize (put tasks in appropriate lists - by context, priority, or project), Reflect (weekly review to update lists and plan the week), Engage (do the work, trusting your system). GTD creates mental clarity by externalizing everything. Pomodoro Technique by Francesco Cirillo: Work in 25-minute focused sprints (pomodoros), Take a 5-minute break, After 4 pomodoros, take a 15-30 minute break. This creates urgency (you have 25 minutes to make progress) and prevents burnout (regular breaks maintain energy). Great for deep work. Eat the Frog by Brian Tracy: Identify your most important task (the 'frog' - the thing you're most likely to procrastinate on), Do it first thing in the morning, before anything else. This ensures your highest-priority work gets done when your energy is highest. The rest of the day feels easier after eating the frog. Time blocking (covered in previous lesson): Schedule every hour of your day in advance. Prevents reactive, distracted work. Combines well with other systems. The Ivy Lee Method: At the end of each day, write down the 6 most important tasks for tomorrow, Prioritize them in order, Tomorrow, work on task 1 until complete, then task 2, etc. Simple but effective for focus. Building your personal system: don't adopt a system wholesale - take principles that work for you. Example hybrid: Use GTD for capturing and organizing, Use time blocking for scheduling, Use Pomodoro for execution, Use Eat the Frog for prioritization. Experiment to find your fit. The key: consistency: any system works if you use it consistently. The best system is the one you'll actually follow. Start simple, then refine. Tools: Analog (paper planner, bullet journal) vs. Digital (Todoist, Notion, Trello). Choose what you'll actually use. This lesson includes productivity system templates and setup guides."
      }
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
      { title: "Growth vs Fixed Mindset", duration: "17 min", type: "reading" }
,
      { title: "Self-Assessment Exercise", duration: "20 min", type: "exercise" },
      { title: "Creating Your Development Plan", duration: "22 min", type: "reading" },
      { title: "Learning How to Learn", duration: "19 min", type: "reading" },
      { title: "Measuring Progress", duration: "15 min", type: "reading" }
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
      { title: "The Power of Discomfort", duration: "18 min", type: "reading" }
,
      { title: "Fear Setting Exercise", duration: "16 min", type: "exercise" },
      { title: "Calculated Risk-Taking", duration: "20 min", type: "reading" },
      { title: "Building Courage", duration: "17 min", type: "reading" },
      { title: "Adventure Planning", duration: "15 min", type: "reading" }
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
      { title: "What is Purpose?", duration: "19 min", type: "reading" }
,
      { title: "Purpose Discovery Workshop", duration: "25 min", type: "exercise" },
      { title: "Values Alignment", duration: "18 min", type: "reading" },
      { title: "Creating Your Mission Statement", duration: "20 min", type: "exercise" },
      { title: "Living with Intention", duration: "17 min", type: "reading" }
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
      { title: "The Science of Resilience", duration: "20 min", type: "reading" },
      { title: "Adversity Inventory", duration: "18 min", type: "exercise" },
      { title: "Cognitive Reframing", duration: "22 min", type: "reading" },
      { title: "Building Mental Toughness", duration: "21 min", type: "reading" },
      { title: "Post-Traumatic Growth", duration: "19 min", type: "reading" }
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
      { title: "What is Mindfulness?", duration: "16 min", type: "reading" },
      { title: "Basic Meditation Practice", duration: "20 min", type: "practice" },
      { title: "Mindful Breathing", duration: "12 min", type: "practice" },
      { title: "Body Scan Meditation", duration: "25 min", type: "practice" },
      { title: "Mindfulness in Daily Life", duration: "18 min", type: "reading" }
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
      { title: "The Science of Happiness", duration: "21 min", type: "reading" },
      { title: "Character Strengths Assessment", duration: "15 min", type: "exercise" },
      { title: "Three Good Things Practice", duration: "10 min", type: "practice" },
      { title: "Savoring Techniques", duration: "17 min", type: "reading" },
      { title: "Building Optimism", duration: "19 min", type: "reading" }
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
      { title: "The Science of Breathwork", duration: "18 min", type: "reading" },
      { title: "Box Breathing Technique", duration: "10 min", type: "practice" },
      { title: "Wim Hof Method", duration: "22 min", type: "reading" },
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
      { title: "The Four Components of EQ", duration: "19 min", type: "reading" },
      { title: "Self-Awareness Assessment", duration: "17 min", type: "exercise" },
      { title: "Emotion Regulation Strategies", duration: "21 min", type: "reading" },
      { title: "Developing Empathy", duration: "18 min", type: "reading" },
      { title: "Social Skills Mastery", duration: "20 min", type: "reading" }
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
      { title: "The Healing Power of Nature", duration: "17 min", type: "reading" },
      { title: "Forest Bathing Practice", duration: "25 min", type: "practice" },
      { title: "Earthing and Grounding", duration: "15 min", type: "reading" },
      { title: "Nature Meditation", duration: "20 min", type: "practice" },
      { title: "Outdoor Movement Practices", duration: "18 min", type: "reading" }
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
      { title: "Strength Training Fundamentals", duration: "22 min", type: "reading" },
      { title: "Progressive Overload Principles", duration: "18 min", type: "reading" },
      { title: "Exercise Form Mastery", duration: "25 min", type: "reading" },
      { title: "Program Design", duration: "20 min", type: "exercise" },
      { title: "Recovery and Adaptation", duration: "16 min", type: "reading" }
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
      { title: "Cardiovascular Health Basics", duration: "19 min", type: "reading" },
      { title: "Heart Rate Zone Training", duration: "21 min", type: "reading" },
      { title: "HIIT vs Steady State", duration: "17 min", type: "reading" },
      { title: "Building Endurance", duration: "20 min", type: "reading" },
      { title: "Heart Health Lifestyle", duration: "18 min", type: "reading" }
    ],
    exercises: [
      "Heart Health Assessment",
      "Heart Rate Zone Calculator",
      "Cardio Program Template",
      "Lifestyle Optimization Checklist"
    ]
  },
};
