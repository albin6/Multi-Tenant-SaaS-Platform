# Admin Panel Documentation

## Overview

The admin panel is a fully responsive, feature-rich dashboard for managing your enterprise application. It includes authentication, analytics, user management, reports, and settings.

## Features

### 🔐 Authentication
- **Login Page**: `/admin/login` - Secure login using Clerk authentication
- **Signup Page**: `/admin/signup` - Admin account registration
- **Protected Routes**: All admin routes except login/signup require authentication

### 📊 Dashboard (`/admin`)
- **Key Metrics**: Real-time statistics for users, revenue, sessions, and conversion rates
- **User Growth Chart**: Area chart showing total and active users over time
- **Revenue Chart**: Line chart displaying monthly revenue trends
- **Traffic Sources**: Bar chart for traffic analysis by source
- **User Activity**: Pie chart showing active, inactive, and pending users
- **Recent Activity Table**: Live feed of user actions

### 👥 Users Management (`/admin/users`)
- User listing with search and filters
- User stats (total, active, new, inactive)
- Role-based user management
- Status tracking (Active/Inactive)
- User profile quick actions

### 📈 Analytics (`/admin/analytics`)
- Performance metrics over 24 hours
- Response time tracking
- Request/error monitoring
- Device distribution analytics
- Top pages by views
- Real-time statistics

### 📄 Reports (`/admin/reports`)
- Pre-generated reports by category
- Report types: User Analytics, Financial, Technical, Marketing, Security
- Schedule automated reports
- Custom report builder
- Export options: PDF, Excel, CSV
- Download functionality

### ⚙️ Settings (`/admin/settings`)
- **General Settings**: App name, admin email, timezone
- **Notifications**: Email, push, and system alerts configuration
- **Security**: 2FA, session timeout, API key management
- **Integrations**: Email service, database backup, user analytics
- **Database Management**: Records count, size monitoring, backup controls

## Navigation

### Sidebar (Always Visible)
- Dashboard
- Users
- Analytics
- Reports
- Settings
- Responsive mobile menu with hamburger icon

### Navbar (Top)
- Search functionality
- Notification bell with live indicator
- User profile with dropdown
- Fully responsive design

## Responsive Design

### Mobile (< 768px)
- Collapsible sidebar with hamburger menu
- Stacked stat cards
- Single column layouts
- Touch-optimized buttons
- Mobile-friendly tables (horizontal scroll)

### Tablet (768px - 1024px)
- 2-column grid layouts
- Optimized chart sizes
- Sidebar toggle with overlay

### Desktop (> 1024px)
- Fixed sidebar (always visible)
- Multi-column layouts (up to 4 columns)
- Full-size charts and tables
- Optimal spacing and typography

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Clerk
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## Routes Structure

```
/admin
├── /login              # Admin login page
├── /signup             # Admin signup page
├── /                   # Dashboard (protected)
├── /users              # User management (protected)
├── /analytics          # Analytics page (protected)
├── /reports            # Reports page (protected)
└── /settings           # Settings page (protected)
```

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Add your Clerk credentials

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   - Navigate to `http://localhost:3000/admin/login`
   - Create an admin account or sign in

## Components

### Layout Components
- `Sidebar.tsx` - Responsive navigation sidebar
- `Navbar.tsx` - Top navigation bar with search and user menu

### Page Components
- `page.tsx` (Dashboard) - Main dashboard with charts and stats
- `users/page.tsx` - User management interface
- `analytics/page.tsx` - Detailed analytics and metrics
- `reports/page.tsx` - Report generation and downloads
- `settings/page.tsx` - Application settings

### Shared Components
- `ui/card.tsx` - Reusable card component
- `ui/button.tsx` - Button variants

## Customization

### Colors
Main theme color is controlled by `primary` in Tailwind config. Modify in `tailwind.config.js`:

```js
colors: {
  primary: '#3b82f6', // Change to your brand color
}
```

### Sidebar Menu
Edit menu items in `components/admin/Sidebar.tsx`:

```tsx
const menuItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  // Add more items here
];
```

### Charts Data
Update chart data in respective page components to connect to your API endpoints.

## Security

- All admin routes are protected by Clerk authentication middleware
- Session-based authentication with automatic token refresh
- CSRF protection enabled
- Secure environment variable handling
- Role-based access control ready

## Performance

- Server-side rendering for initial page loads
- Client-side navigation for instant page transitions
- Optimized chart rendering with ResponsiveContainer
- Lazy loading for images and heavy components
- Code splitting by route

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Charts not rendering
- Ensure `recharts` is installed: `npm install recharts`
- Check browser console for errors

### Authentication issues
- Verify Clerk credentials in `.env.local`
- Clear browser cache and cookies
- Check middleware configuration in `src/middleware.ts`

### Responsive issues
- Clear Tailwind cache: `rm -rf .next`
- Rebuild: `npm run build`

## Future Enhancements

- [ ] Real-time data updates with WebSockets
- [ ] Dark mode support
- [ ] Advanced filtering and sorting
- [ ] Bulk user actions
- [ ] Custom dashboard widgets
- [ ] Export functionality for all data tables
- [ ] Role-based permissions system
- [ ] Activity audit logs
