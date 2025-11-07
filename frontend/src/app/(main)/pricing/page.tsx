'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Loader2, Zap, Crown, Rocket } from 'lucide-react';
import { createPaymentOrder, verifyPayment } from '@/lib/api/payment';

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: string[];
  limits: {
    users: number;
    storage: number;
    apiCalls: number;
    customDomain: boolean;
  };
}

export default function PricingPage() {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const organizationId = searchParams.get('organizationId');

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
    loadRazorpayScript();
  }, []);

  const fetchPlans = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(
        `${apiUrl}/plans`
      );
      const data = await response.json();
      setPlans(data.data || []);
    } catch (err) {
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSelectPlan = async (plan: Plan) => {
    if (!organizationId) {
      setError('Organization ID is required');
      return;
    }

    setSelectedPlan(plan._id);
    setProcessing(true);
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Please sign in to continue');
      }

      // Create Razorpay order
      const orderResponse = await createPaymentOrder(
        {
          planId: plan._id,
          organizationId,
        },
        token
      );

      const order = orderResponse.data;

      // Check if using mock payment (orderId starts with 'order_mock_')
      if (order.orderId.startsWith('order_mock_')) {
        // Mock payment - skip Razorpay checkout and verify immediately
        try {
          await verifyPayment(
            {
              organizationId,
              planId: plan._id,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              razorpayOrderId: order.orderId,
              razorpaySignature: 'mock_signature',
            },
            token
          );

          // Redirect to success page
          router.push('/profile/organizations?payment=success');
        } catch (err: any) {
          setError(err.message || 'Payment verification failed');
        }
        return;
      }

      // Real Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Your SaaS Platform',
        description: `${plan.name} Plan`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            await verifyPayment(
              {
                organizationId,
                planId: plan._id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              token
            );

            // Redirect to success page
            router.push('/profile/organizations?payment=success');
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      // @ts-ignore
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', function (response: any) {
        setError('Payment failed. Please try again.');
      });
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('starter')) return <Zap className="h-8 w-8" />;
    if (planName.toLowerCase().includes('professional')) return <Rocket className="h-8 w-8" />;
    if (planName.toLowerCase().includes('enterprise')) return <Crown className="h-8 w-8" />;
    return <Zap className="h-8 w-8" />;
  };

  const getPlanColor = (planName: string) => {
    if (planName.toLowerCase().includes('starter')) return 'from-blue-500 to-cyan-500';
    if (planName.toLowerCase().includes('professional')) return 'from-purple-500 to-pink-500';
    if (planName.toLowerCase().includes('enterprise')) return 'from-amber-500 to-orange-500';
    return 'from-blue-500 to-cyan-500';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Group plans by billing cycle
  const monthlyPlans = plans.filter((p) => p.billingCycle === 'monthly');
  const yearlyPlans = plans.filter((p) => p.billingCycle === 'yearly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-4 text-lg text-gray-600">
            Select the perfect plan for your organization
          </p>
          {!organizationId && (
            <div className="mt-4 rounded-md bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Please create an organization first before selecting a plan.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Monthly Plans */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Monthly Billing</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {monthlyPlans.map((plan) => (
              <div
                key={plan._id}
                className="relative overflow-hidden rounded-2xl bg-white shadow-xl transition-transform hover:scale-105"
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${getPlanColor(plan.name)} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    {getPlanIcon(plan.name)}
                    {plan.name.toLowerCase().includes('professional') && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-sm opacity-90">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-sm opacity-90">/month</span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={!organizationId || processing}
                    className={`mt-6 w-full rounded-lg py-3 font-semibold text-white transition-colors ${
                      plan.name.toLowerCase().includes('professional')
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } disabled:opacity-50`}
                  >
                    {processing && selectedPlan === plan._id ? (
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    ) : (
                      'Select Plan'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yearly Plans */}
        {yearlyPlans.length > 0 && (
          <div>
            <div className="mb-6 flex items-center">
              <h2 className="text-2xl font-bold text-gray-900">Yearly Billing</h2>
              <span className="ml-3 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                SAVE 20%
              </span>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {yearlyPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="relative overflow-hidden rounded-2xl bg-white shadow-xl transition-transform hover:scale-105"
                >
                  <div className={`bg-gradient-to-r ${getPlanColor(plan.name)} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      {getPlanIcon(plan.name)}
                      <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold">
                        20% OFF
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold">{plan.name}</h3>
                    <p className="mt-2 text-sm opacity-90">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      <span className="text-sm opacity-90">/year</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={!organizationId || processing}
                      className="mt-6 w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 py-3 font-semibold text-white transition-colors hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
                    >
                      {processing && selectedPlan === plan._id ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      ) : (
                        'Select Plan'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
