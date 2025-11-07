# Email Verification Fix - Phase 2

## ❌ Issue
Error when verifying email in Phase 2:
```
Invalid verification token
```

Even though the correct token was being passed from the frontend.

## 🔍 Root Cause

The Organization schema had `verificationToken` and `verificationTokenExpiry` marked with `select: false`:

```typescript
verificationToken: {
  type: String,
  select: false,  // ❌ Not included in queries by default
},
verificationTokenExpiry: {
  type: Date,
  select: false,  // ❌ Not included in queries by default
},
```

When `verifyEmail` service called `repository.findById()`, the token fields were not retrieved, causing the comparison to always fail:

```typescript
// This query didn't include verificationToken
const organization = await this.repository.findById(organizationId);

// So this check always failed
if (!organization.verificationToken || 
    organization.verificationToken !== verificationToken) {
  throw new BadRequestError('Invalid verification token'); // ❌ Always thrown
}
```

## ✅ Fix Applied

### 1. Added New Repository Method
**File:** `organization.repository.ts`

```typescript
/**
 * Find organization by ID with verification token (for email verification)
 */
async findByIdWithToken(id: string): Promise<IOrganization | null> {
  try {
    return await OrganizationModel.findById(id)
      .select('+verificationToken +verificationTokenExpiry');
      // ✅ The '+' prefix includes fields with select: false
  } catch (error) {
    logger.error({ error, id }, 'Error finding organization with token');
    throw error;
  }
}
```

### 2. Updated Service to Use New Method
**File:** `organization.service.ts`

```typescript
async verifyEmail(
  organizationId: string,
  verificationToken: string
): Promise<IOrganization> {
  try {
    // ✅ Use findByIdWithToken instead of findById
    const organization = await this.repository.findByIdWithToken(organizationId);
    
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // ✅ Now verificationToken is available for comparison
    if (
      !organization.verificationToken ||
      organization.verificationToken !== verificationToken
    ) {
      throw new BadRequestError('Invalid verification token');
    }
    
    // Rest of verification logic...
  }
}
```

## 🎯 How It Works Now

### Phase 2: Email Verification Flow

1. **User submits verification token** from frontend
   ```json
   POST /api/v1/organizations/verify-email
   {
     "organizationId": "xxx",
     "verificationToken": "abc123..."
   }
   ```

2. **Backend retrieves org with token** ✅
   ```typescript
   const organization = await this.repository.findByIdWithToken(organizationId);
   // Now includes: verificationToken, verificationTokenExpiry
   ```

3. **Token validation succeeds** ✅
   ```typescript
   if (organization.verificationToken === verificationToken) {
     // ✅ Match found!
   }
   ```

4. **Email verified** ✅
   ```typescript
   await this.repository.verifyEmail(organizationId);
   // Updates:
   // - isEmailVerified: true
   // - status: 'pending_orgname'
   // - Removes verificationToken fields
   ```

## 🔐 Security Note

The `select: false` on verification tokens is a **good security practice**:
- Tokens are NOT returned in normal queries
- They're only retrieved when explicitly needed (like verification)
- Prevents accidental token exposure in API responses

The fix maintains this security by:
- Only selecting tokens in the verification flow
- Immediately removing tokens after successful verification
- Not returning tokens in the response

## ✅ Testing

### Test Email Verification

```bash
# 1. Create organization (Phase 1)
curl -X POST http://localhost:5000/api/v1/organizations/phase1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "companyEmail": "test@example.com",
    "companyAddress": {
      "street": "123 Main St",
      "city": "City",
      "state": "State",
      "country": "Country",
      "zipCode": "12345"
    }
  }'

# Response includes (in development):
# { "verificationToken": "abc123..." }

# 2. Verify email (Phase 2)
curl -X POST http://localhost:5000/api/v1/organizations/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "xxx",
    "verificationToken": "abc123..."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now create your orgname.",
  "data": {
    "organizationId": "xxx",
    "status": "pending_orgname"
  }
}
```

## 📊 Key Takeaways

### Why `select: false`?
- **Security:** Sensitive fields not exposed in normal queries
- **Performance:** Reduces data transfer for unnecessary fields
- **Best Practice:** Common for tokens, passwords, etc.

### How to Access `select: false` Fields?
```typescript
// Method 1: Use .select('+fieldName')
Model.findById(id).select('+verificationToken')

// Method 2: Use .select() with explicit fields
Model.findById(id).select('verificationToken verificationTokenExpiry')
```

### When to Use?
- Password verification
- Token validation
- Sensitive data operations
- When you explicitly need excluded fields

## 🚀 Result

✅ Email verification now works correctly
✅ Tokens are properly validated
✅ Security is maintained with `select: false`
✅ 3-phase workflow proceeds smoothly

---

**Status:** ✅ FIXED - Email verification fully functional
