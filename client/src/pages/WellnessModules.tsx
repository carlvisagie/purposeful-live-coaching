import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  TreePine
} from "lucide-react";

const wellnessModules = [
  // Core 5 Pillars
  { icon: Heart, title: "Emotional Wellness", description: "Master your emotions and build resilience", category: "Core", color: "text-red-500" },
  { icon: Brain, title: "Mental Health", description: "Clarity, focus, and peace of mind", category: "Core", color: "text-purple-500" },
  { icon: Activity, title: "Physical Fitness", description: "Strength, energy, and vitality", category: "Core", color: "text-green-500" },
  { icon: Apple, title: "Nutrition", description: "Fuel your body for optimal performance", category: "Core", color: "text-orange-500" },
  { icon: Sparkles, title: "Spiritual Wellness", description: "Purpose, meaning, and inner peace", category: "Core", color: "text-indigo-500" },
  
  // Lifestyle & Wellness
  { icon: Users, title: "Relationships", description: "Build meaningful connections", category: "Lifestyle", color: "text-pink-500" },
  { icon: DollarSign, title: "Financial Wellness", description: "Money mindset and financial freedom", category: "Lifestyle", color: "text-emerald-500" },
  { icon: Target, title: "Goal Achievement", description: "Set and achieve your biggest goals", category: "Lifestyle", color: "text-blue-500" },
  { icon: Flame, title: "Habit Formation", description: "Build lasting positive habits", category: "Lifestyle", color: "text-amber-500" },
  { icon: Moon, title: "Sleep Optimization", description: "Restorative sleep for peak performance", category: "Lifestyle", color: "text-slate-500" },
  { icon: Zap, title: "Stress Management", description: "Reduce stress and increase calm", category: "Lifestyle", color: "text-yellow-500" },
  { icon: BookOpen, title: "Journaling", description: "Self-reflection and personal growth", category: "Lifestyle", color: "text-teal-500" },
  
  // Professional & Personal Growth
  { icon: Briefcase, title: "Career Development", description: "Advance your professional life", category: "Growth", color: "text-cyan-500" },
  { icon: MessageCircle, title: "Communication Skills", description: "Express yourself clearly and confidently", category: "Growth", color: "text-violet-500" },
  { icon: Award, title: "Leadership", description: "Develop your leadership potential", category: "Growth", color: "text-rose-500" },
  { icon: Lightbulb, title: "Creativity", description: "Unlock your creative potential", category: "Growth", color: "text-fuchsia-500" },
  { icon: Clock, title: "Time Management", description: "Master your schedule and priorities", category: "Growth", color: "text-sky-500" },
  { icon: TrendingUp, title: "Personal Development", description: "Continuous self-improvement", category: "Growth", color: "text-lime-500" },
  
  // Advanced Modules
  { icon: Shield, title: "Resilience Building", description: "Bounce back stronger from setbacks", category: "Advanced", color: "text-stone-500" },
  { icon: Eye, title: "Mindfulness", description: "Present moment awareness", category: "Advanced", color: "text-amber-600" },
  { icon: Smile, title: "Positive Psychology", description: "Cultivate happiness and well-being", category: "Advanced", color: "text-yellow-600" },
  { icon: Coffee, title: "Energy Management", description: "Optimize your daily energy levels", category: "Advanced", color: "text-orange-600" },
  { icon: Wind, title: "Breathwork", description: "Harness the power of your breath", category: "Advanced", color: "text-cyan-600" },
  { icon: Droplet, title: "Hydration & Detox", description: "Cleanse and nourish your body", category: "Advanced", color: "text-blue-600" },
  { icon: Sun, title: "Circadian Rhythm", description: "Align with your natural rhythms", category: "Advanced", color: "text-yellow-500" },
  { icon: Star, title: "Purpose & Meaning", description: "Discover your life's purpose", category: "Advanced", color: "text-indigo-600" },
  { icon: Leaf, title: "Environmental Wellness", description: "Create a healthy living space", category: "Advanced", color: "text-green-600" },
  { icon: Mountain, title: "Adventure & Growth", description: "Step outside your comfort zone", category: "Advanced", color: "text-slate-600" },
  { icon: Waves, title: "Emotional Intelligence", description: "Understand and manage emotions", category: "Advanced", color: "text-teal-600" },
  { icon: TreePine, title: "Nature Connection", description: "Reconnect with the natural world", category: "Advanced", color: "text-emerald-600" },
  { icon: Home, title: "Work-Life Balance", description: "Harmony between work and personal life", category: "Advanced", color: "text-purple-600" },
];

const categories = ["All", "Core", "Lifestyle", "Growth", "Advanced"];

export default function WellnessModules() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredModules = selectedCategory === "All" 
    ? wellnessModules 
    : wellnessModules.filter(m => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Comprehensive Wellness Modules
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              31 evidence-based modules to transform every area of your life
            </p>
            <Link to="/pricing">
              <Button size="lg" variant="secondary" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module, idx) => {
            const Icon = module.icon;
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 ${module.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">{module.category}</Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Access all 31 wellness modules with AI-powered coaching and live human support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button size="lg" variant="secondary">
                  View Pricing Plans
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
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


