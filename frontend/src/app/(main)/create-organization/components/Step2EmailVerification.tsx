'use client';

import { useState } from 'react';
import { verifyEmail } from '@/lib/api/organization';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

interface Step2Props {
  organizationId: string;
  verificationToken: string;
  onComplete: () => void;
}

export default function Step2EmailVerification({
  organizationId,
  verificationToken,
  onComplete,
}: Step2Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(verificationToken || '');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyEmail({
        organizationId,
        verificationToken: token,
      });

      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Verify Your Email
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;ve sent a verification code to your company email.
          <br />
          Enter the code below to continue.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-lg tracking-widest shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Enter verification code"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Verify Email
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Didn&apos;t receive the code?</p>
        <button
          type="button"
          className="mt-2 text-blue-600 hover:text-blue-700"
          onClick={() => {
            // TODO: Implement resend email
            alert('Resend email functionality coming soon');
          }}
        >
          Resend Email
        </button>
      </div>

      {/* Development Helper */}
      {process.env.NODE_ENV === 'development' && verificationToken && (
        <div className="mt-6 rounded-md bg-yellow-50 p-4">
          <p className="text-xs text-yellow-800">
            <strong>Development Mode:</strong> Verification token is auto-filled
            for testing.
          </p>
        </div>
      )}
    </div>
  );
}
