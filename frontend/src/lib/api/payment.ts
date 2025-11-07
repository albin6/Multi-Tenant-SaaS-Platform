const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Payment API Client
 */

export interface CreateOrderData {
  planId: string;
  organizationId: string;
}

export interface VerifyPaymentData {
  organizationId: string;
  planId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

/**
 * Create Razorpay order
 */
export async function createPaymentOrder(data: CreateOrderData, token: string) {
  const response = await fetch(`${API_URL}/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }

  return response.json();
}

/**
 * Verify payment and activate subscription
 */
export async function verifyPayment(data: VerifyPaymentData, token: string) {
  const response = await fetch(`${API_URL}/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to verify payment');
  }

  return response.json();
}

/**
 * Get subscription details
 */
export async function getSubscription(organizationId: string, token: string) {
  const response = await fetch(
    `${API_URL}/payments/subscription/${organizationId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch subscription');
  }

  return response.json();
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(organizationId: string, token: string) {
  const response = await fetch(`${API_URL}/payments/cancel-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ organizationId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel subscription');
  }

  return response.json();
}

/**
 * Get available plans
 */
export async function getPlans() {
  const response = await fetch(`${API_URL}/plans`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch plans');
  }

  return response.json();
}
