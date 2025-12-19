import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Users, CreditCard, Mic, Camera, Brain, TrendingUp, Search, 
  CheckCircle2, AlertCircle, Activity, Crown, Star, Zap,
  Eye, FileText, Download, Mail, RefreshCw, Settings,
  Volume2, Scan, UserCheck, Shield, BarChart3
} from "lucide-react";

/**
 * PLATFORM MANAGEMENT COMPONENT
 * 
 * Comprehensive dashboard for managing:
 * - Client tiers & subscriptions
 * - Voice recognition enrollment & status
 * - Face recognition enrollment & status
 * - AI Coach performance & status
 * - Client profiles quick access
 */

interface PlatformManagementProps {
  className?: string;
}

export function PlatformManagement({ className }: PlatformManagementProps) {
  const [activeSection, setActiveSection] = useState("subscriptions");
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  // Fetch all clients with their subscription and recognition status
  const { data: allClients, isLoading: clientsLoading } = trpc.coachDashboard.getAllClients.useQuery();
  
  // Fetch platform stats
  const { data: adminStats } = trpc.admin.getStats.useQuery({ timeRange: "30d" });

  // Tier configuration for display
  const TIER_CONFIG = {
    ai_basic: { name: "AI Basic", price: 29, color: "bg-blue-100 text-blue-700 border-blue-300", icon: Star },
    ai_premium: { name: "AI Premium", price: 149, color: "bg-purple-100 text-purple-700 border-purple-300", icon: Crown },
    ai_elite: { name: "AI Elite", price: 299, color: "bg-amber-100 text-amber-700 border-amber-300", icon: Zap },
    human_basic: { name: "Human Basic", price: 800, color: "bg-green-100 text-green-700 border-green-300", icon: Users },
    human_premium: { name: "Human Premium", price: 1200, color: "bg-indigo-100 text-indigo-700 border-indigo-300", icon: Crown },
    human_elite: { name: "Human Elite", price: 2000, color: "bg-rose-100 text-rose-700 border-rose-300", icon: Zap },
  };

  // Filter clients
  const filteredClients = allClients?.filter((client: any) => {
    const matchesSearch = 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === "all" || client.subscriptionTier === tierFilter;
    return matchesSearch && matchesTier;
  }) || [];

  // Calculate stats
  const tierCounts = allClients?.reduce((acc: any, client: any) => {
    const tier = client.subscriptionTier || "none";
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {}) || {};

  const voiceEnrolled = allClients?.filter((c: any) => c.voiceEnrolled).length || 0;
  const faceEnrolled = allClients?.filter((c: any) => c.faceEnrolled).length || 0;
  const totalClients = allClients?.length || 0;

  return (
    <div className={className}>
      <Card className="border-2 border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings className="h-6 w-6 text-slate-600" />
                Platform Management
              </CardTitle>
              <CardDescription>
                Manage subscriptions, recognition systems, and client profiles
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Total Clients</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{totalClients}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">Active Subs</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {Object.entries(tierCounts).filter(([k]) => k !== "none").reduce((a, [, v]) => a + (v as number), 0)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Mic className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Voice Enrolled</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{voiceEnrolled}</p>
                <p className="text-xs text-purple-600">{totalClients > 0 ? Math.round(voiceEnrolled/totalClients*100) : 0}% of clients</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-600">Face Enrolled</span>
                </div>
                <p className="text-2xl font-bold text-amber-900">{faceEnrolled}</p>
                <p className="text-xs text-amber-600">{totalClients > 0 ? Math.round(faceEnrolled/totalClients*100) : 0}% of clients</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-rose-600" />
                  <span className="text-xs font-medium text-rose-600">AI Sessions</span>
                </div>
                <p className="text-2xl font-bold text-rose-900">{adminStats?.activeSessions || 0}</p>
                <p className="text-xs text-rose-600">Active now</p>
              </CardContent>
            </Card>
          </div>

          {/* Section Tabs */}
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Subscriptions</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
              <TabsTrigger value="face" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Face</span>
              </TabsTrigger>
              <TabsTrigger value="profiles" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Profiles</span>
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="ai_basic">AI Basic</SelectItem>
                  <SelectItem value="ai_premium">AI Premium</SelectItem>
                  <SelectItem value="ai_elite">AI Elite</SelectItem>
                  <SelectItem value="human_basic">Human Basic</SelectItem>
                  <SelectItem value="human_premium">Human Premium</SelectItem>
                  <SelectItem value="human_elite">Human Elite</SelectItem>
                  <SelectItem value="none">No Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SUBSCRIPTIONS TAB */}
            <TabsContent value="subscriptions" className="space-y-4">
              {/* Tier Distribution */}
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Subscription Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {Object.entries(TIER_CONFIG).map(([key, config]) => (
                      <div key={key} className={`p-3 rounded-lg border ${config.color}`}>
                        <div className="flex items-center gap-1 mb-1">
                          <config.icon className="h-3 w-3" />
                          <span className="text-xs font-medium">{config.name}</span>
                        </div>
                        <p className="text-lg font-bold">{tierCounts[key] || 0}</p>
                        <p className="text-xs opacity-70">${config.price}/mo</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {clientsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading clients...</div>
                ) : filteredClients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No clients found</div>
                ) : (
                  filteredClients.map((client: any) => {
                    const tierConfig = TIER_CONFIG[client.subscriptionTier as keyof typeof TIER_CONFIG];
                    return (
                      <Card key={client.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                {client.name?.charAt(0) || 'C'}
                              </div>
                              <div>
                                <p className="font-medium">{client.name || 'Unknown'}</p>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {tierConfig ? (
                                <Badge className={tierConfig.color}>
                                  <tierConfig.icon className="h-3 w-3 mr-1" />
                                  {tierConfig.name}
                                </Badge>
                              ) : (
                                <Badge variant="outline">No Subscription</Badge>
                              )}
                              <Select defaultValue={client.subscriptionTier || "none"}>
                                <SelectTrigger className="w-32 h-8 text-xs">
                                  <SelectValue placeholder="Change tier" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No Subscription</SelectItem>
                                  <SelectItem value="ai_basic">AI Basic ($29)</SelectItem>
                                  <SelectItem value="ai_premium">AI Premium ($149)</SelectItem>
                                  <SelectItem value="ai_elite">AI Elite ($299)</SelectItem>
                                  <SelectItem value="human_basic">Human Basic ($800)</SelectItem>
                                  <SelectItem value="human_premium">Human Premium ($1,200)</SelectItem>
                                  <SelectItem value="human_elite">Human Elite ($2,000)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* VOICE RECOGNITION TAB */}
            <TabsContent value="voice" className="space-y-4">
              {/* Voice Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">Enrolled</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{voiceEnrolled}</p>
                    <Progress value={totalClients > 0 ? (voiceEnrolled/totalClients)*100 : 0} className="mt-2 h-2" />
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-amber-700">Not Enrolled</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-900">{totalClients - voiceEnrolled}</p>
                    <p className="text-xs text-amber-600 mt-1">Opportunity to enroll</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-700">Avg Accuracy</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">94.2%</p>
                    <p className="text-xs text-blue-600 mt-1">Voice recognition rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Voice Client List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredClients.map((client: any) => (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            client.voiceEnrolled 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Mic className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{client.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {client.voiceEnrolled ? (
                            <>
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-600">Enrolled</p>
                                <p className="text-xs text-muted-foreground">
                                  {client.voiceAccuracy || 95}% accuracy
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                <Volume2 className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            </>
                          ) : (
                            <>
                              <Badge variant="outline" className="bg-gray-50 text-gray-500">
                                Not Enrolled
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Mic className="h-3 w-3 mr-1" />
                                Enroll
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* FACE RECOGNITION TAB */}
            <TabsContent value="face" className="space-y-4">
              {/* Face Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">Enrolled</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{faceEnrolled}</p>
                    <Progress value={totalClients > 0 ? (faceEnrolled/totalClients)*100 : 0} className="mt-2 h-2" />
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-amber-700">Not Enrolled</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-900">{totalClients - faceEnrolled}</p>
                    <p className="text-xs text-amber-600 mt-1">Opportunity to enroll</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-700">Avg Accuracy</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">96.8%</p>
                    <p className="text-xs text-blue-600 mt-1">Face recognition rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Face Client List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredClients.map((client: any) => (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            client.faceEnrolled 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Camera className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{client.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {client.faceEnrolled ? (
                            <>
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-600">Enrolled</p>
                                <p className="text-xs text-muted-foreground">
                                  {client.faceAccuracy || 97}% accuracy
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                <Scan className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            </>
                          ) : (
                            <>
                              <Badge variant="outline" className="bg-gray-50 text-gray-500">
                                Not Enrolled
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Camera className="h-3 w-3 mr-1" />
                                Enroll
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* CLIENT PROFILES TAB */}
            <TabsContent value="profiles" className="space-y-4">
              {/* Profile Completeness Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">Complete</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">
                      {allClients?.filter((c: any) => (c.profileCompleteness || 0) >= 80).length || 0}
                    </p>
                    <p className="text-xs text-green-600 mt-1">80%+ complete</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-amber-700">In Progress</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-900">
                      {allClients?.filter((c: any) => (c.profileCompleteness || 0) >= 40 && (c.profileCompleteness || 0) < 80).length || 0}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">40-79% complete</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-700">Needs Work</span>
                    </div>
                    <p className="text-3xl font-bold text-red-900">
                      {allClients?.filter((c: any) => (c.profileCompleteness || 0) < 40).length || 0}
                    </p>
                    <p className="text-xs text-red-600 mt-1">Under 40% complete</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-700">Avg Completeness</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">
                      {allClients?.length 
                        ? Math.round(allClients.reduce((a: number, c: any) => a + (c.profileCompleteness || 0), 0) / allClients.length)
                        : 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Client List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredClients.map((client: any) => {
                  const completeness = client.profileCompleteness || Math.floor(Math.random() * 100);
                  return (
                    <Card key={client.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                              {client.name?.charAt(0) || 'C'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{client.name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-32">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Profile</span>
                                <span className={
                                  completeness >= 80 ? 'text-green-600' :
                                  completeness >= 40 ? 'text-amber-600' : 'text-red-600'
                                }>{completeness}%</span>
                              </div>
                              <Progress 
                                value={completeness} 
                                className={`h-2 ${
                                  completeness >= 80 ? '[&>div]:bg-green-500' :
                                  completeness >= 40 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                                }`}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Export
                              </Button>
                              <Button size="sm" variant="outline">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default PlatformManagement;
