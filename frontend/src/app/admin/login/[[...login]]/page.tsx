import { SignIn } from '@clerk/nextjs';
import { LayoutDashboard } from 'lucide-react';

/**
 * Admin Login Page
 * Uses Clerk's SignIn component for admin authentication
 */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      {/* Logo/Brand */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <LayoutDashboard className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
        <p className="mt-2 text-gray-600">Sign in to access the admin dashboard</p>
      </div>

      {/* Sign In Component */}
      <SignIn
        signUpUrl="/admin/signup"
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
        <p>Protected Admin Area</p>
        <p className="mt-1">© 2024 Enterprise App. All rights reserved.</p>
      </div>
    </div>
  );
}
