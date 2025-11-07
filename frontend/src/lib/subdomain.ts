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
  
  // Get the configured base domain (e.g., "multi-tenant-saas-platform-1.onrender.com" or "localhost")
  const configuredBaseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost';

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

  // Check if current hostname matches the base domain (not a subdomain)
  if (hostname === configuredBaseDomain) {
    return {
      isSubdomain: false,
      subdomain: null,
      baseDomain: hostname,
    };
  }

  // For production: orgname.yourdomain.com (e.g., acme.multi-tenant-saas-platform-1.onrender.com)
  // Only treat as subdomain if there's an extra level beyond the base domain
  if (hostname.endsWith(`.${configuredBaseDomain}`)) {
    const subdomain = hostname.replace(`.${configuredBaseDomain}`, '');
    // Make sure it's a single subdomain level (no dots in subdomain)
    if (subdomain && !subdomain.includes('.') && subdomain !== 'www') {
      return {
        isSubdomain: true,
        subdomain,
        baseDomain: configuredBaseDomain,
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
