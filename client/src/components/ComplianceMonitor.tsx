import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  BookOpen,
  Scale,
  Heart,
  Users,
  Brain,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

/**
 * COMPREHENSIVE COMPLIANCE MONITOR
 * 
 * Real-time compliance monitoring for coaching sessions that covers:
 * 1. Legal Compliance - Medical/legal/financial advice detection
 * 2. Banned Words/Phrases - Defensiveness triggers, judgmental language
 * 3. Ethical Compliance - ICF Code of Ethics alignment
 * 4. Social Compliance - Cultural sensitivity, appropriate language
 * 5. Wisdom Compliance - Research-backed communication principles
 * 6. Interpersonal Skills - Human nature alignment
 */

type ComplianceCategory = 
  | "legal"
  | "banned_words"
  | "ethical"
  | "social"
  | "wisdom"
  | "interpersonal"
  | "crisis";

type ViolationSeverity = "info" | "warning" | "moderate" | "severe" | "critical";

interface ComplianceViolation {
  category: ComplianceCategory;
  subcategory: string;
  severity: ViolationSeverity;
  flaggedContent: string;
  reason: string;
  suggestion: string;
  research_basis?: string;
}

interface RealTimeAlert {
  type: "pre_speech" | "during_speech" | "post_speech";
  urgency: "low" | "medium" | "high" | "critical";
  message: string;
  alternativePhrase?: string;
}

interface ComplianceMonitorProps {
  isActive: boolean;
  currentTranscript?: string;
  onAlert?: (alert: RealTimeAlert) => void;
  onSpeak?: (text: string) => void;
  voiceEnabled?: boolean;
  className?: string;
}

const CATEGORY_CONFIG: Record<ComplianceCategory, {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
}> = {
  legal: {
    icon: <Scale className="h-4 w-4" />,
    label: "Legal",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  banned_words: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "Language",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  ethical: {
    icon: <Shield className="h-4 w-4" />,
    label: "Ethics",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  social: {
    icon: <Users className="h-4 w-4" />,
    label: "Cultural",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  wisdom: {
    icon: <Brain className="h-4 w-4" />,
    label: "Wisdom",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  interpersonal: {
    icon: <Heart className="h-4 w-4" />,
    label: "Interpersonal",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  crisis: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Crisis",
    color: "text-red-700",
    bgColor: "bg-red-200",
  },
};

const SEVERITY_CONFIG: Record<ViolationSeverity, {
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}> = {
  info: {
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: <Info className="h-4 w-4" />,
  },
  warning: {
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  moderate: {
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  severe: {
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: <XCircle className="h-4 w-4" />,
  },
  critical: {
    color: "text-red-700",
    bgColor: "bg-red-200",
    icon: <AlertCircle className="h-4 w-4" />,
  },
};

export default function ComplianceMonitor({
  isActive,
  currentTranscript = "",
  onAlert,
  onSpeak,
  voiceEnabled = true,
  className = "",
}: ComplianceMonitorProps) {
  const [complianceScore, setComplianceScore] = useState(100);
  const [violations, setViolations] = useState<ComplianceViolation[]>([]);
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [previousViolations, setPreviousViolations] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showGuidance, setShowGuidance] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ComplianceCategory | null>(null);

  // Compliance check mutation
  const complianceCheck = trpc.compliance.streamComplianceCheck.useMutation({
    onSuccess: (data) => {
      setComplianceScore(data.overallScore);
      
      if (data.alerts.length > 0) {
        setAlerts(prev => [...prev, ...data.alerts].slice(-10));
        setPreviousViolations(prev => [...prev, ...data.newViolations]);
        
        // Speak critical/high urgency alerts
        if (voiceEnabled && onSpeak) {
          const criticalAlert = data.alerts.find(a => a.urgency === "critical" || a.urgency === "high");
          if (criticalAlert) {
            onSpeak(criticalAlert.message);
          }
        }
        
        // Notify parent
        data.alerts.forEach(alert => onAlert?.(alert));
      }
    },
  });

  // Full compliance check mutation
  const fullComplianceCheck = trpc.compliance.checkCompliance.useMutation({
    onSuccess: (data) => {
      setComplianceScore(data.overallScore);
      setViolations(data.violations);
      
      if (data.requiresImmediateAction && voiceEnabled && onSpeak) {
        onSpeak(data.coachGuidance || "Please pause and reconsider your approach.");
      }
    },
  });

  // Get compliance rules
  const { data: complianceRules } = trpc.compliance.getComplianceRules.useQuery();

  // Get category guidance
  const { data: categoryGuidance } = trpc.compliance.getCategoryGuidance.useQuery(
    { category: selectedCategory! },
    { enabled: !!selectedCategory }
  );

  // Run compliance check when transcript changes
  useEffect(() => {
    if (!isActive || !currentTranscript || currentTranscript.length < 10) return;

    const debounceTimer = setTimeout(() => {
      complianceCheck.mutate({
        text: currentTranscript,
        previousViolations,
      });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentTranscript, isActive]);

  // Calculate category scores
  const categoryScores = violations.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {} as Record<ComplianceCategory, number>);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className={cn("border-2", className, {
      "border-green-500": complianceScore >= 90,
      "border-yellow-500": complianceScore >= 70 && complianceScore < 90,
      "border-orange-500": complianceScore >= 50 && complianceScore < 70,
      "border-red-500": complianceScore < 50,
    })}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={cn("h-5 w-5", getScoreColor(complianceScore))} />
            <CardTitle className="text-lg">Compliance Monitor</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-2xl font-bold", getScoreColor(complianceScore))}>
              {complianceScore}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <Progress 
          value={complianceScore} 
          className="h-2"
        />
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Category Overview */}
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(CATEGORY_CONFIG) as ComplianceCategory[]).map((category) => {
              const config = CATEGORY_CONFIG[category];
              const count = categoryScores[category] || 0;
              return (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1 justify-start",
                    count > 0 && config.bgColor
                  )}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className={config.color}>{config.icon}</span>
                  <span className="text-xs">{config.label}</span>
                  {count > 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Active Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                Active Alerts
              </h4>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {alerts.slice(-5).reverse().map((alert, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-2 rounded-lg text-sm",
                        alert.urgency === "critical" && "bg-red-100 border border-red-300",
                        alert.urgency === "high" && "bg-orange-100 border border-orange-300",
                        alert.urgency === "medium" && "bg-yellow-100 border border-yellow-300",
                        alert.urgency === "low" && "bg-blue-100 border border-blue-300"
                      )}
                    >
                      <p className="font-medium">{alert.message}</p>
                      {alert.alternativePhrase && (
                        <p className="text-xs text-gray-600 mt-1">
                          💡 {alert.alternativePhrase}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Recent Violations */}
          {violations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-600" />
                Recent Violations
              </h4>
              <ScrollArea className="h-40">
                <div className="space-y-2">
                  {violations.slice(-5).reverse().map((violation, idx) => {
                    const catConfig = CATEGORY_CONFIG[violation.category];
                    const sevConfig = SEVERITY_CONFIG[violation.severity];
                    return (
                      <div
                        key={idx}
                        className={cn("p-2 rounded-lg border", sevConfig.bgColor)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={catConfig.color}>{catConfig.icon}</span>
                          <span className="text-xs font-medium">{catConfig.label}</span>
                          <Badge variant="outline" className={cn("text-xs", sevConfig.color)}>
                            {violation.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">
                          <span className="font-mono bg-gray-200 px-1 rounded">
                            "{violation.flaggedContent}"
                          </span>
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {violation.suggestion}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Compliance Status */}
          {violations.length === 0 && alerts.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-4 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>All clear - communication is compliant</span>
            </div>
          )}

          {/* Quick Reference Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowGuidance(!showGuidance)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {showGuidance ? "Hide" : "Show"} Compliance Guidelines
          </Button>

          {/* Guidelines Panel */}
          {showGuidance && complianceRules && (
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm">Quick Reference</h4>
              {complianceRules.map((rule) => (
                <div key={rule.category} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={CATEGORY_CONFIG[rule.category as ComplianceCategory]?.color}>
                      {CATEGORY_CONFIG[rule.category as ComplianceCategory]?.icon}
                    </span>
                    <span className="font-medium text-sm">{rule.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{rule.description}</p>
                  <ul className="text-xs text-gray-500 list-disc list-inside">
                    {rule.examples.slice(0, 2).map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Category Detail Modal */}
          {selectedCategory && categoryGuidance && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-lg mx-4 max-h-[80vh] overflow-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={CATEGORY_CONFIG[selectedCategory].color}>
                        {CATEGORY_CONFIG[selectedCategory].icon}
                      </span>
                      <CardTitle>{categoryGuidance.title}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{categoryGuidance.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-green-600 flex items-center gap-1 mb-2">
                      <CheckCircle className="h-4 w-4" /> Do
                    </h4>
                    <ul className="space-y-1">
                      {categoryGuidance.doList.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-600 flex items-center gap-1 mb-2">
                      <XCircle className="h-4 w-4" /> Don't
                    </h4>
                    <ul className="space-y-1">
                      {categoryGuidance.dontList.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-red-500">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-600 flex items-center gap-1 mb-2">
                      <BookOpen className="h-4 w-4" /> Resources
                    </h4>
                    <ul className="space-y-1">
                      {categoryGuidance.resources.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// Export types for use in other components
export type { ComplianceViolation, RealTimeAlert, ComplianceCategory, ViolationSeverity };
