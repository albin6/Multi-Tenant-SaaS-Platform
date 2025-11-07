# Payment Development Guide

## Webhook Alternatives for Development

### ✅ Option 1: Mock Payment Service (Recommended for Dev)

**No Razorpay credentials needed!** Just leave the `.env` file without Razorpay keys:

```bash
# .env - Remove or comment out Razorpay credentials
# RAZORPAY_KEY_ID=
# RAZORPAY_KEY_SECRET=
# RAZORPAY_WEBHOOK_SECRET=
```

**How it works:**
- Backend automatically uses `MockPaymentService` when credentials are missing
- Frontend detects mock orders (starting with `order_mock_`) and skips Razorpay checkout
- Subscriptions are activated immediately without real payment
- Perfect for testing subscription flows

**Usage:**
1. Remove Razorpay credentials from `.env`
2. Restart backend: `npm run dev`
3. Select a plan - it will activate instantly!

---

### ✅ Option 2: Razorpay Test Mode (No Webhook)

**Use test credentials but skip webhooks:**

```bash
# .env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxx
# RAZORPAY_WEBHOOK_SECRET= # Leave empty
```

**Test cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

**How it works:**
- Real Razorpay checkout UI
- Test mode - no real money
- Uses `/verify` endpoint instead of webhooks
- Perfect for testing payment UI/UX

---

### ✅ Option 3: Full Razorpay with Webhooks (Production-like)

**Only needed if:**
- Testing async payment methods
- Testing webhook-specific features
- Testing production flow

**Setup:**
1. Get Razorpay credentials from https://dashboard.razorpay.com
2. Expose localhost via ngrok: `ngrok http 5000`
3. Add webhook URL in Razorpay Dashboard:
   ```
   https://your-ngrok-url.ngrok-free.dev/api/v1/payments/webhook
   ```
4. Copy webhook secret to `.env`:
   ```bash
   RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## Current Setup

Your app now supports **ALL THREE** options automatically:

| Scenario | Backend Behavior | Frontend Behavior |
|----------|------------------|-------------------|
| No credentials | Uses MockPaymentService | Skips Razorpay checkout |
| Test credentials only | Uses RazorpayService (test mode) | Shows Razorpay checkout |
| Full credentials + webhook | Uses RazorpayService (production) | Shows Razorpay checkout |

## Recommendations

### For Development (Local)
✅ **Use Mock Payment Service** - Fastest, no external dependencies

### For Staging
✅ **Use Razorpay Test Mode** - Test UI without webhooks

### For Production
✅ **Use Full Razorpay with Webhooks** - Complete payment flow

## API Endpoints

### Manual Payment Flow (Works in all modes)
1. `POST /api/v1/payments/create-order` - Create order
2. Frontend handles payment
3. `POST /api/v1/payments/verify` - Verify & activate

### Webhook Flow (Production only)
1. `POST /api/v1/payments/create-order` - Create order
2. Frontend handles payment
3. `POST /api/v1/payments/webhook` - Razorpay sends webhook
4. Subscription activated automatically

## Testing Workflow

### Test Mock Payment
```bash
# 1. Remove Razorpay credentials
# 2. Restart backend
npm run dev

# 3. Go to pricing page, select plan
# 4. Subscription activates instantly!
```

### Test Real Payment (Test Mode)
```bash
# 1. Add test credentials to .env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# 2. Restart backend
npm run dev

# 3. Select plan, use test card: 4111 1111 1111 1111
# 4. Complete payment, subscription activates
```

## Benefits

✅ **No ngrok needed for development**
✅ **No webhook configuration needed**  
✅ **Faster development cycle**
✅ **Easy testing of subscription flows**
✅ **Seamless switch to production**

## Files Modified

- `backend/src/modules/payment/services/mock-payment.service.ts` - New mock service
- `backend/src/modules/payment/controllers/payment.controller.ts` - Auto-detects mode
- `backend/src/core/middleware/subdomain.middleware.ts` - Skip /health, /api
- `frontend/src/app/(main)/pricing/page.tsx` - Detects mock orders

## Summary

**For development: Just remove Razorpay credentials and everything works!**  
No webhooks, no ngrok, no hassle. 🚀
