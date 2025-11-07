'use client';

import Link from 'next/link';
import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Navbar Component
 * Displays navigation with conditional rendering based on auth state
 */
export function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Enterprise</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Pricing
          </Link>
          {isSignedIn && (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/profile/organizations"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                My Organizations
              </Link>
              <Link
                href="/create-organization"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Create Organization
              </Link>
            </>
          )}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {!isSignedIn ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                {user?.firstName || user?.username || 'User'}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            {isSignedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile/organizations"
                  className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Organizations
                </Link>
                <Link
                  href="/create-organization"
                  className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Organization
                </Link>
              </>
            )}
            {!isSignedIn ? (
              <>
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block rounded-md bg-primary px-3 py-2 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3 rounded-md px-3 py-2">
                <UserButton afterSignOutUrl="/" />
                <span className="text-sm">
                  {user?.firstName || user?.username || 'User'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
