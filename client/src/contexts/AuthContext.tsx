/**
 * AuthContext - Manages user authentication and trial status
 * 
 * Flow:
 * 1. On mount, check localStorage for existing anonymousId
 * 2. If none, generate new anonymousId and store it
 * 3. Call trial.initializeUser to create/retrieve user with trial
 * 4. Track trial status and show appropriate prompts
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { trpc } from "@/lib/trpc";

// Generate a unique anonymous ID (Safari-compatible)
function generateAnonymousId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `anon_${timestamp}_${randomPart}`;
}

// Safely access localStorage (handles private browsing mode)
function safeLocalStorage() {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return localStorage;
  } catch (e) {
    // localStorage not available (private browsing, etc.)
    return null;
  }
}

// Get or create anonymous ID from localStorage
function getOrCreateAnonymousId(): string {
  const STORAGE_KEY = "purposeful_anonymous_id";
  const storage = safeLocalStorage();
  
  if (!storage) {
    // Fallback for private browsing - generate new ID each time
    return generateAnonymousId();
  }
  
  let anonymousId = storage.getItem(STORAGE_KEY);
  
  if (!anonymousId) {
    anonymousId = generateAnonymousId();
    try {
      storage.setItem(STORAGE_KEY, anonymousId);
    } catch (e) {
      // Storage quota exceeded or other error
      console.warn("[Auth] Could not save anonymous ID to localStorage");
    }
  }
  
  return anonymousId;
}

interface User {
  id: number;
  email?: string;
  name: string;
  role: "user" | "client" | "coach" | "admin";
  anonymousId?: string;
}

interface TrialStatus {
  tier: string;
  trialEndsAt: string | null;
  isTrialExpired: boolean;
  daysRemaining: number;
  limits?: {
    aiMessagesPerDay: number;
    modulesAccess: string;
    bookingAccess: boolean;
    voiceCallAccess: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  trialStatus: TrialStatus | null;
  refreshTrialStatus: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default trial status for fallback
const DEFAULT_TRIAL_STATUS: TrialStatus = {
  tier: "trial",
  trialEndsAt: null,
  isTrialExpired: false,
  daysRemaining: 7,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  // tRPC mutations
  const initializeUserMutation = trpc.trial.initializeUser.useMutation();
  const getTierStatusQuery = trpc.trial.getTierStatus.useQuery(
    { userId: userId || 0 },
    { enabled: !!userId, refetchInterval: 60000 } // Refetch every minute
  );

  // Initialize anonymous user on mount
  useEffect(() => {
    let isMounted = true;
    
    const initUser = async () => {
      try {
        const anonymousId = getOrCreateAnonymousId();
        
        // Call server to create/retrieve user with timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timeout")), 10000)
        );
        
        const result = await Promise.race([
          initializeUserMutation.mutateAsync({ anonymousId }),
          timeoutPromise
        ]) as any;
        
        if (!isMounted) return;
        
        setUserId(result.userId);
        setUser({
          id: result.userId,
          name: "Guest User",
          role: "user",
          anonymousId,
        });

        setTrialStatus({
          tier: result.tier,
          trialEndsAt: result.trialEndsAt,
          isTrialExpired: result.isTrialExpired,
          daysRemaining: result.daysRemaining,
        });
      } catch (error) {
        console.error("[Auth] Failed to initialize user:", error);
        if (!isMounted) return;
        
        // Fallback to local-only mode with mock user
        const anonymousId = getOrCreateAnonymousId();
        setUser({
          id: 1,
          name: "Guest User",
          role: "user",
          anonymousId,
        });
        setTrialStatus(DEFAULT_TRIAL_STATUS);
        setInitError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Small delay to ensure React is fully hydrated on mobile Safari
    const timer = setTimeout(() => {
      initUser();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Update trial status when query returns
  useEffect(() => {
    if (getTierStatusQuery.data) {
      setTrialStatus({
        tier: getTierStatusQuery.data.tier,
        trialEndsAt: getTierStatusQuery.data.trialEndsAt,
        isTrialExpired: getTierStatusQuery.data.isTrialExpired,
        daysRemaining: getTierStatusQuery.data.daysRemaining,
        limits: getTierStatusQuery.data.limits,
      });
    }
  }, [getTierStatusQuery.data]);

  // Refresh trial status
  const refreshTrialStatus = useCallback(async () => {
    if (userId) {
      await getTierStatusQuery.refetch();
    }
  }, [userId, getTierStatusQuery]);

  const login = async (email: string, password: string) => {
    // TODO: Implement real login that links anonymous user to email account
    console.log("[Auth] Login not yet implemented");
  };

  const logout = () => {
    // Clear user but keep anonymous ID for continuity
    setUser(null);
    setTrialStatus(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        trialStatus,
        refreshTrialStatus,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to check if user has access to a feature
export function useFeatureAccess() {
  const { trialStatus } = useAuth();

  const hasModuleAccess = (moduleIndex: number): boolean => {
    if (!trialStatus) return false;
    
    // Trial and paid tiers have full access
    if (trialStatus.tier === "trial" || 
        trialStatus.tier === "basic" || 
        trialStatus.tier === "premium" || 
        trialStatus.tier === "elite") {
      return true;
    }
    
    // Free tier only has access to first 5 modules
    if (trialStatus.tier === "free") {
      return moduleIndex < 5;
    }
    
    return false;
  };

  const hasBookingAccess = (): boolean => {
    if (!trialStatus) return false;
    return trialStatus.limits?.bookingAccess ?? false;
  };

  const hasVoiceCallAccess = (): boolean => {
    if (!trialStatus) return false;
    return trialStatus.limits?.voiceCallAccess ?? false;
  };

  const canSendAiMessage = (): boolean => {
    if (!trialStatus) return false;
    // Unlimited for trial and paid tiers
    if (trialStatus.limits?.aiMessagesPerDay === -1) return true;
    // For free tier, this should be checked server-side
    return true;
  };

  return {
    hasModuleAccess,
    hasBookingAccess,
    hasVoiceCallAccess,
    canSendAiMessage,
    tier: trialStatus?.tier || "free",
    isTrialExpired: trialStatus?.isTrialExpired ?? true,
    daysRemaining: trialStatus?.daysRemaining ?? 0,
  };
}
