# API Endpoints

Smart Dictate exposes its functionality through a RESTful API. All endpoints are prefixed with `/api/v1`. The following sections describe the available endpoints.

## Authentication Endpoints (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Log in a user | No |
| POST | `/auth/refresh-tokens` | Refresh authentication tokens | Yes (Refresh Token) |
| POST | `/auth/check-tokens` | Check token validity | Yes (Refresh Token) |
| GET | `/auth/logout` | Log out a user | Yes (Refresh Token) |

### Authentication Flow:
1. Client registers or logs in
2. Server returns access token (in response body) and refresh token (in HTTP-only cookie)
3. Client uses access token for API requests
4. When access token expires, client uses refresh token to get new tokens
5. On logout, refresh token is invalidated

## User Management (`/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/users/profile` | Get user profile | Yes |
| PATCH | `/users/profile` | Update user profile | Yes |
| GET | `/users/statistics` | Get user statistics | Yes |

## Text Management (`/texts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/texts` | Get filtered list of texts | Yes |
| GET | `/texts/:id` | Get detailed text data with performance and analytics | Yes |

## Category Management (`/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/categories` | Get list of categories | Yes |
| POST | `/categories` | Create a category | Yes |
| PATCH | `/categories/:id` | Update a category | Yes |
| DELETE | `/categories/:id` | Delete a category | Yes |

## Vocabulary Management

### Vocabulary Groups (`/vocabulary-group`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/vocabulary-group` | Get list of vocabulary groups | Yes |
| POST | `/vocabulary-group` | Create a vocabulary group | Yes |
| PATCH | `/vocabulary-group/:id` | Update a vocabulary group | Yes |
| DELETE | `/vocabulary-group/:id` | Delete a vocabulary group | Yes |

### Vocabulary Words (`/vocabulary`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/vocabulary` | Get list of vocabulary words | Yes |
| POST | `/vocabulary` | Add a vocabulary word | Yes |
| PATCH | `/vocabulary/:id` | Update a vocabulary word | Yes |
| DELETE | `/vocabulary/:id` | Delete a vocabulary word | Yes |

## Submissions (`/submissions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/submissions` | Submit a dictation attempt | Yes |
| GET | `/submissions/:id` | Get details of a submission | Yes |

## Settings (`/settings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/settings` | Get user settings | Yes |
| POST | `/settings` | Update or create settings | Yes |

## Speakers (`/speakers`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/speakers` | Get available text-to-speech speakers | Yes |

## System (`/system`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/system/health` | Check system health | No |
| GET | `/system/status` | Get system status | Yes (Admin) |

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful message",
  "data": {
    // Response data specific to the endpoint
  }
}
```

For error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Detailed error information (optional)
  ]
}
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require authentication, which is handled via:

1. **Access Token**: Short-lived token sent in the `Authorization` header as a Bearer token
2. **Refresh Token**: Longer-lived token stored in an HTTP-only secure cookie

### Headers for Authenticated Requests

```
Authorization: Bearer <access_token>
```

## Request Validation

Input validation is performed using DTOs (Data Transfer Objects) with class-validator decorators. Invalid requests will return appropriate error responses with validation details.

## API Documentation

The API is documented using Swagger and can be accessed at `/api/docs` when the server is running. This interactive documentation provides detailed information about each endpoint, including:

- Request parameters
- Request body schemas
- Response schemas
- Authentication requirements 