'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

// localStorage key for persisting notification state
const NOTIFICATION_ENABLED_KEY = 'chauffeurtop-notifications-enabled';

export function PushNotificationSetup() {
  const [permission, setPermission] = useState<PermissionState>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  const checkNotificationSupport = async () => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      setSupported(false);
      setPermission('unsupported');
      return;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      setSupported(false);
      setPermission('unsupported');
      return;
    }

    // Get current permission state
    setPermission(Notification.permission as PermissionState);

    // Check localStorage for persisted notification state (primary source of truth)
    const savedState = localStorage.getItem(NOTIFICATION_ENABLED_KEY);
    
    if (savedState === 'true' && Notification.permission === 'granted') {
      // User previously enabled notifications and permission is still granted
      setIsSubscribed(true);
      
      // Ensure service worker is registered
      try {
        await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      } catch (error) {
        console.error('Error registering service worker:', error);
      }
    } else if (Notification.permission === 'granted') {
      // Permission granted but no localStorage state - check push subscription as fallback
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setIsSubscribed(true);
          localStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    }
  };

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('Service Worker registered:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  };

  const subscribeToPush = async () => {
    setLoading(true);
    try {
      // Register service worker first
      const registration = await registerServiceWorker();
      await navigator.serviceWorker.ready;

      // Request notification permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult as PermissionState);

      if (permissionResult !== 'granted') {
        toast.error('Notification permission denied');
        return;
      }

      // Subscribe to push notifications
      // Note: For production, you'll need VAPID keys
      // For now, we'll just enable notifications without push server
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // In production, add your VAPID public key here:
        // applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      }).catch(() => {
        // If push subscription fails (no VAPID key), still enable local notifications
        console.log('Push subscription not available, using local notifications');
        return null;
      });

      if (subscription) {
        // Save subscription to Supabase
        const { error } = await supabase.from('push_subscriptions').upsert({
          endpoint: subscription.endpoint,
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh') || new ArrayBuffer(0)))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth') || new ArrayBuffer(0)))),
        }, {
          onConflict: 'endpoint'
        });

        if (error) {
          console.error('Error saving subscription:', error);
        }
      }

      // Persist enabled state to localStorage
      localStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
      
      setIsSubscribed(true);
      toast.success('Notifications enabled! You\'ll be notified of new bookings.');

    } catch (error) {
      console.error('Error subscribing to push:', error);
      toast.error('Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove from Supabase
        await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint);
      }

      // Remove from localStorage
      localStorage.removeItem(NOTIFICATION_ENABLED_KEY);
      
      setIsSubscribed(false);
      toast.success('Notifications disabled');
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Failed to disable notifications');
    } finally {
      setLoading(false);
    }
  };

  // Test notification
  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('ChauffeurTop Test', {
        body: 'Notifications are working! You\'ll receive alerts for new bookings.',
        icon: '/logo/fav.ico',
        badge: '/logo/fav.ico',
      });
      toast.success('Test notification sent!');
    }
  };

  if (!supported) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-300">Push notifications are not supported in this browser.</p>
            <p className="text-xs text-gray-500 mt-1">Try using Safari or Chrome on your device.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 border border-amber-500/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${isSubscribed ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
            {isSubscribed ? (
              <Bell className="w-5 h-5 text-green-400" />
            ) : (
              <BellOff className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              Push Notifications
              {isSubscribed && <Check className="w-4 h-4 text-green-400" />}
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {isSubscribed 
                ? 'You\'ll receive instant alerts for new quotes and bookings'
                : 'Enable to get notified when customers submit quotes or confirm bookings'
              }
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isSubscribed && (
            <button
              onClick={sendTestNotification}
              className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              Test
            </button>
          )}
          <button
            onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
            disabled={loading || permission === 'denied'}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubscribed
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : isSubscribed ? (
              'Disable'
            ) : (
              'Enable Notifications'
            )}
          </button>
        </div>
      </div>

      {permission === 'denied' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">
            Notifications are blocked. Please enable them in your browser settings to receive alerts.
          </p>
        </div>
      )}
    </div>
  );
}
