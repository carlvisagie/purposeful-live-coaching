import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Search, AlertTriangle, MessageSquare, Calendar, TrendingUp } from "lucide-react";

export default function AdminClientHistory() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get client history when selected
  const { data: clientHistory, isLoading } = trpc.coachClientHistory.getClientHistory.useQuery(
    { clientUserId: selectedClientId! },
    { enabled: !!selectedClientId }
  );

  // Get pre-call brief
  const { data: preCallBrief } = trpc.coachClientHistory.getPreCallBrief.useQuery(
    { clientUserId: selectedClientId! },
    { enabled: !!selectedClientId }
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Client History</h1>
        <p className="text-muted-foreground">
          Review client AI conversations and session notes before calls
        </p>
      </div>

      {/* Client Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Client</CardTitle>
          <CardDescription>Enter client ID to view their complete history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Enter client user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => {
                const id = parseInt(searchQuery);
                if (!isNaN(id)) setSelectedClientId(id);
              }}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading client history...
          </CardContent>
        </Card>
      )}

      {/* Client History */}
      {clientHistory && (
        <div className="space-y-6">
          {/* Client Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{clientHistory.client.name || "Anonymous Client"}</CardTitle>
                  <CardDescription>{clientHistory.client.email}</CardDescription>
                </div>
                <Badge variant={clientHistory.subscription?.status === "active" ? "default" : "secondary"}>
                  {clientHistory.subscription?.tier || "No Subscription"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">AI Conversations</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {clientHistory.summary.totalAIConversations}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">AI Messages</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {clientHistory.summary.totalAIMessages}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Human Sessions</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {clientHistory.summary.totalHumanSessions}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Crisis Flags</div>
                  <div className="text-2xl font-bold flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    {clientHistory.summary.crisisCount}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pre-Call Brief */}
          {preCallBrief && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  Pre-Call Brief
                </CardTitle>
                <CardDescription>Key information before your next call</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {preCallBrief.recentCrisisCount > 0 && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                    <div className="font-semibold text-red-900">⚠️ Recent Crisis Flags: {preCallBrief.recentCrisisCount}</div>
                    <div className="text-sm text-red-700">Client has expressed concerning thoughts recently. Approach with care.</div>
                  </div>
                )}

                <div>
                  <div className="font-semibold mb-2">Recent Topics:</div>
                  <div className="flex flex-wrap gap-2">
                    {preCallBrief.keyTopics.map((topic, i) => (
                      <Badge key={i} variant="outline">{topic}</Badge>
                    ))}
                  </div>
                </div>

                {preCallBrief.lastSessionNotes && (
                  <div>
                    <div className="font-semibold mb-2">Last Session Notes:</div>
                    <div className="p-3 bg-white border rounded-md text-sm whitespace-pre-wrap">
                      {preCallBrief.lastSessionNotes}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {preCallBrief.lastSessionDate && new Date(preCallBrief.lastSessionDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Detailed History Tabs */}
          <Tabs defaultValue="ai-conversations">
            <TabsList>
              <TabsTrigger value="ai-conversations">
                AI Conversations ({clientHistory.aiConversations.length})
              </TabsTrigger>
              <TabsTrigger value="human-sessions">
                Human Sessions ({clientHistory.humanSessions.length})
              </TabsTrigger>
            </TabsList>

            {/* AI Conversations Tab */}
            <TabsContent value="ai-conversations" className="space-y-4">
              {clientHistory.aiConversations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No AI conversations yet
                  </CardContent>
                </Card>
              ) : (
                clientHistory.aiConversations.map((conversation) => (
                  <Card key={conversation.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{conversation.title}</CardTitle>
                          <CardDescription>
                            {new Date(conversation.createdAt).toLocaleString()} • {conversation.messages.length} messages
                          </CardDescription>
                        </div>
                        {conversation.messages.some(m => m.crisisFlag) && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Crisis Flag
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {conversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.role === "user"
                                ? "bg-blue-50 border border-blue-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                {message.role === "user" ? "Client" : "AI Coach"}
                              </span>
                              {message.crisisFlag && (
                                <Badge variant="destructive" className="text-xs">Crisis</Badge>
                              )}
                            </div>
                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(message.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Human Sessions Tab */}
            <TabsContent value="human-sessions" className="space-y-4">
              {clientHistory.humanSessions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No human sessions yet
                  </CardContent>
                </Card>
              ) : (
                clientHistory.humanSessions.map((session) => (
                  <Card key={session.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {new Date(session.sessionDate).toLocaleDateString()}
                          </CardTitle>
                          <CardDescription>
                            {session.duration} minutes • {session.status}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">Human Session</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {session.coachNotes ? (
                        <div className="p-3 bg-gray-50 border rounded-md whitespace-pre-wrap text-sm">
                          {session.coachNotes}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">
                          No notes recorded for this session
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* No Client Selected */}
      {!selectedClientId && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Search for a client to view their history
          </CardContent>
        </Card>
      )}
    </div>
  );
}
