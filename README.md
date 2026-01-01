SaaS Notes — MERN Stack Application

A production-ready SaaS-style notes application built with the MERN stack, featuring authentication, role-based access control (RBAC), admin management, and scalable pagination.

## 🔗 Live Demo

Frontend: <https://saas-notes-app-gray.vercel.app>

Backend API: <https://saas-notes-app-production.up.railway.app/>

## 🚀 Tech Stack

Frontend

React (Vite)

Zustand (global state management)

Chakra UI

React Router v6

Backend

Node.js

Express

MongoDB (Mongoose)

JWT Authentication (HttpOnly Cookies)

Deployment

Frontend: Vercel

Backend: Railway / Render

Database: MongoDB Atlas

## ✨ Core Features

👤 Authentication & Authorization

User registration & login

JWT-based authentication stored in HttpOnly cookies

Persistent login via /me endpoint

Secure logout

Role-Based Access Control (RBAC)

-user

-admin

## 📝 Notes (User)

Create / Read / Update / Delete notes

Notes are scoped per user

Pagination support

Sorting by createdAt

Clean RESTful API design

🛠 Admin Dashboard

Admin-only access (frontend + backend enforcement)

View all users

Ban / Unban users

View all notes

View notes of a specific user

Pagination for admin notes & users

Defensive access control (protect + adminOnly middleware)

## 🔐 Security Design

JWT payload contains:

-userId

-role

Role is verified on every protected request

Admin APIs are double-protected:

Frontend route guard (AdminRoute)

Backend middleware (adminOnly)

HttpOnly cookies prevent XSS token access

CORS configured with credentials support

## 📄 API Structure (Simplified)

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

GET /api/notes
POST /api/notes
PATCH /api/notes/:id
DELETE /api/notes/:id

GET /api/admin/users
PATCH /api/admin/users/:id/ban
GET /api/admin/allnotes
GET /api/admin/users/:userId/notes

## 📦 Pagination Design

Backend returns:

{
"data": [],
"pagination": {
"page": 1,
"limit": 5,
"total": 23,
"totalPages": 5
}
}
Frontend consumes only current page data

Page boundaries enforced on UI (Prev / Next)

Prevents over-fetching and unnecessary payloads

## 🧠 Key Design Decisions

Pagination over full fetch to support scalability

JWT role stored in token to avoid extra DB reads

Zustand chosen for simplicity and predictable global state

Admin logic separated from user logic for maintainability

Defensive coding for invalid routes, IDs, and permissions

## 🧪 Error Handling

Centralized async error handling (asyncHandler)

Custom AppError class

Consistent API error responses

Graceful empty states on frontend (e.g. no notes)

## 📈 Possible Improvements

Audit logs for admin actions

Soft-delete for notes

Full-text search

Rate limiting

Unit & integration tests

Activity analytics for admins

## 👤 Author

Bowen Dai

This project was built to demonstrate real-world full-stack patterns including authentication, authorization, pagination, and admin-level system design.
