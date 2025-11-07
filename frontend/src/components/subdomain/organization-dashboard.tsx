'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Organization {
  _id: string;
  orgname: string;
  companyName: string;
  industry?: string;
  subscription?: {
    status: string;
  };
}

interface OrganizationDashboardProps {
  subdomain: string;
}

export function OrganizationDashboard({ subdomain }: OrganizationDashboardProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchOrganization = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(
        `${apiUrl}/organizations/by-orgname/${subdomain}`
      );

      if (!response.ok) {
        throw new Error('Organization not found');
      }

      const data = await response.json();
      setOrganization(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Organization Not Found</CardTitle>
            <CardDescription>
              The organization &quot;{subdomain}&quot; could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')}
              className="w-full"
            >
              Go to Main Platform
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = organization.subscription?.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-lg">
              {subdomain.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {organization.companyName || subdomain.toUpperCase()} Dashboard
              </h1>
              {isActive ? (
                <p className="text-xs text-green-600">● Active Subscription</p>
              ) : (
                <p className="text-xs text-yellow-600">● Inactive Subscription</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
            >
              Storefront
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/vendor')}
            >
              Vendor Portal
            </Button>
            <Button size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to {organization.companyName || subdomain}
          </h2>
          <p className="mt-2 text-gray-600">
            Organization Dashboard - Manage your business operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0</div>
              <p className="text-xs text-muted-foreground">No sales yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">+0 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your organization efficiently</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => router.push('/vendor')}
              >
                <Package className="h-8 w-8 mb-2 text-blue-600" />
                <span className="font-semibold">Manage Products</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <ShoppingCart className="h-8 w-8 mb-2 text-purple-600" />
                <span className="font-semibold">View Orders</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <BarChart3 className="h-8 w-8 mb-2 text-green-600" />
                <span className="font-semibold">Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <Users className="h-8 w-8 mb-2 text-orange-600" />
                <span className="font-semibold">Customers</span>
              </Button>
            </CardContent>
          </Card>

          {/* Organization Info */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Company Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {organization.companyName || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Organization Name</p>
                <p className="text-lg font-semibold text-gray-900">{subdomain}</p>
              </div>
              {organization.industry && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Industry</p>
                  <p className="text-lg font-semibold text-gray-900">{organization.industry}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Subscription Status</p>
                <p className={`text-lg font-semibold ${isActive ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes to your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No recent activity</p>
              <p className="text-sm mt-1">Activity will appear here as you use the platform</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
