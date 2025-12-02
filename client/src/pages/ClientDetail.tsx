import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Calendar, Target, FileText, Brain, TrendingUp, Plus } from "lucide-react";

export default function ClientDetail() {
  const [, params] = useRoute("/clients/:id");
  const [, setLocation] = useLocation();
  const clientId = params?.id ? parseInt(params.id) : 0;

  const { data: client, isLoading } = trpc.clients.get.useQuery({ id: clientId });
  const { data: stats } = trpc.clients.getStats.useQuery({ id: clientId });
  const { data: journalEntries } = trpc.journal.list.useQuery({ clientId, limit: 10 });
  const { data: emotionLogs } = trpc.emotionLogs.list.useQuery({ clientId, limit: 20 });
  const { data: copingStrategies } = trpc.copingStrategies.list.useQuery({ clientId });
  const { data: aiInsights } = trpc.aiInsights.list.useQuery({ clientId });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Client Not Found</CardTitle>
            <CardDescription>The requested client could not be found</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/clients")}>Back to Clients</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/clients")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    {client.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {client.email}
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {client.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Badge variant={client.status === "active" ? "default" : "secondary"} className="text-sm px-4 py-2">
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Journal Entries</CardTitle>
              <FileText className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.journalEntries || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Total entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Emotion Logs</CardTitle>
              <Brain className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.emotionLogs || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Tracked emotions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Resilience</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.averageResilienceScore ? Math.round(stats.averageResilienceScore) : "-"}
              </div>
              <p className="text-xs text-gray-500 mt-1">Out of 100</p>
            </CardContent>
          </Card>
        </div>

        {/* Client Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Start Date</span>
                </div>
                <p className="text-gray-900">{new Date(client.startDate).toLocaleDateString()}</p>
              </div>
              {client.dateOfBirth && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Date of Birth</span>
                  </div>
                  <p className="text-gray-900">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            {client.goals && (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">Goals</span>
                </div>
                <p className="text-gray-900">{client.goals}</p>
              </div>
            )}
            {client.notes && (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Notes</span>
                </div>
                <p className="text-gray-900">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="journal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="emotions">Emotions</TabsTrigger>
            <TabsTrigger value="coping">Coping</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Journal Tab */}
          <TabsContent value="journal">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Journal Entries</CardTitle>
                    <CardDescription>Track emotional resilience through journaling</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {journalEntries && journalEntries.length > 0 ? (
                  <div className="space-y-4">
                    {journalEntries.map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm text-gray-500">{new Date(entry.entryDate).toLocaleDateString()}</p>
                            {entry.mood && (
                              <Badge variant="outline" className="mt-1">{entry.mood}</Badge>
                            )}
                          </div>
                          {entry.resilienceScore && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Resilience</p>
                              <p className="text-lg font-bold text-blue-600">{entry.resilienceScore}</p>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-900 line-clamp-3">{entry.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No journal entries yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Start tracking emotional resilience with journal entries.</p>
                    <div className="mt-6">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Entry
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emotions Tab */}
          <TabsContent value="emotions">
            <Card>
              <CardHeader>
                <CardTitle>Emotion Tracking</CardTitle>
                <CardDescription>Detailed emotional state monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                {emotionLogs && emotionLogs.length > 0 ? (
                  <div className="space-y-3">
                    {emotionLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{log.emotionType}</p>
                          <p className="text-sm text-gray-500">{new Date(log.logDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Intensity</p>
                          <p className="text-2xl font-bold text-purple-600">{log.intensity}/10</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No emotion logs yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Begin tracking emotional patterns and triggers.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coping Strategies Tab */}
          <TabsContent value="coping">
            <Card>
              <CardHeader>
                <CardTitle>Coping Strategies</CardTitle>
                <CardDescription>Effectiveness tracking for coping mechanisms</CardDescription>
              </CardHeader>
              <CardContent>
                {copingStrategies && copingStrategies.length > 0 ? (
                  <div className="space-y-3">
                    {copingStrategies.map((strategy) => (
                      <div key={strategy.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{strategy.strategyName}</p>
                          {strategy.description && (
                            <p className="text-sm text-gray-500 mt-1">{strategy.description}</p>
                          )}
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>Used {strategy.timesUsed} times</span>
                            {strategy.category && <span className="capitalize">{strategy.category}</span>}
                          </div>
                        </div>
                        {strategy.averageEffectiveness && (
                          <div className="text-right ml-4">
                            <p className="text-xs text-gray-500">Effectiveness</p>
                            <p className="text-2xl font-bold text-green-600">{strategy.averageEffectiveness}/10</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No coping strategies yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Add strategies to track their effectiveness.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Pattern detection and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {aiInsights && aiInsights.length > 0 ? (
                  <div className="space-y-4">
                    {aiInsights.map((insight) => (
                      <div key={insight.id} className={`border-l-4 p-4 rounded-lg ${
                        insight.severity === "critical" ? "border-l-red-500 bg-red-50" :
                        insight.severity === "high" ? "border-l-orange-500 bg-orange-50" :
                        insight.severity === "medium" ? "border-l-yellow-500 bg-yellow-50" :
                        "border-l-blue-500 bg-blue-50"
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{insight.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(insight.insightDate).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={insight.severity === "critical" || insight.severity === "high" ? "destructive" : "default"}>
                            {insight.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{insight.description}</p>
                        {insight.actionable && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <p className="text-xs font-medium text-gray-600">Suggested Action:</p>
                            <p className="text-sm text-gray-900">{insight.actionable}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No AI insights yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Insights will appear as patterns are detected in the data.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
