/**
 * POPOUT TELEPROMPTER - Detachable Window for Eye Contact
 * 
 * This page opens in a new browser window and can be dragged to your
 * upper monitor near your camera. When you read the script, you're
 * looking directly into the camera - maintaining eye contact.
 * 
 * Features:
 * - Full screen capable
 * - Auto-scrolling text
 * - Large, readable font
 * - Dark mode for less eye strain
 * - Syncs with main Control Center
 * - Keyboard shortcuts for control
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Settings,
  ChevronUp,
  ChevronDown,
  Sun,
  Moon,
  Type,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Pre-built coaching scripts
const QUICK_SCRIPTS = {
  opening: [
    "Thank you for joining me today. Before we begin, I want you to know this is a safe space where you can share openly.",
    "I'm glad you're here. Let's start by checking in - how are you feeling right now, in this moment?",
    "Welcome back! I've been looking forward to our session. What's been on your mind since we last spoke?",
  ],
  empathy: [
    "I hear you, and that sounds really challenging. It takes courage to share that.",
    "Thank you for trusting me with this. Your feelings are completely valid.",
    "That must be difficult to carry. I appreciate you opening up about this.",
  ],
  grounding: [
    "Let's pause for a moment. Can you take a deep breath with me? Inhale for 4 counts... hold for 4... exhale for 6...",
    "I notice this is bringing up strong emotions. Let's ground ourselves - can you name 5 things you can see right now?",
    "Before we continue, let's do a quick body scan. Where are you holding tension right now?",
  ],
  reframing: [
    "I'm curious - what would it look like if you approached this situation with self-compassion?",
    "Let's explore another perspective. What advice would you give a close friend in this situation?",
    "What's one small thing that went well today, even if it feels insignificant?",
  ],
  closing: [
    "We've covered a lot today. What's one insight you're taking away from our conversation?",
    "Before we end, what's one small action you feel ready to take this week?",
    "Thank you for your openness today. Remember, progress isn't always linear, and you're doing important work.",
  ],
};

export default function PopoutTeleprompter() {
  // Script content - can be set via URL params or localStorage sync
  const [scriptContent, setScriptContent] = useState<string>(() => {
    // Try to get from localStorage (synced from main window)
    const saved = localStorage.getItem("teleprompter_script");
    return saved || "Welcome to your coaching session.\n\nYour script will appear here.\n\nYou can type or paste your script, or select from quick scripts below.";
  });
  
  // Display settings
  const [fontSize, setFontSize] = useState(32);
  const [scrollSpeed, setScrollSpeed] = useState(50);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof QUICK_SCRIPTS | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for script updates from main window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "teleprompter_script" && e.newValue) {
        setScriptContent(e.newValue);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save script to localStorage for sync
  useEffect(() => {
    localStorage.setItem("teleprompter_script", scriptContent);
  }, [scriptContent]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isScrolling && scrollContainerRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += scrollSpeed / 50;
        }
      }, 50);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    }
    
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isScrolling, scrollSpeed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ": // Space to toggle scroll
          e.preventDefault();
          setIsScrolling(prev => !prev);
          break;
        case "ArrowUp":
          e.preventDefault();
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop -= 50;
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop += 50;
          }
          break;
        case "r":
        case "R":
          e.preventDefault();
          resetScroll();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            document.exitFullscreen();
          }
          break;
        case "+":
        case "=":
          e.preventDefault();
          setFontSize(prev => Math.min(prev + 4, 72));
          break;
        case "-":
          e.preventDefault();
          setFontSize(prev => Math.max(prev - 4, 16));
          break;
        case "h":
        case "H":
          e.preventDefault();
          setShowControls(prev => !prev);
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const resetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setIsScrolling(false);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const addQuickScript = (script: string) => {
    setScriptContent(prev => prev + "\n\n" + script);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors`}>
      {/* Controls Bar - Can be hidden */}
      {showControls && (
        <div className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800/95' : 'bg-gray-100/95'} backdrop-blur-sm border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-3`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={isScrolling ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsScrolling(!isScrolling)}
                className="gap-2"
              >
                {isScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isScrolling ? "Pause" : "Scroll"}
              </Button>
              <Button variant="outline" size="sm" onClick={resetScroll}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Scroll Speed */}
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <span className="text-xs whitespace-nowrap">Speed:</span>
              <Slider
                value={[scrollSpeed]}
                onValueChange={([v]) => setScrollSpeed(v)}
                min={10}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-xs w-8">{scrollSpeed}%</span>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setFontSize(prev => Math.max(prev - 4, 16))}>
                <span className="text-xs">A-</span>
              </Button>
              <span className="text-sm w-8 text-center">{fontSize}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setFontSize(prev => Math.min(prev + 4, 72))}>
                <span className="text-xs">A+</span>
              </Button>
            </div>

            {/* Theme & Fullscreen */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center mt-2`}>
            <span className="mr-4">Space: Play/Pause</span>
            <span className="mr-4">↑↓: Manual Scroll</span>
            <span className="mr-4">R: Reset</span>
            <span className="mr-4">F: Fullscreen</span>
            <span className="mr-4">+/-: Font Size</span>
            <span>H: Hide Controls</span>
          </div>
        </div>
      )}

      {/* Hidden Controls Toggle */}
      {!showControls && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-2 right-2 z-50 opacity-30 hover:opacity-100"
          onClick={() => setShowControls(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}

      {/* Main Script Display */}
      <div
        ref={scrollContainerRef}
        className={`h-screen overflow-y-auto ${showControls ? 'pt-28' : 'pt-8'} pb-32 px-8 md:px-16 lg:px-24`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Script Text */}
        <div
          className="max-w-4xl mx-auto leading-relaxed whitespace-pre-wrap"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
        >
          {scriptContent}
        </div>

        {/* Quick Scripts Section */}
        <div className={`max-w-4xl mx-auto mt-16 pt-8 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Quick Scripts
          </h3>
          
          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(QUICK_SCRIPTS).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category as keyof typeof QUICK_SCRIPTS)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Script Options */}
          {selectedCategory && (
            <div className="space-y-2">
              {QUICK_SCRIPTS[selectedCategory].map((script, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => addQuickScript(script)}
                >
                  <p className="text-sm">{script}</p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Click to add to script
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Script Section */}
        <div className={`max-w-4xl mx-auto mt-8 pt-8 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Edit Script
          </h3>
          <textarea
            value={scriptContent}
            onChange={(e) => setScriptContent(e.target.value)}
            className={`w-full h-64 p-4 rounded-lg border resize-none ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="Type or paste your script here..."
          />
        </div>

        {/* Spacer for scroll */}
        <div className="h-screen" />
      </div>

      {/* Scroll Position Indicator */}
      <div className={`fixed bottom-4 right-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-2 shadow-lg`}>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
            if (scrollContainerRef.current) scrollContainerRef.current.scrollTop -= 100;
          }}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
            if (scrollContainerRef.current) scrollContainerRef.current.scrollTop += 100;
          }}>
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
