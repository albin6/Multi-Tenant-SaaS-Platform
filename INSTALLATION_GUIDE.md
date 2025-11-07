# Multi-Tenant SaaS Platform - Installation Guide

## 🚀 Complete Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- Git installed
- A Clerk account (https://clerk.com)
- A Razorpay account (https://razorpay.com) - Optional for payment features

---

## 📦 Step 1: Install Dependencies

### Backend

```bash
cd backend

# Install main dependencies
npm install

# Install Razorpay SDK
npm install razorpay

# Install type definitions
npm install --save-dev @types/razorpay
```

**Backend package.json should include:**
```json
{
  "dependencies": {
    "razorpay": "^2.9.2",
    // ... other dependencies
  },
  "devDependencies": {
    "@types/razorpay": "^2.0.0",
    // ... other dev dependencies
  }
}
```

### Frontend

```bash
cd frontend

# All dependencies should already be installed
npm install
```

---

## ⚙️ Step 2: Environment Configuration

### Backend Environment

Create `.env` file in `backend/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/enterprise-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d

# Clerk Configuration (Get from https://dashboard.clerk.com)
CLERK_SECRET_KEY=sk_test_your_actual_clerk_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_publishable_key

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Multi-Tenant Configuration
BASE_URL=localhost:3000

# Razorpay Payment Gateway (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
RAZORPAY_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Frontend Environment

Create `.env.local` file in `frontend/` directory:

```env
# Clerk Authentication Keys (Get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_actual_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Multi-Tenant Configuration
NEXT_PUBLIC_BASE_URL=localhost:3000

# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
```

---

## 🔑 Step 3: Get API Keys

### Clerk Setup

1. Go to https://dashboard.clerk.com
2. Create a new application
3. Get your keys from "API Keys" section
4. Copy `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
5. Add them to both backend and frontend `.env` files

### Razorpay Setup (Optional)

1. Go to https://dashboard.razorpay.com
2. Sign up / Log in
3. Go to "Settings" → "API Keys"
4. Generate Test/Live API keys
5. Copy `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
6. For webhooks, go to "Settings" → "Webhooks" → Create webhook
7. URL: `http://your-domain.com/api/v1/payments/webhook`
8. Copy the `RAZORPAY_WEBHOOK_SECRET`

---

## 🗄️ Step 4: Database Setup

### Start MongoDB

```bash
# If using local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### Seed Initial Data (Optional)

Create some initial plans in MongoDB:

```javascript
// Run this in MongoDB shell or MongoDB Compass
use enterprise-app

db.plans.insertMany([
  {
    name: "Starter",
    description: "Perfect for small teams",
    price: 999,
    currency: "INR",
    billingCycle: "monthly",
    features: [
      "Up to 10 users",
      "5 GB storage",
      "10,000 API calls/month",
      "Email support"
    ],
    limits: {
      users: 10,
      storage: 5,
      apiCalls: 10000,
      customDomain: false
    },
    isActive: true
  },
  {
    name: "Professional",
    description: "For growing businesses",
    price: 2999,
    currency: "INR",
    billingCycle: "monthly",
    features: [
      "Up to 50 users",
      "50 GB storage",
      "100,000 API calls/month",
      "Priority support",
      "Custom domain"
    ],
    limits: {
      users: 50,
      storage: 50,
      apiCalls: 100000,
      customDomain: true
    },
    isActive: true
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: 9999,
    currency: "INR",
    billingCycle: "monthly",
    features: [
      "Unlimited users",
      "500 GB storage",
      "Unlimited API calls",
      "24/7 dedicated support",
      "Custom domain",
      "SLA guarantee"
    ],
    limits: {
      users: 999999,
      storage: 500,
      apiCalls: 999999999,
      customDomain: true
    },
    isActive: true
  }
])
```

---

## 🚀 Step 5: Run the Application

### Start Backend

```bash
cd backend
npm run dev
```

**Expected output:**
```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🚀 Server started successfully                        ║
║                                                        ║
║  Environment: development                              ║
║  Port: 5000                                            ║
║  API Version: v1                                       ║
║                                                        ║
║  🔗 http://localhost:5000                              ║
║  📝 API: http://localhost:5000/api/v1                  ║
║  ❤️  Health: http://localhost:5000/health              ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### Start Frontend

```bash
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
- Ready in 2.5s
```

---

## 🧪 Step 6: Test the Flow

### 1. Register a User

1. Navigate to `http://localhost:3000`
2. Click "Sign Up"
3. Create an account using Clerk

### 2. Create an Organization

1. Go to `http://localhost:3000/create-organization`
2. **Step 1:** Fill in company details
3. **Step 2:** Verify email (check console for token in development mode)
4. **Step 3:** Choose an orgname and see real-time availability check
5. Click "Complete Setup"

### 3. View Organizations

1. Go to `http://localhost:3000/profile/organizations`
2. See your created organization
3. Click "Activate Plan" (if payment is configured)

### 4. Access Subdomain

1. Open `http://your-orgname.localhost:3000`
2. Should see organization landing page (if subscription is active)
3. Access admin at `http://your-orgname.localhost:3000/admin`

---

## 🔧 Step 7: Configure Subdomain (Local Development)

### Option 1: Browser Auto-handles (Recommended)

Most modern browsers automatically support `*.localhost` domains. Just use:
- `http://acme.localhost:3000`
- `http://test.localhost:3000`

### Option 2: Edit Hosts File

**Linux/Mac:**
```bash
sudo nano /etc/hosts

# Add these lines:
127.0.0.1 acme.localhost
127.0.0.1 test.localhost
```

**Windows:**
```powershell
# Open as Administrator:
notepad C:\Windows\System32\drivers\etc\hosts

# Add these lines:
127.0.0.1 acme.localhost
127.0.0.1 test.localhost
```

---

## 📝 Step 8: API Testing

### Test Organization Creation

```bash
# Get your Clerk token from browser (Network tab → Copy as cURL → Extract Bearer token)

# Phase 1: Create Organization
curl -X POST http://localhost:5000/api/v1/organizations/phase1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_CLERK_TOKEN" \
-d '{
  "companyName": "Test Corp",
  "companyEmail": "test@testcorp.com",
  "companyAddress": {
    "street": "123 Test St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "zipCode": "400001"
  }
}'

# Phase 2: Verify Email
curl -X POST http://localhost:5000/api/v1/organizations/verify-email \
-H "Content-Type: application/json" \
-d '{
  "organizationId": "ORG_ID_FROM_PHASE1",
  "verificationToken": "TOKEN_FROM_PHASE1_RESPONSE"
}'

# Phase 3: Check Orgname Availability
curl http://localhost:5000/api/v1/organizations/check-orgname/testcorp

# Phase 3: Set Orgname
curl -X POST http://localhost:5000/api/v1/organizations/set-orgname \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_CLERK_TOKEN" \
-d '{
  "organizationId": "ORG_ID",
  "orgname": "testcorp"
}'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Or start it
sudo systemctl start mongod
```

### Port Already in Use

```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Clerk Authentication Issues

1. Verify keys in `.env` files
2. Check Clerk dashboard for correct domain whitelist
3. Clear browser cookies and try again

### Subdomain Not Working

1. Check `/etc/hosts` file (if using Option 2)
2. Clear browser DNS cache: `chrome://net-internals/#dns`
3. Try different browser
4. Check backend logs for subdomain detection

### Razorpay Issues

1. Verify test keys from dashboard
2. Check webhook URL is accessible
3. Use Razorpay test cards for testing

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register/login with Clerk
- [ ] Can create organization (Phase 1)
- [ ] Email verification works (Phase 2)
- [ ] Real-time orgname check works (Phase 3)
- [ ] Organization appears in profile
- [ ] Subdomain URL works
- [ ] Payment flow works (if configured)
- [ ] Admin panel accessible on subdomain

---

## 🎯 Next Steps

1. **Production Deployment:**
   - Set up wildcard DNS for your domain
   - Configure SSL certificates
   - Replace in-memory cache with Redis
   - Set environment to `production`

2. **Email Service:**
   - Integrate SendGrid/AWS SES for verification emails
   - Create email templates

3. **Payment Testing:**
   - Use Razorpay test mode
   - Test payment flows
   - Configure webhook handlers

4. **Monitoring:**
   - Add error tracking (Sentry)
   - Set up logging (ELK stack)
   - Configure alerts

---

## 📚 Documentation

- **Backend API:** See `MULTI_TENANT_IMPLEMENTATION.md`
- **Frontend Components:** See `ADMIN_PANEL.md`
- **Error Fixes:** See `FIXES_APPLIED.md`
- **Quick Start:** See `QUICK_START_MULTI_TENANT.md`

---

**Status:** Complete installation guide for multi-tenant SaaS platform! 🎉
