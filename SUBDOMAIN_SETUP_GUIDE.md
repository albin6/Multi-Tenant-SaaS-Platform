# Subdomain-Specific Pages Setup Guide

## Overview
The application now shows **different pages** based on whether you access it from:
- **Main domain**: `localhost:3000` - Shows the main SaaS platform
- **Subdomain**: `acme.localhost:3000` - Shows organization-specific pages

## What's Different?

### 1. Landing Page (`/`)

#### Main Domain (`localhost:3000`)
- Multi-tenant SaaS platform landing page
- Features showcase
- Call-to-action for signup
- Generic platform information

#### Subdomain (`acme.localhost:3000`)
- Organization-specific storefront
- Company branding and information
- Product/service showcase
- Contact information
- Footer with organization name

### 2. Dashboard (`/dashboard`)

#### Main Domain (`localhost:3000/dashboard`)
- User's personal dashboard
- Create organization action
- View all organizations
- Pricing plans
- Getting started guide

#### Subdomain (`acme.localhost:3000/dashboard`)
- Organization-specific dashboard
- Revenue and sales statistics
- Order management
- Product catalog
- Customer management
- Quick actions for business operations

### 3. Vendor Portal (`/vendor`)
- Available on both main and subdomain
- Vendor management interface
- Product management tools

## Testing Instructions

### Step 1: Access Main Platform
```
http://localhost:3000
```
You should see the main SaaS platform landing page.

### Step 2: Access Organization Subdomain
```
http://acme.localhost:3000
```
You should see ACME's organization-specific landing page.

### Step 3: Compare Dashboards
**Main Dashboard:**
```
http://localhost:3000/dashboard
```

**Organization Dashboard:**
```
http://acme.localhost:3000/dashboard
```

## Technical Implementation

### Files Created/Modified

1. **`/src/lib/subdomain.ts`**
   - Subdomain detection utility
   - Works for `orgname.localhost` (development)
   - Works for `orgname.domain.com` (production)

2. **`/src/components/subdomain/organization-landing.tsx`**
   - Organization-specific landing page component
   - Fetches organization data from backend
   - Shows company information and services

3. **`/src/components/subdomain/organization-dashboard.tsx`**
   - Organization-specific dashboard component
   - Business metrics and statistics
   - Quick actions for management

4. **`/src/app/page.tsx`** (Modified)
   - Now detects subdomain on client-side
   - Conditionally renders appropriate landing page

5. **`/src/app/(main)/dashboard/page.tsx`** (Modified)
   - Detects subdomain
   - Shows organization dashboard for subdomains
   - Shows user dashboard for main domain

### How It Works

```typescript
// Subdomain detection
const detectSubdomain = () => {
  const hostname = window.location.hostname;
  
  // For localhost: acme.localhost
  // Returns: { isSubdomain: true, subdomain: 'acme' }
  
  // For main: localhost
  // Returns: { isSubdomain: false, subdomain: null }
}
```

### Data Flow

1. User visits `acme.localhost:3000`
2. Page component detects subdomain = "acme"
3. Component calls API: `/organizations/by-orgname/acme`
4. Backend returns organization data
5. Page renders with organization-specific content

## Features

### Organization Landing Page
- ✅ Subdomain detection
- ✅ Organization info display
- ✅ Subscription status banner
- ✅ Services/features showcase
- ✅ Contact information
- ✅ Branded header and footer
- ✅ Navigation to vendor portal

### Organization Dashboard
- ✅ Business metrics (revenue, orders, products)
- ✅ Quick action buttons
- ✅ Organization information panel
- ✅ Subscription status display
- ✅ Recent activity feed (placeholder)
- ✅ Navigation options

## Notes

- The subdomain detection happens client-side using `window.location.hostname`
- Backend already has the endpoint `/organizations/by-orgname/:orgname` for fetching organization data
- Subscription status is checked and displayed appropriately
- All pages gracefully handle organization not found scenarios

## Future Enhancements

Potential additions:
- Custom themes per organization
- Product catalog integration
- Order management
- Customer portal
- Analytics dashboard
- Custom domain support (beyond subdomains)
