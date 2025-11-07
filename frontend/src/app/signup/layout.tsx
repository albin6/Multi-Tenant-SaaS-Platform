import { Navbar } from '@/components/layout/navbar';

/**
 * Signup Layout
 * Wraps signup page with consistent navigation
 */
export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center">
        {children}
      </div>
    </>
  );
}
