'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createOrganizationPhase1 } from '@/lib/api/organization';
import { Building2, Mail, MapPin, Loader2 } from 'lucide-react';

interface Step1Props {
  onComplete: (data: {
    organizationId: string;
    companyName: string;
    verificationToken?: string;
  }) => void;
}

export default function Step1CompanyInfo({ onComplete }: Step1Props) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const result = await createOrganizationPhase1(
        {
          companyName: formData.companyName,
          companyEmail: formData.companyEmail,
          companyAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zipCode: formData.zipCode,
          },
        },
        token
      );

      onComplete({
        organizationId: result.data.organizationId,
        companyName: result.data.companyName,
        verificationToken: result.data.verificationToken,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter your company details to get started
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <Building2 className="mr-2 inline h-4 w-4" />
          Company Name *
        </label>
        <input
          type="text"
          required
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Acme Corporation"
        />
      </div>

      {/* Company Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <Mail className="mr-2 inline h-4 w-4" />
          Company Email *
        </label>
        <input
          type="email"
          required
          value={formData.companyEmail}
          onChange={(e) =>
            setFormData({ ...formData, companyEmail: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="contact@acme.com"
        />
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="mr-2 inline h-4 w-4" />
          Company Address *
        </label>

        <input
          type="text"
          required
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Street Address"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="City"
          />
          <input
            type="text"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="State"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Country"
          />
          <input
            type="text"
            required
            value={formData.zipCode}
            onChange={(e) =>
              setFormData({ ...formData, zipCode: e.target.value })
            }
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="ZIP Code"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating...
          </>
        ) : (
          'Continue to Email Verification'
        )}
      </button>
    </form>
  );
}
