# Enterprise Backend - Clean Architecture & DDD

A production-ready backend built with Node.js, Express, TypeScript, and MongoDB, following Clean Architecture and Domain-Driven Design principles.

## 🏗️ Architecture

This project follows **Clean Architecture** and **Domain-Driven Design (DDD)** patterns with a clear separation of concerns:

```
src/
├── core/                    # Core infrastructure layer
│   ├── config/             # Configuration management
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── modules/                # Feature modules (DDD)
│   ├── auth/              # Authentication module
│   │   ├── controllers/   # HTTP request handlers
│   │   ├── services/      # Business logic
│   │   ├── dto/           # Data Transfer Objects
│   │   └── routes/        # Route definitions
│   └── user/              # User module
│       ├── controllers/   # HTTP request handlers
│       ├── services/      # Business logic
│       ├── repositories/  # Data access layer
│       ├── models/        # MongoDB schemas
│       ├── dto/           # Data Transfer Objects
│       └── routes/        # Route definitions
├── shared/                # Shared resources
│   ├── interfaces/        # Common interfaces
│   └── constants/         # Application constants
├── app.ts                 # Express app configuration
└── server.ts              # Server entry point
```

### Layered Architecture Flow

```
Request → Route → Controller → Service → Repository → Database
                      ↓
                  Middleware
                  (Auth, Validation, Error Handling)
```

## 🚀 Features

### Core Infrastructure
- ✅ **TypeScript** - Full type safety
- ✅ **Express.js** - Fast, minimalist web framework
- ✅ **MongoDB + Mongoose** - Database with ODM
- ✅ **Clean Architecture** - Separation of concerns
- ✅ **DDD Patterns** - Domain-driven design
- ✅ **Modular Structure** - Feature-based modules

### Security & Middleware
- ✅ **Clerk Authentication** - JWT token verification
- ✅ **Helmet** - Security headers
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **Rate Limiting** - API request throttling
- ✅ **Validation** - Request validation with Zod
- ✅ **Error Handling** - Centralized error management

### Development Tools
- ✅ **ESLint + Prettier** - Code quality and formatting
- ✅ **Pino Logger** - High-performance logging
- ✅ **Hot Reload** - ts-node-dev for development
- ✅ **Environment Variables** - dotenv configuration

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your credentials
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

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

# Clerk Configuration
# Get these from https://dashboard.clerk.com
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Getting Clerk Credentials

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select existing one
3. Navigate to **API Keys** section
4. Copy the `Secret Key` and `Publishable Key`
5. Paste them in your `.env` file

## 🏃 Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Authentication
```
GET  /api/v1/auth/health          # Auth service health check
POST /api/v1/auth/webhook/clerk   # Clerk webhook handler
GET  /api/v1/auth/verify          # Verify user session (Protected)
```

### Users
```
GET    /api/v1/users/me           # Get current user profile (Protected)
PATCH  /api/v1/users/me           # Update current user profile (Protected)
GET    /api/v1/users              # Get all users (Protected/Admin)
GET    /api/v1/users/:id          # Get user by ID (Protected)
PATCH  /api/v1/users/:id          # Update user by ID (Protected/Admin)
DELETE /api/v1/users/:id          # Delete user by ID (Protected/Admin)
```

## 🔐 Authentication Flow

### 1. User Signs Up/Logs In (Frontend with Clerk)
- User interacts with Clerk UI components on frontend
- Clerk handles authentication and creates session

### 2. Clerk Webhook Syncs User to Backend
```
POST /api/v1/auth/webhook/clerk
```
- Clerk sends webhook on user.created or user.updated
- Backend creates/updates user in MongoDB
- User data is synced between Clerk and your database

### 3. Protected API Requests
- Frontend sends Clerk session token in Authorization header
- Backend verifies token with Clerk
- Attaches user info to request
- Proceeds with business logic

```typescript
// Example request from frontend
headers: {
  'Authorization': 'Bearer <clerk_session_token>'
}
```

## 🏛️ Design Patterns

### Repository Pattern
Abstracts data access logic from business logic:

```typescript
// Repository - Data access layer
class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }
}
```

### Service Layer Pattern
Contains business logic and orchestrates repositories:

```typescript
// Service - Business logic layer
class UserService {
  async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}
```

### Controller Pattern
Handles HTTP requests and responses:

```typescript
// Controller - Presentation layer
class UserController {
  getUserById = asyncHandler(async (req, res) => {
    const user = await this.userService.getUserById(req.params.id);
    res.json({ status: 'success', data: { user } });
  });
}
```

## 🧪 Error Handling

Centralized error handling with custom error classes:

```typescript
// Throw custom errors anywhere in your code
throw new NotFoundError('Resource not found');
throw new UnauthorizedError('Invalid credentials');
throw new ValidationError('Invalid input data');

// Errors are automatically caught and formatted
```

## 📝 Validation

Request validation using Zod schemas:

```typescript
// Define schema
const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
});

// Apply to route
router.post('/', validate(createUserSchema), controller.create);
```

## 📊 Logging

Structured logging with Pino:

```typescript
logger.info({ userId: user._id }, 'User created successfully');
logger.error({ error, userId }, 'Failed to create user');
```

## 🔒 Security Best Practices

- **Helmet**: Sets security HTTP headers
- **CORS**: Restricts cross-origin requests
- **Rate Limiting**: Prevents abuse
- **JWT Verification**: Validates Clerk tokens
- **Input Validation**: Zod schema validation
- **Error Sanitization**: Hides sensitive info in production

## 🚦 Production Considerations

### Database
- Use MongoDB Atlas for managed database
- Set up connection pooling (already configured)
- Enable database indexes (already set on User model)

### Security
- Use strong JWT secrets (minimum 32 characters)
- Enable HTTPS in production
- Set up proper CORS origins
- Configure rate limits based on traffic
- Set up Clerk webhook secret verification

### Monitoring
- Integrate APM tools (e.g., New Relic, DataDog)
- Set up error tracking (e.g., Sentry)
- Monitor logs with log aggregation service

### Scaling
- Use horizontal scaling with load balancer
- Set up Redis for session management (if needed)
- Enable database read replicas for heavy read traffic

## 🧩 Adding New Modules

To add a new feature module:

1. Create module directory: `src/modules/[module-name]/`
2. Add layers:
   - `models/` - Database schemas
   - `dto/` - Validation schemas
   - `repositories/` - Data access
   - `services/` - Business logic
   - `controllers/` - Request handlers
   - `routes/` - Route definitions
3. Register routes in `src/app.ts`

Example:
```typescript
// src/modules/product/routes/product.routes.ts
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const controller = new ProductController();

router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;

// Register in src/app.ts
import productRoutes from './modules/product/routes/product.routes';
app.use('/api/v1/products', productRoutes);
```

## 📚 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Validation**: Zod
- **Logging**: Pino
- **Security**: Helmet, CORS
- **Code Quality**: ESLint, Prettier

## 🤝 Contributing

1. Follow the existing architecture patterns
2. Maintain layer separation (Controller → Service → Repository)
3. Add proper TypeScript types
4. Include error handling
5. Add logging for important operations
6. Validate all inputs with Zod schemas
7. Write meaningful comments

## 📄 License

MIT
