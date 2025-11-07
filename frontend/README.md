# Enterprise Frontend - Next.js 14 + Clerk Authentication

A modern, enterprise-grade frontend built with Next.js 14 App Router, TypeScript, TailwindCSS, and Clerk authentication.

## 🏗️ Architecture

This frontend follows a **feature-based architecture** with clear separation of concerns:

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with Clerk provider
│   ├── providers.tsx      # React Query provider
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── dashboard/         # Protected dashboard page
├── components/            # React components
│   ├── layout/           # Layout components (Navbar, Footer)
│   └── ui/               # Reusable UI components (Button, Card)
├── hooks/                # Custom React hooks
│   └── use-api.ts        # API data fetching hooks
├── lib/                  # Utility libraries
│   ├── utils.ts          # Helper functions
│   ├── api-client.ts     # Axios API client
│   └── react-query-client.ts  # React Query configuration
├── types/                # TypeScript type definitions
│   └── index.ts          # Shared types
└── styles/               # Global styles
    └── globals.css       # TailwindCSS globals
```

## 🚀 Features

### Authentication
- ✅ **Clerk Authentication** - Secure, production-ready auth
- ✅ **Protected Routes** - Middleware-based route protection
- ✅ **Session Management** - Automatic token refresh
- ✅ **User Management** - Profile and user data

### UI/UX
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Modern UI** - TailwindCSS with custom design system
- ✅ **Conditional Navbar** - Auth state-based rendering
- ✅ **Loading States** - Skeleton loaders and suspense

### Data Management
- ✅ **React Query** - Server state management
- ✅ **Caching** - Automatic data caching
- ✅ **Optimistic Updates** - Better UX with instant feedback
- ✅ **Type Safety** - Full TypeScript support

### Developer Experience
- ✅ **Hot Reload** - Fast refresh for development
- ✅ **TypeScript** - Type-safe development
- ✅ **ESLint** - Code quality enforcement
- ✅ **Path Aliases** - Clean imports with @/ prefix

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your credentials
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication Keys
# Get these from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Clerk URLs (default paths)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Getting Clerk Credentials

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select existing one
3. Navigate to **API Keys** section
4. Copy the keys:
   - `Publishable Key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret Key` → `CLERK_SECRET_KEY`
5. Paste them in your `.env.local` file

## 🏃 Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type check
npm run type-check

# Lint code
npm run lint
```

The app will be available at: **http://localhost:3000**

## 📄 Pages

### Public Pages
- **/** - Landing page with features and CTA
- **/login** - Login page with Clerk authentication
- **/signup** - Signup page with Clerk registration

### Protected Pages
- **/dashboard** - User dashboard (requires authentication)

## 🎨 Components

### Layout Components

**Navbar** (`components/layout/navbar.tsx`)
- Conditional rendering based on auth state
- Mobile-responsive with hamburger menu
- Integrates Clerk's UserButton component

### UI Components

**Button** (`components/ui/button.tsx`)
- Variants: default, outline, ghost, link
- Sizes: default, sm, lg
- Full TypeScript support

**Card** (`components/ui/card.tsx`)
- CardHeader, CardTitle, CardDescription
- CardContent, CardFooter
- Modular and composable

## 🔌 API Integration

### Custom Hooks

The application uses custom React Query hooks for API communication:

```typescript
// Fetch current user
const { data: user, isLoading } = useCurrentUser();

// Update user profile
const updateUser = useUpdateCurrentUser();
updateUser.mutate({ firstName: 'John' });

// Verify session
const { data: sessionUser } = useVerifySession();
```

### API Client

Centralized axios instance with interceptors:

```typescript
import { apiClient } from '@/lib/api-client';

// Automatic token attachment
const data = await apiClient.get('/users/me');
```

## 🔐 Authentication Flow

### 1. User Signs Up/Logs In
- User interacts with Clerk UI components
- Clerk creates a session and issues JWT token
- Token is stored in cookies/local storage

### 2. Protected Routes
- Middleware checks authentication status
- Redirects unauthenticated users to login
- Allows authenticated users to proceed

### 3. API Requests
- Custom hooks automatically attach Clerk token
- Backend verifies token with Clerk
- Returns user data from MongoDB

## 🎯 Protected Routes

The `middleware.ts` file handles route protection:

```typescript
// Public routes (accessible without auth)
publicRoutes: ['/', '/login', '/signup']

// All other routes require authentication
```

Add routes to `publicRoutes` array to make them accessible without authentication.

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Navbar transforms into mobile menu on smaller screens.

## 🎨 Styling

### TailwindCSS

Custom color system with CSS variables:

```css
--primary: 221.2 83.2% 53.3%
--secondary: 210 40% 96.1%
--accent: 210 40% 96.1%
```

### Utility Function

Use the `cn()` function to merge Tailwind classes:

```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-class', isActive && 'active-class')} />
```

## 🔄 React Query

### Configuration

```typescript
// Default options set in react-query-client.ts
staleTime: 5 minutes
cacheTime: 10 minutes
retry: 1 time
refetchOnWindowFocus: production only
```

### DevTools

React Query DevTools are available in development mode at the bottom-left corner.

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Styling**: TailwindCSS
- **State Management**: React Query
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Custom with TailwindCSS

## 🏗️ Adding New Pages

### 1. Create Page File

```typescript
// src/app/my-page/page.tsx
export default function MyPage() {
  return <div>My Page</div>;
}
```

### 2. Add to Middleware (if protected)

```typescript
// src/middleware.ts
publicRoutes: ['/', '/login', '/signup'] // Don't add here if protected
```

### 3. Add to Navbar (if needed)

```typescript
// src/components/layout/navbar.tsx
<Link href="/my-page">My Page</Link>
```

## 🧩 Adding New API Endpoints

### 1. Define Hook

```typescript
// src/hooks/use-api.ts
export function useMyData() {
  const { setToken } = useApiAuth();

  return useQuery({
    queryKey: ['my-data'],
    queryFn: async () => {
      await setToken();
      return await apiClient.get('/my-endpoint');
    },
  });
}
```

### 2. Use in Component

```typescript
const { data, isLoading, error } = useMyData();
```

## 🐛 Common Issues

### Issue: Clerk keys not working
**Solution**: Ensure you're using the correct keys from Clerk Dashboard and they're in `.env.local`

### Issue: API requests failing
**Solution**: Check that backend is running on `http://localhost:5000` and `NEXT_PUBLIC_API_URL` is correct

### Issue: Protected routes not working
**Solution**: Verify middleware configuration and Clerk provider is wrapping the app

### Issue: Styles not loading
**Solution**: Make sure TailwindCSS is properly configured and `globals.css` is imported in layout

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Add these to your hosting platform:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_API_URL` (your production backend URL)

## 📝 Best Practices

1. **Always use TypeScript** - Define types for all data
2. **Use React Query** - For all API calls
3. **Component composition** - Keep components small and reusable
4. **Path aliases** - Use `@/` instead of relative imports
5. **Responsive first** - Design for mobile, enhance for desktop
6. **Error handling** - Always handle loading and error states

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Add proper types and interfaces
4. Follow Tailwind utility-first approach
5. Test on mobile and desktop viewports

## 📄 License

MIT
