import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { wellnessModulesData } from "@/data/wellnessModulesData";

// Curated reading lists for each module
const readingLists: Record<string, Array<{title: string; author: string; type: string; description: string; link: string}>> = {
  "emotional-wellness": [
    {
      title: "Emotional Intelligence 2.0",
      author: "Travis Bradberry & Jean Greaves",
      type: "Book",
      description: "Practical strategies to increase your EQ with a step-by-step program.",
      link: "https://www.amazon.com/Emotional-Intelligence-2-0-Travis-Bradberry/dp/0974320625"
    },
    {
      title: "The Gifts of Imperfection",
      author: "Brené Brown",
      type: "Book",
      description: "Let go of who you think you're supposed to be and embrace who you are.",
      link: "https://www.amazon.com/Gifts-Imperfection-Think-Supposed-Embrace/dp/159285849X"
    },
    {
      title: "Understanding and Managing Emotions",
      author: "American Psychological Association",
      type: "Article",
      description: "Research-based guide to emotional regulation and well-being.",
      link: "https://www.apa.org/topics/emotion"
    }
  ],
  "mental-health": [
    {
      title: "Feeling Good: The New Mood Therapy",
      author: "David D. Burns",
      type: "Book",
      description: "The clinically proven drug-free treatment for depression using cognitive behavioral therapy.",
      link: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336"
    },
    {
      title: "The Anxiety and Phobia Workbook",
      author: "Edmund J. Bourne",
      type: "Book",
      description: "Comprehensive guide to understanding and overcoming anxiety disorders.",
      link: "https://www.amazon.com/Anxiety-Phobia-Workbook-Edmund-Bourne/dp/1626252157"
    },
    {
      title: "Mental Health Foundation",
      author: "Mental Health Foundation",
      type: "Resource",
      description: "Evidence-based information on mental health conditions and treatments.",
      link: "https://www.mentalhealth.org.uk/"
    }
  ],
  "physical-fitness": [
    {
      title: "Bigger Leaner Stronger",
      author: "Michael Matthews",
      type: "Book",
      description: "The simple science of building the ultimate male body.",
      link: "https://www.amazon.com/Bigger-Leaner-Stronger-Building-Ultimate/dp/1938895304"
    },
    {
      title: "Starting Strength",
      author: "Mark Rippetoe",
      type: "Book",
      description: "Basic barbell training for strength and fitness.",
      link: "https://www.amazon.com/Starting-Strength-Basic-Barbell-Training/dp/0982522738"
    },
    {
      title: "Exercise Guidelines",
      author: "American College of Sports Medicine",
      type: "Resource",
      description: "Evidence-based exercise recommendations for health and fitness.",
      link: "https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines"
    }
  ],
  "nutrition": [
    {
      title: "How Not to Die",
      author: "Michael Greger, MD",
      type: "Book",
      description: "Discover the foods scientifically proven to prevent and reverse disease.",
      link: "https://www.amazon.com/How-Not-Die-Discover-Scientifically/dp/1250066115"
    },
    {
      title: "Precision Nutrition",
      author: "John Berardi & Ryan Andrews",
      type: "Book",
      description: "The essentials of sport and exercise nutrition.",
      link: "https://www.amazon.com/Precision-Nutrition-Essentials-Exercise-Certification/dp/0973597054"
    },
    {
      title: "Dietary Guidelines for Americans",
      author: "USDA",
      type: "Resource",
      description: "Evidence-based nutritional guidance for health promotion and disease prevention.",
      link: "https://www.dietaryguidelines.gov/"
    }
  ],
  "spiritual-wellness": [
    {
      title: "The Power of Now",
      author: "Eckhart Tolle",
      type: "Book",
      description: "A guide to spiritual enlightenment and living in the present moment.",
      link: "https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808"
    },
    {
      title: "Man's Search for Meaning",
      author: "Viktor E. Frankl",
      type: "Book",
      description: "Finding purpose and meaning even in the most difficult circumstances.",
      link: "https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/080701429X"
    },
    {
      title: "The Four Agreements",
      author: "Don Miguel Ruiz",
      type: "Book",
      description: "A practical guide to personal freedom based on ancient Toltec wisdom.",
      link: "https://www.amazon.com/Four-Agreements-Practical-Personal-Freedom/dp/1878424319"
    }
  ],
  "habit-formation": [
    {
      title: "Atomic Habits",
      author: "James Clear",
      type: "Book",
      description: "An easy and proven way to build good habits and break bad ones.",
      link: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299"
    },
    {
      title: "The Power of Habit",
      author: "Charles Duhigg",
      type: "Book",
      description: "Why we do what we do in life and business - the science of habit formation.",
      link: "https://www.amazon.com/Power-Habit-What-Life-Business/dp/081298160X"
    },
    {
      title: "Tiny Habits",
      author: "BJ Fogg",
      type: "Book",
      description: "The small changes that change everything - from Stanford behavior scientist.",
      link: "https://www.amazon.com/Tiny-Habits-Small-Changes-Everything/dp/0358003326"
    }
  ],
  "relationships": [
    {
      title: "The 5 Love Languages",
      author: "Gary Chapman",
      type: "Book",
      description: "The secret to love that lasts - understanding how people give and receive love.",
      link: "https://www.amazon.com/Love-Languages-Secret-that-Lasts/dp/080241270X"
    },
    {
      title: "Attached",
      author: "Amir Levine & Rachel Heller",
      type: "Book",
      description: "The new science of adult attachment and how it can help you find and keep love.",
      link: "https://www.amazon.com/Attached-Science-Adult-Attachment-YouFind/dp/1585429139"
    },
    {
      title: "Nonviolent Communication",
      author: "Marshall B. Rosenberg",
      type: "Book",
      description: "A language of life - create your life, relationships, and world in harmony.",
      link: "https://www.amazon.com/Nonviolent-Communication-Language-Life-Changing-Relationships/dp/189200528X"
    }
  ],
  "financial-wellness": [
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      type: "Book",
      description: "Timeless lessons on wealth, greed, and happiness.",
      link: "https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681"
    },
    {
      title: "I Will Teach You to Be Rich",
      author: "Ramit Sethi",
      type: "Book",
      description: "No guilt, no excuses - a 6-week program to master your finances.",
      link: "https://www.amazon.com/Will-Teach-You-Rich-Second/dp/1523505745"
    },
    {
      title: "Your Money or Your Life",
      author: "Vicki Robin",
      type: "Book",
      description: "9 steps to transforming your relationship with money and achieving financial independence.",
      link: "https://www.amazon.com/Your-Money-Life-Transforming-Relationship/dp/0143115766"
    }
  ],
  "goal-achievement": [
    {
      title: "The 12 Week Year",
      author: "Brian P. Moran",
      type: "Book",
      description: "Get more done in 12 weeks than others do in 12 months.",
      link: "https://www.amazon.com/12-Week-Year-Others-Months/dp/1118509234"
    },
    {
      title: "Measure What Matters",
      author: "John Doerr",
      type: "Book",
      description: "How Google, Bono, and the Gates Foundation rock the world with OKRs.",
      link: "https://www.amazon.com/Measure-What-Matters-Google-Foundation/dp/0525536221"
    },
    {
      title: "The One Thing",
      author: "Gary Keller",
      type: "Book",
      description: "The surprisingly simple truth behind extraordinary results.",
      link: "https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776"
    }
  ],
  "sleep-optimization": [
    {
      title: "Why We Sleep",
      author: "Matthew Walker",
      type: "Book",
      description: "Unlocking the power of sleep and dreams - the new science of sleep.",
      link: "https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316"
    },
    {
      title: "The Sleep Solution",
      author: "W. Chris Winter, MD",
      type: "Book",
      description: "Why your sleep is broken and how to fix it.",
      link: "https://www.amazon.com/Sleep-Solution-Why-Your-Broken/dp/0399583610"
    },
    {
      title: "Sleep Foundation",
      author: "National Sleep Foundation",
      type: "Resource",
      description: "Evidence-based sleep health information and recommendations.",
      link: "https://www.sleepfoundation.org/"
    }
  ],
  "stress-management": [
    {
      title: "The Upside of Stress",
      author: "Kelly McGonigal",
      type: "Book",
      description: "Why stress is good for you, and how to get better at it.",
      link: "https://www.amazon.com/Upside-Stress-Why-Good-You/dp/1101982934"
    },
    {
      title: "Burnout",
      author: "Emily Nagoski & Amelia Nagoski",
      type: "Book",
      description: "The secret to unlocking the stress cycle.",
      link: "https://www.amazon.com/Burnout-Secret-Unlocking-Stress-Cycle/dp/1984818325"
    },
    {
      title: "Full Catastrophe Living",
      author: "Jon Kabat-Zinn",
      type: "Book",
      description: "Using the wisdom of your body and mind to face stress, pain, and illness.",
      link: "https://www.amazon.com/Full-Catastrophe-Living-Revised-Illness/dp/0345536932"
    }
  ],
  "journaling": [
    {
      title: "The Artist's Way",
      author: "Julia Cameron",
      type: "Book",
      description: "A spiritual path to higher creativity through morning pages and artist dates.",
      link: "https://www.amazon.com/Artists-Way-25th-Anniversary/dp/0143129252"
    },
    {
      title: "Writing Down the Bones",
      author: "Natalie Goldberg",
      type: "Book",
      description: "Freeing the writer within - classic guide to the writing practice.",
      link: "https://www.amazon.com/Writing-Down-Bones-Freeing-Writer/dp/161180308X"
    },
    {
      title: "The Bullet Journal Method",
      author: "Ryder Carroll",
      type: "Book",
      description: "Track the past, order the present, design the future.",
      link: "https://www.amazon.com/Bullet-Journal-Method-Present-Design/dp/0525533338"
    }
  ],
  "work-life-balance": [
    {
      title: "Essentialism",
      author: "Greg McKeown",
      type: "Book",
      description: "The disciplined pursuit of less - do less but better.",
      link: "https://www.amazon.com/Essentialism-Disciplined-Pursuit-Greg-McKeown/dp/0804137382"
    },
    {
      title: "Off the Clock",
      author: "Laura Vanderkam",
      type: "Book",
      description: "Feel less busy while getting more done.",
      link: "https://www.amazon.com/Off-Clock-Feel-Less-Getting/dp/0735219818"
    },
    {
      title: "Boundaries",
      author: "Henry Cloud & John Townsend",
      type: "Book",
      description: "When to say yes, how to say no to take control of your life.",
      link: "https://www.amazon.com/Boundaries-Updated-Expanded-When-Control/dp/0310351804"
    }
  ],
  "energy-management": [
    {
      title: "The Power of Full Engagement",
      author: "Jim Loehr & Tony Schwartz",
      type: "Book",
      description: "Managing energy, not time, is the key to high performance.",
      link: "https://www.amazon.com/Power-Full-Engagement-Managing-Performance/dp/0743226755"
    },
    {
      title: "Peak Performance",
      author: "Brad Stulberg & Steve Magness",
      type: "Book",
      description: "Elevate your game, avoid burnout, and thrive with the new science of success.",
      link: "https://www.amazon.com/Peak-Performance-Elevate-Burnout-Science/dp/162336793X"
    },
    {
      title: "When",
      author: "Daniel H. Pink",
      type: "Book",
      description: "The scientific secrets of perfect timing.",
      link: "https://www.amazon.com/When-Scientific-Secrets-Perfect-Timing/dp/0735210624"
    }
  ],
  "circadian-rhythm": [
    {
      title: "The Circadian Code",
      author: "Satchin Panda",
      type: "Book",
      description: "Lose weight, supercharge your energy, and transform your health from morning to midnight.",
      link: "https://www.amazon.com/Circadian-Code-Supercharge-Transform-Midnight/dp/163565243X"
    },
    {
      title: "Change Your Schedule, Change Your Life",
      author: "Suhas Kshirsagar",
      type: "Book",
      description: "How to harness the power of clock genes to heal your body.",
      link: "https://www.amazon.com/Change-Your-Schedule-Life-Harness/dp/0062684922"
    },
    {
      title: "Circadian Rhythms",
      author: "National Institute of General Medical Sciences",
      type: "Resource",
      description: "Scientific overview of circadian rhythms and their impact on health.",
      link: "https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms.aspx"
    }
  ],
  "hydration-detox": [
    {
      title: "Quench",
      author: "Dana Cohen, MD & Gina Bria",
      type: "Book",
      description: "Beat fatigue, drop weight, and heal your body through the new science of optimum hydration.",
      link: "https://www.amazon.com/Quench-Fatigue-Weight-Through-Optimum/dp/0316515663"
    },
    {
      title: "Your Body's Many Cries for Water",
      author: "F. Batmanghelidj, MD",
      type: "Book",
      description: "You're not sick, you're thirsty - water for health, for healing, for life.",
      link: "https://www.amazon.com/Your-Bodys-Many-Cries-Water/dp/0970245882"
    },
    {
      title: "Hydration for Health",
      author: "Hydration for Health Initiative",
      type: "Resource",
      description: "Scientific research on hydration and health outcomes.",
      link: "https://www.hydrationforhealth.com/"
    }
  ],
  "environmental-wellness": [
    {
      title: "The Life-Changing Magic of Tidying Up",
      author: "Marie Kondo",
      type: "Book",
      description: "The Japanese art of decluttering and organizing.",
      link: "https://www.amazon.com/Life-Changing-Magic-Tidying-Decluttering-Organizing/dp/1607747308"
    },
    {
      title: "Healthy Home",
      author: "Environmental Working Group",
      type: "Resource",
      description: "Guide to creating a healthier home environment.",
      link: "https://www.ewg.org/healthyhomeguide/"
    },
    {
      title: "The Well Home",
      author: "International WELL Building Institute",
      type: "Resource",
      description: "Standards for buildings that support human health and well-being.",
      link: "https://www.wellcertified.com/"
    }
  ],
  "career-development": [
    {
      title: "So Good They Can't Ignore You",
      author: "Cal Newport",
      type: "Book",
      description: "Why skills trump passion in the quest for work you love.",
      link: "https://www.amazon.com/Good-They-Cant-Ignore-You/dp/1455509124"
    },
    {
      title: "Designing Your Life",
      author: "Bill Burnett & Dave Evans",
      type: "Book",
      description: "How to build a well-lived, joyful life using design thinking.",
      link: "https://www.amazon.com/Designing-Your-Life-Well-Lived-Joyful/dp/1101875321"
    },
    {
      title: "The Pathless Path",
      author: "Paul Millerd",
      type: "Book",
      description: "Imagining a new story for work and life.",
      link: "https://www.amazon.com/Pathless-Path-Imagining-Story-Work/dp/B09QF5VHBP"
    }
  ],
  "communication-skills": [
    {
      title: "Crucial Conversations",
      author: "Kerry Patterson et al.",
      type: "Book",
      description: "Tools for talking when stakes are high.",
      link: "https://www.amazon.com/Crucial-Conversations-Talking-Stakes-Second/dp/0071771328"
    },
    {
      title: "Never Split the Difference",
      author: "Chris Voss",
      type: "Book",
      description: "Negotiating as if your life depended on it - from a former FBI hostage negotiator.",
      link: "https://www.amazon.com/Never-Split-Difference-Negotiating-Depended/dp/0062407805"
    },
    {
      title: "How to Win Friends and Influence People",
      author: "Dale Carnegie",
      type: "Book",
      description: "The classic guide to building relationships and communicating effectively.",
      link: "https://www.amazon.com/How-Win-Friends-Influence-People/dp/0671027034"
    }
  ],
  "leadership": [
    {
      title: "Leaders Eat Last",
      author: "Simon Sinek",
      type: "Book",
      description: "Why some teams pull together and others don't.",
      link: "https://www.amazon.com/Leaders-Eat-Last-Together-Others/dp/1591848016"
    },
    {
      title: "Dare to Lead",
      author: "Brené Brown",
      type: "Book",
      description: "Brave work, tough conversations, whole hearts.",
      link: "https://www.amazon.com/Dare-Lead-Brave-Conversations-Hearts/dp/0399592520"
    },
    {
      title: "The 21 Irrefutable Laws of Leadership",
      author: "John C. Maxwell",
      type: "Book",
      description: "Follow them and people will follow you.",
      link: "https://www.amazon.com/21-Irrefutable-Laws-Leadership-Anniversary/dp/0785288376"
    }
  ],
  "creativity": [
    {
      title: "Big Magic",
      author: "Elizabeth Gilbert",
      type: "Book",
      description: "Creative living beyond fear.",
      link: "https://www.amazon.com/Big-Magic-Creative-Living-Beyond/dp/1594634726"
    },
    {
      title: "Steal Like an Artist",
      author: "Austin Kleon",
      type: "Book",
      description: "10 things nobody told you about being creative.",
      link: "https://www.amazon.com/Steal-Like-Artist-Things-Creative/dp/0761169253"
    },
    {
      title: "The War of Art",
      author: "Steven Pressfield",
      type: "Book",
      description: "Break through the blocks and win your inner creative battles.",
      link: "https://www.amazon.com/War-Art-Through-Creative-Battles/dp/1936891026"
    }
  ],
  "time-management": [
    {
      title: "Getting Things Done",
      author: "David Allen",
      type: "Book",
      description: "The art of stress-free productivity.",
      link: "https://www.amazon.com/Getting-Things-Done-Stress-Free-Productivity/dp/0143126563"
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      type: "Book",
      description: "Rules for focused success in a distracted world.",
      link: "https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692"
    },
    {
      title: "Make Time",
      author: "Jake Knapp & John Zeratsky",
      type: "Book",
      description: "How to focus on what matters every day.",
      link: "https://www.amazon.com/Make-Time-Focus-Matters-Every/dp/0525572422"
    }
  ],
  "personal-development": [
    {
      title: "Mindset",
      author: "Carol S. Dweck",
      type: "Book",
      description: "The new psychology of success - fixed vs growth mindset.",
      link: "https://www.amazon.com/Mindset-Psychology-Carol-S-Dweck/dp/0345472322"
    },
    {
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen R. Covey",
      type: "Book",
      description: "Powerful lessons in personal change.",
      link: "https://www.amazon.com/Habits-Highly-Effective-People-Powerful/dp/1982137274"
    },
    {
      title: "Can't Hurt Me",
      author: "David Goggins",
      type: "Book",
      description: "Master your mind and defy the odds.",
      link: "https://www.amazon.com/Cant-Hurt-Me-Master-Your/dp/1544512287"
    }
  ],
  "adventure-growth": [
    {
      title: "The Comfort Crisis",
      author: "Michael Easter",
      type: "Book",
      description: "Embrace discomfort to reclaim your wild, happy, healthy self.",
      link: "https://www.amazon.com/Comfort-Crisis-Embrace-Discomfort-Reclaim/dp/0593138767"
    },
    {
      title: "Born to Run",
      author: "Christopher McDougall",
      type: "Book",
      description: "A hidden tribe, superathletes, and the greatest race the world has never seen.",
      link: "https://www.amazon.com/Born-Run-Hidden-Superathletes-Greatest/dp/0307279189"
    },
    {
      title: "Into the Wild",
      author: "Jon Krakauer",
      type: "Book",
      description: "The story of a young man's search for meaning through adventure.",
      link: "https://www.amazon.com/Into-Wild-Jon-Krakauer/dp/0385486804"
    }
  ],
  "purpose-meaning": [
    {
      title: "Start with Why",
      author: "Simon Sinek",
      type: "Book",
      description: "How great leaders inspire everyone to take action.",
      link: "https://www.amazon.com/Start-Why-Leaders-Inspire-Everyone/dp/1591846447"
    },
    {
      title: "Ikigai",
      author: "Héctor García & Francesc Miralles",
      type: "Book",
      description: "The Japanese secret to a long and happy life.",
      link: "https://www.amazon.com/Ikigai-Japanese-Secret-Long-Happy/dp/0143130722"
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      type: "Book",
      description: "A fable about following your dream and finding your personal legend.",
      link: "https://www.amazon.com/Alchemist-Paulo-Coelho/dp/0062315005"
    }
  ],
  "resilience-building": [
    {
      title: "Option B",
      author: "Sheryl Sandberg & Adam Grant",
      type: "Book",
      description: "Facing adversity, building resilience, and finding joy.",
      link: "https://www.amazon.com/Option-Adversity-Building-Resilience-Finding/dp/1524732680"
    },
    {
      title: "Antifragile",
      author: "Nassim Nicholas Taleb",
      type: "Book",
      description: "Things that gain from disorder.",
      link: "https://www.amazon.com/Antifragile-Things-That-Disorder-Incerto/dp/0812979680"
    },
    {
      title: "Grit",
      author: "Angela Duckworth",
      type: "Book",
      description: "The power of passion and perseverance.",
      link: "https://www.amazon.com/Grit-Passion-Perseverance-Angela-Duckworth/dp/1501111116"
    }
  ],
  "mindfulness": [
    {
      title: "Wherever You Go, There You Are",
      author: "Jon Kabat-Zinn",
      type: "Book",
      description: "Mindfulness meditation in everyday life.",
      link: "https://www.amazon.com/Wherever-You-Go-There-Are/dp/1401307787"
    },
    {
      title: "10% Happier",
      author: "Dan Harris",
      type: "Book",
      description: "How I tamed the voice in my head and found self-help that actually works.",
      link: "https://www.amazon.com/10-Happier-Self-Help-Actually-Works/dp/0062265431"
    },
    {
      title: "The Miracle of Mindfulness",
      author: "Thich Nhat Hanh",
      type: "Book",
      description: "An introduction to the practice of meditation.",
      link: "https://www.amazon.com/Miracle-Mindfulness-Introduction-Practice-Meditation/dp/0807012394"
    }
  ],
  "positive-psychology": [
    {
      title: "Flourish",
      author: "Martin E.P. Seligman",
      type: "Book",
      description: "A visionary new understanding of happiness and well-being.",
      link: "https://www.amazon.com/Flourish-Visionary-Understanding-Happiness-Well-being/dp/1439190763"
    },
    {
      title: "The Happiness Advantage",
      author: "Shawn Achor",
      type: "Book",
      description: "How a positive brain fuels success in work and life.",
      link: "https://www.amazon.com/Happiness-Advantage-Positive-Brain-Success/dp/0307591557"
    },
    {
      title: "Authentic Happiness",
      author: "Martin E.P. Seligman",
      type: "Book",
      description: "Using the new positive psychology to realize your potential for lasting fulfillment.",
      link: "https://www.amazon.com/Authentic-Happiness-Psychology-Potential-Fulfillment/dp/0743222989"
    }
  ],
  "breathwork": [
    {
      title: "Breath",
      author: "James Nestor",
      type: "Book",
      description: "The new science of a lost art.",
      link: "https://www.amazon.com/Breath-New-Science-Lost-Art/dp/0735213615"
    },
    {
      title: "The Oxygen Advantage",
      author: "Patrick McKeown",
      type: "Book",
      description: "Simple, scientifically proven breathing techniques for better health and performance.",
      link: "https://www.amazon.com/Oxygen-Advantage-Scientifically-Breathing-Techniques/dp/0062349473"
    },
    {
      title: "Wim Hof Method",
      author: "Wim Hof",
      type: "Book",
      description: "Activate your full human potential through breathing, cold exposure, and commitment.",
      link: "https://www.amazon.com/Wim-Hof-Method-Activate-Potential/dp/1683644093"
    }
  ],
  "emotional-intelligence": [
    {
      title: "Emotional Intelligence",
      author: "Daniel Goleman",
      type: "Book",
      description: "Why it can matter more than IQ.",
      link: "https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X"
    },
    {
      title: "Permission to Feel",
      author: "Marc Brackett",
      type: "Book",
      description: "Unlocking the power of emotions to help our kids, ourselves, and our society thrive.",
      link: "https://www.amazon.com/Permission-Feel-Unlocking-Emotions-Ourselves/dp/1250212847"
    },
    {
      title: "Atlas of the Heart",
      author: "Brené Brown",
      type: "Book",
      description: "Mapping meaningful connection and the language of human experience.",
      link: "https://www.amazon.com/Atlas-Heart-Meaningful-Connection-Experience/dp/0399592555"
    }
  ],
  "nature-connection": [
    {
      title: "The Nature Fix",
      author: "Florence Williams",
      type: "Book",
      description: "Why nature makes us happier, healthier, and more creative.",
      link: "https://www.amazon.com/Nature-Fix-Happier-Healthier-Creative/dp/0393355578"
    },
    {
      title: "Last Child in the Woods",
      author: "Richard Louv",
      type: "Book",
      description: "Saving our children from nature-deficit disorder.",
      link: "https://www.amazon.com/Last-Child-Woods-Children-Nature-Deficit/dp/156512605X"
    },
    {
      title: "Forest Bathing",
      author: "Dr. Qing Li",
      type: "Book",
      description: "How trees can help you find health and happiness.",
      link: "https://www.amazon.com/Forest-Bathing-Trees-Health-Happiness/dp/052555985X"
    }
  ],
  "strength-training": [
    {
      title: "Starting Strength",
      author: "Mark Rippetoe",
      type: "Book",
      description: "Basic barbell training - the definitive guide.",
      link: "https://www.amazon.com/Starting-Strength-Basic-Barbell-Training/dp/0982522738"
    },
    {
      title: "The New Encyclopedia of Modern Bodybuilding",
      author: "Arnold Schwarzenegger",
      type: "Book",
      description: "The bible of bodybuilding, fully updated and revised.",
      link: "https://www.amazon.com/New-Encyclopedia-Modern-Bodybuilding-Updated/dp/0684857219"
    },
    {
      title: "Strength Training Anatomy",
      author: "Frédéric Delavier",
      type: "Book",
      description: "Detailed anatomical drawings of strength training exercises.",
      link: "https://www.amazon.com/Strength-Training-Anatomy-Frederic-Delavier/dp/0736092269"
    }
  ],
  "cardiovascular-health": [
    {
      title: "The Heart Book",
      author: "Cleveland Clinic",
      type: "Book",
      description: "Every question you ever wanted to ask about your heart.",
      link: "https://www.amazon.com/Cleveland-Clinic-Heart-Book-Question/dp/0786865288"
    },
    {
      title: "Prevent and Reverse Heart Disease",
      author: "Caldwell B. Esselstyn Jr., MD",
      type: "Book",
      description: "The revolutionary, scientifically proven, nutrition-based cure.",
      link: "https://www.amazon.com/Prevent-Reverse-Heart-Disease-Nutrition-Based/dp/1583333002"
    },
    {
      title: "American Heart Association",
      author: "American Heart Association",
      type: "Resource",
      description: "Evidence-based information on heart health and cardiovascular disease prevention.",
      link: "https://www.heart.org/"
    }
  ],
  "autism-support": [
    {
      title: "NeuroTribes",
      author: "Steve Silberman",
      type: "Book",
      description: "The legacy of autism and the future of neurodiversity.",
      link: "https://www.amazon.com/NeuroTribes-Legacy-Autism-Future-Neurodiversity/dp/0399185615"
    },
    {
      title: "Uniquely Human",
      author: "Barry M. Prizant",
      type: "Book",
      description: "A different way of seeing autism.",
      link: "https://www.amazon.com/Uniquely-Human-Different-Seeing-Autism/dp/1476776245"
    },
    {
      title: "Autism Self Advocacy Network",
      author: "ASAN",
      type: "Resource",
      description: "Resources and advocacy by and for autistic people.",
      link: "https://autisticadvocacy.org/"
    }
  ]
};

export default function ModuleResources() {
  const [, params] = useRoute("/wellness-modules/:slug/resources");
  const slug = params?.slug || "";
  
  const module = wellnessModulesData[slug];
  const resources = readingLists[slug] || [];
  
  if (!module) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Module not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link to={`/wellness-modules/${slug}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {module.title}
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {module.title} - Reading List
          </h1>
          <p className="text-xl text-gray-600">
            Curated books, articles, and resources to deepen your understanding
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <Badge variant="secondary">{resource.type}</Badge>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription>{resource.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <a 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    View Resource
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {resources.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reading list coming soon
              </h3>
              <p className="text-gray-600">
                We're curating the best resources for this module.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
