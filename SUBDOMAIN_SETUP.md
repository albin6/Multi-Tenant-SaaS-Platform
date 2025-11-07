# Subdomain Setup Guide

## 🌐 Multi-Tenant Subdomain Routing

Your application uses subdomain-based multi-tenancy where each organization gets its own subdomain:
- Organization "acme" → `http://acme.localhost:3000`
- Organization "test-org" → `http://test-org.localhost:3000`

---

## 🚀 Development Setup

### Option 1: Automatic (Most Browsers) ✅ RECOMMENDED

Most modern browsers (Chrome, Firefox, Safari) automatically resolve `*.localhost` to `127.0.0.1`, so subdomains **should work out of the box**:

```
✅ http://acme.localhost:3000          → Works automatically
✅ http://acme.localhost:3000/admin    → Works automatically
✅ http://test-org.localhost:3000      → Works automatically
```

**Just click the buttons and they should work!**

---

### Option 2: Manual `/etc/hosts` Setup (If Needed)

If subdomains don't work automatically, add them to your hosts file:

#### **macOS / Linux**

1. **Open terminal and edit hosts file:**
   ```bash
   sudo nano /etc/hosts
   ```

2. **Add your organization subdomains:**
   ```
   127.0.0.1 localhost
   127.0.0.1 acme.localhost
   127.0.0.1 test-org.localhost
   127.0.0.1 mycompany.localhost
   ```

3. **Save and exit** (Ctrl+O, Enter, Ctrl+X)

4. **Flush DNS cache:**
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Linux
   sudo systemctl restart systemd-resolved
   ```

#### **Windows**

1. **Open Notepad as Administrator**

2. **Open file:**
   ```
   C:\Windows\System32\drivers\etc\hosts
   ```

3. **Add your organization subdomains:**
   ```
   127.0.0.1 localhost
   127.0.0.1 acme.localhost
   127.0.0.1 test-org.localhost
   127.0.0.1 mycompany.localhost
   ```

4. **Save the file**

5. **Flush DNS cache:**
   ```cmd
   ipconfig /flushdns
   ```

---

## 🎯 How It Works

### 1. **User Creates Organization**
```
Navigate to: /create-organization
Set orgname: "acme"
Organization created with orgname: "acme"
```

### 2. **Backend Subdomain Detection**
When you visit `http://acme.localhost:3000`:

```typescript
// Backend middleware extracts subdomain
const subdomain = "acme"; // From acme.localhost:3000

// Loads organization by orgname
const org = await Organization.findOne({ orgname: subdomain });

// Injects into request context
req.organization = org;
```

### 3. **Organization Context Available**
All routes on `acme.localhost:3000` have access to the organization:
- `/` → Organization landing page
- `/admin` → Organization admin panel
- `/api/*` → Organization-scoped APIs

---

## 📍 URLs Reference

### **Main Application**
```
http://localhost:3000              → Landing page
http://localhost:3000/dashboard    → User dashboard
http://localhost:3000/create-organization → Create org wizard
http://localhost:3000/profile/organizations → My organizations
http://localhost:3000/pricing      → Pricing plans
```

### **Organization Subdomains** (after creating an org)
```
http://acme.localhost:3000         → Organization site
http://acme.localhost:3000/admin   → Organization admin panel
```

---

## 🧪 Testing Subdomain Routing

### 1. **Create a Test Organization**
```bash
# Go to the create organization page
http://localhost:3000/create-organization

# Fill in details:
Company Name: Acme Corporation
Email: admin@acme.com
Orgname: acme

# Complete all 3 phases
```

### 2. **Access the Subdomain**
```bash
# Visit your organization
http://acme.localhost:3000

# Access admin panel
http://acme.localhost:3000/admin
```

### 3. **Use Organization Profile Buttons**
```bash
# Go to your organizations
http://localhost:3000/profile/organizations

# Click "Visit Site" → Opens http://acme.localhost:3000
# Click "Admin Panel" → Opens http://acme.localhost:3000/admin
```

---

## 🔧 Troubleshooting

### **Problem: "This site can't be reached"**

**Solution 1:** Browser should auto-resolve `*.localhost` - try Chrome/Firefox
**Solution 2:** Add to `/etc/hosts` as shown above
**Solution 3:** Clear browser cache and DNS cache

### **Problem: "Organization not found"**

**Check:**
1. ✅ Organization created successfully (check `/profile/organizations`)
2. ✅ Orgname matches subdomain (e.g., `acme` → `acme.localhost:3000`)
3. ✅ Backend server is running on port 5000
4. ✅ Frontend proxy is configured correctly

### **Problem: Admin panel shows 404**

**Check:**
1. ✅ Frontend is running on port 3000
2. ✅ `/admin` route exists in `frontend/src/app/admin/`
3. ✅ Clerk authentication is working

---

## 🌍 Production Setup

For production with a real domain (e.g., `yourdomain.com`):

### 1. **Configure DNS (Wildcard)**
```
Type: A Record
Name: *
Value: YOUR_SERVER_IP
TTL: 3600
```

This creates:
- `acme.yourdomain.com` → Your Server
- `test-org.yourdomain.com` → Your Server
- Any orgname → Your Server

### 2. **Update Environment Variables**

**Backend `.env`:**
```env
BASE_URL=yourdomain.com
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_BASE_URL=yourdomain.com
```

### 3. **SSL Certificate (Wildcard)**
```bash
# Let's Encrypt with Certbot
sudo certbot certonly --manual --preferred-challenges dns -d *.yourdomain.com -d yourdomain.com
```

### 4. **Nginx Configuration Example**
```nginx
server {
    listen 80;
    server_name *.yourdomain.com yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## ✅ Quick Test Checklist

- [ ] Main app accessible at `http://localhost:3000`
- [ ] Can create organization with orgname
- [ ] Organization appears in `/profile/organizations`
- [ ] "Visit Site" button works
- [ ] "Admin Panel" button works
- [ ] Subdomain URL opens in new tab
- [ ] Subdomain shows correct organization context

---

## 💡 Tips

### **Development**
- Use simple orgnames: `test`, `demo`, `acme`
- Keep them short and lowercase
- No special characters except hyphens

### **Production**
- Set up wildcard DNS before deploying
- Use wildcard SSL certificate
- Test subdomain routing before going live
- Monitor subdomain performance

---

## 📚 Related Documentation

- **Multi-Tenant Implementation:** `MULTI_TENANT_IMPLEMENTATION.md`
- **Backend Middleware:** `backend/src/core/middleware/subdomain.middleware.ts`
- **Organization Model:** `backend/src/modules/organization/models/organization.model.ts`

---

**Your subdomain routing is now configured!** 🎉

Just click "Admin Panel" or "Visit Site" and it should open `http://orgname.localhost:3000` in a new tab!
