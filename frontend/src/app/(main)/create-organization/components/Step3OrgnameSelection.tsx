'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  checkOrgnameAvailability,
  setOrgname,
} from '@/lib/api/organization';
import {
  Globe,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface Step3Props {
  organizationId: string;
  companyName: string;
  onComplete: (orgname: string) => void;
}

export default function Step3OrgnameSelection({
  organizationId,
  companyName,
  onComplete,
}: Step3Props) {
  const { getToken } = useAuth();
  const [orgname, setOrgnameValue] = useState('');
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availability, setAvailability] = useState<{
    available: boolean;
    message: string;
  } | null>(null);

  // Debounced availability check
  useEffect(() => {
    if (orgname.length < 3) {
      setAvailability(null);
      return;
    }

    setChecking(true);
    const timer = setTimeout(async () => {
      try {
        const result = await checkOrgnameAvailability(orgname);
        setAvailability(result.data);
      } catch (err) {
        console.error('Error checking availability:', err);
      } finally {
        setChecking(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [orgname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!availability?.available) {
      setError('Please choose an available orgname');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const result = await setOrgname(
        {
          organizationId,
          orgname,
        },
        token
      );

      onComplete(result.data.orgname);
    } catch (err: any) {
      setError(err.message || 'Failed to set orgname');
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityIndicator = () => {
    if (orgname.length < 3) {
      return (
        <div className="text-sm text-gray-500">
          <AlertCircle className="mr-1 inline h-4 w-4" />
          Minimum 3 characters
        </div>
      );
    }

    if (checking) {
      return (
        <div className="text-sm text-gray-500">
          <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />
          Checking availability...
        </div>
      );
    }

    if (availability) {
      return availability.available ? (
        <div className="text-sm text-green-600">
          <CheckCircle className="mr-1 inline h-4 w-4" />
          {availability.message}
        </div>
      ) : (
        <div className="text-sm text-red-600">
          <XCircle className="mr-1 inline h-4 w-4" />
          {availability.message}
        </div>
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <Globe className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Choose Your Orgname
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          This will be your unique identifier and subdomain URL
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Orgname *
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            required
            value={orgname}
            onChange={(e) =>
              setOrgnameValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
            }
            pattern="[a-z0-9-]+"
            minLength={3}
            maxLength={50}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="acme-corp"
          />
        </div>
        <div className="mt-2">{getAvailabilityIndicator()}</div>
        <p className="mt-2 text-xs text-gray-500">
          Only lowercase letters, numbers, and hyphens. Cannot start or end with
          a hyphen.
        </p>
      </div>

      {/* Preview URL */}
      {orgname && (
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Your subdomain will be:</p>
          <p className="mt-1 text-lg font-semibold text-blue-600">
            {orgname}.{process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000'}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || checking || !availability?.available}
        className="flex w-full items-center justify-center rounded-md bg-purple-600 px-4 py-3 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating Organization...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-5 w-5" />
            Complete Setup
          </>
        )}
      </button>
    </form>
  );
}
