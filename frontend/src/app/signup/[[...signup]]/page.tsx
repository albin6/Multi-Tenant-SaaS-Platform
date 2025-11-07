import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Signup Page
 * Uses Clerk's SignUp component for user registration
 */
export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Link
        href="/"
        className="mb-8 flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Create Your Account</h1>
        <p className="mt-2 text-muted-foreground">
          Get started with your enterprise application
        </p>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
      />
    </div>
  );
}
