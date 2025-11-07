'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Zap, Building2, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { detectSubdomain } from '@/lib/subdomain';
import { OrganizationLanding } from '@/components/subdomain/organization-landing';

/**
 * Landing Page
 * Main entry point - shows different content for main domain vs subdomains
 */
export default function LandingPage() {
  const [subdomainInfo, setSubdomainInfo] = useState<{
    isSubdomain: boolean;
    subdomain: string | null;
  } | null>(null);

  useEffect(() => {
    const info = detectSubdomain();
    console.log('[LandingPage] Detected subdomain info:', info);
    console.log('[LandingPage] Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');
    console.log('[LandingPage] Current href:', typeof window !== 'undefined' ? window.location.href : 'SSR');
    setSubdomainInfo(info);
  }, []);

  // Loading state
  if (!subdomainInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // If accessing via subdomain, show organization landing page
  if (subdomainInfo.isSubdomain && subdomainInfo.subdomain) {
    return <OrganizationLanding subdomain={subdomainInfo.subdomain} />;
  }

  // Main platform landing page (localhost:3000)
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Multi-Tenant
            <span className="text-primary"> SaaS Platform</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Built with Clean Architecture, Domain-Driven Design, and modern best practices.
            Create organizations, manage subscriptions, and scale with subdomain routing.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Built for Scale</h2>
            <p className="mt-2 text-muted-foreground">
              Production-ready architecture with enterprise-grade features
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Building2 className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Multi-Tenant</CardTitle>
                <CardDescription>
                  Create organizations with subdomain routing and subscription management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Subdomain routing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Real-time validation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Payment integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Secure Authentication</CardTitle>
                <CardDescription>
                  Clerk-powered authentication with session management and JWT tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Multi-factor authentication
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Session management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Protected routes
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Modern Tech Stack</CardTitle>
                <CardDescription>
                  Next.js 14, TypeScript, React Query, and TailwindCSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Server-side rendering
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Type-safe APIs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Optimized caching
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Clean Architecture</CardTitle>
                <CardDescription>
                  DDD principles with Controller-Service-Repository pattern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Modular structure
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Separation of concerns
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Scalable codebase
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground">
            Create your account today and experience the power of a production-ready application.
          </p>
          <Link href="/signup">
            <Button size="lg">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Enterprise App. Built with Next.js, Express, and MongoDB.</p>
        </div>
      </footer>
    </div>
  );
}
