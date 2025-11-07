'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { getMyOrganizations } from '@/lib/api/organization';
import {
  Building2,
  Globe,
  Calendar,
  ExternalLink,
  Plus,
  CreditCard,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Organization {
  _id: string;
  orgname: string;
  companyName: string;
  companyEmail: string;
  status: string;
  subscription?: {
    status: string;
    planId?: any;
    startDate?: string;
    endDate?: string;
  };
  createdAt: string;
}

export default function OrganizationsPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrganizations = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const result = await getMyOrganizations(token);
      setOrganizations(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; icon: React.ReactNode; label: string }
    > = {
      active: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="mr-1 h-3 w-3" />,
        label: 'Active',
      },
      pending_verification: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Loader2 className="mr-1 h-3 w-3" />,
        label: 'Pending Verification',
      },
      pending_orgname: {
        color: 'bg-blue-100 text-blue-800',
        icon: <Loader2 className="mr-1 h-3 w-3" />,
        label: 'Pending Orgname',
      },
      suspended: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="mr-1 h-3 w-3" />,
        label: 'Suspended',
      },
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getSubscriptionBadge = (subscription?: any) => {
    if (!subscription || subscription.status !== 'active') {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
          No Active Subscription
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
        <CheckCircle className="mr-1 h-3 w-3" />
        Active Subscription
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Organizations
            </h1>
            <p className="mt-1 text-gray-600">
              Manage your organizations and subscriptions
            </p>
          </div>
          <button
            onClick={() => router.push('/create-organization')}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Organization
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Organizations List */}
        {organizations.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No organizations yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first organization.
            </p>
            <button
              onClick={() => router.push('/create-organization')}
              className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Organization
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {organizations.map((org) => (
              <div
                key={org._id}
                className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {org.companyName}
                    </h3>
                    <p className="text-sm text-gray-500">{org.companyEmail}</p>
                  </div>
                  {getStatusBadge(org.status)}
                </div>

                {/* Orgname */}
                {org.orgname && (
                  <div className="mt-4 flex items-center text-sm text-gray-600">
                    <Globe className="mr-2 h-4 w-4" />
                    <span className="font-mono">{org.orgname}</span>
                  </div>
                )}

                {/* Subscription Status */}
                <div className="mt-3">
                  {getSubscriptionBadge(org.subscription)}
                </div>

                {/* Created Date */}
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Created {new Date(org.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-2">
                  {org.orgname && org.subscription?.status === 'active' && (
                    <button
                      onClick={() => {
                        const subdomainUrl = `http://${org.orgname}.${process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000'}`;
                        window.open(subdomainUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex flex-1 items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Site
                    </button>
                  )}
                  {org.orgname && org.subscription?.status !== 'active' && (
                    <button
                      onClick={() =>
                        router.push(
                          `/pricing?organizationId=${org._id}`
                        )
                      }
                      className="flex flex-1 items-center justify-center rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Activate Plan
                    </button>
                  )}
                  {org.orgname && (
                    <button
                      onClick={() => {
                        const adminUrl = `http://${org.orgname}.${process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000'}/admin`;
                        window.open(adminUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex flex-1 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Admin Panel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
