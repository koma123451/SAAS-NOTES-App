# Admin API Documentation

Base URL: `/api/admin`

**All routes require authentication and admin privileges.**

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Notes](#notes)
- [Error Handling](#error-handling)

---

## Authentication

All admin endpoints require:

1. Valid JWT token (authentication)
2. User role must be `"admin"` (authorization)

Both conditions are checked by middleware:

- `protect` - Verifies JWT token and loads user from database
- `admin` - Verifies user role is `"admin"`

**Note:** The role is always checked against the database, not the JWT token, ensuring role changes take effect immediately.

---

## Users

### GET /admin/users

Get a paginated list of all users.

**Auth:** Required (admin)

**Query Parameters:**

| Name   | Type   | Description                              | Default        |
| ------ | ------ | ---------------------------------------- | -------------- |
| page   | number | Page number (minimum 1)                  | 1              |
| limit  | number | Items per page (minimum 1, maximum 10)   | 8              |
| search | string | Search users by email (case-insensitive) | ""             |
| sort   | string | Sort format: `field:asc` or `field:desc` | createdAt:desc |

**Example Request:**

```
GET /api/admin/users?page=1&limit=5&search=john&sort=createdAt:desc
```

**Response 200:**

```json
{
  "data": [
    {
      "_id": "64f1c2a9e3b9f4b8a1d2c345",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "isBanned": false,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "_id": "64f1c2a9e3b9f4b8a1d2c346",
      "username": "janedoe",
      "email": "jane@example.com",
      "role": "admin",
      "isBanned": false,
      "createdAt": "2025-01-02T10:00:00.000Z",
      "updatedAt": "2025-01-02T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "totalPages": 5
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

**Response 403:**

```json
{
  "success": false,
  "message": "Not authorized"
}
```

**Notes:**

- Password field is excluded from response
- Search is case-insensitive and matches email
- Returns all users regardless of ban status

---

### GET /admin/users/:id

Get a single user by ID.

**Auth:** Required (admin)

**URL Parameters:**

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| id   | string | MongoDB ObjectId of the user |

**Example Request:**

```
GET /api/admin/users/64f1c2a9e3b9f4b8a1d2c345
```

**Response 200:**

```json
{
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

**Response 400:**

```json
{
  "success": false,
  "message": "Invalid user id"
}
```

**Response 404:**

```json
{
  "success": false,
  "message": "User not found"
}
```

**Notes:**

- Password field is excluded from response
- Returns complete user information

---

### PATCH /admin/users/:id/ban

Toggle a user's banned status.

**Auth:** Required (admin)

**URL Parameters:**

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| id   | string | MongoDB ObjectId of the user |

**Example Request:**

```
PATCH /api/admin/users/64f1c2a9e3b9f4b8a1d2c345/ban
```

**Response 200:**

```json
{
  "success": true,
  "message": "User banned successfully",
  "isBanned": true
}
```

Or if unbanning:

```json
{
  "success": true,
  "message": "User unbanned successfully",
  "isBanned": false
}
```

**Response 400:**

```json
{
  "success": false,
  "message": "You cannot ban yourself"
}
```

**Response 403:**

```json
{
  "success": false,
  "message": "Cannot ban another admin"
}
```

**Response 404:**

```json
{
  "success": false,
  "message": "User not found"
}
```

**Behavior Notes:**

- **Toggles** the `isBanned` status (if banned, becomes unbanned and vice versa)
- Prevents admins from banning their own account
- Prevents admins from banning other admins
- Changes are persisted immediately to the database
- Banned users cannot log in (checked during authentication)

**Important:**

- This is a toggle operation - no request body needed
- The endpoint automatically determines whether to ban or unban based on current status

---

### GET /admin/users/:userId/notes

Get paginated list of notes belonging to a specific user.

**Auth:** Required (admin)

**URL Parameters:**

| Name   | Type   | Description                  |
| ------ | ------ | ---------------------------- |
| userId | string | MongoDB ObjectId of the user |

**Query Parameters:**

| Name  | Type   | Description                              | Default        |
| ----- | ------ | ---------------------------------------- | -------------- |
| page  | number | Page number (minimum 1)                  | 1              |
| limit | number | Items per page (minimum 1, maximum 8)    | 5              |
| sort  | string | Sort format: `field:asc` or `field:desc` | createdAt:desc |

**Example Request:**

```
GET /api/admin/users/64f1c2a9e3b9f4b8a1d2c345/notes?page=1&limit=5&sort=createdAt:desc
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
      "createdAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "_id": "64f1c2a9e3b9f4b8a1d2c347",
      "title": "My Second Note",
      "content": "Another note content.",
      "createdAt": "2025-01-02T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "totalPages": 3
  }
}
```

**Response 400:**

```json
{
  "success": false,
  "message": "Invalid user id"
}
```

**Response 404:**

```json
{
  "success": false,
  "message": "User not found"
}
```

**Notes:**

- Only returns `title`, `content`, and `createdAt` fields
- Useful for viewing a specific user's notes in the admin dashboard
- Returns empty array if user has no notes

---

## Notes

### GET /admin/notes

Get paginated list of all notes from all users.

**Auth:** Required (admin)

**Query Parameters:**

| Name   | Type   | Description                                         | Default        |
| ------ | ------ | --------------------------------------------------- | -------------- |
| page   | number | Page number (minimum 1)                             | 1              |
| limit  | number | Items per page (minimum 1, maximum 50)              | 10             |
| search | string | Search notes by title or content (case-insensitive) | ""             |
| sort   | string | Sort format: `field:asc` or `field:desc`            | createdAt:desc |

**Example Request:**

```
GET /api/admin/notes?page=1&limit=10&search=important&sort=createdAt:desc
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
      "userId": {
        "_id": "64f1c2a9e3b9f4b8a1d2c345",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
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

**Response 403:**

```json
{
  "success": false,
  "message": "Not authorized"
}
```

**Notes:**

- Returns notes from all users
- Includes populated user information (username and email)
- Search matches both title and content
- Useful for admin dashboard overview

---

### DELETE /admin/notes/:id

Delete any note (admin override).

**Auth:** Required (admin)

**URL Parameters:**

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| id   | string | MongoDB ObjectId of the note |

**Example Request:**

```
DELETE /api/admin/notes/64f1c2a9e3b9f4b8a1d2c346
```

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

**Response 404:**

```json
{
  "success": false,
  "message": "Note not found"
}
```

**Notes:**

- Admins can delete any note, regardless of ownership
- Deletion is permanent
- No additional confirmation required (admin privilege)

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
| 400  | Bad Request (validation error)         |
| 401  | Unauthorized (authentication required) |
| 403  | Forbidden (insufficient permissions)   |
| 404  | Not Found                              |
| 500  | Internal Server Error                  |

### Common Error Messages

- `"Not authorized"` - Missing token, invalid token, or insufficient permissions
- `"Invalid user id"` - Malformed MongoDB ObjectId
- `"User not found"` - User does not exist
- `"You cannot ban yourself"` - Admin attempted to ban their own account
- `"Cannot ban another admin"` - Admin attempted to ban another admin
- `"Invalid note ID"` - Malformed MongoDB ObjectId
- `"Note not found"` - Note does not exist

### Error Response Examples

**401 Unauthorized (No Token):**

```json
{
  "success": false,
  "message": "Not authorized"
}
```

**403 Forbidden (Not Admin):**

```json
{
  "success": false,
  "message": "Not authorized"
}
```

**400 Bad Request (Invalid ID):**

```json
{
  "success": false,
  "message": "Invalid user id"
}
```

---

## Security Considerations

### Admin Privileges

1. **Role Verification**: Admin role is always verified against the database, not the JWT token
2. **Immediate Effect**: Role changes take effect immediately (no need to re-login)
3. **Double Protection**: Both frontend (`AdminRoute`) and backend (`admin` middleware) enforce admin access
4. **Self-Protection**: Admins cannot ban themselves
5. **Admin Protection**: Admins cannot ban other admins

### Best Practices

- Always verify admin status on the backend (never trust frontend-only checks)
- Use middleware chain: `protect` → `admin` for all admin routes
- Log admin actions for audit purposes (future enhancement)
- Consider implementing rate limiting for admin endpoints

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

## Sorting

All endpoints support sorting via the `sort` query parameter:

**Format:** `field:direction`

- `field`: Any valid field name (e.g., `createdAt`, `email`, `username`)
- `direction`: `asc` (ascending) or `desc` (descending)

**Examples:**

- `createdAt:desc` - Newest first
- `createdAt:asc` - Oldest first
- `email:asc` - Alphabetical by email

**Default:** `createdAt:desc`

**Note:** When sorting by `createdAt`, if timestamps are identical, the `_id` field is used as a secondary sort key.

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are MongoDB ObjectIds (24 character hex strings)
- Search is case-insensitive where applicable
- Admin endpoints have higher rate limits (or no limits currently)
- Consider implementing audit logging for admin actions

---

## Future Enhancements

Potential improvements for admin API:

1. **Audit Logs**: Track all admin actions (ban/unban, delete notes, etc.)
2. **Bulk Operations**: Ban/unban multiple users, delete multiple notes
3. **User Statistics**: Get user activity stats, note counts, etc.
4. **Advanced Search**: Filter by role, ban status, date ranges
5. **Export Data**: Export user/note data as CSV/JSON
6. **Rate Limiting**: Implement rate limiting for admin endpoints
7. **Admin Activity Dashboard**: View recent admin actions
