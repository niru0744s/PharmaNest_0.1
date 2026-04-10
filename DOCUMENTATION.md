# PharmaNest - Complete Documentation

**Version:** 1.0.0  
**Last Updated:** April 2026

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Backend Documentation](#backend-documentation)
7. [Frontend Documentation](#frontend-documentation)
8. [API Endpoints](#api-endpoints)
9. [Database Schema](#database-schema)
10. [Key Features Implementation](#key-features-implementation)
11. [Security & Best Practices](#security--best-practices)
12. [Development Workflow](#development-workflow)
13. [Troubleshooting](#troubleshooting)
14. [Contributing Guidelines](#contributing-guidelines)

---

## 🎯 Project Overview

**PharmaNest** is a production-grade, full-stack healthcare and pharmacy marketplace platform that bridges the gap between healthcare providers, pharmacists, and patients. It combines modern technology with healthcare services to provide a seamless, secure, and intelligent ecosystem.

### Key Objectives

- **Dual Role Architecture**: Support both patients (Users) and healthcare providers (Hosts/Sellers)
- **AI-Powered Services**: Integrate intelligent healthcare consultations
- **Secure Transactions**: Enable frictionless, secure payment processing
- **Real-time Communication**: Provide live notifications and updates
- **Advanced Analytics**: Offer data-driven insights for sellers

### Core Features

| Feature | Description |
|---------|-------------|
| **User Management** | Patient profiles, health tracking, account management |
| **Product Marketplace** | Browse, search, and purchase healthcare products |
| **AI Consultations** | AI-powered medical consultations via OpenAI & Google Gemini |
| **Seller Dashboard** | Real-time analytics, inventory management, order processing |
| **Payment Integration** | Secure Razorpay payment gateway integration |
| **Real-time Updates** | Socket.io integration for live notifications |
| **Order Management** | Order tracking, automated status updates, invoice generation |
| **Consultation System** | Book and manage AI consultations |
| **Reviews & Ratings** | Product reviews and seller ratings |

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React + TypeScript)              │
│                  Vite Dev Server | Build                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ (HTTP/WebSocket)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)               │
│  ┌─────────────┬──────────────┬────────────┬──────────────┐ │
│  │ Controllers │ Routes       │ Middleware │ Jobs/Crons   │ │
│  └─────────────┴──────────────┴────────────┴──────────────┘ │
│                           ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │            MongoDB Database (Mongoose ORM)              │ │
│  │  Users │ Products │ Orders │ Consultations │ Reviews    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
    ┌─────────────────────┼─────────────────────┐
    ↓                     ↓                     ↓
┌─────────┐         ┌──────────┐         ┌──────────┐
│ Razorpay│         │Cloudinary│         │Resend    │
│ (Payment)│         │(Storage) │         │(Email)   │
└─────────┘         └──────────┘         └──────────┘
    
    ┌─────────────────────┬─────────────────────┐
    ↓                     ↓                     
┌─────────────┐    ┌──────────────┐    
│   OpenAI    │    │Google Gemini │    
│  (AI API)   │    │  (AI API)    │    
└─────────────┘    └──────────────┘    
```

### Design Patterns

1. **MVC Pattern**: Controllers handle business logic, Routes define endpoints
2. **Repository Pattern**: Mongoose models act as data access layer
3. **Middleware Pattern**: Express middleware for authentication, validation, error handling
4. **Job Scheduler**: Node-cron for background tasks (inventory monitoring, order progression)
5. **Real-time Events**: Socket.io for live updates and notifications

---

## 🛠️ Tech Stack

### Frontend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19.x | UI library with Hooks |
| **Build Tool** | Vite | 6.x | Lightning-fast build tool |
| **Language** | TypeScript | 5.7.x | Type-safe JavaScript |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **Animations** | Framer Motion | 12.x | Advanced animations |
| **Icons** | Lucide React, React Icons | Latest | Icon libraries |
| **HTTP Client** | Axios | 1.13.x | API requests |
| **Routing** | React Router | 7.x | Client-side routing |
| **State** | React Context + Props | - | State management |
| **Charts** | Recharts | 3.7.x | Data visualization |
| **Toast Notifications** | React Hot Toast | 2.6.x | Toast UI notifications |
| **WebSocket** | Socket.io-client | 4.8.x | Real-time communication |
| **Markdown** | React Markdown | 10.x | Markdown rendering |

### Backend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Framework** | Express | 5.x | Web server framework |
| **Database** | MongoDB | Latest | NoSQL database |
| **ODM** | Mongoose | 8.x | MongoDB object modeling |
| **Authentication** | JWT | 9.x | Token-based auth |
| **Password Hashing** | Bcrypt | 5.x | Secure password hashing |
| **Real-time** | Socket.io | 4.8.x | WebSocket library |
| **Job Scheduler** | Node-cron | 4.2.x | Background tasks |
| **File Upload** | Multer | 1.4.x | Form data parsing |
| **Cloud Storage** | Cloudinary | 1.41.x | Image hosting |
| **Email Service** | Resend/Nodemailer | 6.9.x/7.x | Transactional emails |
| **Payment Gateway** | Razorpay | 2.9.x | Payment processing |
| **AI APIs** | OpenAI, Google Generative AI | Latest | AI consultations |
| **Validation** | Joi | 17.x | Schema validation |
| **Security** | Helmet | 8.x | HTTP header security |
| **Sanitization** | express-mongo-sanitize, xss-filters | Latest | Injection prevention |
| **Rate Limiting** | express-rate-limit | 8.x | DDoS protection |
| **PDF Generation** | PDFKit | 0.17.x | Invoice generation |
| **Logging** | Morgan | 1.10.x | HTTP request logging |
| **CORS** | cors | 2.8.x | Cross-origin requests |

---

## 📂 Project Structure

### Root Directory

```
Pharmanest/
├── backend/              # Node.js Server Application
├── frontend/             # React TypeScript Application
├── .git/                 # Git repository
├── .gitignore            # Git ignore rules
└── README.md             # Quick start guide
```

### Backend Structure

```
backend/
├── app.js                    # Express application entry point
├── schema.js                 # Joi validation schemas
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
│
├── config/
│   └── razorpay.js          # Razorpay configuration
│
├── controllers/             # Business logic layer
│   ├── User/
│   │   ├── AuthController.js       # User authentication
│   │   ├── ProductsController.js   # Product browsing
│   │   ├── OrderController.js      # Order management
│   │   ├── paymentController.js    # Payment processing
│   │   ├── aiChatController.js     # AI chat interactions
│   │   └── VerificationController.js
│   ├── host/
│   │   ├── hostController.js           # Host auth & profile
│   │   ├── SellerOrderController.js    # Seller order management
│   │   ├── SellerAnalyticsController.js # Analytics dashboard
│   │   └── BulkProductController.js    # Bulk operations
│   ├── Products/
│   │   ├── ProductController.js    # Product CRUD
│   │   ├── SearchController.js     # Product search
│   │   └── ReviewController.js     # Product reviews
│   ├── Order/
│   │   └── InvoiceController.js    # Invoice generation
│   ├── Payment/
│   │   ├── PaymentController.js    # Payment handling
│   │   └── RefundController.js     # Refund processing
│   ├── Consultation/
│   │   └── consultationController.js  # Consultation booking
│   ├── aiController.js             # AI service orchestration
│   └── ...
│
├── modules/                # Mongoose Database Schemas
│   ├── User.js                 # User model
│   ├── Host.js                 # Host/Seller model
│   ├── Doctor.js               # Doctor model
│   ├── Products.js             # Product schema
│   ├── orders.js               # Order schema
│   ├── Consultation.js         # Consultation schema
│   ├── Chat.js                 # Chat messages schema
│   ├── reviews.js              # Product reviews
│   ├── CartItems.js            # Shopping cart
│   ├── WishList.js             # User wishlists
│   ├── Prescription.js         # Medical prescriptions
│   ├── RefreshToken.js         # Token management
│   ├── VerificationToken.js    # Email verification
│   ├── Locations.js            # Location data
│   └── ...
│
├── routes/                 # API Route Handlers
│   ├── auth.js                      # General auth routes
│   ├── userAuth.js                  # User-specific auth
│   ├── hostsAuth.js                 # Host-specific auth
│   ├── products.js                  # Product endpoints
│   ├── userProducts.js              # User product interactions
│   ├── userOrders.js                # User order management
│   ├── sellerOrders.js              # Seller order management
│   ├── payment.js                   # Payment routes
│   ├── consultations.js             # Consultation booking
│   ├── ai.js                        # AI endpoints
│   ├── analytics.js                 # Analytics dashboard
│   ├── reviews.js                   # Review management
│   ├── verification.js              # Email verification
│   ├── userAddress.js               # Address management
│   ├── bulkOperations.js            # Bulk operations
│   └── ...
│
├── middleware/             # Express Middleware
│   ├── tokenVerify.js      # JWT verification
│   ├── rbac.js             # Role-based access control
│   ├── errorMiddleware.js  # Global error handling
│   ├── schemaValidate.js   # Input validation
│   └── ...
│
├── jobs/                   # Background Tasks (Cron Jobs)
│   ├── orderProgression.js      # Auto-update order status
│   ├── inventoryMonitor.js      # Monitor low inventory
│   ├── checkOrder.js            # Check order status
│   ├── testProgression.js       # Test status updates
│   ├── findNullOrders.js        # Find incomplete orders
│   └── listOrders.js            # List order details
│
├── utils/                  # Utility Functions
│   ├── asyncHandler.js     # Async error wrapper
│   ├── ErrorResponse.js    # Custom error class
│   ├── socket.js           # Socket.io events
│   ├── emailService.js     # Email sending
│   ├── pdfGenerator.js     # PDF invoice generation
│   └── ...
│
├── init/                   # Database Initialization
│   ├── init.js             # Setup scripts
│   └── data.js             # Sample data
│
├── scripts/                # Utility Scripts
│   ├── testEmail.js        # Test email service
│   ├── testRazorpay.js     # Test payment integration
│   └── testAI.js           # Test AI APIs
│
├── cloudConfig.js          # Cloudinary configuration
├── node_modules/           # Dependencies
├── uploads/                # Temporary file uploads
└── render.yaml             # Deployment configuration
```

### Frontend Structure

```
frontend/
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Root component
│   ├── index.css                # Global styles
│   ├── App.css                  # App-specific styles
│   ├── vite-env.d.ts            # Vite environment types
│   │
│   ├── components/              # Reusable UI Components
│   │   ├── auth/               # Authentication components
│   │   ├── products/           # Product display components
│   │   ├── cart/               # Shopping cart components
│   │   ├── orders/             # Order management components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── navbar/             # Navigation components
│   │   ├── footer/             # Footer components
│   │   ├── ai/                 # AI chat components
│   │   └── ...
│   │
│   ├── pages/                   # Full Page Components
│   │   ├── auth/               # Login, Signup pages
│   │   ├── home/               # Homepage
│   │   ├── products/           # Product catalog
│   │   ├── cart/               # Shopping cart page
│   │   ├── checkout/           # Checkout page
│   │   ├── orders/             # Orders page
│   │   ├── dashboard/          # Seller/User dashboard
│   │   ├── consultation/       # Consultation pages
│   │   ├── profile/            # User profile
│   │   └── ...
│   │
│   ├── services/                # API Service Layer
│   │   ├── api.ts              # Axios instance configuration
│   │   ├── auth.ts             # Auth API calls
│   │   ├── products.ts         # Product API calls
│   │   ├── orders.ts           # Order API calls
│   │   ├── payment.ts          # Payment API calls
│   │   ├── consultation.ts     # Consultation API calls
│   │   ├── ai.ts               # AI API calls
│   │   ├── analytics.ts        # Analytics API calls
│   │   └── ...
│   │
│   ├── contexts/                # React Context Providers
│   │   ├── AuthContext.tsx      # Authentication state
│   │   ├── CartContext.tsx      # Shopping cart state
│   │   ├── UserContext.tsx      # User data state
│   │   └── ...
│   │
│   ├── types/                   # TypeScript Type Definitions
│   │   ├── user.ts             # User type definitions
│   │   ├── product.ts          # Product type definitions
│   │   ├── order.ts            # Order type definitions
│   │   ├── common.ts           # Common types
│   │   └── ...
│   │
│   ├── utils/                   # Utility Functions
│   │   ├── constants.ts        # App constants
│   │   ├── helpers.ts          # Helper functions
│   │   ├── formatters.ts       # Data formatting functions
│   │   └── ...
│   │
│   └── assets/                  # Static Files
│       ├── images/             # Image assets
│       ├── icons/              # Icon assets
│       └── ...
│
├── public/                  # Public static files
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App TypeScript config
├── tsconfig.node.json       # Node TypeScript config
├── vite.config.ts           # Vite configuration
├── eslint.config.js         # ESLint configuration
├── vercel.json              # Vercel deployment config
└── node_modules/            # Dependencies
```

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MongoDB Atlas**: Cloud database account
- **Git**: Version control

### API Keys Required

1. **Razorpay**: Payment gateway (https://razorpay.com)
2. **Cloudinary**: Image storage (https://cloudinary.com)
3. **OpenAI**: AI consultations (https://openai.com)
4. **Google Generative AI**: AI alternative (https://ai.google.dev)
5. **Resend**: Transactional emails (https://resend.com)
6. **Nodemailer**: Email service (or use Resend)

### Installation Steps

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/pharmanest.git
cd pharmanest
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google Generative AI
GOOGLE_API_KEY=your_google_api_key

# Resend Email Service
RESEND_API_KEY=your_resend_api_key

# Nodemailer (if using)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Session Secret
SESSION_SECRET=your_session_secret
EOF

# Start development server
npm start

# Server runs on http://localhost:5000
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (if needed)
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

### Verification

- **Backend**: Visit `http://localhost:5000` - should return server response
- **Frontend**: Visit `http://localhost:5173` - should load React app
- **MongoDB**: Check connection in backend logs
- **API Health**: Check backend logs for startup messages

---

## 📚 Backend Documentation

### Authentication System

#### User Authentication Flow

```
1. Sign Up (POST /api/v1/auth/register)
   ├── Validate input (Joi schema)
   ├── Check existing user
   ├── Hash password with Bcrypt
   ├── Create user in MongoDB
   └── Send verification email (Resend)

2. Email Verification (POST /api/v1/auth/verify-email)
   ├── Validate token
   ├── Mark user as verified
   └── Clear verification token

3. Login (POST /api/v1/auth/login)
   ├── Validate credentials
   ├── Hash comparison
   ├── Generate JWT & Refresh Token
   └── Return tokens + user data

4. Token Refresh (POST /api/v1/auth/refresh)
   ├── Validate refresh token
   ├── Generate new access token
   └── Return new token
```

#### Host (Seller) Authentication

- Separate authentication for sellers/doctors
- Additional verification requirements
- Professional credentials validation

### Key Controllers

#### UserAuthController
- User registration and login
- Email verification
- Password reset
- Token refresh
- Profile management

#### ProductsController
- Product listing with filters
- Search functionality
- Product details
- Category management

#### OrderController
- Create orders
- Order history
- Order tracking
- Return/refund requests

#### PaymentController
- Razorpay payment initiation
- Payment verification
- Webhook handling
- Invoice generation

#### AIController & aiChatController
- AI consultation booking
- AI chat interface
- Response generation via OpenAI/Gemini
- Consultation history

#### SellerAnalyticsController
- Sales trends
- Revenue analytics
- Inventory metrics
- Customer insights

### Database Models

#### User Schema

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  profilePhoto: String (Cloudinary URL),
  
  // Health Profile
  dateOfBirth: Date,
  bloodGroup: String,
  medicalHistory: String,
  allergies: [String],
  
  // Address
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: Boolean
  }],
  
  // Account Status
  isVerified: Boolean,
  isActive: Boolean,
  role: String (enum: ['user', 'host', 'admin']),
  
  // Relationships
  orders: [ObjectId],
  consultations: [ObjectId],
  wishlist: [ObjectId],
  cart: [ObjectId],
  reviews: [ObjectId],
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

#### Product Schema

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  subcategory: String,
  
  // Pricing
  basePrice: Number,
  discountedPrice: Number,
  discount: Number,
  
  // Inventory
  stock: Number,
  reservedStock: Number,
  
  // Images
  images: [String], // Cloudinary URLs
  thumbnail: String,
  
  // Details
  sku: String (unique),
  manufacturer: String,
  expiryDate: Date,
  batchNumber: String,
  
  // Medical Info
  activeIngredients: [String],
  prescriptionRequired: Boolean,
  sideEffects: String,
  
  // Seller Info
  host: ObjectId (reference to Host),
  
  // Ratings
  averageRating: Number,
  reviewCount: Number,
  reviews: [ObjectId],
  
  // Status
  isActive: Boolean,
  isFeatured: Boolean,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Schema

```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  
  // Customer Info
  user: ObjectId,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  
  // Items
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number,
    total: Number
  }],
  
  // Totals
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  discount: Number,
  total: Number,
  
  // Payment
  paymentMethod: String,
  paymentStatus: String (enum: ['pending', 'completed', 'failed']),
  paymentId: String (Razorpay),
  
  // Order Status
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  statusHistory: [{
    status: String,
    timestamp: Date,
    notes: String
  }],
  
  // Tracking
  trackingNumber: String,
  estimatedDelivery: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

#### Consultation Schema

```javascript
{
  _id: ObjectId,
  user: ObjectId,
  host: ObjectId,
  
  // Consultation Details
  type: String (enum: ['ai', 'doctor']),
  topic: String,
  description: String,
  
  // Chat/Messages
  messages: [{
    sender: ObjectId,
    role: String (enum: ['user', 'assistant']),
    content: String,
    timestamp: Date
  }],
  
  // Status
  status: String (enum: ['active', 'completed', 'cancelled']),
  startTime: Date,
  endTime: Date,
  duration: Number,
  
  // Prescription (if applicable)
  prescription: ObjectId,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints Summary

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/verify-email` - Email verification

#### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (Host only)
- `PUT /api/v1/products/:id` - Update product (Host only)
- `DELETE /api/v1/products/:id` - Delete product (Host only)
- `GET /api/v1/products/search?query=` - Search products

#### Orders
- `GET /api/v1/user/orders` - Get user orders
- `POST /api/v1/user/orders` - Create order
- `GET /api/v1/user/orders/:id` - Get order details
- `PUT /api/v1/user/orders/:id/cancel` - Cancel order
- `GET /api/v1/seller/orders` - Get seller orders (Host only)

#### Payments
- `POST /api/v1/payment/create-order` - Create Razorpay order
- `POST /api/v1/payment/verify` - Verify payment
- `POST /api/v1/payment/refund` - Process refund

#### Consultations
- `GET /api/v1/consultations` - List consultations
- `POST /api/v1/consultations` - Book consultation
- `GET /api/v1/consultations/:id` - Get consultation details
- `POST /api/v1/consultations/:id/message` - Send message

#### AI
- `POST /api/v1/ai/chat` - AI chat endpoint
- `POST /api/v1/ai/diagnose` - AI diagnosis

#### Analytics
- `GET /api/v1/analytics/dashboard` - Analytics dashboard data
- `GET /api/v1/analytics/sales` - Sales analytics
- `GET /api/v1/analytics/inventory` - Inventory analytics

### Background Jobs (Cron Jobs)

#### Order Progression Job
- **Schedule**: Every minute
- **Purpose**: Automatically update order status based on time elapsed
- **Logic**: pending → processing → shipped → delivered

```javascript
// Auto-progresses orders every minute
// Can be customized based on business rules
```

#### Inventory Monitor Job
- **Schedule**: Every 5 minutes
- **Purpose**: Monitor low stock items
- **Logic**: Trigger alerts when stock < threshold

#### Email Service

#### Using Resend (Recommended)

```javascript
// Send verification email
await resend.emails.send({
  from: 'noreply@pharmanest.com',
  to: userEmail,
  subject: 'Verify Your Email',
  html: emailTemplate
});
```

#### Using Nodemailer

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: recipient,
  subject: 'Subject',
  html: htmlContent
});
```

### File Uploads

#### Cloudinary Configuration

```javascript
// cloudConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

#### Upload Handler with Multer

```javascript
// Using multer with Cloudinary storage
const storage = require('multer-storage-cloudinary');
const upload = multer({
  storage: storage.storage({
    cloudinary: cloudinary,
    folder: 'pharmanest',
    allowed_formats: ['jpg', 'png', 'gif']
  })
});
```

### Error Handling

#### Custom Error Response

```javascript
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
```

#### Async Handler Wrapper

```javascript
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
router.get('/products', asyncHandler(async (req, res) => {
  // Code here
}));
```

---

## 🎨 Frontend Documentation

### Project Setup

#### Vite Configuration
- Lightning-fast dev server
- Optimized production builds
- Hot Module Replacement (HMR)
- TypeScript support

#### React 19 Features
- New JSX transform
- Improved hooks
- Better performance
- Concurrent rendering support

### State Management

#### Context API Usage

```typescript
// AuthContext
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usage in components
const { user, login, logout } = useContext(AuthContext);
```

#### Local Storage

```typescript
// Save user data
localStorage.setItem('user', JSON.stringify(user));
localStorage.setItem('token', token);

// Retrieve data
const user = JSON.parse(localStorage.getItem('user'));
```

### API Integration

#### Axios Instance Configuration

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Service Pattern Example

```typescript
// services/products.ts
export const productService = {
  getAll: async (filters?: any) => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await api.get('/products/search', {
      params: { query }
    });
    return response.data;
  }
};
```

### Component Architecture

#### Functional Components with Hooks

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.thumbnail} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">₹{product.discountedPrice}</p>
      <button onClick={handleAddToCart} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};
```

#### Custom Hooks

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// hooks/useFetch.ts
export const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get<T>(url);
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
```

### Styling with Tailwind CSS

#### Utility-First Approach

```typescript
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Real-time Communication with Socket.io

```typescript
// contexts/SocketContext.tsx
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL);

// Listen to notifications
socket.on('notification', (data) => {
  toast.success(data.message);
});

// Listen to order updates
socket.on('order-updated', (order) => {
  // Update order state
});

// Emit events
socket.emit('consultation-started', { consultationId });
```

### Animation with Framer Motion

```typescript
import { motion } from 'framer-motion';

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="grid grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map(product => (
        <motion.div
          key={product._id}
          variants={itemVariants}
          className="product-card"
        >
          {/* Product content */}
        </motion.div>
      ))}
    </motion.div>
  );
};
```

### Routing with React Router v7

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductCatalog />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* Protected Routes */}
      <Route
        path="/cart"
        element={isAuthenticated ? <Cart /> : <Navigate to="/login" />}
      />
      <Route
        path="/orders"
        element={isAuthenticated ? <Orders /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard/*"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
```

### Type Safety with TypeScript

```typescript
// types/user.ts
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  role: 'user' | 'host' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// types/product.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  stock: number;
  images: string[];
  category: string;
  manufacturer: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

// types/order.ts
export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}
```

---

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/v1/auth/register                  Register new user
POST   /api/v1/auth/login                     User login
POST   /api/v1/auth/refresh                   Refresh access token
POST   /api/v1/auth/logout                    User logout
POST   /api/v1/auth/verify-email              Verify email address
POST   /api/v1/auth/forgot-password           Request password reset
POST   /api/v1/auth/reset-password            Reset password
GET    /api/v1/auth/me                        Get current user
```

### User Endpoints

```
GET    /api/v1/user/profile                   Get user profile
PUT    /api/v1/user/profile                   Update user profile
POST   /api/v1/user/address                   Add address
GET    /api/v1/user/addresses                 Get all addresses
PUT    /api/v1/user/address/:id               Update address
DELETE /api/v1/user/address/:id               Delete address
GET    /api/v1/user/wishlist                  Get wishlist
POST   /api/v1/user/wishlist/:productId       Add to wishlist
DELETE /api/v1/user/wishlist/:productId       Remove from wishlist
```

### Product Endpoints

```
GET    /api/v1/products                       List all products
GET    /api/v1/products/:id                   Get product details
GET    /api/v1/products/search                Search products
POST   /api/v1/products                       Create product (Host)
PUT    /api/v1/products/:id                   Update product (Host)
DELETE /api/v1/products/:id                   Delete product (Host)
GET    /api/v1/products/:id/reviews           Get product reviews
POST   /api/v1/products/:id/reviews           Add product review
GET    /api/v1/products/category/:category    Get by category
```

### Order Endpoints

```
POST   /api/v1/user/orders                    Create order
GET    /api/v1/user/orders                    Get user orders
GET    /api/v1/user/orders/:id                Get order details
PUT    /api/v1/user/orders/:id/cancel         Cancel order
GET    /api/v1/user/orders/:id/invoice        Get order invoice
GET    /api/v1/seller/orders                  Get seller orders (Host)
PUT    /api/v1/seller/orders/:id/status       Update order status (Host)
GET    /api/v1/seller/orders/:id/details      Get order details (Host)
```

### Payment Endpoints

```
POST   /api/v1/payment/create-order           Create Razorpay order
POST   /api/v1/payment/verify                 Verify payment
POST   /api/v1/payment/webhook                Razorpay webhook
POST   /api/v1/payment/refund                 Request refund
GET    /api/v1/payment/status/:orderId        Get payment status
```

### Consultation Endpoints

```
GET    /api/v1/consultations                  List consultations
POST   /api/v1/consultations                  Book consultation
GET    /api/v1/consultations/:id              Get consultation details
PUT    /api/v1/consultations/:id/cancel       Cancel consultation
POST   /api/v1/consultations/:id/message      Send message
GET    /api/v1/consultations/:id/messages     Get messages
```

### AI Endpoints

```
POST   /api/v1/ai/chat                        AI chat endpoint
POST   /api/v1/ai/diagnose                    AI diagnosis endpoint
GET    /api/v1/ai/conversation/:id            Get conversation history
```

### Analytics Endpoints

```
GET    /api/v1/analytics/dashboard            Dashboard data (Host)
GET    /api/v1/analytics/sales                Sales analytics (Host)
GET    /api/v1/analytics/inventory            Inventory analytics (Host)
GET    /api/v1/analytics/customers            Customer analytics (Host)
GET    /api/v1/analytics/revenue              Revenue analytics (Host)
```

### Host/Seller Endpoints

```
POST   /api/v1/host/register                  Host registration
POST   /api/v1/host/login                     Host login
GET    /api/v1/host/profile                   Get host profile
PUT    /api/v1/host/profile                   Update host profile
GET    /api/v1/host/dashboard                 Host dashboard
POST   /api/v1/host/products/bulk             Bulk upload products
GET    /api/v1/host/inventory                 Get inventory
PUT    /api/v1/host/inventory/:productId      Update inventory
```

---

## 💾 Database Schema

### Collection: users

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  phone: String,
  password: String (hashed),
  profilePhoto: String,
  dateOfBirth: Date,
  bloodGroup: String,
  gender: String,
  medicalHistory: String,
  allergies: [String],
  
  addresses: [{
    _id: ObjectId,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String,
    isDefault: Boolean
  }],
  
  role: String (default: 'user'),
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  
  cart: [ObjectId],
  wishlist: [ObjectId],
  orders: [ObjectId],
  consultations: [ObjectId],
  reviews: [ObjectId],
  
  lastLogin: Date,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### Collection: hosts

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  phone: String,
  password: String (hashed),
  businessName: String,
  businessLicense: String,
  licenseExpiry: Date,
  professionalPhoto: String,
  bio: String,
  specialization: String,
  
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  
  verification: {
    isVerified: Boolean,
    verifiedBy: ObjectId,
    verifiedAt: Date
  },
  
  products: [ObjectId],
  orders: [ObjectId],
  consultations: [ObjectId],
  reviews: [ObjectId],
  
  ratings: Number (default: 0),
  reviewCount: Number (default: 0),
  totalSales: Number (default: 0),
  totalRevenue: Number (default: 0),
  
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: products

```javascript
{
  _id: ObjectId,
  name: String (indexed),
  description: String,
  category: String (indexed),
  subcategory: String,
  
  basePrice: Number,
  discountedPrice: Number,
  discount: Number,
  
  stock: Number,
  reservedStock: Number (default: 0),
  
  images: [String],
  thumbnail: String,
  
  sku: String (unique, indexed),
  manufacturer: String,
  expiryDate: Date,
  batchNumber: String,
  
  activeIngredients: [String],
  prescriptionRequired: Boolean (default: false),
  sideEffects: String,
  dosage: String,
  
  host: ObjectId (indexed, reference to hosts),
  
  averageRating: Number (default: 0),
  reviewCount: Number (default: 0),
  reviews: [ObjectId],
  
  isFeatured: Boolean (default: false),
  isActive: Boolean (default: true),
  
  tags: [String],
  
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### Collection: orders

```javascript
{
  _id: ObjectId,
  orderNumber: String (unique, indexed),
  
  user: ObjectId (indexed, reference to users),
  host: ObjectId (indexed, reference to hosts),
  
  items: [{
    product: ObjectId,
    productName: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    image: String
  }],
  
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String,
    receiverName: String
  },
  
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  discount: Number,
  couponCode: String,
  total: Number,
  
  paymentMethod: String (enum: ['razorpay', 'upi', 'card']),
  paymentStatus: String (enum: ['pending', 'completed', 'failed']),
  paymentId: String,
  
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  statusHistory: [{
    status: String,
    timestamp: Date,
    notes: String,
    updatedBy: ObjectId
  }],
  
  trackingNumber: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  
  notes: String,
  cancelReason: String,
  returnRequest: Boolean (default: false),
  
  createdAt: Date (indexed),
  updatedAt: Date (indexed)
}
```

### Collection: consultations

```javascript
{
  _id: ObjectId,
  user: ObjectId (indexed),
  host: ObjectId (indexed),
  
  type: String (enum: ['ai', 'doctor']),
  topic: String,
  description: String,
  severity: String (enum: ['mild', 'moderate', 'severe']),
  
  messages: [{
    _id: ObjectId,
    sender: ObjectId,
    role: String (enum: ['user', 'assistant', 'doctor']),
    content: String,
    timestamp: Date
  }],
  
  status: String (enum: ['active', 'completed', 'cancelled']),
  startTime: Date,
  endTime: Date,
  duration: Number,
  
  prescription: ObjectId,
  diagnosis: String,
  
  rating: Number,
  feedback: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: reviews

```javascript
{
  _id: ObjectId,
  product: ObjectId (indexed),
  user: ObjectId (indexed),
  
  title: String,
  content: String,
  rating: Number (1-5),
  
  isVerifiedPurchase: Boolean (default: false),
  helpful: Number (default: 0),
  unhelpful: Number (default: 0),
  
  images: [String],
  
  isActive: Boolean (default: true),
  
  createdAt: Date (indexed),
  updatedAt: Date
}
```

---

## 🚀 Key Features Implementation

### 1. AI-Powered Consultations

#### Technology Stack
- **OpenAI**: Primary AI service
- **Google Gemini**: Alternative AI service
- **Real-time Chat**: Socket.io for live messaging

#### Implementation Flow

```javascript
// Backend: AI Chat Handler
const aiChat = asyncHandler(async (req, res) => {
  const { consultationId, message } = req.body;

  // Get consultation
  const consultation = await Consultation.findById(consultationId);

  // Prepare conversation history
  const messages = consultation.messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  // Add current message
  messages.push({ role: 'user', content: message });

  // Call OpenAI API
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: messages,
    temperature: 0.7,
    max_tokens: 500
  });

  const aiMessage = response.choices[0].message.content;

  // Save to database
  consultation.messages.push({
    sender: req.user._id,
    role: 'user',
    content: message
  });
  consultation.messages.push({
    sender: null,
    role: 'assistant',
    content: aiMessage
  });

  await consultation.save();

  // Emit via Socket.io
  io.to(consultationId).emit('ai-response', {
    role: 'assistant',
    content: aiMessage,
    timestamp: new Date()
  });

  res.json({ success: true, message: aiMessage });
});
```

### 2. Secure Payment Processing

#### Razorpay Integration

```javascript
// Backend: Create Payment Order
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  // Create Razorpay order
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `receipt_${orderId}`,
    payment_capture: 1
  };

  const razorpayOrder = await razorpay.orders.create(options);

  // Save to database
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentId: razorpayOrder.id,
      paymentStatus: 'pending'
    },
    { new: true }
  );

  res.json({
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency
  });
});

// Backend: Verify Payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  // Verify signature
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature === signature) {
    // Payment successful
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'completed', status: 'processing' },
      { new: true }
    );

    // Emit event
    io.to(order.user).emit('payment-success', order);

    res.json({ success: true, order });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});
```

#### Frontend Integration

```typescript
// Frontend: Razorpay Payment Handler
const handlePayment = async (orderId: string, amount: number) => {
  try {
    // Create payment order
    const { data } = await api.post('/payment/create-order', {
      orderId,
      amount
    });

    // Open Razorpay modal
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: 'PharmaNest',
      order_id: data.orderId,
      handler: async (response: any) => {
        // Verify payment
        await api.post('/payment/verify', {
          orderId,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature
        });

        toast.success('Payment successful!');
        navigate('/orders');
      },
      prefill: {
        email: user?.email,
        contact: user?.phone
      }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    toast.error('Payment failed');
  }
};
```

### 3. Real-time Notifications

#### Socket.io Implementation

```javascript
// Backend: Socket.io Setup
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Verify token
  next();
});

// Connection handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user room
  socket.on('user-joined', (userId) => {
    socket.join(`user_${userId}`);
  });

  // Order status update
  socket.on('order-status-update', (orderId, status) => {
    io.to(`order_${orderId}`).emit('order-updated', {
      orderId,
      status,
      timestamp: new Date()
    });
  });

  // Consultation message
  socket.on('consultation-message', (consultationId, message) => {
    io.to(`consultation_${consultationId}`).emit('message-received', message);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

#### Frontend: Real-time Updates

```typescript
// Frontend: Socket.io Integration
import { useEffect } from 'react';
import io from 'socket.io-client';

export const useSocket = (userId: string) => {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Emit user joined
    socket.emit('user-joined', userId);

    // Listen to notifications
    socket.on('order-updated', (order) => {
      // Update UI with new order status
      dispatch(updateOrder(order));
      toast.info(`Order ${order.orderNumber} status: ${order.status}`);
    });

    socket.on('notification', (notification) => {
      toast.info(notification.message);
    });

    return () => socket.disconnect();
  }, [userId]);
};
```

### 4. Order Automation with Cron Jobs

```javascript
// Backend: Order Status Progression
const orderProgressionJob = require('node-cron').schedule('* * * * *', async () => {
  try {
    const orders = await Order.find({
      status: { $in: ['pending', 'processing', 'shipped'] }
    });

    const now = new Date();

    for (const order of orders) {
      const hoursElapsed = (now - new Date(order.createdAt)) / (1000 * 60 * 60);

      // Auto-progress order based on time
      if (hoursElapsed < 1 && order.status === 'pending') {
        // Payment received, auto-process
        order.status = 'processing';
      } else if (hoursElapsed >= 1 && hoursElapsed < 24 && order.status === 'processing') {
        // Auto-ship after 1 hour
        order.status = 'shipped';
        order.trackingNumber = generateTrackingNumber();
      } else if (hoursElapsed >= 24 && order.status === 'shipped') {
        // Auto-deliver after 24 hours
        order.status = 'delivered';
        order.actualDelivery = now;
      }

      await order.save();

      // Notify user
      const user = await User.findById(order.user);
      io.to(`user_${user._id}`).emit('order-updated', order);
    }

    console.log('Order progression job completed');
  } catch (error) {
    console.error('Order progression job error:', error);
  }
});
```

---

## 🔐 Security & Best Practices

### Authentication & Authorization

#### JWT Implementation

```javascript
// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Verify token middleware
const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});
```

#### Role-Based Access Control

```javascript
// RBAC middleware
const authorize = (roles) => {
  return asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.userId);

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: 'Insufficient permissions'
      });
    }

    next();
  });
};

// Usage
router.post('/products', authorize(['host', 'admin']), createProduct);
```

### Data Validation & Sanitization

#### Joi Schema Validation

```javascript
const createProductSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10),
  category: Joi.string().required(),
  price: Joi.number().required().positive(),
  stock: Joi.number().required().min(0),
  images: Joi.array().items(Joi.string()).min(1),
  expiryDate: Joi.date().required()
});

// Usage
const validateSchema = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    req.validatedData = value;
    next();
  });
};

router.post('/products', validateSchema(createProductSchema), createProduct);
```

#### Mongo Sanitization

```javascript
const mongoSanitize = require('express-mongo-sanitize');

app.use(mongoSanitize()); // Prevents NoSQL injection
app.use(mongoSanitize({ replaceWith: '_' })); // Replace $ with _
```

### Security Headers

#### Helmet Configuration

```javascript
const helmet = require('helmet');

app.use(helmet()); // Apply default security headers

// Custom configuration
app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  })
);
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

// Apply to all routes
app.use(limiter);

// Apply to specific routes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

router.post('/login', loginLimiter, login);
```

### Password Security

```javascript
const bcrypt = require('bcrypt');

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (enteredPassword, hashedPassword) => {
  return bcrypt.compare(enteredPassword, hashedPassword);
};

// Usage in registration
const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check existing user
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  user = await User.create({
    email,
    password: hashedPassword
  });

  res.json({ success: true, user });
});
```

---

## 👨‍💻 Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .

# Commit with message
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/feature-name

# Create Pull Request
# - Request reviews
# - Address feedback
# - Merge to main
```

### Development Environment Setup

```bash
# Install Node.js dependencies
npm install

# Create .env files
cp .env.example .env
cp ../frontend/.env.example ..frontend/.env

# Start development servers
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Code Style & Linting

```bash
# Frontend: Run ESLint
cd frontend
npm run lint

# Format with Prettier (if configured)
npm run format

# TypeScript type check
tsc --noEmit
```

### Testing

```bash
# Backend: Run tests (if configured)
npm test

# Frontend: Run tests
npm test

# Generate coverage report
npm test -- --coverage
```

---

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Failed

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
1. Check MongoDB Atlas connection string
2. Verify IP whitelist settings
3. Check database credentials
4. Ensure network access is enabled

```javascript
// Debug connection
mongoose.set('debug', true);
```

#### JWT Token Expired

**Error**: `JsonWebTokenError: jwt expired`

**Solution**:
1. Use refresh token endpoint to get new token
2. Check token expiration time in .env
3. Implement token refresh logic on frontend

```typescript
// Frontend: Axios interceptor for token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await api.post('/auth/refresh', { refreshToken });
      localStorage.setItem('token', response.data.token);
      // Retry request
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

#### Cloudinary Upload Fails

**Error**: `CloudinaryError: 401 Unauthorized`

**Solution**:
1. Verify Cloudinary credentials in .env
2. Check folder permissions
3. Ensure file size is within limits

```javascript
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload with error handling
try {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'pharmanest',
    resource_type: 'auto'
  });
} catch (error) {
  console.error('Upload error:', error);
}
```

#### Razorpay Payment Fails

**Error**: `RAZORPAY_ERROR_CODE_XXX`

**Solution**:
1. Verify Razorpay credentials
2. Check payment amount is in correct format (in paise)
3. Ensure order is created before payment

```javascript
// Correct amount format
const amount = orderTotal * 100; // Convert to paise
```

### Logging & Debugging

```javascript
// Enable Morgan logging
const morgan = require('morgan');
app.use(morgan('dev')); // Development logging

// Custom logging
const logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`),
  error: (msg, error) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, error),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} ${msg}`)
};

logger.info('Server started');
logger.error('Database connection failed', error);
```

---

## 🤝 Contributing Guidelines

### Code Standards

1. **JavaScript/TypeScript**
   - Use ESLint configuration
   - Follow ES6+ standards
   - Use async/await over callbacks
   - Add proper error handling

2. **Naming Conventions**
   - camelCase for variables and functions
   - PascalCase for classes and components
   - SCREAMING_SNAKE_CASE for constants
   - Descriptive names over abbreviations

3. **Code Comments**
   - Add comments for complex logic
   - Use JSDoc for functions
   - Explain WHY, not WHAT

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Write/update tests
4. Update documentation
5. Create PR with detailed description
6. Address code review feedback
7. Merge when approved

### Commit Message Format

```
type(scope): subject

description

footer (if breaking change)

Example:
feat(auth): implement JWT refresh token

Add refresh token logic to automatically refresh expired
access tokens without requiring user login.

Fixes #123
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Dependency updates

---

## 📞 Support & Contact

For questions, issues, or contributions:

1. **GitHub Issues**: Report bugs and feature requests
2. **Email**: contact@pharmanest.com
3. **Documentation**: See this file and README.md
4. **Discord**: Join our community server

---

## 📄 License

This project is licensed under the ISC License. See LICENSE file for details.

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Maintainers**: PharmaNest Development Team

