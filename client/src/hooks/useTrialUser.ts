/**
 * useTrialUser - Hook for managing anonymous users and trial status
 * 
 * Creates a persistent anonymous ID in localStorage and syncs with server
 * to track trial period and tier access.
 */

import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";

const ANONYMOUS_ID_KEY = "purposeful_anonymous_id";

// Generate a UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get or create anonymous ID from localStorage
function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  
  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!anonymousId) {
    anonymousId = `anon_${generateUUID()}`;
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
  }
  return anonymousId;
}

export interface TrialUserState {
  userId: number | null;
  anonymousId: string;
  tier: string;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  daysRemaining: number;
  trialEndsAt: Date | null;
  isLoading: boolean;
  error: string | null;
  canSendMessage: boolean;
  messagesUsedToday: number;
  messageLimit: number;
  showUpgradePrompt: boolean;
}

export function useTrialUser() {
  const [state, setState] = useState<TrialUserState>({
    userId: null,
    anonymousId: "",
    tier: "trial",
    isTrialActive: true,
    isTrialExpired: false,
    daysRemaining: 7,
    trialEndsAt: null,
    isLoading: true,
    error: null,
    canSendMessage: true,
    messagesUsedToday: 0,
    messageLimit: -1,
    showUpgradePrompt: false,
  });

  // Initialize anonymous user
  const initUser = trpc.trial.initializeUser.useMutation();
  const checkMessageLimit = trpc.trial.checkMessageLimit.useMutation();

  // Initialize on mount
  useEffect(() => {
    const anonymousId = getAnonymousId();
    
    initUser.mutate(
      { anonymousId },
      {
        onSuccess: (data) => {
          setState((prev) => ({
            ...prev,
            userId: data.userId,
            anonymousId,
            tier: data.tier,
            isTrialActive: data.tier === "trial" && !data.isTrialExpired,
            isTrialExpired: data.isTrialExpired,
            daysRemaining: data.daysRemaining,
            trialEndsAt: data.trialEndsAt ? new Date(data.trialEndsAt) : null,
            isLoading: false,
            showUpgradePrompt: data.isTrialExpired && data.tier !== "basic" && data.tier !== "premium" && data.tier !== "elite",
          }));
        },
        onError: (error) => {
          console.error("Failed to initialize user:", error);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error.message,
          }));
        },
      }
    );
  }, []);

  // Check if user can send a message
  const checkCanSendMessage = useCallback(async (): Promise<boolean> => {
    if (!state.userId) return false;

    return new Promise((resolve) => {
      checkMessageLimit.mutate(
        { userId: state.userId! },
        {
          onSuccess: (data) => {
            setState((prev) => ({
              ...prev,
              canSendMessage: data.allowed,
              messagesUsedToday: data.messagesUsedToday || 0,
              messageLimit: data.limit || -1,
              showUpgradePrompt: !data.allowed,
            }));
            resolve(data.allowed);
          },
          onError: () => {
            resolve(false);
          },
        }
      );
    });
  }, [state.userId, checkMessageLimit]);

  // Dismiss upgrade prompt
  const dismissUpgradePrompt = useCallback(() => {
    setState((prev) => ({ ...prev, showUpgradePrompt: false }));
  }, []);

  return {
    ...state,
    checkCanSendMessage,
    dismissUpgradePrompt,
  };
}

export default useTrialUser;
