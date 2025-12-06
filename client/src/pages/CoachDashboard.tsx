import { useAuth } from "@/_core/hooks/useAuth";
import ScriptTeleprompter from "@/components/ScriptTeleprompter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Users, TrendingUp, Zap } from "lucide-react";
import { APP_TITLE } from "@/const";

export default function CoachDashboard() {
  const { user, loading } = useAuth();

  // Auth disabled for demo/development - useAuth() now returns mock admin user
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user || user.role !== "admin") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <Card className="p-8 max-w-md text-center">
  //         <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
  //         <p className="text-muted-foreground">
  //           This page is only accessible to coaches.
  //         </p>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Script Teleprompter (always available) */}
      <ScriptTeleprompter />

      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{APP_TITLE} - Coach Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
            </div>
            <Badge variant="default" className="gap-1">
              <Zap className="w-3 h-3" />
              Script Teleprompter Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Quick Stats */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-primary" />
              <Badge variant="secondary">This Week</Badge>
            </div>
            <h3 className="text-3xl font-bold">12</h3>
            <p className="text-sm text-muted-foreground">Active Clients</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <Badge variant="secondary">Today</Badge>
            </div>
            <h3 className="text-3xl font-bold">3</h3>
            <p className="text-sm text-muted-foreground">Sessions Scheduled</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <Badge variant="secondary">30 Days</Badge>
            </div>
            <h3 className="text-3xl font-bold">85%</h3>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <Badge variant="secondary">Library</Badge>
            </div>
            <h3 className="text-3xl font-bold">50+</h3>
            <p className="text-sm text-muted-foreground">Scripts Available</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Script Teleprompter
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Access research-backed scripts during live calls. Type trigger words or browse the library.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+S</kbd>
                <span className="text-muted-foreground">Open script search</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd>
                <span className="text-muted-foreground">Close teleprompter</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Today's Sessions
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Sarah J.</p>
                  <p className="text-xs text-muted-foreground">Growth Coaching</p>
                </div>
                <Badge variant="outline">6:00 PM</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Michael T.</p>
                  <p className="text-xs text-muted-foreground">Discovery Call</p>
                </div>
                <Badge variant="outline">7:00 PM</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Emily C.</p>
                  <p className="text-xs text-muted-foreground">Transformation</p>
                </div>
                <Badge variant="outline">8:00 PM</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Quick Script Access
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Common trigger words for fast access:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">COST</Button>
              <Button variant="outline" size="sm" className="justify-start">TIME</Button>
              <Button variant="outline" size="sm" className="justify-start">DOUBT</Button>
              <Button variant="outline" size="sm" className="justify-start">THINK</Button>
              <Button variant="outline" size="sm" className="justify-start">CRISIS</Button>
              <Button variant="outline" size="sm" className="justify-start">UPGRADE</Button>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-primary/5 to-purple/5 border-primary/20">
          <h3 className="text-lg font-bold mb-4">🎯 How to Use the Script Teleprompter</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">During Live Calls:</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Client raises an objection (e.g., "I can't afford it")</li>
                <li>2. Say: "I understand how you feel, however let me point out <strong>COST</strong>"</li>
                <li>3. Type "COST" in the Quick Trigger box (bottom-right)</li>
                <li>4. Script appears instantly with your response</li>
                <li>5. Read naturally, client never knows</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Practice Mode:</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Shift+S</kbd> to open script library</li>
                <li>2. Browse scripts by category or search</li>
                <li>3. Click any script to view full details</li>
                <li>4. Rehearse before your first call</li>
                <li>5. Build muscle memory for common objections</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
