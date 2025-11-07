'use client';

import { Card } from '@/components/ui/card';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      name: 'Monthly User Report',
      description: 'Detailed breakdown of user activity and growth',
      date: '2024-10-01',
      type: 'User Analytics',
      size: '2.4 MB',
      status: 'Ready',
    },
    {
      id: 2,
      name: 'Revenue Summary Q3',
      description: 'Quarterly revenue analysis and projections',
      date: '2024-09-30',
      type: 'Financial',
      size: '1.8 MB',
      status: 'Ready',
    },
    {
      id: 3,
      name: 'Performance Metrics',
      description: 'System performance and uptime statistics',
      date: '2024-10-15',
      type: 'Technical',
      size: '3.2 MB',
      status: 'Processing',
    },
    {
      id: 4,
      name: 'Customer Engagement',
      description: 'User engagement and retention metrics',
      date: '2024-10-10',
      type: 'Marketing',
      size: '1.5 MB',
      status: 'Ready',
    },
    {
      id: 5,
      name: 'Security Audit',
      description: 'Security incidents and compliance report',
      date: '2024-10-05',
      type: 'Security',
      size: '4.1 MB',
      status: 'Ready',
    },
  ];

  const reportTypes = [
    { name: 'User Analytics', count: 12, color: 'bg-blue-500' },
    { name: 'Financial', count: 8, color: 'bg-green-500' },
    { name: 'Technical', count: 15, color: 'bg-purple-500' },
    { name: 'Marketing', count: 6, color: 'bg-orange-500' },
    { name: 'Security', count: 4, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate and download comprehensive reports
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Report Type Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {reportTypes.map((type) => (
          <Card key={type.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{type.name}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{type.count}</p>
              </div>
              <div className={`${type.color} rounded-full p-3`}>
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Schedule Report</h3>
              <p className="text-sm text-gray-500">Set up automated reports</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Custom Report</h3>
              <p className="text-sm text-gray-500">Create custom analytics</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-purple-100 p-3">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Export Data</h3>
              <p className="text-sm text-gray-500">Download raw data</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports List */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col gap-4 p-6 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{report.name}</h4>
                  <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {report.date}
                    </span>
                    <span>•</span>
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    report.status === 'Ready'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {report.status}
                </span>
                {report.status === 'Ready' && (
                  <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Export Options</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <button className="flex flex-col items-center rounded-lg border-2 border-gray-200 p-6 transition-colors hover:border-primary hover:bg-gray-50">
            <FileText className="h-8 w-8 text-gray-600" />
            <span className="mt-2 font-medium text-gray-900">PDF</span>
            <span className="mt-1 text-xs text-gray-500">Portable Document</span>
          </button>
          <button className="flex flex-col items-center rounded-lg border-2 border-gray-200 p-6 transition-colors hover:border-primary hover:bg-gray-50">
            <FileText className="h-8 w-8 text-gray-600" />
            <span className="mt-2 font-medium text-gray-900">Excel</span>
            <span className="mt-1 text-xs text-gray-500">Spreadsheet</span>
          </button>
          <button className="flex flex-col items-center rounded-lg border-2 border-gray-200 p-6 transition-colors hover:border-primary hover:bg-gray-50">
            <FileText className="h-8 w-8 text-gray-600" />
            <span className="mt-2 font-medium text-gray-900">CSV</span>
            <span className="mt-1 text-xs text-gray-500">Raw Data</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
