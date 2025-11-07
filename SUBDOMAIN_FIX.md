# Subdomain Access Fix

## Issue
When accessing `http://acme.localhost:3000/`, the page showed:
```
Organization Not Found
The organization "acme" could not be found or is not active.
```

## Root Causes

### 1. Missing API URL Fallback (Frontend)
**Problem**: Several frontend components were using `process.env.NEXT_PUBLIC_API_URL` without a fallback value. When the environment variable was not set, the API URL became `undefined/organizations/by-orgname/acme`, causing failed API calls.

**Files Fixed**:
- `frontend/src/components/subdomain/organization-landing.tsx`
- `frontend/src/components/subdomain/organization-dashboard.tsx`
- `frontend/src/app/(main)/pricing/page.tsx`

**Solution**: Added fallback URL:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
```

### 2. CORS Configuration (Backend)
**Problem**: The backend CORS configuration only allowed `http://localhost:3000`, blocking requests from subdomains like `http://acme.localhost:3000`.

**File Fixed**: `backend/src/app.ts`

**Solution**: Updated CORS to use a function that checks the origin:
```typescript
cors({
  origin: (origin, callback) => {
    // Allow requests with no origin
    if (!origin) {
      return callback(null, true);
    }

    // Allow configured origin
    if (origin === appConfig.cors.origin) {
      return callback(null, true);
    }

    // Allow any subdomain of localhost (e.g., acme.localhost:3000)
    if (origin.match(/^https?:\/\/[\w-]+\.localhost(:\d+)?$/)) {
      return callback(null, true);
    }

    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
```

## Verification

1. **Backend API Test**:
```bash
curl -s http://localhost:5000/api/v1/organizations/by-orgname/acme
```
✅ Returns organization data successfully

2. **CORS Test**:
```bash
curl -s -H "Origin: http://acme.localhost:3000" http://localhost:5000/api/v1/organizations/by-orgname/acme
```
✅ Returns `Access-Control-Allow-Origin: http://acme.localhost:3000`

3. **Browser Test**:
   - Visit `http://acme.localhost:3000/`
   - ✅ Should now display the organization landing page

## How It Works Now

1. User visits `http://acme.localhost:3000/`
2. Frontend detects "acme" subdomain using `detectSubdomain()` function
3. Frontend renders `OrganizationLanding` component
4. Component fetches organization data from backend API
5. Backend allows the request (CORS passes)
6. API returns organization data
7. Landing page displays organization information

## Production Notes

For production deployment, update the CORS configuration in `backend/src/app.ts` to allow your actual domain:

```typescript
// Allow production subdomains
if (origin.match(/^https?:\/\/[\w-]+\.yourdomain\.com$/)) {
  return callback(null, true);
}
```

## Environment Variables

While the app now works with fallback values, it's recommended to set these environment variables:

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BASE_URL=localhost:3000
```

**Backend** (`.env`):
```env
CORS_ORIGIN=http://localhost:3000
```

## Status
✅ **Fixed**: Subdomain access now works correctly for multi-tenant organizations.
