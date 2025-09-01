'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import NotificationManager from '@/components/pwa/NotificationManager';
import {
  Settings,
  Bell,
  Download,
  Wifi,
  WifiOff,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure your admin dashboard preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Configure push notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <NotificationManager />
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Notification Types</h4>
              
              <div className="space-y-3">
                {[
                  { id: 'project-updates', label: 'Project Updates', description: 'Get notified when projects are updated or completed' },
                  { id: 'customer-requests', label: 'Customer Requests', description: 'Receive alerts for new support requests' },
                  { id: 'license-expirations', label: 'License Expirations', description: 'Get reminders for upcoming license renewals' },
                  { id: 'seo-alerts', label: 'SEO Alerts', description: 'Receive notifications for SEO opportunities' },
                  { id: 'system-alerts', label: 'System Alerts', description: 'Get important system maintenance notifications' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor={item.id} className="font-medium text-gray-900">
                        {item.label}
                      </Label>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <Switch id={item.id} defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PWA & Offline Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>PWA & Offline</span>
            </CardTitle>
            <CardDescription>
              Configure progressive web app features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Offline Capabilities</h4>
              
              <div className="space-y-3">
                {[
                  { 
                    id: 'offline-mode', 
                    label: 'Offline Mode', 
                    description: 'Enable offline access to projects and customer data',
                    icon: WifiOff
                  },
                  { 
                    id: 'background-sync', 
                    label: 'Background Sync', 
                    description: 'Automatically sync data when connection is restored',
                    icon: Wifi
                  },
                  { 
                    id: 'data-caching', 
                    label: 'Data Caching', 
                    description: 'Cache frequently accessed data for faster loading',
                    icon: Download
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        <Icon className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor={item.id} className="font-medium text-gray-900">
                            {item.label}
                          </Label>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <Switch id={item.id} defaultChecked />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Storage Usage</h4>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Cached Data</span>
                  <span className="text-sm text-blue-700">12.5 MB / 50 MB</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Data cached for offline use
                </p>
              </div>

              <Button variant="outline" className="w-full">
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
          <CardDescription>
            Configure your dashboard preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Appearance</h4>
              
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="system"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label htmlFor="compact-mode" className="font-medium text-gray-900">
                  Compact Mode
                </Label>
                <Switch id="compact-mode" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Data & Privacy</h4>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label htmlFor="analytics" className="font-medium text-gray-900">
                  Usage Analytics
                </Label>
                <Switch id="analytics" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label htmlFor="error-reporting" className="font-medium text-gray-900">
                  Error Reporting
                </Label>
                <Switch id="error-reporting" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label htmlFor="auto-update" className="font-medium text-gray-900">
                  Auto Update
                </Label>
                <Switch id="auto-update" defaultChecked />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline">Cancel</Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}