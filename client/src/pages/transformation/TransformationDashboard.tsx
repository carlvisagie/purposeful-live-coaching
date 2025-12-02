import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  TrendingUp,
  Target,
  Zap,
  Brain,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

/**
 * TRANSFORMATION DASHBOARD
 * 
 * Central hub for the PurposefulLive Transformation Protocol
 * Tracks identity evolution, habit formation, and behavioral change
 * 
 * Synthesizes:
 * - Chase Hughes (behavioral influence)
 * - Og Mandino (emotional transformation)
 * - BJ Fogg (tiny habits)
 * - James Clear (identity-based change)
 * - Andrew Huberman (neurochemical optimization)
 */
export default function TransformationDashboard() {
  const { data: profile } = trpc.identity.getProfile.useQuery();
  const { data: recentCheckIns } = trpc.identity.getRecentCheckIns.useQuery({ limit: 7 });
  const { data: habits } = trpc.identity.getHabits.useQuery();
  const { data: todayCompletions } = trpc.identity.getTodayCompletions.useQuery();

  const completedToday = todayCompletions?.length || 0;
  const totalHabits = habits?.length || 0;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const avgEnergyLevel = recentCheckIns?.length
    ? Math.round(
        recentCheckIns.reduce((sum, c) => sum + (c.energyLevel || 0), 0) / recentCheckIns.length
      )
    : 0;

  const avgIdentityAlignment = recentCheckIns?.length
    ? Math.round(
        recentCheckIns.reduce((sum, c) => sum + (c.identityAlignment || 0), 0) /
          recentCheckIns.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Transformation Protocol
          </h1>
          <p className="text-gray-400 text-lg">
            Your journey to becoming who you're meant to be
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/transformation/check-in">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-primary" />
                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Daily Check-In
              </h3>
              <p className="text-gray-400 text-sm">
                Track your energy, mood, and progress
              </p>
            </Card>
          </Link>

          <Link href="/transformation/habits">
            <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 hover:border-accent/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="w-8 h-8 text-accent" />
                <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Habit Tracker
              </h3>
              <p className="text-gray-400 text-sm">
                Build identity-based habits
              </p>
            </Card>
          </Link>

          <Link href="/transformation/identity">
            <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-blue-500" />
                <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Identity Profile
              </h3>
              <p className="text-gray-400 text-sm">
                Define who you're becoming
              </p>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-400 text-sm">Avg Energy</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {avgEnergyLevel}/10
            </div>
          </Card>

          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-gray-400 text-sm">Identity Alignment</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {avgIdentityAlignment}/10
            </div>
          </Card>

          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-gray-400 text-sm">Today's Habits</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {completedToday}/{totalHabits}
            </div>
          </Card>

          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-gray-400 text-sm">Completion Rate</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {completionRate}%
            </div>
          </Card>
        </div>

        {/* Recent Progress */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Check-Ins */}
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-500" />
              Recent Check-Ins
            </h3>

            {!recentCheckIns || recentCheckIns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No check-ins yet</p>
                <Link href="/transformation/check-in">
                  <Button className="bg-primary hover:bg-primary/90">
                    Start Your First Check-In
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCheckIns.slice(0, 5).map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-medium">
                        {new Date(checkIn.checkInDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        Energy: {checkIn.energyLevel}/10 • Mood: {checkIn.moodLevel}/10
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-semibold">
                        {checkIn.identityAlignment}/10
                      </div>
                      <div className="text-xs text-gray-400">Alignment</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Active Habits */}
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Active Habits
            </h3>

            {!habits || habits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No habits yet</p>
                <Link href="/transformation/habits">
                  <Button className="bg-primary hover:bg-primary/90">
                    Create Your First Habit
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.slice(0, 5).map((habit) => {
                  const completed = todayCompletions?.some(
                    (c) => c.habitId === habit.id
                  );
                  return (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                        )}
                        <span className="text-white">{habit.name}</span>
                      </div>
                      <div className="text-primary font-semibold">
                        {habit.currentStreak || 0} day streak
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Transformation Principles */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🎯 The Transformation Protocol
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-white mb-2">Identity First</h4>
              <p className="text-gray-300 text-sm">
                Change who you are, not just what you do. Every action is a vote for your identity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h4 className="font-semibold text-white mb-2">Tiny Habits</h4>
              <p className="text-gray-300 text-sm">
                Start so small you can't fail. Consistency beats intensity every time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="font-semibold text-white mb-2">Adaptive Learning</h4>
              <p className="text-gray-300 text-sm">
                The system learns from your patterns and adapts strategies to your unique journey.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
