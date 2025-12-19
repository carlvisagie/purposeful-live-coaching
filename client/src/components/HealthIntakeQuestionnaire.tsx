/**
 * HEALTH INTAKE QUESTIONNAIRE
 * Comprehensive health assessment for personalized coaching
 * Evidence-based approach using longevity science research
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Brain, 
  Moon, 
  Dumbbell, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Shield,
  Target,
  Activity
} from "lucide-react";

interface HealthIntakeQuestionnaireProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const STEPS = [
  { id: 1, title: "Welcome", icon: Heart },
  { id: 2, title: "Current Health", icon: Activity },
  { id: 3, title: "Health Goals", icon: Target },
  { id: 4, title: "Medical History", icon: Shield },
  { id: 5, title: "Lifestyle", icon: Dumbbell },
  { id: 6, title: "Sleep & Stress", icon: Moon },
  { id: 7, title: "Mental Health", icon: Brain },
  { id: 8, title: "Consent", icon: CheckCircle2 },
];

const HEALTH_GOALS = [
  { value: "longevity", label: "Live Longer & Healthier", description: "Optimize for maximum healthspan" },
  { value: "weight_loss", label: "Lose Weight", description: "Sustainable fat loss" },
  { value: "muscle_gain", label: "Build Muscle", description: "Increase strength and lean mass" },
  { value: "energy", label: "More Energy", description: "Feel vibrant throughout the day" },
  { value: "mental_clarity", label: "Mental Clarity", description: "Sharper focus and cognition" },
  { value: "stress_reduction", label: "Reduce Stress", description: "Better stress management" },
  { value: "sleep_improvement", label: "Better Sleep", description: "Improve sleep quality" },
  { value: "disease_prevention", label: "Prevent Disease", description: "Reduce chronic disease risk" },
  { value: "athletic_performance", label: "Athletic Performance", description: "Optimize for sports/fitness" },
  { value: "hormone_optimization", label: "Hormone Balance", description: "Optimize hormonal health" },
];

const COMMON_CONDITIONS = [
  "Diabetes / Pre-diabetes",
  "High Blood Pressure",
  "Heart Disease",
  "High Cholesterol",
  "Thyroid Issues",
  "Autoimmune Condition",
  "Chronic Pain",
  "Digestive Issues",
  "Obesity",
  "Arthritis",
];

const SLEEP_ISSUES = [
  "Difficulty falling asleep",
  "Waking up during the night",
  "Waking up too early",
  "Not feeling rested",
  "Sleep apnea",
  "Insomnia",
  "Restless legs",
];

const MENTAL_HEALTH_CONCERNS = [
  "Anxiety",
  "Depression",
  "ADHD",
  "Burnout",
  "Trauma / PTSD",
  "Grief",
  "Relationship issues",
  "Work stress",
];

export function HealthIntakeQuestionnaire({ onComplete, onSkip }: HealthIntakeQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    // Demographics
    dateOfBirth: "",
    biologicalSex: "" as "male" | "female" | "other" | "",
    height: "",
    weight: "",
    
    // Current Health
    overallHealth: 5,
    energyLevel: 5,
    sleepQuality: 5,
    stressLevel: 5,
    
    // Goals
    primaryGoal: "" as string,
    
    // Medical
    currentConditions: [] as string[],
    familyHistory: [] as string[],
    currentMedications: "",
    allergies: "",
    
    // Lifestyle
    smokingStatus: "" as "never" | "former" | "current" | "",
    alcoholConsumption: "" as "none" | "occasional" | "moderate" | "heavy" | "",
    exerciseFrequency: "" as "none" | "1-2_weekly" | "3-4_weekly" | "5+_weekly" | "",
    dietType: "" as string,
    
    // Sleep
    averageSleepHours: 7,
    sleepIssues: [] as string[],
    
    // Mental Health
    mentalHealthConcerns: [] as string[],
    currentlyInTherapy: false,
    
    // Screening
    hasRecentBloodwork: false,
    lastPhysicalExam: "",
    
    // Consent
    consentToHealthTracking: false,
    understandsNotMedicalAdvice: false,
  });
  
  const submitMutation = trpc.healthOptimization.submitHealthIntake.useMutation({
    onSuccess: () => {
      toast({
        title: "Health Profile Created!",
        description: "Your personalized coaching experience is ready.",
      });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev] as string[];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };
  
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = () => {
    if (!formData.consentToHealthTracking || !formData.understandsNotMedicalAdvice) {
      toast({
        title: "Consent Required",
        description: "Please agree to the terms to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.primaryGoal) {
      toast({
        title: "Goal Required",
        description: "Please select your primary health goal.",
        variant: "destructive",
      });
      setCurrentStep(3);
      return;
    }
    
    submitMutation.mutate({
      dateOfBirth: formData.dateOfBirth || undefined,
      biologicalSex: formData.biologicalSex || undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      overallHealth: formData.overallHealth,
      energyLevel: formData.energyLevel,
      sleepQuality: formData.sleepQuality,
      stressLevel: formData.stressLevel,
      primaryGoal: formData.primaryGoal as any,
      currentConditions: formData.currentConditions.length ? formData.currentConditions : undefined,
      familyHistory: formData.familyHistory.length ? formData.familyHistory : undefined,
      currentMedications: formData.currentMedications ? formData.currentMedications.split(",").map(s => s.trim()) : undefined,
      allergies: formData.allergies ? formData.allergies.split(",").map(s => s.trim()) : undefined,
      smokingStatus: formData.smokingStatus || undefined,
      alcoholConsumption: formData.alcoholConsumption || undefined,
      exerciseFrequency: formData.exerciseFrequency || undefined,
      dietType: formData.dietType || undefined,
      averageSleepHours: formData.averageSleepHours,
      sleepIssues: formData.sleepIssues.length ? formData.sleepIssues : undefined,
      mentalHealthConcerns: formData.mentalHealthConcerns.length ? formData.mentalHealthConcerns : undefined,
      currentlyInTherapy: formData.currentlyInTherapy,
      hasRecentBloodwork: formData.hasRecentBloodwork,
      lastPhysicalExam: formData.lastPhysicalExam || undefined,
      consentToHealthTracking: formData.consentToHealthTracking,
      understandsNotMedicalAdvice: formData.understandsNotMedicalAdvice,
    });
  };
  
  const progress = (currentStep / STEPS.length) * 100;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep} of {STEPS.length}</span>
            <span>{STEPS[currentStep - 1].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = STEPS[currentStep - 1].icon;
                return <Icon className="h-8 w-8 text-emerald-600" />;
              })()}
              <div>
                <CardTitle className="text-2xl">{STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Let's understand your health to provide personalized coaching"}
                  {currentStep === 2 && "How are you feeling right now?"}
                  {currentStep === 3 && "What do you want to achieve?"}
                  {currentStep === 4 && "Help us understand your medical background"}
                  {currentStep === 5 && "Your daily habits matter"}
                  {currentStep === 6 && "Sleep and stress affect everything"}
                  {currentStep === 7 && "Mental health is health"}
                  {currentStep === 8 && "Almost done!"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-emerald-800 mb-2">Why This Matters</h3>
                  <p className="text-emerald-700 text-sm">
                    To provide you with the most effective coaching, we need to understand your complete health picture. 
                    This assessment takes about 5 minutes and helps us personalize every interaction.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date of Birth (Optional)</Label>
                    <Input 
                      type="date" 
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Biological Sex (Optional)</Label>
                    <RadioGroup 
                      value={formData.biologicalSex}
                      onValueChange={(v) => updateField("biologicalSex", v)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Height (cm)</Label>
                    <Input 
                      type="number" 
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => updateField("height", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input 
                      type="number" 
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => updateField("weight", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Current Health */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <Label className="text-base">Overall Health: {formData.overallHealth}/10</Label>
                  <p className="text-sm text-gray-500 mb-3">How would you rate your overall health?</p>
                  <Slider
                    value={[formData.overallHealth]}
                    onValueChange={([v]) => updateField("overallHealth", v)}
                    min={1}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base">Energy Level: {formData.energyLevel}/10</Label>
                  <p className="text-sm text-gray-500 mb-3">How's your typical energy throughout the day?</p>
                  <Slider
                    value={[formData.energyLevel]}
                    onValueChange={([v]) => updateField("energyLevel", v)}
                    min={1}
                    max={10}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Exhausted</span>
                    <span>Vibrant</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base">Sleep Quality: {formData.sleepQuality}/10</Label>
                  <p className="text-sm text-gray-500 mb-3">How well do you typically sleep?</p>
                  <Slider
                    value={[formData.sleepQuality]}
                    onValueChange={([v]) => updateField("sleepQuality", v)}
                    min={1}
                    max={10}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Terrible</span>
                    <span>Amazing</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base">Stress Level: {formData.stressLevel}/10</Label>
                  <p className="text-sm text-gray-500 mb-3">How stressed are you typically?</p>
                  <Slider
                    value={[formData.stressLevel]}
                    onValueChange={([v]) => updateField("stressLevel", v)}
                    min={1}
                    max={10}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Very Low</span>
                    <span>Extremely High</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Health Goals */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select your primary health goal:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {HEALTH_GOALS.map((goal) => (
                    <div
                      key={goal.value}
                      onClick={() => updateField("primaryGoal", goal.value)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.primaryGoal === goal.value
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <h4 className="font-medium">{goal.label}</h4>
                      <p className="text-sm text-gray-500">{goal.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 4: Medical History */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Current Health Conditions</Label>
                  <p className="text-sm text-gray-500 mb-3">Select any that apply:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {COMMON_CONDITIONS.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.currentConditions.includes(condition)}
                          onCheckedChange={() => toggleArrayItem("currentConditions", condition)}
                        />
                        <Label htmlFor={condition} className="text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Current Medications (Optional)</Label>
                  <Input 
                    placeholder="e.g., Metformin, Lisinopril (comma separated)"
                    value={formData.currentMedications}
                    onChange={(e) => updateField("currentMedications", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Allergies (Optional)</Label>
                  <Input 
                    placeholder="e.g., Penicillin, Shellfish (comma separated)"
                    value={formData.allergies}
                    onChange={(e) => updateField("allergies", e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recentBloodwork"
                    checked={formData.hasRecentBloodwork}
                    onCheckedChange={(v) => updateField("hasRecentBloodwork", v)}
                  />
                  <Label htmlFor="recentBloodwork">I have recent bloodwork (within 12 months)</Label>
                </div>
              </div>
            )}
            
            {/* Step 5: Lifestyle */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Smoking Status</Label>
                  <RadioGroup 
                    value={formData.smokingStatus}
                    onValueChange={(v) => updateField("smokingStatus", v)}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="never" />
                      <Label htmlFor="never">Never smoked</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="former" id="former" />
                      <Label htmlFor="former">Former smoker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="current" id="current" />
                      <Label htmlFor="current">Current smoker</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-base">Alcohol Consumption</Label>
                  <RadioGroup 
                    value={formData.alcoholConsumption}
                    onValueChange={(v) => updateField("alcoholConsumption", v)}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="occasional" id="occasional" />
                      <Label htmlFor="occasional">Occasional (1-2 drinks/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Moderate (3-7 drinks/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="heavy" id="heavy" />
                      <Label htmlFor="heavy">Heavy (8+ drinks/week)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-base">Exercise Frequency</Label>
                  <RadioGroup 
                    value={formData.exerciseFrequency}
                    onValueChange={(v) => updateField("exerciseFrequency", v)}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="ex-none" />
                      <Label htmlFor="ex-none">None / Sedentary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2_weekly" id="ex-12" />
                      <Label htmlFor="ex-12">1-2 times per week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-4_weekly" id="ex-34" />
                      <Label htmlFor="ex-34">3-4 times per week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5+_weekly" id="ex-5" />
                      <Label htmlFor="ex-5">5+ times per week</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
            
            {/* Step 6: Sleep & Stress */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Average Sleep: {formData.averageSleepHours} hours</Label>
                  <p className="text-sm text-gray-500 mb-3">How many hours do you typically sleep?</p>
                  <Slider
                    value={[formData.averageSleepHours]}
                    onValueChange={([v]) => updateField("averageSleepHours", v)}
                    min={3}
                    max={12}
                    step={0.5}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>3 hours</span>
                    <span>12 hours</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base">Sleep Issues</Label>
                  <p className="text-sm text-gray-500 mb-3">Select any that apply:</p>
                  <div className="space-y-2">
                    {SLEEP_ISSUES.map((issue) => (
                      <div key={issue} className="flex items-center space-x-2">
                        <Checkbox
                          id={issue}
                          checked={formData.sleepIssues.includes(issue)}
                          onCheckedChange={() => toggleArrayItem("sleepIssues", issue)}
                        />
                        <Label htmlFor={issue} className="text-sm">{issue}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 7: Mental Health */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    Mental health is a crucial part of overall wellness. Your answers help us provide 
                    appropriate support and know when to recommend professional resources.
                  </p>
                </div>
                
                <div>
                  <Label className="text-base">Current Concerns</Label>
                  <p className="text-sm text-gray-500 mb-3">Select any that apply:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {MENTAL_HEALTH_CONCERNS.map((concern) => (
                      <div key={concern} className="flex items-center space-x-2">
                        <Checkbox
                          id={concern}
                          checked={formData.mentalHealthConcerns.includes(concern)}
                          onCheckedChange={() => toggleArrayItem("mentalHealthConcerns", concern)}
                        />
                        <Label htmlFor={concern} className="text-sm">{concern}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="therapy"
                    checked={formData.currentlyInTherapy}
                    onCheckedChange={(v) => updateField("currentlyInTherapy", v)}
                  />
                  <Label htmlFor="therapy">I'm currently working with a therapist or counselor</Label>
                </div>
              </div>
            )}
            
            {/* Step 8: Consent */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800">Important Disclaimer</h4>
                      <p className="text-amber-700 text-sm mt-1">
                        This platform provides wellness coaching, not medical advice. Always consult 
                        healthcare professionals for medical concerns. In case of emergency, call 911.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent1"
                      checked={formData.consentToHealthTracking}
                      onCheckedChange={(v) => updateField("consentToHealthTracking", v)}
                    />
                    <Label htmlFor="consent1" className="text-sm leading-relaxed">
                      I consent to having my health information stored securely to personalize my 
                      coaching experience. I understand I can delete this data at any time.
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent2"
                      checked={formData.understandsNotMedicalAdvice}
                      onCheckedChange={(v) => updateField("understandsNotMedicalAdvice", v)}
                    />
                    <Label htmlFor="consent2" className="text-sm leading-relaxed">
                      I understand that this platform provides wellness coaching, not medical advice. 
                      I will consult healthcare professionals for any medical concerns.
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {onSkip && currentStep === 1 && (
              <Button variant="ghost" onClick={onSkip}>
                Skip for now
              </Button>
            )}
            
            {currentStep < STEPS.length ? (
              <Button onClick={nextStep}>
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={submitMutation.isPending || !formData.consentToHealthTracking || !formData.understandsNotMedicalAdvice}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {submitMutation.isPending ? "Saving..." : "Complete Assessment"}
                <CheckCircle2 className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthIntakeQuestionnaire;
