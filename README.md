# AUTH-SHOP

A full-stack web application for managing shop with user authentication and shop management capabilities.

##  Tech Stack

### Frontend
- **React** with TypeScript
- **TailwindCSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **React Hook Form** for form handling
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Zod** for validation

##  Features

### Authentication System
-  User registration and login
-  JWT-based authentication
-  Password encryption with bcrypt
-  Protected routes with middleware
-  Redux persist User for session management

### User Management
-  Shop creation while creating user
-  Dashboard for users and shops

### Core Features
-  User registration with username/password
-  Secure login with JWT tokens
-  User profile retrieval
-  Shop name management
-  Protected API routes
### Sub features
-  Form validation with Zod
-  Error handling and notifications
-  Responsive design with TailwindCSS
-  Database error handling (validation, unique constraints, etc.)
-  Environment variable management
-  CORS enabled for cross-origin requests

##  Project Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm package manager

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/alamin147/auth-implementation.git
cd auth-implementation
```

#### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
copy all from .env.example into .env
# DATABASE_URL=
# BCRYPT_SALTROUNDS=
# JWT_EXPIRES_IN=
# JWT_SECRETS=
# PORT=
# CLIENT_URL=

# Start the server locally
npm start
```

#### 3. Frontend Setup
```bash
cd client
npm install

# Create .env file
copy all from .env.example into .env
# VITE_SERVER_URI=
# VITE_PRODUCTION=
npm run dev
```

#### 4. Access the Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Live Links
- Frontend: [Link](https://auth-shop-five.vercel.app)
- Backend: [Link](https://auth-shop-server.vercel.app)

### Production Setup

#### Backend Deployment
```bash
cd server
npm run build
npm start
```

#### Frontend Deployment
```bash
cd client
npm run build
# Deploy the dist/ folder to your hosting service
```
#### vercel
```bash
I used vercel for deployment, so i ran
vercel --prod (after creating a vercel project through the vercel CLI)
```

##  API Documentation

### Base URL (All detailed endpoints are given in screenshots folder)
```
Local: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### POST `/signup`
Register a new user
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "uuid",
      "username": "string"
    }
  }
}
```

#### POST `/signin`
Login user
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "uuid",
      "username": "string"
    }
  }
}
```

#### GET `/profile`
Get current user profile (Protected)

**Headers:**
```
Authorization: <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "shopNames": [
      {
        "id": "uuid",
        "name": "string"
      }
    ]
  }
}
```

#### GET `/user/:userId`
Get user by ID (Protected)

**Headers:**
```
Authorization: <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "shopNames": []
  }
}
```

##  Token/Session Handling

### JWT Authentication Flow

#### 1. Token Generation
- User signs up or signs in successfully
- Server generates JWT token with user payload
- Token expires in <b>30 mins</b> if remember me is not checked, otherwise <b>7 days</b>
- Token is sent to client in response

#### 2. Token Storage (Frontend)
```typescript
// Redux store with persistence
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user']
}
```
- JWT token stored in Redux store
- Redux-persist saves token to localStorage
- Automatic rehydration on app reload

#### 3. Token Usage
```typescript
// API interceptor automatically adds token
headers: {
  Authorization: `${token}`
}
```

#### 4. Token Validation (Backend)
```typescript
// Auth middleware validates every protected route
const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user to request
    req.user = decoded;
    next();
  }
}
```

### Security Features
-  Passwords hashed with bcrypt (salt rounds: 16)
-  JWT tokens with expiration
-  Protected routes with middleware validation
-  CORS enabled for cross-origin requests
-  Input validation with Zod schemas

##  Database Schema

### User Model
```prisma
model User {
  id        String     @id @default(uuid())
  username  String     @unique
  password  String
  shopNames ShopName[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

### ShopName Model
```prisma
model ShopName {
  id     String @id @default(uuid())
  name   String @unique
  userId String
  user   User   @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

##  Project Structure

```
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── auth/          # Auth utilities
│   │   └── utils/         # Helper functions
│   └── public/            # Static assets
│
├── server/                # Express backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/      # Auth module
│   │   │   ├── config/    # App configuration
│   │   │   ├── middlewares/ # Custom middlewares
│   │   │   └── routes/    # API routes
│   │   └── prisma/        # Database schema
│   └── migrations/        # Database migrations
```

##  Development Scripts

### Backend
```bash
npm start          # Start development server
npm run migrate    # Run database migrations
npm run studio     # Open Prisma Studio
npm run build      # Build for production
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```
