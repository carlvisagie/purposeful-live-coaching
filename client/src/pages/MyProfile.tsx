/**
 * My Profile page - View and edit profile data extracted from AI conversations
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Check } from "lucide-react";

export default function MyProfile() {
  const { toast } = useToast();
  const { data: profile, isLoading, refetch } = trpc.profileExtraction.getProfile.useQuery();
  const updateProfile = trpc.profileExtraction.updateProfile.useMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    primaryGoal: "",
    secondaryGoal: "",
    mainChallenges: [] as string[],
    preferredFrequency: "" as "daily" | "weekly" | "as_needed" | "",
    timezone: "",
    availability: "",
    communicationStyle: "" as "concise" | "detailed" | "balanced" | "",
  });

  // Initialize form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        primaryGoal: profile.primaryGoal || "",
        secondaryGoal: profile.secondaryGoal || "",
        mainChallenges: profile.mainChallenges || [],
        preferredFrequency: profile.preferredFrequency || "",
        timezone: profile.timezone || "",
        availability: profile.availability || "",
        communicationStyle: profile.communicationStyle || "balanced",
      });
    }
  });

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        primaryGoal: formData.primaryGoal || undefined,
        secondaryGoal: formData.secondaryGoal || undefined,
        mainChallenges: formData.mainChallenges.length > 0 ? formData.mainChallenges : undefined,
        preferredFrequency: formData.preferredFrequency || undefined,
        timezone: formData.timezone || undefined,
        availability: formData.availability || undefined,
        communicationStyle: formData.communicationStyle || undefined,
      });

      toast({
        title: "Profile updated",
        description: "Your preferences have been saved.",
      });

      setIsEditing(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const completeness = profile?.profileCompleteness || 0;

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Your AI coach learns about you through conversation and auto-fills this profile.
        </p>
      </div>

      {/* Profile Completeness */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Profile Completeness: {completeness}%</h3>
            <div className="w-full bg-purple-200 dark:bg-purple-900 rounded-full h-3 mb-3">
              <div
                className="bg-purple-600 dark:bg-purple-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {completeness < 50
                ? "Keep chatting with your AI coach to help it understand you better!"
                : completeness < 80
                ? "Great progress! Your AI coach is learning your preferences."
                : "Excellent! Your AI coach has a complete understanding of your needs."}
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Fields */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Preferences</h2>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Primary Goal */}
          <div>
            <Label htmlFor="primaryGoal">Primary Goal</Label>
            {isEditing ? (
              <Input
                id="primaryGoal"
                value={formData.primaryGoal}
                onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                placeholder="e.g., Manage stress and anxiety"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.primaryGoal || "Not set yet - your AI coach will learn this from conversation"}
              </p>
            )}
          </div>

          {/* Secondary Goal */}
          <div>
            <Label htmlFor="secondaryGoal">Secondary Goal</Label>
            {isEditing ? (
              <Input
                id="secondaryGoal"
                value={formData.secondaryGoal}
                onChange={(e) => setFormData({ ...formData, secondaryGoal: e.target.value })}
                placeholder="e.g., Improve sleep quality"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.secondaryGoal || "Not set yet"}
              </p>
            )}
          </div>

          {/* Main Challenges */}
          <div>
            <Label htmlFor="mainChallenges">Main Challenges</Label>
            {isEditing ? (
              <Textarea
                id="mainChallenges"
                value={formData.mainChallenges.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mainChallenges: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="e.g., Work stress, poor sleep, anxiety"
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.mainChallenges && profile.mainChallenges.length > 0
                  ? profile.mainChallenges.join(", ")
                  : "Not set yet"}
              </p>
            )}
          </div>

          {/* Preferred Frequency */}
          <div>
            <Label htmlFor="preferredFrequency">Preferred Check-in Frequency</Label>
            {isEditing ? (
              <Select
                value={formData.preferredFrequency}
                onValueChange={(value: "daily" | "weekly" | "as_needed") =>
                  setFormData({ ...formData, preferredFrequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="as_needed">As Needed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.preferredFrequency || "Not set yet"}
              </p>
            )}
          </div>

          {/* Availability */}
          <div>
            <Label htmlFor="availability">Availability</Label>
            {isEditing ? (
              <Input
                id="availability"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                placeholder="e.g., Evenings, weekends, flexible"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.availability || "Not set yet"}
              </p>
            )}
          </div>

          {/* Communication Style */}
          <div>
            <Label htmlFor="communicationStyle">Communication Style</Label>
            {isEditing ? (
              <Select
                value={formData.communicationStyle}
                onValueChange={(value: "concise" | "detailed" | "balanced") =>
                  setFormData({ ...formData, communicationStyle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise (short, direct responses)</SelectItem>
                  <SelectItem value="balanced">Balanced (moderate detail)</SelectItem>
                  <SelectItem value="detailed">Detailed (in-depth explanations)</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.communicationStyle === "concise"
                  ? "Concise (short, direct responses)"
                  : profile?.communicationStyle === "detailed"
                  ? "Detailed (in-depth explanations)"
                  : "Balanced (moderate detail)"}
              </p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            {isEditing ? (
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                placeholder="e.g., America/Los_Angeles, Europe/London"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.timezone || "Not set yet"}
              </p>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Your AI coach automatically updates this profile as you chat. You can
              manually edit any field if needed.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
