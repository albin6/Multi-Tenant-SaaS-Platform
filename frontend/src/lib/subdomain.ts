/**
 * Subdomain Detection Utilities
 * Client-side utilities for detecting and handling subdomains
 */

export interface SubdomainInfo {
  isSubdomain: boolean;
  subdomain: string | null;
  baseDomain: string;
}

/**
 * Detect subdomain from current hostname
 * Works for both development (orgname.localhost) and production (orgname.domain.com)
 */
export function detectSubdomain(): SubdomainInfo {
  if (typeof window === 'undefined') {
    return {
      isSubdomain: false,
      subdomain: null,
      baseDomain: 'localhost:3000',
    };
  }

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // For localhost development: orgname.localhost
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    const subdomain = parts[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      return {
        isSubdomain: true,
        subdomain,
        baseDomain: 'localhost',
      };
    }
  }

  // For production: orgname.yourdomain.com
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain && subdomain !== 'www') {
      const baseDomain = parts.slice(1).join('.');
      return {
        isSubdomain: true,
        subdomain,
        baseDomain,
      };
    }
  }

  return {
    isSubdomain: false,
    subdomain: null,
    baseDomain: hostname,
  };
}

/**
 * Get organization URL for a given orgname
 */
export function getOrganizationUrl(orgname: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
  const protocol = baseUrl.includes('localhost') ? 'http://' : 'https://';
  return `${protocol}${orgname}.${baseUrl}`;
}

/**
 * Get main platform URL (without subdomain)
 */
export function getMainPlatformUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
  const protocol = baseUrl.includes('localhost') ? 'http://' : 'https://';
  return `${protocol}${baseUrl}`;
}
