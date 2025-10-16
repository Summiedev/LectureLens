# LectureLens Backend API Documentation

## Overview
Backend API for LectureLens - a platform for managing teachers and their lecture content.

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### POST /auth/register
Register a new teacher account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "token": "string",
  "teacher": {
    "id": "number",
    "name": "string",
    "email": "string",
    "supabase_user_id": "string"
  }
}
```

**Error Responses:**
- `400` - Email already in use or validation error
- `500` - Registration failed

### POST /auth/login
Authenticate a teacher.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "user": "object",
  "session": "object",
  "teacher": {
    "id": "number",
    "name": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `500` - Login failed

### POST /auth/logout
Log out the current user.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**
- `400` - Logout error
- `500` - Logout failed

## Teacher Model Functions

### createTeacher(data)
Creates a new teacher record in the database.

**Parameters:**
```javascript
{
  name: "string",
  email: "string", 
  supabase_user_id: "string"
}
```

**Returns:**
```javascript
{
  data: TeacherObject,
  error: ErrorObject | null
}
```

### getTeacherById(id)
Retrieves a teacher by their ID.

**Parameters:**
- `id` (number) - Teacher ID

**Returns:**
```javascript
{
  data: TeacherObject,
  error: ErrorObject | null
}
```

### getTeacherByEmail(email)
Retrieves a teacher by their email address.

**Parameters:**
- `email` (string) - Teacher email

**Returns:**
```javascript
{
  data: TeacherObject,
  error: ErrorObject | null
}
```

### updateTeacher(id, data)
Updates teacher information.

**Parameters:**
- `id` (number) - Teacher ID
- `data` (object):
  ```javascript
  {
    name?: "string",
    email?: "string",
    password?: "string"
  }
  ```

**Returns:**
```javascript
{
  data: TeacherObject,
  error: ErrorObject | null
}
```

### deleteTeacher(id)
Deletes a teacher record.

**Parameters:**
- `id` (number) - Teacher ID

**Returns:**
```javascript
{
  data: any,
  error: ErrorObject | null
}
```

## Database Schema

### Teachers Table
```sql
teachers {
  id: SERIAL PRIMARY KEY,
  name: VARCHAR NOT NULL,
  email: VARCHAR UNIQUE NOT NULL,
  supabase_user_id: UUID REFERENCES auth.users(id),
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

## Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Environment:** Development

## Setup Instructions
1. Install dependencies: `npm install`
2. Configure environment variables
3. Start server: `npm start` or `npm run dev`
4. Server runs on port 5000

## Error Handling
All endpoints return standardized error responses:
```json
{
  "error": "Error message",
  "field": "fieldName" // (optional, for validation errors)
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error