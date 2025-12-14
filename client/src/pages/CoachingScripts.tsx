import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  BookOpen,
  Copy,
  Check,
  Search,
  ArrowLeft,
  FileText,
  Heart,
  Brain,
  MessageSquare,
  LogOut,
  AlertTriangle,
  Shield,
  Sparkles,
} from "lucide-react";
import { coachingScripts, scriptCategories, type CoachingScript } from "@/data/coachingScripts";

const categoryIcons: Record<string, typeof BookOpen> = {
  "Session Opening": Sparkles,
  "Empathy & Validation": Heart,
  "Grounding Techniques": Brain,
  "Cognitive Reframing": MessageSquare,
  "Transition Phrases": FileText,
  "Session Closing": LogOut,
  "Crisis Response": AlertTriangle,
  "Compliance-Safe Language": Shield,
};

export default function CoachingScripts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter scripts
  const filteredScripts = coachingScripts.filter((script) => {
    const matchesSearch =
      searchQuery === "" ||
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.script.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || script.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group scripts by category
  const scriptsByCategory = filteredScripts.reduce((acc, script) => {
    if (!acc[script.category]) {
      acc[script.category] = [];
    }
    acc[script.category].push(script);
    return acc;
  }, {} as Record<string, CoachingScript[]>);

  // Copy script to clipboard
  const copyScript = async (script: CoachingScript) => {
    try {
      await navigator.clipboard.writeText(script.script);
      setCopiedId(script.id);
      toast.success("Script copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy script");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link href="/live-session">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Live Session
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              Coaching Scripts Library
            </h1>
            <p className="text-gray-600 mt-1">
              Evidence-based scripts and phrases for confident coaching
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search scripts, techniques, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All ({coachingScripts.length})
          </Button>
          {scriptCategories.map((category) => {
            const Icon = categoryIcons[category] || FileText;
            const count = coachingScripts.filter((s) => s.category === category).length;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2"
              >
                <Icon className="h-3 w-3" />
                {category} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Scripts Grid */}
      <div className="max-w-6xl mx-auto space-y-8">
        {Object.entries(scriptsByCategory).map(([category, scripts]) => {
          const Icon = categoryIcons[category] || FileText;
          return (
            <div key={category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon className="h-6 w-6 text-blue-600" />
                {category}
                <Badge variant="secondary">{scripts.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {scripts.map((script) => (
                  <Card key={script.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{script.title}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyScript(script)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedId === script.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Script Text */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-gray-800 leading-relaxed italic">
                          "{script.script}"
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-2 text-sm">
                        {script.technique && (
                          <div>
                            <span className="font-semibold text-gray-700">Technique:</span>{" "}
                            <span className="text-gray-600">{script.technique}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-gray-700">When to use:</span>{" "}
                          <span className="text-gray-600">{script.whenToUse}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {script.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {/* No Results */}
        {filteredScripts.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No scripts found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </Card>
        )}
      </div>

      {/* Footer Tip */}
      <div className="max-w-6xl mx-auto mt-8 p-4 bg-blue-100 rounded-lg border border-blue-300">
        <p className="text-sm text-blue-900">
          <strong>💡 Pro Tip:</strong> Click the copy button to quickly paste scripts into your
          notes or use them during live sessions. These scripts are evidence-based and
          compliance-safe.
        </p>
      </div>
    </div>
  );
}
