import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

export default function CreateAutismProfile() {
  const [, setLocation] = useLocation();
  const [childName, setChildName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("moderate");
  const [communicationLevel, setCommunicationLevel] = useState<"nonverbal" | "minimally_verbal" | "verbal">("verbal");
  const [atecScore, setAtecScore] = useState("");
  const [carsScore, setCarsScore] = useState("");

  const createProfile = trpc.autism.createProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile created successfully!");
      setLocation("/autism");
    },
    onError: (error) => {
      toast.error(`Failed to create profile: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!childName || !dateOfBirth) {
      toast.error("Please fill in required fields");
      return;
    }

    createProfile.mutate({
      childName,
      dateOfBirth: new Date(dateOfBirth),
      diagnosisDate: diagnosisDate ? new Date(diagnosisDate) : undefined,
      severity,
      communicationLevel,
      atecScore: atecScore ? parseInt(atecScore) : undefined,
      carsScore: carsScore ? parseInt(carsScore) : undefined,
    });
  };

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Child Profile</CardTitle>
          <CardDescription>
            Enter your child's information to begin tracking their transformation journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="childName">Child's Name *</Label>
              <Input
                id="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter child's name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
                <Input
                  id="diagnosisDate"
                  type="date"
                  value={diagnosisDate}
                  onChange={(e) => setDiagnosisDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level *</Label>
                <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="communicationLevel">Communication Level *</Label>
                <Select value={communicationLevel} onValueChange={(value: any) => setCommunicationLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nonverbal">Nonverbal</SelectItem>
                    <SelectItem value="minimally_verbal">Minimally Verbal</SelectItem>
                    <SelectItem value="verbal">Verbal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="atecScore">ATEC Score (optional)</Label>
                <Input
                  id="atecScore"
                  type="number"
                  value={atecScore}
                  onChange={(e) => setAtecScore(e.target.value)}
                  placeholder="0-180"
                />
                <p className="text-xs text-muted-foreground">
                  Autism Treatment Evaluation Checklist
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carsScore">CARS Score (optional)</Label>
                <Input
                  id="carsScore"
                  type="number"
                  value={carsScore}
                  onChange={(e) => setCarsScore(e.target.value)}
                  placeholder="15-60"
                />
                <p className="text-xs text-muted-foreground">
                  Childhood Autism Rating Scale
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/autism")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProfile.isPending}
                className="flex-1"
              >
                {createProfile.isPending ? "Creating..." : "Create Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
