'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Building2, CreditCard, Users, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { detectSubdomain } from '@/lib/subdomain';
import { OrganizationDashboard } from '@/components/subdomain/organization-dashboard';

export default function DashboardPage() {
  const { user } = useUser();
  const [subdomainInfo, setSubdomainInfo] = useState<{
    isSubdomain: boolean;
    subdomain: string | null;
  } | null>(null);

  useEffect(() => {
    const info = detectSubdomain();
    setSubdomainInfo(info);
  }, []);

  // Loading state
  if (!subdomainInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // If accessing via subdomain, show organization-specific dashboard
  if (subdomainInfo.isSubdomain && subdomainInfo.subdomain) {
    return <OrganizationDashboard subdomain={subdomainInfo.subdomain} />;
  }

  // Main platform dashboard (localhost:3000/dashboard)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your organizations and subscriptions
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Link href="/create-organization">
            <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Create Organization
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Set up a new organization in 3 simple steps
              </p>
            </div>
          </Link>

          <Link href="/profile/organizations">
            <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-purple-500 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                My Organizations
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                View and manage all your organizations
              </p>
            </div>
          </Link>

          <Link href="/pricing">
            <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-green-500 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                View Pricing
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Explore plans and upgrade your subscription
              </p>
            </div>
          </Link>
        </div>

        {/* Features Overview */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
          <p className="mt-2 text-gray-600">
            Follow these steps to set up your first organization
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-start">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                1
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">
                  Create Your Organization
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Fill in your company details, verify your email, and choose a unique orgname
                </p>
                <Link
                  href="/create-organization"
                  className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Start Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600">
                2
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">
                  Select a Subscription Plan
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Choose from Starter, Professional, or Enterprise plans to activate your subdomain
                </p>
                <Link
                  href="/pricing"
                  className="mt-2 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  View Plans
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600">
                3
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">
                  Access Your Subdomain
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Once activated, access your organization at orgname.{process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards (Placeholder) */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Organizations</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
