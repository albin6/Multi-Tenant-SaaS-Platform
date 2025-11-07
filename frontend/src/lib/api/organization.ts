import { auth } from '@clerk/nextjs/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Organization API Client
 */

export interface CreateOrganizationPhase1Data {
  companyName: string;
  companyEmail: string;
  companyAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface VerifyEmailData {
  organizationId: string;
  verificationToken: string;
}

export interface SetOrgnameData {
  organizationId: string;
  orgname: string;
}

/**
 * Phase 1: Create organization
 */
export async function createOrganizationPhase1(
  data: CreateOrganizationPhase1Data,
  token: string
) {
  const response = await fetch(`${API_URL}/organizations/phase1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create organization');
  }

  return response.json();
}

/**
 * Phase 2: Verify email
 */
export async function verifyEmail(data: VerifyEmailData) {
  const response = await fetch(`${API_URL}/organizations/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to verify email');
  }

  return response.json();
}

/**
 * Phase 3: Check orgname availability
 */
export async function checkOrgnameAvailability(orgname: string) {
  const response = await fetch(
    `${API_URL}/organizations/check-orgname/${orgname}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check orgname availability');
  }

  return response.json();
}

/**
 * Phase 3: Set orgname
 */
export async function setOrgname(data: SetOrgnameData, token: string) {
  const response = await fetch(`${API_URL}/organizations/set-orgname`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to set orgname');
  }

  return response.json();
}

/**
 * Get user's organizations
 */
export async function getMyOrganizations(token: string) {
  const response = await fetch(`${API_URL}/organizations/my-organizations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }

  return response.json();
}

/**
 * Get organization by orgname
 */
export async function getOrganizationByOrgname(orgname: string) {
  const response = await fetch(
    `${API_URL}/organizations/by-orgname/${orgname}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch organization');
  }

  return response.json();
}

/**
 * Check subscription status
 */
export async function checkSubscriptionStatus(orgname: string) {
  const response = await fetch(
    `${API_URL}/organizations/subscription-status/${orgname}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check subscription');
  }

  return response.json();
}
