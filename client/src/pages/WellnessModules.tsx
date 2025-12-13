import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Heart,
  Brain,
  Activity,
  Apple,
  Sparkles,
  Users,
  DollarSign,
  Target,
  Flame,
  Moon,
  Zap,
  BookOpen,
  TrendingUp,
  Shield,
  Lightbulb,
  Clock,
  Home,
  Briefcase,
  MessageCircle,
  Award,
  Eye,
  Smile,
  Coffee,
  Wind,
  Droplet,
  Sun,
  Star,
  Leaf,
  Mountain,
  Waves,
  TreePine,
  Dumbbell,
  HeartPulse,
  Search,
  Lock
} from "lucide-react";

const wellnessModules = [
  // Core 5 Pillars
  { icon: Heart, title: "Emotional Wellness", description: "Master your emotions and build resilience through evidence-based techniques", category: "Core", color: "text-red-500", bgColor: "bg-red-50" },
  { icon: Brain, title: "Mental Health", description: "Clarity, focus, and peace of mind using cognitive behavioral strategies", category: "Core", color: "text-purple-500", bgColor: "bg-purple-50" },
  { icon: Activity, title: "Physical Fitness", description: "Strength, energy, and vitality through personalized movement plans", category: "Core", color: "text-green-500", bgColor: "bg-green-50" },
  { icon: Apple, title: "Nutrition", description: "Fuel your body for optimal performance with science-backed nutrition", category: "Core", color: "text-orange-500", bgColor: "bg-orange-50" },
  { icon: Sparkles, title: "Spiritual Wellness", description: "Purpose, meaning, and inner peace through mindful practices", category: "Core", color: "text-indigo-500", bgColor: "bg-indigo-50" },
  
  // Lifestyle & Wellness (12 modules)
  { icon: Users, title: "Relationships", description: "Build meaningful connections and healthy communication patterns", category: "Lifestyle", color: "text-pink-500", bgColor: "bg-pink-50" },
  { icon: DollarSign, title: "Financial Wellness", description: "Money mindset and financial freedom strategies", category: "Lifestyle", color: "text-emerald-500", bgColor: "bg-emerald-50" },
  { icon: Target, title: "Goal Achievement", description: "Set and achieve your biggest goals with proven frameworks", category: "Lifestyle", color: "text-blue-500", bgColor: "bg-blue-50" },
  { icon: Flame, title: "Habit Formation", description: "Build lasting positive habits using behavioral science", category: "Lifestyle", color: "text-amber-500", bgColor: "bg-amber-50" },
  { icon: Moon, title: "Sleep Optimization", description: "Restorative sleep for peak performance and recovery", category: "Lifestyle", color: "text-slate-500", bgColor: "bg-slate-50" },
  { icon: Zap, title: "Stress Management", description: "Reduce stress and increase calm through proven techniques", category: "Lifestyle", color: "text-yellow-500", bgColor: "bg-yellow-50" },
  { icon: BookOpen, title: "Journaling", description: "Self-reflection and personal growth through structured writing", category: "Lifestyle", color: "text-teal-500", bgColor: "bg-teal-50" },
  { icon: Home, title: "Work-Life Balance", description: "Harmony between work and personal life for sustainable success", category: "Lifestyle", color: "text-purple-600", bgColor: "bg-purple-50" },
  { icon: Coffee, title: "Energy Management", description: "Optimize your daily energy levels for peak productivity", category: "Lifestyle", color: "text-orange-600", bgColor: "bg-orange-50" },
  { icon: Sun, title: "Circadian Rhythm", description: "Align with your natural rhythms for better health", category: "Lifestyle", color: "text-yellow-500", bgColor: "bg-yellow-50" },
  { icon: Droplet, title: "Hydration & Detox", description: "Cleanse and nourish your body from the inside out", category: "Lifestyle", color: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: Leaf, title: "Environmental Wellness", description: "Create a healthy living space that supports your wellbeing", category: "Lifestyle", color: "text-green-600", bgColor: "bg-green-50" },
  
  // Professional & Personal Growth (8 modules)
  { icon: Briefcase, title: "Career Development", description: "Advance your professional life with strategic planning", category: "Growth", color: "text-cyan-500", bgColor: "bg-cyan-50" },
  { icon: MessageCircle, title: "Communication Skills", description: "Express yourself clearly and confidently in any situation", category: "Growth", color: "text-violet-500", bgColor: "bg-violet-50" },
  { icon: Award, title: "Leadership", description: "Develop your leadership potential and influence", category: "Growth", color: "text-rose-500", bgColor: "bg-rose-50" },
  { icon: Lightbulb, title: "Creativity", description: "Unlock your creative potential and innovative thinking", category: "Growth", color: "text-fuchsia-500", bgColor: "bg-fuchsia-50" },
  { icon: Clock, title: "Time Management", description: "Master your schedule and priorities for maximum impact", category: "Growth", color: "text-sky-500", bgColor: "bg-sky-50" },
  { icon: TrendingUp, title: "Personal Development", description: "Continuous self-improvement and growth mindset", category: "Growth", color: "text-lime-500", bgColor: "bg-lime-50" },
  { icon: Mountain, title: "Adventure & Growth", description: "Step outside your comfort zone and embrace challenges", category: "Growth", color: "text-slate-600", bgColor: "bg-slate-50" },
  { icon: Star, title: "Purpose & Meaning", description: "Discover your life's purpose and live with intention", category: "Growth", color: "text-indigo-600", bgColor: "bg-indigo-50" },
  
  // Advanced Modules (8 modules)
  { icon: Shield, title: "Resilience Building", description: "Bounce back stronger from setbacks and adversity", category: "Advanced", color: "text-stone-500", bgColor: "bg-stone-50" },
  { icon: Eye, title: "Mindfulness", description: "Present moment awareness and meditation practices", category: "Advanced", color: "text-amber-600", bgColor: "bg-amber-50" },
  { icon: Smile, title: "Positive Psychology", description: "Cultivate happiness and well-being scientifically", category: "Advanced", color: "text-yellow-600", bgColor: "bg-yellow-50" },
  { icon: Wind, title: "Breathwork", description: "Harness the power of your breath for transformation", category: "Advanced", color: "text-cyan-600", bgColor: "bg-cyan-50" },
  { icon: Waves, title: "Emotional Intelligence", description: "Understand and manage emotions effectively", category: "Advanced", color: "text-teal-600", bgColor: "bg-teal-50" },
  { icon: TreePine, title: "Nature Connection", description: "Reconnect with the natural world for healing", category: "Advanced", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: Dumbbell, title: "Strength Training", description: "Build physical and mental strength systematically", category: "Advanced", color: "text-red-600", bgColor: "bg-red-50" },
  { icon: HeartPulse, title: "Cardiovascular Health", description: "Optimize heart health and endurance for longevity", category: "Advanced", color: "text-rose-600", bgColor: "bg-rose-50" },
];

const categories = [
  { name: "All", count: 33, description: "Complete wellness transformation" },
  { name: "Core", count: 5, description: "Essential foundation pillars" },
  { name: "Lifestyle", count: 12, description: "Daily wellness practices" },
  { name: "Growth", count: 8, description: "Professional & personal development" },
  { name: "Advanced", count: 8, description: "Deep transformation work" },
];

export default function WellnessModules() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user's subscription tier for access control
  const { data: usageData } = trpc.subscriptions.getCurrentUsage.useQuery();

  // Determine tier access (Basic: 5 modules, Premium/Elite: all 33)
  const tierModuleLimit = usageData?.tierName?.includes('Basic') ? 5 : 33;
  const hasFullAccess = tierModuleLimit === 33;

  const filteredModules = wellnessModules.filter(m => {
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-lg px-4 py-2">
              33 Evidence-Based Modules
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Complete Wellness Transformation
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
              Transform every area of your life with our comprehensive, science-backed wellness system. From emotional mastery to physical vitality, we've got you covered.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search modules (e.g., stress, nutrition, habits...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg bg-white/95 border-white/30"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6">
                  <Sparkles className="h-5 w-5" />
                  Get Started Today
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white/10">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedCategory === category.name
                    ? "border-purple-600 bg-purple-50 shadow-lg scale-105"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                }`}
              >
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${
                    selectedCategory === category.name ? "text-purple-600" : "text-gray-900"
                  }`}>
                    {category.count}
                  </div>
                  <div className={`text-sm font-semibold mb-1 ${
                    selectedCategory === category.name ? "text-purple-600" : "text-gray-700"
                  }`}>
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="container pb-20">
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600">
            Showing <span className="font-bold text-purple-600">{filteredModules.length}</span> modules
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module, idx) => {
            const Icon = module.icon;
            const isLocked = !hasFullAccess && idx >= tierModuleLimit;
            return (
              <Card 
                key={idx} 
                className={`hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-purple-300 hover:-translate-y-1 ${isLocked ? 'opacity-60' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-4 rounded-xl ${module.bgColor} group-hover:scale-110 transition-transform relative`}>
                      <Icon className={`h-7 w-7 ${module.color}`} />
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 rounded-xl">
                          <Lock className="h-5 w-5 text-gray-700" />
                        </div>
                      )}
                    </div>
                    <Badge variant={isLocked ? "outline" : "secondary"} className="text-xs">
                      {isLocked ? "Premium" : module.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors leading-tight">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {isLocked ? (
                      <span className="text-orange-600 font-medium">🔒 Upgrade to Premium to unlock</span>
                    ) : (
                      module.description
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No modules found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 mb-10 leading-relaxed">
              Access all 33 wellness modules with AI-powered coaching available 24/7, plus optional live human support for deeper transformation.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">33</div>
                <div className="text-sm">Wellness Modules</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm">AI Coach Access</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm">Evidence-Based</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button size="lg" variant="secondary" className="text-lg px-10 py-7">
                  View Pricing Plans
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 bg-transparent border-white text-white hover:bg-white/10">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
