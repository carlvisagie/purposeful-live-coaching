import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Users, Search, Plus, Mail, Phone, Calendar, TrendingUp } from "lucide-react";

export default function Clients() {
  const { data: clients, isLoading } = trpc.clients.list.useQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and track your coaching clients</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link to="/clients/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Clients</CardTitle>
            <CardDescription>Find clients by name or email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>All Clients ({filteredClients?.length || 0})</CardTitle>
            <CardDescription>Complete list of your coaching clients</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-500">Loading clients...</p>
              </div>
            ) : filteredClients && filteredClients.length > 0 ? (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                    <Link key={client.id} to={`/clients/${client.id}`}>
                    <div className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
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
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Started {new Date(client.startDate).toLocaleDateString()}
                            </div>
                          </div>
                          {client.goals && (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-1">{client.goals}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          client.status === "active" ? "bg-green-100 text-green-800" :
                          client.status === "inactive" ? "bg-gray-100 text-gray-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                        <TrendingUp className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {searchTerm ? "No clients found" : "No clients yet"}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search terms" 
                    : "Get started by adding your first client to begin tracking their emotional resilience journey."}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <Link to="/clients/new">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Client
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
