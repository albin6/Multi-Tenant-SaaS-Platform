'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

const performanceData = [
  { time: '00:00', requests: 120, errors: 2, latency: 45 },
  { time: '04:00', requests: 80, errors: 1, latency: 38 },
  { time: '08:00', requests: 350, errors: 5, latency: 52 },
  { time: '12:00', requests: 520, errors: 8, latency: 68 },
  { time: '16:00', requests: 480, errors: 6, latency: 61 },
  { time: '20:00', requests: 280, errors: 3, latency: 49 },
];

const deviceData = [
  { device: 'Desktop', users: 4500 },
  { device: 'Mobile', users: 3200 },
  { device: 'Tablet', users: 1800 },
];

const pageViewsData = [
  { page: 'Home', views: 12500 },
  { page: 'Dashboard', views: 8900 },
  { page: 'Products', views: 6700 },
  { page: 'About', views: 4200 },
  { page: 'Contact', views: 3100 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detailed insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">52ms</p>
              <div className="mt-2 flex items-center text-sm">
                <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600">-8.2%</span>
              </div>
            </div>
            <div className="rounded-full bg-blue-500 p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">45.2K</p>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="rounded-full bg-green-500 p-3">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Error Rate</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">0.08%</p>
              <div className="mt-2 flex items-center text-sm">
                <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600">-2.1%</span>
              </div>
            </div>
            <div className="rounded-full bg-red-500 p-3">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">99.98%</p>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600">+0.02%</span>
              </div>
            </div>
            <div className="rounded-full bg-purple-500 p-3">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Performance Over Time (24h)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="requests"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Requests"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="latency"
              stroke="#10b981"
              strokeWidth={2}
              name="Latency (ms)"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="errors"
              stroke="#ef4444"
              strokeWidth={2}
              name="Errors"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Device and Page Views */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Users by Device</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="device" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Pages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageViewsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="page" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Real-time Stats */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Real-time Statistics</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600">Active Sessions</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">1,423</div>
            <div className="mt-1 text-xs text-gray-500">Updated 5 seconds ago</div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600">Requests/minute</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">342</div>
            <div className="mt-1 text-xs text-gray-500">Updated 5 seconds ago</div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600">Avg Load Time</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">1.2s</div>
            <div className="mt-1 text-xs text-gray-500">Updated 5 seconds ago</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
