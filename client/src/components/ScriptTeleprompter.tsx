import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, BookOpen, Zap } from "lucide-react";
import { coachingScripts, getScriptByTrigger, getAllTriggers, getAllCategories } from "@shared/coachingScripts";

export default function ScriptTeleprompter() {
  const [currentScript, setCurrentScript] = useState<typeof coachingScripts[0] | null>(null);
  const [triggerInput, setTriggerInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Handle trigger word detection
  const handleTriggerSubmit = useCallback((trigger: string) => {
    const script = getScriptByTrigger(trigger);
    if (script) {
      setCurrentScript(script);
      setIsVisible(true);
      setTriggerInput("");
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC to close
      if (e.key === "Escape" && isVisible) {
        setIsVisible(false);
        setCurrentScript(null);
      }
      
      // Ctrl+Shift+S to open search
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        setIsVisible(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isVisible]);

  const filteredScripts = coachingScripts.filter(script => {
    const matchesSearch = searchQuery === "" || 
      script.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.response.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || script.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = getAllCategories();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Trigger Input (always visible, bottom-right) */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <Card className="p-4 bg-background/95 backdrop-blur shadow-lg border-2 border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Quick Trigger</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter trigger word..."
              value={triggerInput}
              onChange={(e) => setTriggerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && triggerInput) {
                  handleTriggerSubmit(triggerInput.toUpperCase());
                }
              }}
              className="w-48"
            />
            <Button 
              size="sm"
              onClick={() => triggerInput && handleTriggerSubmit(triggerInput.toUpperCase())}
            >
              Go
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Press <kbd className="px-1 py-0.5 bg-muted rounded">Ctrl+Shift+S</kbd> for search
          </div>
        </Card>
      </div>

      {/* Main Teleprompter Display */}
      {isVisible && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-background shadow-2xl">
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Script Teleprompter</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsVisible(false);
                  setCurrentScript(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {currentScript ? (
              // Display selected script
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">{currentScript.category}</Badge>
                    <h3 className="text-2xl font-bold">Trigger: {currentScript.trigger}</h3>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentScript(null)}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse All
                  </Button>
                </div>

                {/* Main Response */}
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-lg">Your Response:</h4>
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    "I understand how you feel, however let me point out{currentScript.response}"
                  </p>
                </div>

                {/* Tone Cues */}
                {currentScript.toneCues.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-blue-600 dark:text-blue-400">🎭</span>
                      Tone Cues:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentScript.toneCues.map((cue, i) => (
                        <Badge key={i} variant="secondary">{cue}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-Up */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Follow-Up Sequence:</h4>
                  {currentScript.followUp.map((line, i) => (
                    <div key={i} className="bg-muted/50 p-4 rounded-lg border-l-2 border-muted-foreground/20">
                      <div className="text-sm text-muted-foreground mb-1">Step {i + 1}</div>
                      <p className="leading-relaxed whitespace-pre-wrap">{line}</p>
                    </div>
                  ))}
                </div>

                {/* Personalization Prompts */}
                {currentScript.personalizationPrompts.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-amber-600 dark:text-amber-400">💡</span>
                      Personalization Tips:
                    </h4>
                    <ul className="space-y-1">
                      {currentScript.personalizationPrompts.map((prompt, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{prompt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Success Story */}
                {currentScript.successStory && (
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-green-600 dark:text-green-400">⭐</span>
                      Success Story:
                    </h4>
                    <p className="text-sm leading-relaxed">{currentScript.successStory}</p>
                  </div>
                )}

                {/* Close Transition */}
                <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">🎯</span>
                    Close Transition:
                  </h4>
                  <p className="leading-relaxed">{currentScript.closeTransition}</p>
                </div>
              </div>
            ) : (
              // Browse all scripts
              <div className="p-6 space-y-4">
                {/* Search */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search scripts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* Script List */}
                <div className="grid gap-3 max-h-[60vh] overflow-auto">
                  {filteredScripts.map((script, i) => (
                    <Card
                      key={i}
                      className="p-4 hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setCurrentScript(script)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{script.category}</Badge>
                            <span className="font-bold text-primary">{script.trigger}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {script.response.substring(0, 150)}...
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View →
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {filteredScripts.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No scripts found matching your search.
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
