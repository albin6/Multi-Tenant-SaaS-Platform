'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Store, Package, ShoppingCart, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Organization {
  _id: string;
  orgname: string;
  companyName: string;
  industry?: string;
  description?: string;
  subscription?: {
    status: string;
    planId?: any;
  };
}

interface OrganizationLandingProps {
  subdomain: string;
}

export function OrganizationLanding({ subdomain }: OrganizationLandingProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchOrganization = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const url = `${apiUrl}/organizations/by-orgname/${subdomain}`;
      console.log('[OrganizationLanding] Subdomain:', subdomain);
      console.log('[OrganizationLanding] Fetching organization from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit', // Try without credentials first
      });
      
      console.log('[OrganizationLanding] Response status:', response.status);
      console.log('[OrganizationLanding] Response ok:', response.ok);
      console.log('[OrganizationLanding] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[OrganizationLanding] Error response:', errorText);
        throw new Error('Organization not found');
      }

      const data = await response.json();
      console.log('[OrganizationLanding] Organization data:', data);
      
      if (data && data.data) {
        setOrganization(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('[OrganizationLanding] Fetch error:', err);
      console.error('[OrganizationLanding] Error stack:', err.stack);
      setError(err.message || 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Organization Not Found</CardTitle>
            <CardDescription>
              The organization &quot;{subdomain}&quot; could not be found or is not active.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')}
              className="w-full"
            >
              Go to Main Platform
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = organization.subscription?.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-lg">
              {subdomain.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {organization.companyName || subdomain.toUpperCase()}
              </h1>
              {organization.industry && (
                <p className="text-xs text-gray-600">{organization.industry}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/vendor')}
            >
              Vendor Portal
            </Button>
            <Button onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Subscription Status Banner */}
      {!isActive && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 py-3">
            <p className="text-sm text-yellow-800 text-center">
              ⚠️ This organization&apos;s subscription is not active. Some features may be limited.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to {organization.companyName || subdomain}
          </h2>
          {organization.description && (
            <p className="text-xl text-gray-600 mb-8">
              {organization.description}
            </p>
          )}
          {!organization.description && (
            <p className="text-xl text-gray-600 mb-8">
              Your trusted partner for quality products and services
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Features/Services Section */}
      <section className="border-t bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">Our Services</h3>
            <p className="mt-2 text-gray-600">Everything you need, all in one place</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <Store className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Quality Products</CardTitle>
                <CardDescription>
                  Browse our curated collection of premium products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Catalog
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Easy Ordering</CardTitle>
                <CardDescription>
                  Simple checkout process with secure payment options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <Package className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Fast Delivery</CardTitle>
                <CardDescription>
                  Quick and reliable shipping to your doorstep
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Track Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="border-t py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-600">+91 XXX XXX XXXX</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mb-3">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">contact@{subdomain}.com</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2024 {organization.companyName || subdomain}. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Powered by Enterprise Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
