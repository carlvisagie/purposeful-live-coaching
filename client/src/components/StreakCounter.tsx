import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Award, Star, Zap, Trophy } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface StreakCounterProps {
  compact?: boolean;
}

/**
 * StreakCounter - Gamification component showing user's current streak
 * 
 * Research shows streaks increase retention by 2-3x (Duolingo model)
 * - Shows current streak (consecutive days of activity)
 * - Displays milestone badges
 * - Encourages daily engagement
 */
export default function StreakCounter({ compact = false }: StreakCounterProps) {
  const { data: recentCheckIns } = trpc.dailyCheckIns.getRecent.useQuery({ limit: 30 });
  
  // Calculate streak from check-ins
  const calculateStreak = () => {
    if (!recentCheckIns || recentCheckIns.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort by date descending
    const sortedCheckIns = [...recentCheckIns].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Get unique dates
    const uniqueDates = new Set<string>();
    sortedCheckIns.forEach(checkIn => {
      const date = new Date(checkIn.createdAt);
      date.setHours(0, 0, 0, 0);
      uniqueDates.add(date.toISOString());
    });
    
    const dates = Array.from(uniqueDates).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    // Check if today or yesterday has a check-in
    const todayStr = today.toISOString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString();
    
    if (!dates.includes(todayStr) && !dates.includes(yesterdayStr)) {
      return 0; // Streak broken
    }
    
    // Count consecutive days
    let currentDate = dates.includes(todayStr) ? today : yesterday;
    
    for (const dateStr of dates) {
      const checkDate = new Date(dateStr);
      checkDate.setHours(0, 0, 0, 0);
      
      if (checkDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (checkDate.getTime() < currentDate.getTime()) {
        break; // Gap in streak
      }
    }
    
    return streak;
  };
  
  const streak = calculateStreak();
  
  // Determine badge level
  const getBadge = () => {
    if (streak >= 30) return { icon: Trophy, label: "Champion", color: "text-yellow-500", bg: "bg-yellow-100" };
    if (streak >= 14) return { icon: Award, label: "Dedicated", color: "text-purple-500", bg: "bg-purple-100" };
    if (streak >= 7) return { icon: Star, label: "Consistent", color: "text-blue-500", bg: "bg-blue-100" };
    if (streak >= 3) return { icon: Zap, label: "Building", color: "text-green-500", bg: "bg-green-100" };
    return { icon: Flame, label: "Starting", color: "text-orange-500", bg: "bg-orange-100" };
  };
  
  const badge = getBadge();
  const BadgeIcon = badge.icon;
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-full ${badge.bg}`}>
          <Flame className={`h-4 w-4 ${streak > 0 ? "text-orange-500" : "text-gray-400"}`} />
        </div>
        <span className="font-bold text-lg">{streak}</span>
        <span className="text-sm text-muted-foreground">day streak</span>
      </div>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${badge.bg}`}>
              <Flame className={`h-6 w-6 ${streak > 0 ? "text-orange-500 animate-pulse" : "text-gray-400"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{streak}</span>
                <span className="text-muted-foreground">day streak</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {streak === 0 
                  ? "Complete a check-in to start your streak!"
                  : streak === 1 
                    ? "Great start! Keep it going!"
                    : `You're on fire! ${streak} days in a row!`
                }
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className={`${badge.color} border-current`}>
            <BadgeIcon className="h-3 w-3 mr-1" />
            {badge.label}
          </Badge>
        </div>
        
        {/* Milestone Progress */}
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <div className={`flex flex-col items-center ${streak >= 3 ? "text-green-500" : ""}`}>
            <Zap className="h-4 w-4" />
            <span>3</span>
          </div>
          <div className={`flex flex-col items-center ${streak >= 7 ? "text-blue-500" : ""}`}>
            <Star className="h-4 w-4" />
            <span>7</span>
          </div>
          <div className={`flex flex-col items-center ${streak >= 14 ? "text-purple-500" : ""}`}>
            <Award className="h-4 w-4" />
            <span>14</span>
          </div>
          <div className={`flex flex-col items-center ${streak >= 30 ? "text-yellow-500" : ""}`}>
            <Trophy className="h-4 w-4" />
            <span>30</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
