# API Documentation

Base URL: `/api`

All endpoints return JSON responses. Authentication is handled via HttpOnly cookies containing JWT tokens.

## Table of Contents

- [Authentication](#authentication)
- [Notes](#notes)
- [Error Handling](#error-handling)

---

## Authentication

Base URL: `/api/auth`

### POST /auth/register

Register a new user account.

**Auth:** Not required

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**

- `username`: Required, 3-30 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

**Response 201:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1c2a9e3b9f4b8a1d2c345",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Response 400:**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Notes:**

- Automatically logs in the user after registration
- Sets HttpOnly cookie with JWT token
- Password is never returned in response

---

### POST /auth/login

Authenticate user and receive JWT token.

**Auth:** Not required

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1c2a9e3b9f4b8a1d2c345",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Response 401:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Response 403:**

```json
{
  "success": false,
  "message": "Account is banned"
}
```

**Notes:**

- Sets HttpOnly cookie with JWT token (expires in 7 days)
- Token contains user ID and role

---

### POST /auth/logout

Log out the current user.

**Auth:** Not required (but recommended)

**Response 200:**

```json
{
  "success": true,
  "message": "Logged out"
}
```

**Notes:**

- Clears the authentication cookie

---

### GET /auth/me

Get current authenticated user information.

**Auth:** Required

**Response 200:**

```json
{
  "success": true,
  "data": {
    "_id": "64f1c2a9e3b9f4b8a1d2c345",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "isBanned": false,
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
}
```

**Response 401:**

```json
{
  "success": false,
  "message": "Not authorized"
}
```

**Notes:**

- Password field is excluded from response
- Returns user data from database (always up-to-date)

---

## Notes

Base URL: `/api/notes`

All note endpoints require authentication. Users can only access their own notes (unless admin).

### POST /notes

Create a new note.

**Auth:** Required

**Request Body:**

```json
{
  "title": "My First Note",
  "content": "This is the content of my note."
}
```

**Validation Rules:**

- `title`: Required, max 200 characters, cannot be empty after trim
- `content`: Required, max 10000 characters, cannot be empty after trim
- Title must be unique per user

**Response 201:**

```json
{
  "success": true,
  "data": {
    "_id": "64f1c2a9e3b9f4b8a1d2c346",
    "title": "My First Note",
    "content": "This is the content of my note.",
    "userId": "64f1c2a9e3b9f4b8a1d2c345",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
}
```

**Response 400:**

```json
{
  "success": false,
  "message": "Title and content are required"
}
```

**Response 409:**

```json
{
  "success": false,
  "message": "A note with this title already exists"
}
```

**Notes:**

- Emits real-time event `note:created` via Socket.io
- Title and content are automatically trimmed

---

### GET /notes

Get paginated list of user's notes.

**Auth:** Required

**Query Parameters:**

| Name   | Type   | Description                              | Default        |
| ------ | ------ | ---------------------------------------- | -------------- |
| page   | number | Page number (minimum 1)                  | 1              |
| limit  | number | Items per page (minimum 1, maximum 10)   | 3              |
| search | string | Search notes by title (case-insensitive) | ""             |
| sort   | string | Sort format: `field:asc` or `field:desc` | createdAt:desc |

**Example Request:**

```
GET /api/notes?page=1&limit=5&search=important&sort=createdAt:desc
```

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1c2a9e3b9f4b8a1d2c346",
      "title": "My First Note",
      "content": "This is the content of my note.",
      "userId": "64f1c2a9e3b9f4b8a1d2c345",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 23,
    "totalPages": 5
  }
}
```

**Notes:**

- Only returns notes belonging to the authenticated user
- Search is case-insensitive and matches title
- Sort field can be any note field (default: createdAt)

---

### GET /notes/:id

Get a single note by ID.

**Auth:** Required

**URL Parameters:**

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| id   | string | MongoDB ObjectId of the note |

**Response 200:**

```json
{
  "success": true,
  "data": {
    "note": {
      "_id": "64f1c2a9e3b9f4b8a1d2c346",
      "title": "My First Note",
      "content": "This is the content of my note.",
      "userId": "64f1c2a9e3b9f4b8a1d2c345",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  }
}
```

**Response 400:**

```json
{
  "success": false,
  "message": "Invalid note ID"
}
```

**Response 403:**

```json
{
  "success": false,
  "message": "Not authorized to view this note"
}
```

**Response 404:**

```json
{
  "success": false,
  "message": "Note not found"
}
```

**Notes:**

- Users can only view their own notes
- Admins can view any note

---

### PATCH /notes/:id

Update an existing note.

**Auth:** Required

**URL Parameters:**

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| id   | string | MongoDB ObjectId of the note |

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Validation Rules:**

- At least one of `title` or `content` must be provided
- Title must be unique per user (if changed)
- Values are automatically trimmed

**Response 200:**

```json
{
  "success": true,
  "data": {
    "_id": "64f1c2a9e3b9f4b8a1d2c346",
    "title": "Updated Title",
    "content": "Updated content",
    "userId": "64f1c2a9e3b9f4b8a1d2c345",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T11:00:00.000Z"
  }
}
```

**Response 400:**

```json
{
  "success": false,
  "message": "At least title or content must be provided"
}
```

**Response 403:**

```json
{
  "success": false,
  "message": "Not authorized to update this note"
}
```

**Response 409:**

```json
{
  "success": false,
  "message": "A note with this title already exists"
}
```

**Notes:**

- Users can only update their own notes
- Admins can update any note
- Partial updates are supported (only send fields to update)

---

### DELETE /notes/:id

Delete a note.

**Auth:** Required

**URL Parameters:**

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| id   | string | MongoDB ObjectId of the note |

**Response 200:**

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

**Response 400:**

```json
{
  "success": false,
  "message": "Invalid note ID"
}
```

**Response 403:**

```json
{
  "success": false,
  "message": "Not authorized to delete this note"
}
```

**Response 404:**

```json
{
  "success": false,
  "message": "Note not found"
}
```

**Notes:**

- Users can only delete their own notes
- Admins can delete any note
- Deletion is permanent

---

## Error Handling

### Standard Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

### HTTP Status Codes

| Code | Description                            |
| ---- | -------------------------------------- |
| 200  | Success                                |
| 201  | Created                                |
| 400  | Bad Request (validation error)         |
| 401  | Unauthorized (authentication required) |
| 403  | Forbidden (insufficient permissions)   |
| 404  | Not Found                              |
| 409  | Conflict (duplicate resource)          |
| 500  | Internal Server Error                  |

### Common Error Messages

- `"Not authorized"` - Missing or invalid authentication token
- `"Invalid credentials"` - Wrong email or password
- `"Account is banned"` - User account has been banned
- `"User not found"` - User does not exist
- `"Note not found"` - Note does not exist
- `"Not authorized to [action] this note"` - User doesn't own the note
- `"Invalid [resource] ID"` - Malformed MongoDB ObjectId
- `"[Field] already exists"` - Duplicate resource (e.g., email, title)

### Development Mode

In development mode, error responses may include additional debugging information:

```json
{
  "success": false,
  "message": "Error message",
  "stack": "Error stack trace..."
}
```

---

## Authentication

### JWT Token

- Stored in HttpOnly cookie named `token`
- Expires in 7 days
- Contains: `id` (user ID) and `role` (user role)
- Automatically sent with requests (credentials: include)

### Protected Routes

All protected routes require:

1. Valid JWT token in cookie or Authorization header
2. User exists in database
3. User is not banned

### Authorization Header (Alternative)

If not using cookies, you can send the token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Pagination

All paginated endpoints return pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Pagination Rules:**

- `page`: Minimum 1
- `limit`: Varies by endpoint (see endpoint documentation)
- `total`: Total number of items matching the query
- `totalPages`: Calculated as `Math.ceil(total / limit)`

---

## Real-time Events

### Socket.io Events

The application uses Socket.io for real-time updates:

**Event: `note:created`**

- Emitted when a new note is created
- Payload: `{ id: "<note_id>" }`
- All connected clients receive this event

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider implementing rate limiting for production use.

---

## CORS

The API supports CORS with credentials. Allowed origins:

- `http://localhost:5173` (development)
- `https://saas-notes-app-gray.vercel.app` (production)
- Any `*.vercel.app` domain

---

## Health Check

### GET /api/health

Check if the API server is running.

**Response 200:**

```
OK
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are MongoDB ObjectIds (24 character hex strings)
- All string inputs are automatically trimmed
- Empty strings after trimming are treated as invalid
- Case-insensitive search is supported where applicable
