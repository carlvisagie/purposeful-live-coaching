import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  DollarSign, Users, TrendingUp, TrendingDown, Target, BarChart3,
  ArrowUpRight, ArrowDownRight, Activity, Eye, MousePointer,
  Mail, Share2, Zap, Calendar, Clock, Award, Flame, Globe,
  Instagram, Youtube, Twitter, Linkedin, Facebook, Rocket, Sparkles, Video, Radio
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

/**
 * FREEDOM DASHBOARD - Marketing & Business Intelligence
 * 
 * Real-time visibility into all marketing efforts and business metrics.
 * Designed to help make data-driven decisions and track path to freedom.
 */

// Mock data for demonstration - will be replaced with real API data
const revenueData = [
  { month: "Jan", revenue: 0, target: 1000 },
  { month: "Feb", revenue: 0, target: 2000 },
  { month: "Mar", revenue: 0, target: 3000 },
  { month: "Apr", revenue: 0, target: 5000 },
  { month: "May", revenue: 0, target: 7500 },
  { month: "Jun", revenue: 0, target: 10000 },
  { month: "Jul", revenue: 0, target: 15000 },
  { month: "Aug", revenue: 0, target: 20000 },
  { month: "Sep", revenue: 0, target: 25000 },
  { month: "Oct", revenue: 0, target: 30000 },
  { month: "Nov", revenue: 0, target: 35000 },
  { month: "Dec", revenue: 29, target: 40000 },
];

const userGrowthData = [
  { week: "W1", users: 0, trials: 0 },
  { week: "W2", users: 0, trials: 0 },
  { week: "W3", users: 0, trials: 0 },
  { week: "W4", users: 1, trials: 1 },
];

const channelData = [
  { name: "Organic Search", value: 0, color: "#10b981" },
  { name: "Social Media", value: 0, color: "#3b82f6" },
  { name: "Direct", value: 100, color: "#8b5cf6" },
  { name: "Referral", value: 0, color: "#f59e0b" },
  { name: "Paid Ads", value: 0, color: "#ef4444" },
];

const engagementData = [
  { day: "Mon", sessions: 0, duration: 0 },
  { day: "Tue", sessions: 0, duration: 0 },
  { day: "Wed", sessions: 0, duration: 0 },
  { day: "Thu", sessions: 0, duration: 0 },
  { day: "Fri", sessions: 0, duration: 0 },
  { day: "Sat", sessions: 0, duration: 0 },
  { day: "Sun", sessions: 0, duration: 0 },
];

export default function FreedomDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: user } = trpc.auth.me.useQuery();
  const { data: adminStats } = trpc.admin.getStats.useQuery({ timeRange: "30d" }, { enabled: !!user });

  // Calculate metrics from real data when available
  const totalUsers = adminStats?.totalUsers || 1;
  const activeUsers = adminStats?.activeUsers || 1;
  const totalRevenue = adminStats?.totalRevenue || 29;
  const conversionRate = adminStats?.conversionRate || 0;

  // Freedom Goal Tracking
  const freedomGoal = 10000; // Monthly revenue goal for "freedom"
  const currentMRR = 29;
  const progressToFreedom = (currentMRR / freedomGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Rocket className="h-10 w-10 text-purple-400" />
              Freedom Dashboard
            </h1>
            <p className="text-purple-200 mt-2">Your path to financial freedom, tracked in real-time</p>
          </div>
          <div className="flex gap-2">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range as any)}
                className={timeRange === range ? "bg-purple-600" : "border-purple-500 text-purple-200"}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Freedom Goal Progress */}
      <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="h-6 w-6" />
                Path to Freedom
              </h2>
              <p className="text-purple-100">Monthly recurring revenue goal: ${freedomGoal.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">${currentMRR.toLocaleString()}</div>
              <div className="text-purple-100">Current MRR</div>
            </div>
          </div>
          <Progress value={progressToFreedom} className="h-4 bg-purple-800" />
          <div className="flex justify-between mt-2 text-sm text-purple-100">
            <span>{progressToFreedom.toFixed(1)}% to freedom</span>
            <span>${(freedomGoal - currentMRR).toLocaleString()} to go</span>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={`$${currentMRR}`}
          change="+$29"
          changeType="positive"
          icon={<DollarSign className="h-6 w-6" />}
          subtitle="First paying customer!"
        />
        <MetricCard
          title="Total Users"
          value={totalUsers.toString()}
          change="+1"
          changeType="positive"
          icon={<Users className="h-6 w-6" />}
          subtitle="Active accounts"
        />
        <MetricCard
          title="Trial to Paid"
          value="100%"
          change="+100%"
          changeType="positive"
          icon={<TrendingUp className="h-6 w-6" />}
          subtitle="Conversion rate"
        />
        <MetricCard
          title="Customer LTV"
          value="$348"
          change="Projected"
          changeType="neutral"
          icon={<Award className="h-6 w-6" />}
          subtitle="12-month value"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-purple-500">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="marketing" className="data-[state=active]:bg-purple-600">
            Marketing
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-purple-600">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-purple-600">
            Goals
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">
            <Sparkles className="h-4 w-4 mr-1" />
            Content Studio
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Revenue vs Target
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Monthly revenue tracking against goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
                    <Bar dataKey="target" fill="#374151" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  User Growth
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Weekly user acquisition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="users" stroke="#10b981" fill="#10b98133" name="Users" />
                    <Area type="monotone" dataKey="trials" stroke="#3b82f6" fill="#3b82f633" name="Trials" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickStat label="Sessions Today" value="0" icon={<Activity />} />
            <QuickStat label="AI Conversations" value="1" icon={<Zap />} />
            <QuickStat label="Modules Completed" value="0" icon={<Award />} />
            <QuickStat label="Health Intakes" value="0" icon={<Target />} />
          </div>
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Sources */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Marketing Channels */}
            <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-pink-400" />
                  Channel Performance
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Track your marketing efforts across channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ChannelRow 
                    icon={<Instagram className="h-5 w-5 text-pink-500" />}
                    name="Instagram"
                    followers="0"
                    engagement="0%"
                    leads="0"
                    status="Not Started"
                  />
                  <ChannelRow 
                    icon={<Facebook className="h-5 w-5 text-blue-500" />}
                    name="Facebook"
                    followers="0"
                    engagement="0%"
                    leads="0"
                    status="Not Started"
                  />
                  <ChannelRow 
                    icon={<Youtube className="h-5 w-5 text-red-500" />}
                    name="YouTube"
                    followers="0"
                    engagement="0%"
                    leads="0"
                    status="Not Started"
                  />
                  <ChannelRow 
                    icon={<Linkedin className="h-5 w-5 text-blue-600" />}
                    name="LinkedIn"
                    followers="0"
                    engagement="0%"
                    leads="0"
                    status="Not Started"
                  />
                  <ChannelRow 
                    icon={<Mail className="h-5 w-5 text-green-500" />}
                    name="Email"
                    followers="0"
                    engagement="0%"
                    leads="0"
                    status="Not Started"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Marketing KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard label="Website Visitors" value="0" target="1,000" progress={0} />
            <KPICard label="Conversion Rate" value="0%" target="3%" progress={0} />
            <KPICard label="Cost Per Lead" value="$0" target="<$10" progress={0} />
            <KPICard label="ROAS" value="0x" target="3x" progress={0} />
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Engagement */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Daily Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sessions" stroke="#10b981" name="Sessions" />
                    <Line type="monotone" dataKey="duration" stroke="#8b5cf6" name="Avg Duration (min)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Feature Usage */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Feature Adoption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureUsage name="AI Chat" usage={100} />
                <FeatureUsage name="Voice Coach" usage={0} />
                <FeatureUsage name="Wellness Modules" usage={0} />
                <FeatureUsage name="Health Tracker" usage={0} />
                <FeatureUsage name="Daily Check-In" usage={0} />
                <FeatureUsage name="Emotion Tracker" usage={0} />
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickStat label="DAU" value="1" icon={<Users />} />
            <QuickStat label="MAU" value="1" icon={<Users />} />
            <QuickStat label="Avg Session" value="5m" icon={<Clock />} />
            <QuickStat label="Retention" value="100%" icon={<Flame />} />
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 90-Day Goals */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  90-Day Goals
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Beta launch milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <GoalItem goal="First 100 users" current={1} target={100} />
                <GoalItem goal="$2,900 MRR" current={29} target={2900} />
                <GoalItem goal="10 testimonials" current={0} target={10} />
                <GoalItem goal="3% conversion rate" current={0} target={3} />
                <GoalItem goal="5 influencer partnerships" current={0} target={5} />
              </CardContent>
            </Card>

            {/* Freedom Milestones */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-pink-400" />
                  Freedom Milestones
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your journey to financial freedom
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MilestoneItem 
                  title="First Customer" 
                  description="Someone paid for your product!"
                  achieved={true}
                  date="Dec 19, 2025"
                />
                <MilestoneItem 
                  title="$1,000 MRR" 
                  description="Covers basic expenses"
                  achieved={false}
                />
                <MilestoneItem 
                  title="$5,000 MRR" 
                  description="Part-time income replacement"
                  achieved={false}
                />
                <MilestoneItem 
                  title="$10,000 MRR" 
                  description="Full-time income replacement"
                  achieved={false}
                />
                <MilestoneItem 
                  title="$50,000 MRR" 
                  description="True financial freedom"
                  achieved={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Items */}
          <Card className="bg-gradient-to-r from-purple-900 to-pink-900 border-0">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Next Actions for Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ActionCard 
                  title="Launch Social Media"
                  description="Create Instagram & Facebook accounts"
                  priority="High"
                />
                <ActionCard 
                  title="Create Video Ads"
                  description="Showcase AI voice coach feature"
                  priority="High"
                />
                <ActionCard 
                  title="Find Influencers"
                  description="Partner with 5 micro-influencers"
                  priority="Medium"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Studio Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Quick Generate
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Create content with one click
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/content-studio">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Youtube className="h-4 w-4 mr-2" />
                    YouTube Script
                  </Button>
                </Link>
                <Link href="/content-studio">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Radio className="h-4 w-4 mr-2" />
                    Podcast Episode
                  </Button>
                </Link>
                <Link href="/content-studio">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    <Video className="h-4 w-4 mr-2" />
                    TikTok/Reels
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Content Calendar */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  This Week's Content
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your content schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 bg-slate-700/50 rounded flex items-center justify-between">
                  <span className="text-white text-sm">Mon</span>
                  <Badge className="bg-red-600">YouTube</Badge>
                </div>
                <div className="p-2 bg-slate-700/50 rounded flex items-center justify-between">
                  <span className="text-white text-sm">Tue</span>
                  <Badge className="bg-purple-600">Podcast</Badge>
                </div>
                <div className="p-2 bg-slate-700/50 rounded flex items-center justify-between">
                  <span className="text-white text-sm">Wed</span>
                  <Badge className="bg-red-600">YouTube</Badge>
                </div>
                <div className="p-2 bg-slate-700/50 rounded flex items-center justify-between">
                  <span className="text-white text-sm">Thu</span>
                  <Badge className="bg-purple-600">Podcast</Badge>
                </div>
                <div className="p-2 bg-slate-700/50 rounded flex items-center justify-between">
                  <span className="text-white text-sm">Fri</span>
                  <Badge className="bg-red-600">YouTube</Badge>
                </div>
                <Link href="/content-studio">
                  <Button variant="outline" className="w-full mt-2 border-purple-500 text-purple-400 hover:bg-purple-500/20">
                    Open Content Studio
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Content Stats */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Content Stats
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your content performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-4xl font-bold text-white">0</div>
                  <div className="text-sm text-slate-400">Videos Published</div>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-4xl font-bold text-white">0</div>
                  <div className="text-sm text-slate-400">Podcast Episodes</div>
                </div>
                <div className="text-center p-4 bg-purple-600/20 rounded-lg border border-purple-500/50">
                  <div className="text-sm text-purple-300">Start creating content to grow your audience!</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Content Studio Link */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Ready to Create?</h3>
                <p className="text-purple-100">Open the full Content Studio to generate scripts, plan your calendar, and more.</p>
              </div>
              <Link href="/content-studio">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-100">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Open Content Studio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
function MetricCard({ title, value, change, changeType, icon, subtitle }: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  subtitle: string;
}) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-600/20 rounded-lg text-purple-400">
            {icon}
          </div>
          <Badge 
            variant={changeType === "positive" ? "default" : changeType === "negative" ? "destructive" : "secondary"}
            className={changeType === "positive" ? "bg-green-600" : ""}
          >
            {change}
          </Badge>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-slate-400">{title}</div>
        <div className="text-xs text-purple-400 mt-1">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

function QuickStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="text-purple-400">{icon}</div>
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-xs text-slate-400">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChannelRow({ icon, name, followers, engagement, leads, status }: {
  icon: React.ReactNode;
  name: string;
  followers: string;
  engagement: string;
  leads: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-white font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className="text-white">{followers}</div>
          <div className="text-slate-400 text-xs">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-white">{engagement}</div>
          <div className="text-slate-400 text-xs">Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-white">{leads}</div>
          <div className="text-slate-400 text-xs">Leads</div>
        </div>
        <Badge variant="outline" className="border-slate-500 text-slate-400">
          {status}
        </Badge>
      </div>
    </div>
  );
}

function KPICard({ label, value, target, progress }: {
  label: string;
  value: string;
  target: string;
  progress: number;
}) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <div className="text-xs text-slate-400 mb-1">{label}</div>
        <div className="text-2xl font-bold text-white mb-2">{value}</div>
        <Progress value={progress} className="h-1 mb-1" />
        <div className="text-xs text-purple-400">Target: {target}</div>
      </CardContent>
    </Card>
  );
}

function FeatureUsage({ name, usage }: { name: string; usage: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white">{name}</span>
        <span className="text-purple-400">{usage}%</span>
      </div>
      <Progress value={usage} className="h-2" />
    </div>
  );
}

function GoalItem({ goal, current, target }: { goal: string; current: number; target: number }) {
  const progress = (current / target) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white">{goal}</span>
        <span className="text-purple-400">{current}/{target}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

function MilestoneItem({ title, description, achieved, date }: {
  title: string;
  description: string;
  achieved: boolean;
  date?: string;
}) {
  return (
    <div className={`p-3 rounded-lg ${achieved ? "bg-green-900/30 border border-green-700" : "bg-slate-700/50"}`}>
      <div className="flex items-center gap-2">
        {achieved ? (
          <Award className="h-5 w-5 text-green-400" />
        ) : (
          <Target className="h-5 w-5 text-slate-500" />
        )}
        <span className={`font-medium ${achieved ? "text-green-400" : "text-white"}`}>{title}</span>
      </div>
      <div className="text-xs text-slate-400 mt-1">{description}</div>
      {achieved && date && (
        <div className="text-xs text-green-500 mt-1">Achieved: {date}</div>
      )}
    </div>
  );
}

function ActionCard({ title, description, priority }: {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}) {
  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-white">{title}</span>
        <Badge className={priority === "High" ? "bg-red-600" : priority === "Medium" ? "bg-yellow-600" : "bg-green-600"}>
          {priority}
        </Badge>
      </div>
      <div className="text-sm text-slate-400">{description}</div>
    </div>
  );
}
