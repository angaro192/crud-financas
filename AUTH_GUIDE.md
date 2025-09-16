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

Todos os endpoints agora exigem autenticação JWT e só permitem acesso aos dados do usuário autenticado:

### Financial Transaction Endpoints (Protected)
- `POST /financial-transactions` - Criar transação (associada ao usuário logado)
- `GET /financial-transactions` - Listar transações (apenas do usuário logado)
- `GET /financial-transactions/stats` - Estatísticas (apenas do usuário logado)
- `GET /financial-transactions/:id` - Buscar transação específica (apenas se pertencer ao usuário)
- `PUT /financial-transactions/:id` - Atualizar transação (apenas se pertencer ao usuário)
- `PATCH /financial-transactions/:id` - Atualização parcial (apenas se pertencer ao usuário)
- `DELETE /financial-transactions/:id` - Deletar transação (apenas se pertencer ao usuário)

### User Management Endpoints (Protected)
- `GET /users` - Listar todos os usuários
- `POST /users` - Criar novo usuário (funcionalidade admin)

Para acessar estes endpoints, inclua o token JWT no cabeçalho Authorization:
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

## Recursos de Segurança

- Senhas são hash usando bcrypt com 10 salt rounds
- Tokens JWT expiram após 7 dias
- Unicidade de email é garantida no nível do banco de dados
- Validação de entrada usando esquemas Zod
- Implementação type-safe com TypeScript
- **Isolamento de dados**: Cada usuário só pode acessar suas próprias transações financeiras
- **Relacionamento usuário-transação**: Todas as transações são associadas ao usuário que as criou
- **Validação de propriedade**: Verificação automática se a transação pertence ao usuário autenticado

## Environment Variables

For production, set the JWT secret in environment variables:
```
JWT_SECRET=your-super-secret-key-here
```