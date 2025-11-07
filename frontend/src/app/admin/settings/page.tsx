'use client';

import { Card } from '@/components/ui/card';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Database,
  Mail,
  Key,
  Users,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your application settings and preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="p-6">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-2">
              <SettingsIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Application Name
              </label>
              <input
                type="text"
                defaultValue="Enterprise App"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <input
                type="email"
                defaultValue="admin@enterprise.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Zone
              </label>
              <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option>UTC (GMT+0)</option>
                <option>EST (GMT-5)</option>
                <option>PST (GMT-8)</option>
                <option>IST (GMT+5:30)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-full bg-purple-100 p-2">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Browser push alerts</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">System Alerts</p>
                <p className="text-sm text-gray-500">Critical system updates</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition" />
              </button>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-full bg-red-100 p-2">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add extra security layer</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-500">30 minutes</p>
              </div>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">API Keys</p>
                <p className="text-sm text-gray-500">Manage API access</p>
              </div>
              <button className="flex items-center rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                <Key className="mr-1 h-4 w-4" />
                Manage
              </button>
            </div>
          </div>
        </Card>

        {/* Integrations */}
        <Card className="p-6">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-full bg-green-100 p-2">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Email Service</p>
                  <p className="text-sm text-gray-500">Connected</p>
                </div>
              </div>
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Database Backup</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">User Analytics</p>
                  <p className="text-sm text-gray-500">Disconnected</p>
                </div>
              </div>
              <span className="inline-flex h-2 w-2 rounded-full bg-gray-300"></span>
            </div>
          </div>
        </Card>
      </div>

      {/* Database Settings */}
      <Card className="p-6">
        <div className="mb-4 flex items-center space-x-3">
          <div className="rounded-full bg-orange-100 p-2">
            <Database className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Database Management</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Total Records</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">45,234</p>
            <p className="mt-1 text-xs text-gray-500">+2.5% this week</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Database Size</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">2.4 GB</p>
            <p className="mt-1 text-xs text-gray-500">18% capacity</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Last Backup</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">2h ago</p>
            <p className="mt-1 text-xs text-gray-500">Automated daily</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Database className="mr-2 h-4 w-4" />
            Backup Now
          </button>
          <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Optimize Database
          </button>
          <button className="inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
            Clear Cache
          </button>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90">
          Save Changes
        </button>
      </div>
    </div>
  );
}
