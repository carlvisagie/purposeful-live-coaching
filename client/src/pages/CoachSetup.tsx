import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function CoachSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const utils = trpc.useUtils();
  
  const [formData, setFormData] = useState({
    specialization: "",
    bio: "",
    certifications: "",
    yearsExperience: "",
  });

  const createProfile = trpc.coaches.createProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Coach profile created successfully",
      });
      utils.coaches.getProfile.invalidate();
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create coach profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createProfile.mutate({
      specialization: formData.specialization || undefined,
      bio: formData.bio || undefined,
      certifications: formData.certifications || undefined,
      yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Purposeful Live Coaching</h1>
          <p className="text-gray-600">Let's set up your coaching profile to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Coach Profile</CardTitle>
              <CardDescription>Tell us about your coaching practice and expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Specialization */}
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  type="text"
                  placeholder="e.g., Emotional Resilience, Life Coaching, Career Coaching"
                  value={formData.specialization}
                  onChange={(e) => handleChange("specialization", e.target.value)}
                />
                <p className="text-xs text-gray-500">What areas do you specialize in?</p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Share your background, approach, and what makes your coaching unique..."
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-gray-500">
                  This will be visible to your clients and helps build trust
                </p>
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications & Credentials</Label>
                <Textarea
                  id="certifications"
                  placeholder="List your relevant certifications, degrees, and professional credentials..."
                  value={formData.certifications}
                  onChange={(e) => handleChange("certifications", e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  Include any relevant professional qualifications
                </p>
              </div>

              {/* Years of Experience */}
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="5"
                  value={formData.yearsExperience}
                  onChange={(e) => handleChange("yearsExperience", e.target.value)}
                />
                <p className="text-xs text-gray-500">How many years have you been coaching?</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={createProfile.isPending}
                  className="w-full sm:w-auto"
                >
                  {createProfile.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Profile & Get Started
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
