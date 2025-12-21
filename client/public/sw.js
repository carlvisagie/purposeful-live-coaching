/**
 * Service Worker for Push Notifications
 * Purposeful Live Coaching Platform
 * 
 * Handles:
 * - Daily check-in reminders
 * - Streak maintenance alerts
 * - Session reminders
 * - Wellness tips
 */

const CACHE_NAME = 'purposeful-coaching-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installed');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated');
  event.waitUntil(clients.claim());
});

// Push notification received
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let data = {
    title: 'Purposeful Coaching',
    body: 'Time for your daily check-in!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'daily-reminder',
    data: {
      url: '/',
      type: 'reminder'
    }
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    tag: data.tag || 'notification',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/' },
    actions: getActionsForType(data.data?.type),
    requireInteraction: data.data?.type === 'session-reminder'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Get notification actions based on type
function getActionsForType(type) {
  switch (type) {
    case 'daily-checkin':
      return [
        { action: 'checkin', title: '✓ Check In Now', icon: '/icons/check.png' },
        { action: 'snooze', title: '⏰ Remind Later', icon: '/icons/snooze.png' }
      ];
    case 'streak-warning':
      return [
        { action: 'checkin', title: '🔥 Keep Streak', icon: '/icons/fire.png' },
        { action: 'dismiss', title: 'Dismiss', icon: '/icons/x.png' }
      ];
    case 'session-reminder':
      return [
        { action: 'join', title: '📹 Join Session', icon: '/icons/video.png' },
        { action: 'reschedule', title: '📅 Reschedule', icon: '/icons/calendar.png' }
      ];
    case 'just-talk':
      return [
        { action: 'talk', title: '💬 Talk Now', icon: '/icons/chat.png' },
        { action: 'dismiss', title: 'Maybe Later', icon: '/icons/x.png' }
      ];
    default:
      return [
        { action: 'open', title: 'Open App', icon: '/icons/app.png' }
      ];
  }
}

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  let url = '/';
  
  switch (event.action) {
    case 'checkin':
      url = '/wellness?action=checkin';
      break;
    case 'join':
      url = event.notification.data?.sessionUrl || '/sessions';
      break;
    case 'reschedule':
      url = '/booking';
      break;
    case 'talk':
      url = '/just-talk';
      break;
    case 'snooze':
      // Schedule another notification in 30 minutes
      scheduleSnoozeReminder();
      return;
    default:
      url = event.notification.data?.url || '/';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Schedule snooze reminder (30 minutes)
function scheduleSnoozeReminder() {
  // In a real implementation, this would call the server to schedule
  // For now, we'll use the notification API timeout
  setTimeout(() => {
    self.registration.showNotification('Reminder', {
      body: "You asked to be reminded - time for your check-in!",
      icon: '/icon-192.png',
      tag: 'snooze-reminder',
      data: { url: '/wellness?action=checkin', type: 'daily-checkin' }
    });
  }, 30 * 60 * 1000); // 30 minutes
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-checkins') {
    event.waitUntil(syncCheckins());
  }
});

async function syncCheckins() {
  // Sync any offline check-ins when back online
  const cache = await caches.open(CACHE_NAME);
  const pendingCheckins = await cache.match('pending-checkins');
  
  if (pendingCheckins) {
    const checkins = await pendingCheckins.json();
    for (const checkin of checkins) {
      try {
        await fetch('/api/wellness/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checkin)
        });
      } catch (e) {
        console.error('[SW] Failed to sync checkin:', e);
      }
    }
    await cache.delete('pending-checkins');
  }
}

// Periodic background sync for daily reminders
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(checkAndSendDailyReminder());
  }
});

async function checkAndSendDailyReminder() {
  // Check if user has already checked in today
  try {
    const response = await fetch('/api/wellness/today-status');
    const status = await response.json();
    
    if (!status.checkedInToday) {
      self.registration.showNotification('Daily Check-In', {
        body: "Take a moment to check in with yourself. How are you feeling today?",
        icon: '/icon-192.png',
        tag: 'daily-checkin',
        data: { url: '/wellness?action=checkin', type: 'daily-checkin' }
      });
    }
  } catch (e) {
    console.error('[SW] Failed to check daily status:', e);
  }
}
