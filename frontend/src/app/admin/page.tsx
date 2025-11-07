'use client';

import { Card } from '@/components/ui/card';
import {
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for charts
const userGrowthData = [
  { month: 'Jan', users: 400, active: 240 },
  { month: 'Feb', users: 600, active: 380 },
  { month: 'Mar', users: 800, active: 500 },
  { month: 'Apr', users: 1200, active: 780 },
  { month: 'May', users: 1600, active: 1100 },
  { month: 'Jun', users: 2000, active: 1400 },
];

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 19000 },
  { month: 'Mar', revenue: 15000 },
  { month: 'Apr', revenue: 25000 },
  { month: 'May', revenue: 32000 },
  { month: 'Jun', revenue: 38000 },
];

const activityData = [
  { name: 'Active', value: 68, color: '#3b82f6' },
  { name: 'Inactive', value: 22, color: '#ef4444' },
  { name: 'Pending', value: 10, color: '#f59e0b' },
];

const trafficData = [
  { source: 'Direct', visitors: 4200 },
  { source: 'Social', visitors: 3800 },
  { source: 'Referral', visitors: 2900 },
  { source: 'Organic', visitors: 5400 },
  { source: 'Paid', visitors: 2100 },
];

// Stat cards data
const stats = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'Revenue',
    value: '$38,420',
    change: '+8.2%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    title: 'Active Sessions',
    value: '1,423',
    change: '-3.1%',
    trend: 'down',
    icon: Activity,
    color: 'bg-purple-500',
  },
  {
    title: 'Conversion Rate',
    value: '24.5%',
    change: '+5.4%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here&apos;s what&apos;s happening with your application.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';

          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="mt-2 flex items-center text-sm">
                    {isPositive ? (
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={isPositive ? 'text-green-600' : 'text-red-600'}
                    >
                      {stat.change}
                    </span>
                    <span className="ml-1 text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`rounded-full ${stat.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visitors" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* User Activity Distribution */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            User Activity Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  User
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Action
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Time
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  user: 'John Doe',
                  action: 'Created new project',
                  time: '5 mins ago',
                  status: 'Success',
                },
                {
                  user: 'Jane Smith',
                  action: 'Updated profile',
                  time: '12 mins ago',
                  status: 'Success',
                },
                {
                  user: 'Mike Johnson',
                  action: 'Uploaded document',
                  time: '1 hour ago',
                  status: 'Pending',
                },
                {
                  user: 'Sarah Williams',
                  action: 'Deleted file',
                  time: '2 hours ago',
                  status: 'Warning',
                },
                {
                  user: 'Tom Brown',
                  action: 'Logged in',
                  time: '3 hours ago',
                  status: 'Success',
                },
              ].map((activity, index) => (
                <tr key={index}>
                  <td className="py-3 text-sm font-medium text-gray-900">
                    {activity.user}
                  </td>
                  <td className="py-3 text-sm text-gray-600">{activity.action}</td>
                  <td className="py-3 text-sm text-gray-600">{activity.time}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        activity.status === 'Success'
                          ? 'bg-green-100 text-green-800'
                          : activity.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
