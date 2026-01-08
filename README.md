# 📝 SaaS Notes - Full-Stack MERN Application

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-00D9FF?style=for-the-badge&logo=javascript)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

A production-ready, scalable SaaS notes application demonstrating enterprise-level full-stack development patterns, security best practices, and modern web architecture.

[🚀 Live Demo](https://saas-notes-app-gray.vercel.app) • [📚 API Documentation](./API.md) • [🔐 Admin API](./ADMIN_API.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Security](#-security)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Design Decisions](#-design-decisions)
- [Performance Optimizations](#-performance-optimizations)
- [Deployment](#-deployment)

---

## 🎯 Overview

SaaS Notes is a full-featured note-taking application built with the MERN stack, designed to showcase production-ready development practices. The application implements secure authentication, role-based access control, real-time updates, and scalable pagination patterns suitable for enterprise environments.

### Highlights

- ✅ **Production-Ready**: Deployed and running on Vercel & Railway
- ✅ **Secure by Design**: JWT authentication, HttpOnly cookies, RBAC implementation
- ✅ **Scalable Architecture**: Pagination, database indexing, optimized queries
- ✅ **Real-Time Features**: Socket.io integration for live updates
- ✅ **Comprehensive Error Handling**: Centralized error management with detailed responses
- ✅ **Type-Safe & Validated**: Input validation, MongoDB schema validation
- ✅ **Admin Dashboard**: Full-featured admin panel with user and content management

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- **Secure Authentication**: JWT-based authentication with HttpOnly cookies
- **Role-Based Access Control (RBAC)**: User and Admin roles with middleware protection
- **Persistent Sessions**: Automatic token refresh and session management
- **Account Management**: User registration, login, logout with proper validation
- **Ban System**: Admin-controlled user ban/unban functionality

### 📝 Notes Management

- **Full CRUD Operations**: Create, read, update, and delete notes
- **User-Scoped Data**: Notes are isolated per user with proper authorization
- **Advanced Search**: Case-insensitive search by title
- **Flexible Sorting**: Sort by any field (createdAt, title, etc.)
- **Pagination**: Efficient server-side pagination to handle large datasets
- **Real-Time Updates**: Socket.io events for live note creation notifications

### 🛠 Admin Dashboard

- **User Management**: View all users with pagination, search, and filtering
- **Content Moderation**: View all notes, delete any note, view user-specific notes
- **Ban Management**: Toggle user ban status with safety checks
- **Statistics**: Real-time user and note counts
- **Protected Routes**: Frontend and backend double-protection for admin access

---

## 🚀 Tech Stack

### Frontend

| Technology           | Purpose                 | Version |
| -------------------- | ----------------------- | ------- |
| **React**            | UI Framework            | 19.2    |
| **Vite**             | Build Tool & Dev Server | 7.2     |
| **Zustand**          | State Management        | 5.0     |
| **Chakra UI**        | Component Library       | 2.8     |
| **React Router**     | Client-Side Routing     | 7.10    |
| **Socket.io Client** | Real-Time Communication | 4.8     |

### Backend

| Technology    | Purpose             | Version |
| ------------- | ------------------- | ------- |
| **Node.js**   | Runtime Environment | 20.x    |
| **Express**   | Web Framework       | 5.2     |
| **MongoDB**   | Database            | Latest  |
| **Mongoose**  | ODM                 | 9.0     |
| **JWT**       | Authentication      | 9.0     |
| **bcryptjs**  | Password Hashing    | 3.0     |
| **Socket.io** | Real-Time Server    | 4.8     |

### DevOps & Deployment

- **Frontend**: Vercel (CDN, automatic deployments)
- **Backend**: Railway (containerized deployment)
- **Database**: MongoDB Atlas (managed cloud database)
- **Version Control**: Git & GitHub

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   React Client  │ ◄─────► │  Express API    │ ◄─────► │  MongoDB Atlas │
│   (Vercel)      │  HTTP   │   (Railway)     │  ODM    │   (Cloud DB)    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │
         │                           │
         └─────────── Socket.io ─────┘
                    (Real-Time)
```

### Request Flow

1. **Authentication**: User logs in → JWT token stored in HttpOnly cookie
2. **Authorization**: Protected routes verify token → Load user from DB → Check role
3. **Data Access**: User requests data → Middleware validates → Controller processes → Database query with indexes
4. **Real-Time**: Note created → Socket.io emits event → All clients notified

### Security Layers

```
Request → CORS Check → Cookie Parser → JWT Verification →
Role Check → Input Validation → Controller → Database
```

---

## 🔐 Security

### Authentication Security

- **HttpOnly Cookies**: Prevents XSS attacks by making tokens inaccessible to JavaScript
- **Secure Flag**: Enabled in production for HTTPS-only transmission
- **SameSite Policy**: CSRF protection with appropriate SameSite settings
- **JWT Expiration**: 7-day token expiration with automatic refresh
- **Password Hashing**: bcrypt with salt rounds (10)

### Authorization Security

- **Role Verification**: Always checked against database, not JWT token
- **Double Protection**: Frontend route guards + Backend middleware
- **Permission Checks**: Resource ownership validation on every operation
- **Admin Safeguards**: Prevents self-ban and admin-to-admin bans

### Data Security

- **Input Validation**: Comprehensive validation on all endpoints
- **SQL Injection Prevention**: Mongoose ODM provides built-in protection
- **XSS Prevention**: Input sanitization and output encoding
- **CORS Configuration**: Whitelist-based origin validation
- **Error Messages**: Sanitized to prevent information leakage

### Security Best Practices Implemented

✅ Password never returned in API responses  
✅ User data scoped to authenticated user  
✅ MongoDB ObjectId validation on all ID parameters  
✅ Rate limiting ready (infrastructure in place)  
✅ Environment variables for sensitive data  
✅ Database indexes for performance and security

---

## 📚 API Documentation

Comprehensive API documentation is available:

- **[Main API Documentation](./API.md)** - Authentication and Notes endpoints
- **[Admin API Documentation](./ADMIN_API.md)** - Admin-only endpoints

### Quick API Overview

**Authentication Endpoints:**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

**Notes Endpoints:**

- `GET /api/notes` - List user's notes (paginated)
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get single note
- `PATCH /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

**Admin Endpoints:**

- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `PATCH /api/admin/users/:id/ban` - Toggle user ban
- `GET /api/admin/users/:userId/notes` - Get user's notes
- `GET /api/admin/notes` - List all notes
- `DELETE /api/admin/notes/:id` - Delete any note

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB Atlas account (or local MongoDB instance)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/saas-notes.git
   cd saas-notes
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in `server/` directory:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=8080
   NODE_ENV=development
   ```

   Create `.env` file in `client/` directory:

   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

5. **Run the application**

   **Start the server:**

   ```bash
   cd server
   npm run dev
   ```

   **Start the client (in a new terminal):**

   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api
   - Health Check: http://localhost:8080/api/health

---

## 📁 Project Structure

```
saas-notes/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── NotesList.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── store/          # Zustand state management
│   │   │   ├── user.js
│   │   │   ├── note.js
│   │   │   └── ...
│   │   ├── service/        # API service layer
│   │   │   └── api.js
│   │   └── realtime/       # Socket.io client
│   │       └── socket.js
│   └── package.json
│
├── server/                 # Express backend application
│   ├── config/             # Configuration files
│   │   └── db.js          # MongoDB connection
│   ├── controller/         # Request handlers
│   │   ├── auth.controller.js
│   │   ├── note.controller.js
│   │   └── admin.controller.*.js
│   ├── middleware/         # Express middleware
│   │   ├── protect.js      # JWT authentication
│   │   ├── admin.js        # Admin authorization
│   │   └── globalErrorHandler.js
│   ├── model/              # Mongoose schemas
│   │   ├── user.model.js
│   │   └── note.model.js
│   ├── routes/             # API routes
│   │   ├── auth.routes.js
│   │   ├── note.routes.js
│   │   └── admin.routes.js
│   ├── realtime/           # Socket.io server
│   │   └── socket.js
│   ├── utils/              # Utility functions
│   │   └── AppError.js
│   └── server.js           # Application entry point
│
├── API.md                  # Main API documentation
├── ADMIN_API.md            # Admin API documentation
└── README.md               # This file
```

---

## 🧠 Design Decisions

### 1. **Pagination Over Full Fetch**

- **Why**: Scalability for large datasets
- **Implementation**: Server-side pagination with configurable limits
- **Benefit**: Reduced memory usage, faster response times

### 2. **Database Role Verification**

- **Why**: Immediate effect of role changes
- **Implementation**: Role checked from database on every request
- **Benefit**: No need to re-login after role changes

### 3. **Zustand for State Management**

- **Why**: Lightweight, simple API, no boilerplate
- **Implementation**: Separate stores for user, notes, and admin data
- **Benefit**: Predictable state updates, easy debugging

### 4. **HttpOnly Cookies for JWT**

- **Why**: XSS attack prevention
- **Implementation**: Secure, HttpOnly cookies with SameSite policy
- **Benefit**: Tokens inaccessible to client-side JavaScript

### 5. **Separated Admin Logic**

- **Why**: Maintainability and security
- **Implementation**: Separate controllers, routes, and stores
- **Benefit**: Clear separation of concerns, easier to audit

### 6. **Centralized Error Handling**

- **Why**: Consistent error responses and easier debugging
- **Implementation**: Global error handler with custom AppError class
- **Benefit**: Unified error format, better developer experience

---

## ⚡ Performance Optimizations

### Database Optimizations

- **Indexes**: Strategic indexes on frequently queried fields
  - User: `email`, `role`, `isBanned`
  - Notes: `userId + createdAt`, `userId + title`, text search indexes
- **Query Optimization**: Selective field projection, efficient sorting
- **Connection Pooling**: MongoDB connection reuse

### Frontend Optimizations

- **Code Splitting**: Vite automatic code splitting
- **Lazy Loading**: Route-based code splitting
- **State Management**: Efficient Zustand selectors to prevent unnecessary re-renders
- **Pagination**: Only current page data loaded

### API Optimizations

- **Parallel Queries**: `Promise.all()` for independent database operations
- **Pagination**: Limits prevent large payloads
- **Field Selection**: Only necessary fields returned
- **Caching Ready**: Infrastructure for response caching

---

## 🚢 Deployment

### Production URLs

- **Frontend**: https://saas-notes-app-gray.vercel.app
- **Backend API**: https://saas-notes-app-production.up.railway.app
- **Database**: MongoDB Atlas (managed cloud)

### Deployment Process

1. **Frontend (Vercel)**

   - Automatic deployments on push to main branch
   - Environment variables configured in Vercel dashboard
   - CDN distribution for global performance

2. **Backend (Railway)**

   - Containerized deployment
   - Environment variables managed in Railway dashboard
   - Automatic health checks

3. **Database (MongoDB Atlas)**
   - Managed cloud database
   - Automated backups
   - Connection string secured via environment variables

### Environment Variables

**Server (.env):**

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=8080
NODE_ENV=production
```

**Client (.env):**

```env
VITE_API_URL=https://saas-notes-app-production.up.railway.app/api
```

---

## 🧪 Testing & Quality

### Code Quality

- ✅ ESLint configuration for code consistency
- ✅ Consistent error handling patterns
- ✅ Input validation on all endpoints
- ✅ Type checking ready (can be extended with TypeScript)

### Error Handling

- Centralized error handler with detailed error types
- MongoDB validation errors handled gracefully
- JWT errors (expired, invalid) with appropriate status codes
- User-friendly error messages

---

## 📈 Future Enhancements

### Planned Features

- [ ] **Testing Suite**: Unit tests, integration tests, E2E tests
- [ ] **Rate Limiting**: API rate limiting for abuse prevention
- [ ] **Audit Logging**: Track all admin actions for compliance
- [ ] **Soft Delete**: Recoverable note deletion
- [ ] **Full-Text Search**: Advanced search across title and content
- [ ] **Activity Analytics**: User activity tracking and reporting
- [ ] **Email Notifications**: Welcome emails, password reset
- [ ] **File Attachments**: Support for note attachments
- [ ] **Collaboration**: Shared notes and real-time collaboration
- [ ] **Export/Import**: Export notes as JSON, Markdown, or PDF

### Technical Improvements

- [ ] TypeScript migration for type safety
- [ ] Redis caching for frequently accessed data
- [ ] WebSocket optimization for better real-time performance
- [ ] API versioning for backward compatibility
- [ ] GraphQL API option
- [ ] Docker containerization for easier deployment

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Bowen Dai**

- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn URL]
- Email: [Your Email]

---

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by real-world SaaS applications
- Designed for scalability and maintainability

---

<div align="center">

**Built with ❤️ using the MERN Stack**

⭐ Star this repo if you find it helpful!

</div>
