# JWT Authentication Implementation

## Authentication Endpoints

### 1. Register a new user
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clxxxxx",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-09-15T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clxxxxx",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get current user info (Protected)
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "clxxxxx",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-09-15T..."
  }
}
```

## Protected Routes

All financial transaction endpoints now require authentication:
- `POST /financial-transactions`
- `GET /financial-transactions`
- `GET /financial-transactions/stats`
- `GET /financial-transactions/:id`
- `PUT /financial-transactions/:id`
- `PATCH /financial-transactions/:id`
- `DELETE /financial-transactions/:id`

To access these endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Testing Examples (PowerShell)

### 1. Register a user
```powershell
$registerResponse = Invoke-RestMethod -Uri "http://localhost:3333/auth/register" -Method POST -ContentType "application/json" -Body '{"name": "Test User", "email": "test@example.com", "password": "123456"}'
$token = $registerResponse.token
```

### 2. Login
```powershell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3333/auth/login" -Method POST -ContentType "application/json" -Body '{"email": "test@example.com", "password": "123456"}'
$token = $loginResponse.token
```

### 3. Access protected endpoint
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3333/auth/me" -Method GET -Headers $headers
```

### 4. Create financial transaction (protected)
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3333/financial-transactions" -Method POST -ContentType "application/json" -Headers $headers -Body '{"valor": 1500.50, "empresa": "Test Company", "data": "2025-09-15T10:00:00Z", "tipo": "Receita"}'
```

## Error Responses

### Authentication Errors

**401 Unauthorized - Missing token:**
```json
{
  "error": "Access token is required"
}
```

**401 Unauthorized - Invalid token:**
```json
{
  "error": "Invalid token"
}
```

**401 Unauthorized - Expired token:**
```json
{
  "error": "Token expired"
}
```

**401 Unauthorized - Invalid credentials:**
```json
{
  "error": "Invalid credentials"
}
```

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens expire after 7 days
- Email uniqueness is enforced at database level
- Input validation using Zod schemas
- Type-safe implementation with TypeScript

## Environment Variables

For production, set the JWT secret in environment variables:
```
JWT_SECRET=your-super-secret-key-here
```