'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';

interface NotificationManagerProps {
  onNotification?: (data: any) => void;
}

export default function NotificationManager({ onNotification }: NotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Check existing subscription
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await subscribeToPush();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      // Send subscription to your server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Notify server about unsubscribe
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
    }
  };

  const sendTestNotification = async () => {
    if (permission !== 'granted') return;

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Test Notification', {
        body: 'This is a test notification from DFM Admin',
        icon: '/icon-192x192.png',
        tag: 'test-notification',
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
        <p className="text-yellow-800">Push notifications are not supported in this browser.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">Push Notifications</h3>
          <p className="text-sm text-gray-600">
            {permission === 'granted'
              ? 'Notifications are enabled'
              : permission === 'denied'
              ? 'Notifications are blocked'
              : 'Enable notifications for updates'}
          </p>
        </div>
        
        {permission === 'default' && (
          <Button onClick={requestPermission} size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Enable
          </Button>
        )}
        
        {permission === 'granted' && isSubscribed && (
          <div className="flex items-center space-x-2">
            <Button onClick={sendTestNotification} variant="outline" size="sm">
              Test
            </Button>
            <Button onClick={unsubscribeFromPush} variant="outline" size="sm">
              <BellOff className="h-4 w-4 mr-2" />
              Disable
            </Button>
          </div>
        )}
      </div>

      {permission === 'denied' && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-sm text-red-800">
            Notifications are blocked. Please enable them in your browser settings.
          </p>
        </div>
      )}

      {permission === 'granted' && isSubscribed && (
        <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Notifications are enabled. You'll receive updates about projects, customers, and system alerts.
          </p>
        </div>
      )}
    </div>
  );
}