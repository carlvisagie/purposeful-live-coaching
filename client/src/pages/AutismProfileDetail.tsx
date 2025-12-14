import { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Activity,
  TrendingUp,
  FileText,
  Edit,
  BarChart3,
  Brain,
  MessageSquare,
  Heart,
  Zap
} from "lucide-react";

export default function AutismProfileDetail() {
  const [, params] = useRoute("/autism/profile/:id");
  const profileId = parseInt(params?.id || "0");
  
  const { data: profile, isLoading } = trpc.autism.getProfileById.useQuery({ id: profileId });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto py-12">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Profile not found</p>
          <Link to="/autism">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  const age = Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/autism">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.childName}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span>Age: {age} years</span>
                <span>•</span>
                <Badge variant="outline" className="capitalize">{profile.severity} Severity</Badge>
                <span>•</span>
                <span className="capitalize">{profile.communicationLevel.replace('_', ' ')}</span>
              </div>
            </div>
            
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* ATEC Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    ATEC Score
                  </CardTitle>
                  <CardDescription>Autism Treatment Evaluation Checklist</CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.atecScore ? (
                    <div>
                      <div className="text-4xl font-bold text-blue-600 mb-2">{profile.atecScore}</div>
                      <p className="text-sm text-gray-600">
                        Lower scores indicate better outcomes
                      </p>
                      <div className="mt-4">
                        <Progress value={100 - (profile.atecScore / 180 * 100)} className="h-2" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">No assessment completed</p>
                      <Button size="sm">Complete ATEC</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Communication Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    Communication
                  </CardTitle>
                  <CardDescription>Current communication level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-2 capitalize">
                    {profile.communicationLevel.replace('_', ' ')}
                  </div>
                  <p className="text-sm text-gray-600">
                    {profile.communicationLevel === 'non_verbal' && 'Uses alternative communication methods'}
                    {profile.communicationLevel === 'minimally_verbal' && 'Uses some words and phrases'}
                    {profile.communicationLevel === 'verbal' && 'Communicates with full sentences'}
                  </p>
                </CardContent>
              </Card>
              
              {/* Interventions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    Active Interventions
                  </CardTitle>
                  <CardDescription>Current treatment plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
                  <p className="text-sm text-gray-600 mb-4">No active interventions</p>
                  <Link to={`/autism/interventions/${profileId}`}>
                    <Button size="sm" className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Start Interventions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            {/* Profile Details */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diagnosis Date:</span>
                      <span className="font-medium">{new Date(profile.diagnosisDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severity Level:</span>
                      <span className="font-medium capitalize">{profile.severity}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Clinical Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Communication:</span>
                      <span className="font-medium capitalize">{profile.communicationLevel.replace('_', ' ')}</span>
                    </div>
                    {profile.atecScore && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ATEC Score:</span>
                        <span className="font-medium">{profile.atecScore}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Created:</span>
                      <span className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Strengths and Challenges */}
            {(profile.strengths || profile.challenges) && (
              <div className="grid gap-6 md:grid-cols-2">
                {profile.strengths && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-600" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{profile.strengths}</p>
                    </CardContent>
                  </Card>
                )}
                
                {profile.challenges && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-orange-600" />
                        Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{profile.challenges}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Assessments Tab */}
          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
                <CardDescription>Track progress through standardized assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No assessments completed yet</p>
                  <Button>Complete ATEC Assessment</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Monitor development across key areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Start tracking progress by completing interventions</p>
                  <Link to={`/autism/interventions/${profileId}`}>
                    <Button>View Interventions</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
                <CardDescription>Document observations and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No notes yet</p>
                  <Button>Add First Note</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
