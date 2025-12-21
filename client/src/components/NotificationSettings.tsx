/**
 * Notification Settings Component
 * 
 * Allows users to:
 * - Enable/disable push notifications
 * - Configure notification preferences
 * - Set quiet hours
 * - Test notifications
 * 
 * Research: Users who enable notifications have 2-3x higher engagement
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, BellOff, BellRing, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";

interface NotificationSettingsProps {
  className?: string;
  compact?: boolean;
}

export default function NotificationSettings({ className, compact = false }: NotificationSettingsProps) {
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    updatePreferences,
    sendTestNotification
  } = usePushNotifications();

  const [preferences, setPreferences] = useState({
    dailyCheckin: true,
    streakWarnings: true,
    sessionReminders: true,
    justTalkPrompts: false,
    wellnessTips: true,
    quietHoursStart: 22,
    quietHoursEnd: 8,
    reminderTime: "09:00"
  });

  const [testSent, setTestSent] = useState(false);

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe(preferences);
    }
  };

  const handlePreferenceChange = async (key: string, value: boolean | number | string) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    
    if (isSubscribed) {
      await updatePreferences({ [key]: value });
    }
  };

  const handleTestNotification = async () => {
    const success = await sendTestNotification();
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  // Not supported message
  if (!isSupported) {
    return (
      <Card className={cn("border-yellow-200 bg-yellow-50", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <p>Push notifications are not supported in this browser.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact mode for onboarding
  if (compact) {
    return (
      <Card className={cn("border-2", isSubscribed ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isSubscribed ? (
                <BellRing className="h-6 w-6 text-green-600" />
              ) : (
                <Bell className="h-6 w-6 text-blue-600" />
              )}
              <div>
                <p className="font-medium">
                  {isSubscribed ? "Notifications Enabled" : "Enable Daily Reminders"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isSubscribed 
                    ? "You'll receive daily check-in reminders" 
                    : "Get reminded to check in and maintain your streak"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleToggleNotifications}
              disabled={isLoading}
              variant={isSubscribed ? "outline" : "default"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSubscribed ? (
                "Disable"
              ) : (
                "Enable"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full settings view
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how and when you receive reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <BellRing className="h-6 w-6 text-green-600" />
            ) : (
              <BellOff className="h-6 w-6 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                {isSubscribed ? "Notifications are enabled" : "Enable to receive reminders"}
              </p>
            </div>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleToggleNotifications}
            disabled={isLoading}
          />
        </div>

        {/* Permission denied warning */}
        {permission === 'denied' && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}

        {/* Notification Types */}
        {isSubscribed && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Notification Types
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="dailyCheckin" className="flex flex-col gap-1">
                  <span>Daily Check-in Reminders</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Remind me to check in each day
                  </span>
                </Label>
                <Switch
                  id="dailyCheckin"
                  checked={preferences.dailyCheckin}
                  onCheckedChange={(v) => handlePreferenceChange('dailyCheckin', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="streakWarnings" className="flex flex-col gap-1">
                  <span>Streak Warnings</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Alert me when my streak is at risk
                  </span>
                </Label>
                <Switch
                  id="streakWarnings"
                  checked={preferences.streakWarnings}
                  onCheckedChange={(v) => handlePreferenceChange('streakWarnings', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sessionReminders" className="flex flex-col gap-1">
                  <span>Session Reminders</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Remind me before scheduled sessions
                  </span>
                </Label>
                <Switch
                  id="sessionReminders"
                  checked={preferences.sessionReminders}
                  onCheckedChange={(v) => handlePreferenceChange('sessionReminders', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="justTalkPrompts" className="flex flex-col gap-1">
                  <span>Just Talk Prompts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Occasional check-ins asking how I'm doing
                  </span>
                </Label>
                <Switch
                  id="justTalkPrompts"
                  checked={preferences.justTalkPrompts}
                  onCheckedChange={(v) => handlePreferenceChange('justTalkPrompts', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="wellnessTips" className="flex flex-col gap-1">
                  <span>Wellness Tips</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive helpful wellness tips and insights
                  </span>
                </Label>
                <Switch
                  id="wellnessTips"
                  checked={preferences.wellnessTips}
                  onCheckedChange={(v) => handlePreferenceChange('wellnessTips', v)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Timing Settings */}
        {isSubscribed && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Timing
            </h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reminderTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Daily Reminder Time
                </Label>
                <Select
                  value={preferences.reminderTime}
                  onValueChange={(v) => handlePreferenceChange('reminderTime', v)}
                >
                  <SelectTrigger id="reminderTime">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BellOff className="h-4 w-4" />
                  Quiet Hours
                </Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={preferences.quietHoursStart.toString()}
                    onValueChange={(v) => handlePreferenceChange('quietHoursStart', parseInt(v))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">to</span>
                  <Select
                    value={preferences.quietHoursEnd.toString()}
                    onValueChange={(v) => handlePreferenceChange('quietHoursEnd', parseInt(v))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Notification */}
        {isSubscribed && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleTestNotification}
              disabled={isLoading || testSent}
              className="w-full"
            >
              {testSent ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Test Sent!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Notification
                </>
              )}
            </Button>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
