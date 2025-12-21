/**
 * Push Notifications Hook
 * 
 * Handles:
 * - Service worker registration
 * - Push subscription management
 * - Permission requests
 * - Notification preferences
 * 
 * Research: Push notifications drive 2-3x higher daily engagement
 */

import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

interface NotificationPreferences {
  dailyCheckin: boolean;
  streakWarnings: boolean;
  sessionReminders: boolean;
  justTalkPrompts: boolean;
  wellnessTips: boolean;
  quietHoursStart?: number;
  quietHoursEnd?: number;
  reminderTime?: string;
}

interface UsePushNotificationsReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  isLoading: boolean;
  error: string | null;
  subscribe: (preferences?: Partial<NotificationPreferences>) => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<boolean>;
  sendTestNotification: () => Promise<boolean>;
  requestPermission: () => Promise<NotificationPermission>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // tRPC mutations
  const { data: vapidKey } = trpc.pushNotifications.getVapidPublicKey.useQuery();
  const subscribeMutation = trpc.pushNotifications.subscribe.useMutation();
  const unsubscribeMutation = trpc.pushNotifications.unsubscribe.useMutation();
  const updatePrefsMutation = trpc.pushNotifications.updatePreferences.useMutation();
  const sendTestMutation = trpc.pushNotifications.sendTest.useMutation();

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      const supported = 
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
      
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
        
        // Register service worker
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          setSwRegistration(registration);
          
          // Check existing subscription
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (err) {
          console.error('[Push] Service worker registration failed:', err);
          setError('Failed to register service worker');
        }
      }
      
      setIsLoading(false);
    };
    
    checkSupport();
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      console.error('[Push] Permission request failed:', err);
      return 'denied';
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (preferences?: Partial<NotificationPreferences>): Promise<boolean> => {
    if (!isSupported || !swRegistration || !vapidKey) {
      setError('Push notifications not supported');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Request permission if needed
      if (permission !== 'granted') {
        const newPermission = await requestPermission();
        if (newPermission !== 'granted') {
          setError('Notification permission denied');
          setIsLoading(false);
          return false;
        }
      }
      
      // Subscribe to push manager
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey.publicKey)
      });
      
      // Send subscription to server
      await subscribeMutation.mutateAsync({
        subscription: {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
            auth: arrayBufferToBase64(subscription.getKey('auth')!)
          }
        },
        preferences: {
          dailyCheckin: preferences?.dailyCheckin ?? true,
          streakWarnings: preferences?.streakWarnings ?? true,
          sessionReminders: preferences?.sessionReminders ?? true,
          justTalkPrompts: preferences?.justTalkPrompts ?? false,
          wellnessTips: preferences?.wellnessTips ?? true,
          quietHoursStart: preferences?.quietHoursStart,
          quietHoursEnd: preferences?.quietHoursEnd
        }
      });
      
      setIsSubscribed(true);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('[Push] Subscription failed:', err);
      setError(err.message || 'Failed to subscribe');
      setIsLoading(false);
      return false;
    }
  }, [isSupported, swRegistration, vapidKey, permission, requestPermission, subscribeMutation]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!swRegistration) {
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const subscription = await swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      
      await unsubscribeMutation.mutateAsync();
      
      setIsSubscribed(false);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('[Push] Unsubscribe failed:', err);
      setError(err.message || 'Failed to unsubscribe');
      setIsLoading(false);
      return false;
    }
  }, [swRegistration, unsubscribeMutation]);

  // Update notification preferences
  const updatePreferences = useCallback(async (preferences: Partial<NotificationPreferences>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await updatePrefsMutation.mutateAsync(preferences);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('[Push] Update preferences failed:', err);
      setError(err.message || 'Failed to update preferences');
      setIsLoading(false);
      return false;
    }
  }, [updatePrefsMutation]);

  // Send test notification
  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    if (!isSubscribed) {
      setError('Not subscribed to notifications');
      return false;
    }
    
    try {
      await sendTestMutation.mutateAsync();
      return true;
    } catch (err: any) {
      console.error('[Push] Test notification failed:', err);
      setError(err.message || 'Failed to send test notification');
      return false;
    }
  }, [isSubscribed, sendTestMutation]);

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    updatePreferences,
    sendTestNotification,
    requestPermission
  };
}

// Helper: Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Helper: Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default usePushNotifications;
