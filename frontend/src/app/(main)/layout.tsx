import { Navbar } from '@/components/layout/navbar';

/**
 * Main Layout
 * Wraps all authenticated and main pages with consistent navigation
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
