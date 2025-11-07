import { Navbar } from '@/components/layout/navbar';

/**
 * Login Layout
 * Wraps login page with consistent navigation
 */
export default function LoginLayout({
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
