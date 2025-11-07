'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Package, BarChart3, Settings, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VendorPage() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Detect subdomain from hostname
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
      const sub = parts[0];
      if (sub && sub !== 'www') {
        setSubdomain(sub);
      }
    } else if (parts.length >= 3) {
      const sub = parts[0];
      if (sub && sub !== 'www') {
        setSubdomain(sub);
      }
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {subdomain ? `${subdomain.toUpperCase()} Vendor Portal` : 'Vendor Portal'}
              </h1>
              <p className="text-xs text-gray-600">Manage your storefront</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {subdomain ? (
          <div className="mb-8 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              ✓ Connected to organization: <strong>{subdomain}</strong>
            </p>
          </div>
        ) : (
          <div className="mb-8 rounded-lg bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              ⚠ No organization subdomain detected. Please access via your organization subdomain.
            </p>
          </div>
        )}

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900">Vendor Dashboard</h2>
          <p className="mt-4 text-lg text-gray-600">
            Manage your products, track sales, and grow your business
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <Package className="mb-2 h-10 w-10 text-blue-600" />
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your product catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button className="w-full rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
                View Products
              </button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <Store className="mb-2 h-10 w-10 text-purple-600" />
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                Track and fulfill orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button className="w-full rounded-lg bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200">
                View Orders
              </button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <BarChart3 className="mb-2 h-10 w-10 text-green-600" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Sales and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button className="w-full rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200">
                View Analytics
              </button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <Settings className="mb-2 h-10 w-10 text-orange-600" />
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button className="w-full rounded-lg bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200">
                View Settings
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Total Products</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            <p className="mt-1 text-xs text-gray-500">No products yet</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            <p className="mt-1 text-xs text-gray-500">No orders yet</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">₹0</p>
            <p className="mt-1 text-xs text-gray-500">No sales yet</p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-12 rounded-lg bg-white p-8 shadow">
          <h3 className="text-2xl font-bold text-gray-900">Getting Started</h3>
          <p className="mt-2 text-gray-600">
            Welcome to your vendor portal! Here's how to get started:
          </p>
          <ol className="mt-6 space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                1
              </span>
              <span>Set up your store profile and branding</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                2
              </span>
              <span>Add your first product to the catalog</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                3
              </span>
              <span>Configure payment and shipping options</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                4
              </span>
              <span>Start accepting orders from customers</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
