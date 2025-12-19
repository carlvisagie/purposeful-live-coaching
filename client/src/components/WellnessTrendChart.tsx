import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

/**
 * WellnessTrendChart - Shows wellness progress over time
 * 
 * Research shows visual progress tracking increases motivation by 40%
 * - Displays check-in frequency over last 7 days
 * - Shows trend direction (improving, stable, declining)
 * - Simple, encouraging visualization
 */
export default function WellnessTrendChart() {
  const { data: recentCheckIns } = trpc.dailyCheckIns.getRecent.useQuery({ limit: 14 });
  
  // Generate last 7 days data
  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      // Count check-ins for this day
      const dayCheckIns = recentCheckIns?.filter(checkIn => {
        const checkInDate = new Date(checkIn.createdAt);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate.getTime() === date.getTime();
      }) || [];
      
      // Score based on check-ins (0-2 possible per day: morning + evening)
      const score = Math.min(dayCheckIns.length, 2);
      
      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        score: score,
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  
  // Calculate trend
  const calculateTrend = () => {
    if (chartData.length < 4) return "stable";
    
    const firstHalf = chartData.slice(0, 3).reduce((sum, d) => sum + d.score, 0);
    const secondHalf = chartData.slice(4).reduce((sum, d) => sum + d.score, 0);
    
    if (secondHalf > firstHalf) return "up";
    if (secondHalf < firstHalf) return "down";
    return "stable";
  };
  
  const trend = calculateTrend();
  const totalCheckIns = chartData.reduce((sum, d) => sum + d.score, 0);
  const completionRate = Math.round((totalCheckIns / 14) * 100); // 14 possible check-ins in 7 days
  
  const chartConfig: ChartConfig = {
    score: {
      label: "Check-ins",
      color: "hsl(var(--chart-1))",
    },
  };
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500";
  const trendText = trend === "up" ? "Improving" : trend === "down" ? "Needs attention" : "Stable";
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
            <CardDescription>Your check-in consistency</CardDescription>
          </div>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{trendText}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div>
            <span className="text-3xl font-bold">{completionRate}%</span>
            <span className="text-sm text-muted-foreground ml-1">completion</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {totalCheckIns} check-ins this week
          </div>
        </div>
        
        <ChartContainer config={chartConfig} className="h-[120px] w-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis hide domain={[0, 2]} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value) => [`${value} check-in${value !== 1 ? 's' : ''}`, 'Activity']}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--chart-1))"
              fill="url(#fillScore)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          Complete morning & evening check-ins for best results
        </p>
      </CardContent>
    </Card>
  );
}
