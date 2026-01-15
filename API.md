# Admin API Documentation

All routes require authentication and admin privileges.

Base URL: `/api/admin`

## Error Response Format

````json
{
  "status": "fail",
  "message": "Not authorized"
}


## USERS

## GET /admin/users
Get a paginated list of all users. (Admin only)

**Auth:** required (admin)

### Query Parameters
| Name   | Type   | Description                         | Default |
|--------|--------|-------------------------------------|---------|
| page   | number | Page number (minimum 1)             | 1       |
| limit  | number | Items per page (maximum 10)         | 8       |
| search | string | Search users by email (partial)     | ""      |
| sort   | string | Sort format: field:asc|desc         | createdAt:desc |

Example Request

GET /api/admin/users?page=1&limit=2&sort=createdAt:desc

### Response 200

{
  "data": [
    {
      "_id": "userId1",
      "username": "testuser",
      "email": "test@test.com",
      "role": "user",
      "createdAt": "2025-01-01T10:00:00Z",
      "isBanned": false,
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 9,
    "totalPages": 5
  }
}

--------

##GET /users/:id

Get a single user by ID.

Auth:required (admin)

###URL Parameters

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| id   | string | MongoDB ObjectId of the user |

Example Request

GET /api/users/64f1c2a9e3b9f4b8a1d2c345

Response 200

```json
{
  "data": {
    "_id": "64f1c2a9e3b9f4b8a1d2c345",
    "username": "testuser",
    "email": "test@test.com",
    "role": "user",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-10T12:00:00Z"
  }
}
### Note: The password field is excluded from the response.

Response 400

{
  "message": "Invalid user id"
}

Response 404

{
  "message": "User not found"
}

--------

PATCH /admin/users/:id/ban

Toggle a user’s banned status. (Admin only)
Auth: required (admin)

###URL Parameters

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| id   | string | MongoDB ObjectId of the user |

Example Request

PATCH /api/admin/users/64f1c2a9e3b9f4b8a1d2c345/ban

Response 200

{
  "success": true,
  "message": "User banned successfully",
  "isBanned": true
}
Note: This endpoint toggles the isBanned status.
If the user is already banned, the request will unban the user.

Response 400
Returned when an admin attempts to ban their own account.
{
  "message": "You cannot ban yourself"
}

Response 404
Returned when the user does not exist.
{
  "message": "User not found"
}

Behavior Notes
-Prevents admins from banning their own account.

-Toggles the isBanned flag instead of hard-deleting users.

-Changes are persisted immediately to the database.

--------
--------

## NOTES

##GET /notes

Get a list of all notes.

Auth: required

### Example Request

GET /api/notes

 Response 200

{
  "data": [
    {
      "_id": "noteId1",
      "title": "First Note",
      "content": "This is the content of the note",
      "user": "userId1",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    },
    {
      "_id": "noteId2",
      "title": "Second Note",
      "content": "Another note content",
      "user": "userId1",
      "createdAt": "2025-01-02T09:30:00Z",
      "updatedAt": "2025-01-02T09:30:00Z"
    }
  ]
}
------

## GET /admin/users/:userId/notes

Get a paginated list of notes created by a specific user. (Admin only)

Auth: required (admin)

### URL Parameters

| Name   | Type   | Description                  |
|--------|--------|------------------------------|
| userId | string | MongoDB ObjectId of the user |

### Query Parameters

| Name  | Type   | Description                         | Default           |
|-------|--------|-------------------------------------|-------------------|
| page  | number | Page number (minimum 1)             | 1                 |
| limit | number | Items per page (maximum 8)          | 5                 |
| sort  | string | Sort format: field:asc\|desc        | createdAt:desc    |

### Example Request

GET /api/admin/users/64f1c2a9e3b9f4b8a1d2c345/notes?page=1&limit=5&sort=createdAt:desc

### Response 200

```json
{
  "success": true,
  "data": [
    {
      "_id": "noteId1",
      "title": "First Note",
      "content": "This is the content of the note",
      "createdAt": "2025-01-01T10:00:00Z"
    },
    {
      "_id": "noteId2",
      "title": "Second Note",
      "content": "Another note content",
      "createdAt": "2025-01-02T09:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "totalPages": 3
  }
}

### Response 200
Returned when the provided userId is not a valid MongoDB ObjectId.
{
  "message": "Invalid user id"
}
Behavior Notes

Admin-only endpoint

Returns only notes belonging to the specified user

Supports pagination and sorting

Results are sorted by the provided field and order

_id is used as a secondary sort key to ensure stable ordering

````
