'use client';

import { Sidebar } from '@/components/admin/Sidebar';
import { Navbar } from '@/components/admin/Navbar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if current route is login or signup
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/signup');

  // If it's an auth page, render without sidebar/navbar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Otherwise, render full admin layout
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
