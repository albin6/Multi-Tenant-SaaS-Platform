# Multi-Tenant SaaS Platform Implementation Guide

## 🎯 Overview

This document outlines the implementation of a scalable multi-tenant SaaS platform with organization management, subdomain routing, and payment integration.

## ✅ Completed Components

### Backend Models & Database Schema

#### 1. Organization Model (`organization.model.ts`)
- **Fields**:
  - `orgname`: Unique, indexed, lowercase alphanumeric + hyphens
  - `companyName`, `companyEmail`, `companyAddress`
  - `ownerId`: Clerk user ID (indexed)
  - `isEmailVerified`, `verificationToken`, `verificationTokenExpiry`
  - `status`: pending_verification | pending_orgname | active | suspended
  - `subscription`: Embedded subscription details with Razorpay integration
  - `metadata`: Logo, description, website, industry

- **Indexes** (Optimized for Scale):
  - `orgname`: Unique index for fast lookups
  - `ownerId`: Index for owner queries
  - `status`: Index for status filters
  - Compound indexes for complex queries

- **Virtual Fields**:
  - `subdomainUrl`: Computed subdomain URL (orgname.localhost:3000)

#### 2. Plan Model (`plan.model.ts`)
- Subscription plans with pricing
- Features and limits (users, storage, API calls, custom domain)
- Razorpay plan integration
- Billing cycles: monthly, yearly, lifetime

### Backend Business Logic

#### 3. Organization Repository (`organization.repository.ts`)
**Key Features**:
- **In-Memory Cache** for orgname availability checks
  - TTL: 60 seconds
  - Max size: 10,000 entries
  - Automatic cleanup
  - **Handles high concurrency** efficiently
  
- **Methods**:
  - `isOrgnameAvailable()`: Cached, high-performance check
  - `createOrganization()`: Phase 1 creation
  - `findByOrgname()`: Fast indexed lookup
  - `findByOwnerId()`: Get user's organizations
  - `setOrgname()`: Phase 3 with double-check
  - `verifyEmail()`: Phase 2 completion
  - `updateSubscription()`: Razorpay integration
  
**Production Note**: Replace in-memory cache with **Redis** for distributed systems.

#### 4. Organization Service (`organization.service.ts`)
**3-Phase Organization Creation**:

**Phase 1: Register Company**
- Input: Company name, email, address
- Creates organization with `pending_verification` status
- Generates verification token (24h expiry)
- Returns organization ID and token

**Phase 2: Email Verification**
- Input: Organization ID + verification token
- Validates token and expiry
- Updates status to `pending_orgname`
- Clears verification tokens

**Phase 3: Orgname Creation**
- Input: Organization ID + desired orgname
- Real-time validation:
  - Format check (lowercase, alphanumeric, hyphens)
  - Length (3-50 chars)
  - Reserved words check
  - Database availability check (with caching)
- Updates status to `active`
- Returns subdomain URL

**Additional Methods**:
- `checkOrgnameAvailability()`: Real-time availability with validation
- `hasActiveSubscription()`: Check if org can access subdomain
- CRUD operations with ownership verification

#### 5. Organization Controller (`organization.controller.ts`)
REST API endpoints:
- `POST /api/v1/organizations/phase1`: Create organization
- `POST /api/v1/organizations/verify-email`: Verify email
- `POST /api/v1/organizations/set-orgname`: Set orgname
- `GET /api/v1/organizations/check-orgname/:orgname`: Check availability
- `GET /api/v1/organizations/my-organizations`: Get user's orgs
- `GET /api/v1/organizations/:id`: Get by ID
- `GET /api/v1/organizations/by-orgname/:orgname`: Get by orgname
- `PUT /api/v1/organizations/:id`: Update organization
- `DELETE /api/v1/organizations/:id`: Delete organization
- `GET /api/v1/organizations/subscription-status/:orgname`: Check subscription

#### 6. Organization Routes (`organization.routes.ts`)
- Protected routes with `authenticate` middleware
- Public routes for verification and availability checks
- Validation middleware for all inputs
- Rate limiting ready (add middleware as needed)

## 🚧 Next Steps for Complete Implementation

### Backend (Remaining)

#### 7. Subdomain Middleware
```typescript
// backend/src/core/middleware/subdomain.middleware.ts
- Parse subdomain from request
- Validate organization exists and is active
- Check subscription status
- Attach org context to request
- Redirect to payment if no active subscription
```

#### 8. Razorpay Integration
```typescript
// backend/src/modules/payment/
- Create Razorpay orders
- Handle payment verification
- Create/update subscriptions
- Webhook handlers for payment events
- Auto-renewal logic
```

#### 9. Main App Server Configuration
```typescript
// backend/src/server.ts
- Import organization routes
- Add subdomain middleware
- Configure CORS for subdomains
```

### Frontend (Remaining)

#### 10. Organization Creation Wizard
```tsx
// frontend/src/app/(main)/create-organization/
- Step 1: Company registration form
- Step 2: Email verification page
- Step 3: Orgname creation with real-time check
  - Debounced API calls (300ms)
  - Live availability indicator
  - Format validation feedback
```

#### 11. Organization Profile
```tsx
// frontend/src/app/(main)/profile/organizations/
- List user's organizations
- Show subdomain URLs
- Edit organization details
- Delete confirmation
```

#### 12. Subdomain Detection & Routing
```tsx
// frontend/src/middleware.ts or custom hook
- Detect if on subdomain
- Fetch organization by orgname
- Show customer landing page
- Redirect to payment if no subscription
```

#### 13. Subdomain Customer Landing Page
```tsx
// frontend/src/app/(subdomain)/page.tsx
- Organization branding
- Customer sign up/login
- Organization description
- Contact information
```

#### 14. Subdomain Admin Panel
```tsx
// frontend/src/app/(subdomain)/admin/
- Reuse existing admin components
- Scoped to organization
- Dashboard with org-specific data
- Customer management
- Settings
```

#### 15. Razorpay Integration
```tsx
// frontend/src/components/payment/
- Plan selection page
- Razorpay checkout integration
- Payment success/failure pages
- Subscription management
```

## 🏗️ Architecture Highlights

### Scalability Features

#### Database Optimization
- **Indexed fields** for fast queries
- **Compound indexes** for complex filters
- **Sparse indexes** for optional fields
- **Virtual fields** for computed values

#### Caching Strategy
- **In-memory cache** for orgname checks
- **LRU eviction** with TTL
- **Automatic cleanup** of expired entries
- **Ready for Redis** in production

#### Concurrency Handling
1. Database-level uniqueness constraint on `orgname`
2. Pre-save hook validation
3. Service-level double-check before setting orgname
4. Cache invalidation on updates
5. Optimistic locking for updates

### Security Features
- **Email verification** required before orgname
- **Ownership verification** for all mutations
- **Token expiry** for verification links
- **Reserved words** protection
- **Rate limiting ready** (add middleware)
- **Input validation** with Zod schemas

### Multi-Tenancy Architecture
- **Organization isolation** by ownerId
- **Subdomain-based** routing
- **Subscription gating** for subdomain access
- **Shared database** with tenant filtering
- **Scalable to millions** of organizations

## 📝 Integration Steps

### 1. Add Organization Routes to Main Server

```typescript
// backend/src/server.ts
import organizationRoutes from '@modules/organization/routes/organization.routes';

// Add after user routes
app.use('/api/v1/organizations', organizationRoutes);
```

### 2. Update Environment Variables

```env
# backend/.env
BASE_URL=localhost:3000

# Razorpay (add after integration)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 3. Frontend API Configuration

```typescript
// frontend/src/lib/api/organization.ts
// Create API client for organization endpoints
```

### 4. Subdomain Configuration

**Development (localhost)**:
- Use format: `orgname.localhost:3000`
- No DNS configuration needed
- Browser handles subdomain automatically

**Production**:
- Configure wildcard DNS: `*.yourdomain.com`
- SSL certificate for wildcard domain
- Update BASE_URL in environment

## 🧪 Testing the Flow

### Phase 1: Register Organization
```bash
POST /api/v1/organizations/phase1
Headers: Authorization: Bearer <clerk_token>
Body: {
  "companyName": "Acme Corp",
  "companyEmail": "contact@acme.com",
  "companyAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "zipCode": "400001"
  }
}
```

### Phase 2: Verify Email
```bash
POST /api/v1/organizations/verify-email
Body: {
  "organizationId": "<org_id>",
  "verificationToken": "<token_from_email>"
}
```

### Phase 3: Set Orgname
```bash
# Check availability first
GET /api/v1/organizations/check-orgname/acme

# Set orgname
POST /api/v1/organizations/set-orgname
Headers: Authorization: Bearer <clerk_token>
Body: {
  "organizationId": "<org_id>",
  "orgname": "acme"
}
```

### Access Subdomain
```
Navigate to: acme.localhost:3000
```

## 🔄 Complete User Journey

1. **User registers** on `localhost:3000` (Clerk)
2. **User logs in** and navigates to "Create Organization"
3. **Phase 1**: Fills company details → Receives verification email
4. **Phase 2**: Clicks email link → Email verified
5. **Phase 3**: Enters desired orgname → Real-time availability check → Orgname set
6. **Profile**: Sees organization with subdomain URL
7. **Purchase Plan**: Clicks "Activate" → Razorpay payment
8. **Subdomain Active**: `orgname.localhost:3000` now accessible
9. **Customers**: Can sign up at subdomain
10. **Admin**: Logs in at `orgname.localhost:3000/admin`

## 📊 Performance Metrics

### Expected Performance (with caching)
- **Orgname availability check**: < 5ms (cache hit), < 50ms (DB query)
- **Organization creation**: < 200ms
- **Concurrent checks**: 10,000+ req/sec (with Redis)
- **Database queries**: All under 100ms with proper indexes

### Scalability Targets
- **Organizations**: Millions
- **Concurrent users**: 100,000+
- **Orgname checks**: 50,000+ req/sec (Redis cache)
- **Database size**: Unlimited (MongoDB sharding ready)

## 🔐 Security Checklist

- [x] Email verification required
- [x] Ownership validation on mutations
- [x] Input validation with Zod
- [x] Reserved words protection
- [x] Token expiry enforcement
- [ ] Rate limiting (add middleware)
- [ ] CSRF protection for subdomain
- [ ] SQL injection prevention (MongoDB native)
- [ ] XSS protection (React native)
- [ ] Payment webhook signature verification

## 🚀 Deployment Considerations

### Production Requirements
1. **Redis** for distributed caching
2. **MongoDB Atlas** with replica sets
3. **CDN** for static assets
4. **Load balancer** for horizontal scaling
5. **Wildcard SSL** certificate
6. **Rate limiting** middleware
7. **Monitoring** (New Relic, Datadog)
8. **Error tracking** (Sentry)
9. **Backup** strategy
10. **CI/CD** pipeline

### Environment Separation
- **Development**: localhost subdomains
- **Staging**: staging-*.yourdomain.com
- **Production**: *.yourdomain.com

## 📚 Additional Files Needed

To complete the implementation, you still need:
1. Subdomain middleware (backend)
2. Razorpay service & controller (backend)
3. Organization wizard (frontend - 3 steps)
4. Subdomain detection (frontend)
5. Customer landing page (frontend)
6. Subdomain admin panel (frontend)
7. Payment integration (frontend)
8. Organization profile page (frontend)

## 🎓 Best Practices Implemented

- ✅ **Clean Architecture** (Controller → Service → Repository)
- ✅ **Domain-Driven Design** principles
- ✅ **SOLID** principles
- ✅ **Caching** for performance
- ✅ **Indexing** for scale
- ✅ **Validation** at multiple layers
- ✅ **Error handling** with custom errors
- ✅ **Logging** for debugging
- ✅ **TypeScript** for type safety
- ✅ **Zod** for runtime validation

This implementation provides a solid foundation for a scalable, enterprise-grade multi-tenant SaaS platform!
