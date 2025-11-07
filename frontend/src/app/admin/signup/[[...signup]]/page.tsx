import { SignUp } from '@clerk/nextjs';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

/**
 * Admin Signup Page
 * Uses Clerk's SignUp component for admin registration
 */
export default function AdminSignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      {/* Logo/Brand */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <LayoutDashboard className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
        <p className="mt-2 text-gray-600">Create an admin account</p>
      </div>

      {/* Sign Up Component */}
      <SignUp
        signInUrl="/admin/login"
        forceRedirectUrl="/admin"
        fallbackRedirectUrl="/admin"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-2xl',
          },
        }}
      />

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Already have an account?{' '}
          <Link href="/admin/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-2">© 2024 Enterprise App. All rights reserved.</p>
      </div>
    </div>
  );
}
