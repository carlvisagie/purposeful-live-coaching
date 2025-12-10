import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  UserPlus,
  CreditCard,
  BarChart3,
  Download,
  Settings,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

/**
 * Admin Dashboard - Platform Management
 * 
 * Features:
 * - Real-time platform statistics
 * - User management overview
 * - Revenue tracking
 * - Crisis alert monitoring
 * - Analytics and insights
 * 
 * Design: Modern Tailwind + Shadcn/ui (matches platform aesthetic)
 */
export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Real tRPC queries - connected to admin router
  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery({ timeRange });
  const { data: recentUsers, isLoading: usersLoading } = trpc.admin.getRecentUsers.useQuery({ limit: 5 });
  const { data: crisisAlerts, isLoading: alertsLoading } = trpc.admin.getCrisisAlerts.useQuery({ status: "pending", limit: 5 });

  const isLoading = statsLoading || usersLoading || alertsLoading;

  // Default values while loading
  const statsData = stats || {
    totalUsers: 0,
    newUsersThisMonth: 0,
    activeSessions: 0,
    pendingCrisisAlerts: 0,
    revenueMTD: 0,
    revenueGrowth: 0,
    usersByTier: { basic: 0, premium: 0, elite: 0 },
  };
  const recentUsersData = recentUsers || [];
  const crisisAlertsData = crisisAlerts || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Platform management and monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Crisis Alerts Banner */}
        {statsData.pendingCrisisAlerts > 0 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <div>
                    <CardTitle className="text-red-900 dark:text-red-100">
                      {statsData.pendingCrisisAlerts} Pending Crisis Alert{statsData.pendingCrisisAlerts !== 1 ? 's' : ''}
                    </CardTitle>
                    <CardDescription className="text-red-700 dark:text-red-300">
                      Immediate attention required
                    </CardDescription>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  View Alerts
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{statsData.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium flex items-center gap-1">
                <UserPlus className="h-3 w-3" />
                +{statsData.newUsersThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Revenue (MTD)</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">${statsData.revenueMTD.toLocaleString()}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{statsData.revenueGrowth}% vs last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Sessions</CardTitle>
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{statsData.activeSessions}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">
                Live coaching sessions
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Crisis Alerts</CardTitle>
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{statsData.pendingCrisisAlerts}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium">
                Pending review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="crisis">
              Crisis Alerts
              {statsData.pendingCrisisAlerts > 0 && (
                <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs">
                  {statsData.pendingCrisisAlerts}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    User Distribution by Tier
                  </CardTitle>
                  <CardDescription>Active subscriptions breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">Basic ($29/mo)</span>
                    </div>
                    <span className="text-sm font-bold">{statsData.usersByTier.basic}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-medium">Premium ($149/mo)</span>
                    </div>
                    <span className="text-sm font-bold">{statsData.usersByTier.premium}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-medium">Elite ($299/mo)</span>
                    </div>
                    <span className="text-sm font-bold">{statsData.usersByTier.elite}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest platform events</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentUsersData.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Activity items will go here */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">User management coming soon</p>
                  <p className="text-xs mt-2">Connect to tRPC admin endpoints</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crisis Alerts Tab */}
          <TabsContent value="crisis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Crisis Alerts
                </CardTitle>
                <CardDescription>Monitor and respond to crisis situations</CardDescription>
              </CardHeader>
              <CardContent>
                {crisisAlertsData.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500 opacity-20" />
                    <p className="text-sm font-medium text-green-600">No pending crisis alerts</p>
                    <p className="text-xs mt-2 text-slate-500">All users are safe</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Crisis alert items will go here */}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Analytics & Insights
                </CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Analytics dashboard coming soon</p>
                  <p className="text-xs mt-2">Charts and insights will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
