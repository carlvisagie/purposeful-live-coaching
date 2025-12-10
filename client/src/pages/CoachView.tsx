/**
 * Coach View - Direct Access Coaching Dashboard
 * No authentication required - for coach/owner use
 * 
 * REAL DATA VERSION - Connected to database via tRPC
 */

import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Search,
  Phone,
  MessageSquare,
  Calendar,
  AlertCircle,
  TrendingUp,
  Heart,
  Clock,
  Loader2,
  User,
  Briefcase,
  MapPin,
  Target,
  Brain,
  Activity,
  DollarSign,
} from "lucide-react";
import { trpc } from "../lib/trpc";

export default function CoachView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [quickNote, setQuickNote] = useState("");

  // Fetch all clients from database
  const { data: clients, isLoading: clientsLoading } = trpc.coachDashboard.getAllClients.useQuery();
  
  // Fetch active sessions
  const { data: activeSessions } = trpc.coachDashboard.getActiveSessions.useQuery();
  
  // Fetch dashboard stats
  const { data: stats } = trpc.coachDashboard.getStats.useQuery();

  // Fetch conversation history for selected client
  const { data: conversationHistory } = trpc.coachDashboard.getConversationHistory.useQuery(
    { clientId: selectedClient?.id },
    { enabled: !!selectedClient }
  );

  const filteredClients = clients?.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSelectClient = (client: any) => {
    setSelectedClient(client);
  };

  // Mutation for saving notes
  const saveNoteMutation = trpc.sessions.saveNote.useMutation({
    onSuccess: () => {
      alert(`Note saved successfully!`);
      setQuickNote("");
    },
    onError: (error) => {
      alert(`Failed to save note: ${error.message}`);
    },
  });

  const handleAddNote = () => {
    if (!quickNote.trim()) return;
    if (!selectedClient?.lastSessionId) {
      alert("No active session found for this client");
      return;
    }
    
    saveNoteMutation.mutate({
      sessionId: selectedClient.lastSessionId,
      note: quickNote,
    });
  };

  if (clientsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading coach dashboard...</p>
        </div>
      </div>
    );
  }

  if (selectedClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              ← Back to Client List
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-600">
                  COACHING SESSION READY
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Profile: {selectedClient.profileCompleteness || 0}% complete
              </div>
            </div>
          </div>

          {/* Client Header */}
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedClient.name}
                </h1>
                {selectedClient.email && (
                  <p className="text-gray-600">{selectedClient.email}</p>
                )}
                {selectedClient.phone && (
                  <p className="text-gray-600">{selectedClient.phone}</p>
                )}
                {selectedClient.age && (
                  <p className="text-sm text-gray-500 mt-1">Age: {selectedClient.age}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedClient.status}
                </p>
              </div>
            </div>
          </Card>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Professional Info */}
            {(selectedClient.jobTitle || selectedClient.company || selectedClient.industry) && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold">💼 PROFESSIONAL</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {selectedClient.jobTitle && (
                    <p><span className="font-semibold">Title:</span> {selectedClient.jobTitle}</p>
                  )}
                  {selectedClient.company && (
                    <p><span className="font-semibold">Company:</span> {selectedClient.company}</p>
                  )}
                  {selectedClient.industry && (
                    <p><span className="font-semibold">Industry:</span> {selectedClient.industry}</p>
                  )}
                  {selectedClient.careerGoals && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="font-semibold mb-1">Career Goals:</p>
                      <p className="text-gray-700">{selectedClient.careerGoals}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Personal Info */}
            {(selectedClient.locationCity || selectedClient.relationshipStatus) && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold">👤 PERSONAL</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {selectedClient.locationCity && (
                    <p><span className="font-semibold">Location:</span> {selectedClient.locationCity}{selectedClient.locationState && `, ${selectedClient.locationState}`}</p>
                  )}
                  {selectedClient.relationshipStatus && (
                    <p><span className="font-semibold">Relationship:</span> {selectedClient.relationshipStatus}</p>
                  )}
                  {selectedClient.hasChildren === 'true' && (
                    <p><span className="font-semibold">Has Children:</span> Yes</p>
                  )}
                </div>
              </Card>
            )}

            {/* Goals & Motivation */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold">🎯 GOALS</h3>
              </div>
              <div className="space-y-3">
                {selectedClient.primaryGoal && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-semibold text-purple-900 mb-1">Primary Goal:</p>
                    <p className="text-gray-700">{selectedClient.primaryGoal}</p>
                  </div>
                )}
                {selectedClient.goalTimeline && (
                  <p className="text-sm"><span className="font-semibold">Timeline:</span> {selectedClient.goalTimeline}</p>
                )}
                {selectedClient.motivation && (
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="font-semibold text-amber-900 mb-1">Motivation:</p>
                    <p className="text-gray-700">{selectedClient.motivation}</p>
                  </div>
                )}
                {selectedClient.goals && (
                  <p className="text-sm text-gray-600">{selectedClient.goals}</p>
                )}
              </div>
            </Card>

            {/* Identity Architecture */}
            {(selectedClient.currentIdentity || selectedClient.targetIdentity) && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold">🧠 IDENTITY</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {selectedClient.currentIdentity && (
                    <div>
                      <p className="font-semibold mb-1">Current Identity:</p>
                      <p className="text-gray-700">{selectedClient.currentIdentity}</p>
                    </div>
                  )}
                  {selectedClient.targetIdentity && (
                    <div className="mt-2">
                      <p className="font-semibold mb-1">Target Identity:</p>
                      <p className="text-gray-700">{selectedClient.targetIdentity}</p>
                    </div>
                  )}
                  {selectedClient.coreValues && (
                    <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
                      <p className="font-semibold mb-1">Core Values:</p>
                      <p className="text-gray-700">{selectedClient.coreValues}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Health & Wellness */}
            {(selectedClient.sleepHours || selectedClient.exerciseFrequency) && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold">💪 HEALTH</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {selectedClient.sleepHours && (
                    <p><span className="font-semibold">Sleep:</span> {selectedClient.sleepHours} hours</p>
                  )}
                  {selectedClient.exerciseFrequency && (
                    <p><span className="font-semibold">Exercise:</span> {selectedClient.exerciseFrequency}</p>
                  )}
                  {selectedClient.dietPattern && (
                    <p><span className="font-semibold">Diet:</span> {selectedClient.dietPattern}</p>
                  )}
                  {selectedClient.mentalHealthNotes && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                      <p className="font-semibold mb-1">Mental Health:</p>
                      <p className="text-gray-700">{selectedClient.mentalHealthNotes}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Financial */}
            {(selectedClient.savingsLevel || selectedClient.hasDebt) && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold">💰 FINANCIAL</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {selectedClient.savingsLevel && (
                    <p><span className="font-semibold">Savings:</span> {selectedClient.savingsLevel}</p>
                  )}
                  {selectedClient.hasDebt && (
                    <p><span className="font-semibold">Debt:</span> {selectedClient.hasDebt === 'true' ? 'Yes' : 'No'}</p>
                  )}
                  {selectedClient.monthlyExpensesEstimate && (
                    <p><span className="font-semibold">Monthly Expenses:</span> ${selectedClient.monthlyExpensesEstimate}</p>
                  )}
                </div>
              </Card>
            )}

            {/* Crisis Indicators */}
            {selectedClient.suicideRiskLevel && (
              <Card className="p-6 border-red-200 bg-red-50">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-red-900">⚠️ CRISIS ALERT</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-red-900">
                    Suicide Risk: {selectedClient.suicideRiskLevel}
                  </p>
                  {selectedClient.crisisFlags && (
                    <p className="text-red-800">{selectedClient.crisisFlags}</p>
                  )}
                  {selectedClient.lastCrisisCheck && (
                    <p className="text-red-700 text-xs">
                      Last check: {new Date(selectedClient.lastCrisisCheck).toLocaleString()}
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Conversation History */}
          {conversationHistory && conversationHistory.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold">💬 CONVERSATION HISTORY</h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {conversationHistory.map((msg: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-600">
                        {msg.role === 'user' ? 'Client' : 'AI Coach'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Notes */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold">📝 QUICK NOTES</h3>
            </div>
            <div className="space-y-3">
              <Textarea
                placeholder="Type notes during your session..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                rows={4}
                className="w-full"
              />
              <Button onClick={handleAddNote} className="w-full">
                💾 Save Note
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            🎯 Coaching Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time client profiles with auto-extracted data
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.totalClients}</p>
              <p className="text-sm text-gray-600 mt-1">Total Clients</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.activeClients}</p>
              <p className="text-sm text-gray-600 mt-1">Active Clients</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.newThisWeek}</p>
              <p className="text-sm text-gray-600 mt-1">New This Week</p>
            </Card>
          </div>
        )}

        {/* Active Sessions */}
        {activeSessions && activeSessions.length > 0 && (
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <h3 className="text-lg font-bold text-green-900">
                🟢 ACTIVE NOW ({activeSessions.length})
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {activeSessions.map((session: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => session.client && handleSelectClient(session.client)}
                >
                  <p className="font-semibold">{session.client?.name || session.userIdentifier}</p>
                  <p className="text-xs text-gray-500">
                    {session.messageCount} messages • Last: {new Date(session.lastMessage).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Search Box */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search clients by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>

            {/* Client List */}
            {filteredClients.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">
                  {searchQuery ? `${filteredClients.length} Results` : `All Clients (${filteredClients.length})`}
                </h3>
                <div className="grid md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                  {filteredClients.map((client) => (
                    <Card
                      key={client.id}
                      className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-300"
                      onClick={() => handleSelectClient(client)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{client.name}</h4>
                          {client.email && (
                            <p className="text-sm text-gray-600">{client.email}</p>
                          )}
                          {client.primaryGoal && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {client.primaryGoal}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-xs font-semibold text-purple-600">
                            {client.profileCompleteness || 0}%
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {client.status}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchQuery
                    ? "No clients found"
                    : "No clients yet"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Clients are added automatically when they chat with your AI or call your hotline
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">24/7 Hotline</h3>
            <p className="text-sm text-gray-600 mb-3">
              +1 (564) 529-6454
            </p>
            <p className="text-xs text-gray-500">
              Clients can call anytime
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">AI Chat</h3>
            <p className="text-sm text-gray-600 mb-3">
              24/7 text support
            </p>
            <p className="text-xs text-gray-500">
              Auto-profiles clients
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Your Sessions</h3>
            <p className="text-sm text-gray-600 mb-3">
              Video coaching
            </p>
            <p className="text-xs text-gray-500">
              Perfect continuity
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
