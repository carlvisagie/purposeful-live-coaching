/**
 * EVENT TRACKING HOOK
 * 
 * Part of the Unified Client Profile - captures EVERY interaction to better
 * understand and help clients.
 * 
 * Usage:
 * 
 * const { trackClick, trackPageView, trackFeature, trackScroll } = useEventTracking();
 * 
 * // Track a button click
 * <button onClick={(e) => trackClick(e, 'start_meditation')}>Start</button>
 * 
 * // Track page view (automatic in most cases)
 * useEffect(() => { trackPageView('/dashboard', 'Dashboard'); }, []);
 * 
 * // Track feature usage
 * trackFeature('journal', 'start');
 * trackFeature('journal', 'complete', { wordCount: 250 });
 */

import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trpc } from '../_core/trpc';
import { useAuth } from '../contexts/AuthContext';

// Generate a unique session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
};

// Get device info
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  
  if (/Mobile|Android|iPhone/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/iPad|Tablet/i.test(ua)) {
    deviceType = 'tablet';
  }
  
  let browserName = 'unknown';
  if (ua.includes('Chrome')) browserName = 'Chrome';
  else if (ua.includes('Firefox')) browserName = 'Firefox';
  else if (ua.includes('Safari')) browserName = 'Safari';
  else if (ua.includes('Edge')) browserName = 'Edge';
  
  return {
    deviceType,
    browserName,
    screenSize: `${window.screen.width}x${window.screen.height}`,
  };
};

export interface TrackEventOptions {
  eventLabel?: string;
  componentName?: string;
  elementId?: string;
  elementText?: string;
  metadata?: Record<string, any>;
  sentimentHint?: 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited';
  engagementLevel?: 'high' | 'medium' | 'low' | 'abandoning';
}

export function useEventTracking() {
  const { user } = useAuth();
  const location = useLocation();
  const trackEventMutation = trpc.eventTracking.trackEvent.useMutation();
  const startSessionMutation = trpc.eventTracking.startSession.useMutation();
  const endSessionMutation = trpc.eventTracking.endSession.useMutation();
  
  const pageStartTime = useRef<number>(Date.now());
  const scrollDepth = useRef<number>(0);
  const sessionStarted = useRef<boolean>(false);
  
  // Get client ID from user
  const clientId = user?.clientId;
  
  // Start session on mount
  useEffect(() => {
    if (clientId && !sessionStarted.current) {
      sessionStarted.current = true;
      const deviceInfo = getDeviceInfo();
      
      startSessionMutation.mutate({
        clientId,
        sessionId: getSessionId(),
        deviceType: deviceInfo.deviceType,
        browserName: deviceInfo.browserName,
        screenSize: deviceInfo.screenSize,
        entryPage: location.pathname,
        referrer: document.referrer || undefined,
      });
    }
    
    // End session on unmount/close
    return () => {
      if (clientId && sessionStarted.current) {
        endSessionMutation.mutate({
          sessionId: getSessionId(),
          exitPage: location.pathname,
        });
      }
    };
  }, [clientId]);
  
  // Track page views automatically
  useEffect(() => {
    if (clientId) {
      pageStartTime.current = Date.now();
      scrollDepth.current = 0;
      
      trackPageView(location.pathname, document.title);
    }
  }, [location.pathname, clientId]);
  
  // Track scroll depth
  useEffect(() => {
    if (!clientId) return;
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const currentDepth = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
      
      if (currentDepth > scrollDepth.current) {
        scrollDepth.current = currentDepth;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [clientId]);
  
  // Track visibility changes (tab switches, minimizing)
  useEffect(() => {
    if (!clientId) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('view', 'session', 'tab_hidden', {
          metadata: { timeOnPage: Math.round((Date.now() - pageStartTime.current) / 1000) },
        });
      } else {
        trackEvent('view', 'session', 'tab_visible', {});
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [clientId]);
  
  /**
   * Core event tracking function
   */
  const trackEvent = useCallback((
    eventType: 'click' | 'view' | 'scroll' | 'input' | 'navigation' | 'feature' | 'error' | 'custom',
    eventCategory: 'ui' | 'feature' | 'content' | 'session' | 'conversion' | 'error',
    eventAction: string,
    options: TrackEventOptions = {}
  ) => {
    if (!clientId) return;
    
    const deviceInfo = getDeviceInfo();
    const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
    
    trackEventMutation.mutate({
      clientId,
      eventType,
      eventCategory,
      eventAction,
      eventLabel: options.eventLabel,
      pagePath: location.pathname,
      pageTitle: document.title,
      componentName: options.componentName,
      elementId: options.elementId,
      elementText: options.elementText,
      sessionId: getSessionId(),
      timeOnPage,
      scrollDepth: scrollDepth.current,
      deviceType: deviceInfo.deviceType,
      browserName: deviceInfo.browserName,
      screenSize: deviceInfo.screenSize,
      metadata: options.metadata,
      sentimentHint: options.sentimentHint,
      engagementLevel: options.engagementLevel,
    });
  }, [clientId, location.pathname, trackEventMutation]);
  
  /**
   * Track a click event
   */
  const trackClick = useCallback((
    event: React.MouseEvent<HTMLElement>,
    actionName: string,
    options: TrackEventOptions = {}
  ) => {
    const target = event.currentTarget;
    
    trackEvent('click', 'ui', actionName, {
      ...options,
      elementId: target.id || undefined,
      elementText: target.textContent?.substring(0, 100) || undefined,
    });
  }, [trackEvent]);
  
  /**
   * Track a page view
   */
  const trackPageView = useCallback((
    pagePath: string,
    pageTitle?: string
  ) => {
    trackEvent('view', 'content', 'page_view', {
      eventLabel: pagePath,
      metadata: { pageTitle },
    });
  }, [trackEvent]);
  
  /**
   * Track feature usage
   */
  const trackFeature = useCallback((
    featureName: string,
    action: 'start' | 'complete' | 'abandon' | 'interact',
    options: TrackEventOptions = {}
  ) => {
    trackEvent('feature', 'feature', `feature_${action}`, {
      ...options,
      eventLabel: featureName,
    });
  }, [trackEvent]);
  
  /**
   * Track navigation
   */
  const trackNavigation = useCallback((
    destination: string,
    source: string,
    options: TrackEventOptions = {}
  ) => {
    trackEvent('navigation', 'ui', 'navigate', {
      ...options,
      eventLabel: destination,
      metadata: { ...options.metadata, source },
    });
  }, [trackEvent]);
  
  /**
   * Track form input (for engagement, not content)
   */
  const trackInput = useCallback((
    fieldName: string,
    action: 'focus' | 'blur' | 'change',
    options: TrackEventOptions = {}
  ) => {
    trackEvent('input', 'ui', `input_${action}`, {
      ...options,
      eventLabel: fieldName,
    });
  }, [trackEvent]);
  
  /**
   * Track conversion events
   */
  const trackConversion = useCallback((
    conversionType: string,
    value?: number,
    options: TrackEventOptions = {}
  ) => {
    trackEvent('custom', 'conversion', conversionType, {
      ...options,
      metadata: { ...options.metadata, value },
      engagementLevel: 'high',
    });
  }, [trackEvent]);
  
  /**
   * Track errors
   */
  const trackError = useCallback((
    errorType: string,
    errorMessage: string,
    options: TrackEventOptions = {}
  ) => {
    trackEvent('error', 'error', errorType, {
      ...options,
      metadata: { ...options.metadata, errorMessage },
      sentimentHint: 'frustrated',
    });
  }, [trackEvent]);
  
  /**
   * Track scroll milestones (25%, 50%, 75%, 100%)
   */
  const trackScrollMilestone = useCallback((
    milestone: 25 | 50 | 75 | 100
  ) => {
    trackEvent('scroll', 'content', `scroll_${milestone}`, {
      metadata: { milestone },
      engagementLevel: milestone >= 75 ? 'high' : 'medium',
    });
  }, [trackEvent]);
  
  /**
   * Track time spent (call when leaving page or at intervals)
   */
  const trackTimeSpent = useCallback((
    seconds: number,
    options: TrackEventOptions = {}
  ) => {
    let engagementLevel: 'high' | 'medium' | 'low' = 'low';
    if (seconds > 120) engagementLevel = 'high';
    else if (seconds > 30) engagementLevel = 'medium';
    
    trackEvent('custom', 'session', 'time_spent', {
      ...options,
      metadata: { ...options.metadata, seconds },
      engagementLevel,
    });
  }, [trackEvent]);
  
  return {
    trackEvent,
    trackClick,
    trackPageView,
    trackFeature,
    trackNavigation,
    trackInput,
    trackConversion,
    trackError,
    trackScrollMilestone,
    trackTimeSpent,
  };
}

/**
 * Higher-order component to wrap any component with click tracking
 */
export function withClickTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  actionName: string
) {
  return function TrackedComponent(props: P & { onClick?: (e: React.MouseEvent<HTMLElement>) => void }) {
    const { trackClick } = useEventTracking();
    
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      trackClick(e, actionName);
      props.onClick?.(e);
    };
    
    const Component = WrappedComponent as React.ComponentType<any>;
    return <Component {...props} onClick={handleClick} />;
  };
}
