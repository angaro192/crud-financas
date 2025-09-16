# Financial Transactions API Documentation

This API provides CRUD operations for managing financial transactions following the MVC pattern.

## Base URL
`http://localhost:3333`

## Endpoints

### 1. Create Financial Transaction
**POST** `/financial-transactions`

Creates a new financial transaction.

**Request Body:**
```json
{
  "valor": 1500.50,              // Number with up to 3 decimal places
  "empresa": "Banco do Brasil",   // String, name of bank/company
  "data": "2025-09-15T10:00:00Z", // ISO datetime string
  "tipo": "Receita"              // String: "Receita" or "Despesa"
}
```

**Response (201):**
```json
{
  "id": "cmfklpdba0000vplcz39cirs0",
  "valor": 1500.5,
  "empresa": "Banco do Brasil",
  "data": "2025-09-15T10:00:00.000Z",
  "tipo": "Receita",
  "createdAt": "2025-09-15T04:05:24.259Z",
  "updatedAt": "2025-09-15T04:05:24.259Z"
}
```

### 2. List Financial Transactions
**GET** `/financial-transactions`

Retrieves a paginated list of financial transactions with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `tipo` (optional): Filter by type ("Receita" or "Despesa")
- `empresa` (optional): Filter by company name (partial match)
- `startDate` (optional): Filter by start date (ISO datetime)
- `endDate` (optional): Filter by end date (ISO datetime)

**Example:** `/financial-transactions?tipo=Receita&page=1&limit=5`

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "cmfklpdba0000vplcz39cirs0",
      "valor": 1500.5,
      "empresa": "Banco do Brasil",
      "data": "2025-09-15T10:00:00.000Z",
      "tipo": "Receita",
      "createdAt": "2025-09-15T04:05:24.259Z",
      "updatedAt": "2025-09-15T04:05:24.259Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

### 3. Get Financial Transaction by ID
**GET** `/financial-transactions/:id`

Retrieves a specific financial transaction.

**Response (200):**
```json
{
  "id": "cmfklpdba0000vplcz39cirs0",
  "valor": 1500.5,
  "empresa": "Banco do Brasil",
  "data": "2025-09-15T10:00:00.000Z",
  "tipo": "Receita",
  "createdAt": "2025-09-15T04:05:24.259Z",
  "updatedAt": "2025-09-15T04:05:24.259Z"
}
```

### 4. Update Financial Transaction
**PUT** `/financial-transactions/:id` or **PATCH** `/financial-transactions/:id`

Updates a financial transaction. Use PUT for complete updates, PATCH for partial updates.

**Request Body (all fields optional for PATCH):**
```json
{
  "valor": 1600.75,
  "empresa": "Banco do Brasil - Corrigido",
  "data": "2025-09-15T12:00:00Z",
  "tipo": "Receita"
}
```

**Response (200):**
```json
{
  "id": "cmfklpdba0000vplcz39cirs0",
  "valor": 1600.75,
  "empresa": "Banco do Brasil - Corrigido",
  "data": "2025-09-15T10:00:00.000Z",
  "tipo": "Receita",
  "createdAt": "2025-09-15T04:05:24.259Z",
  "updatedAt": "2025-09-15T04:06:55.473Z"
}
```

### 5. Delete Financial Transaction
**DELETE** `/financial-transactions/:id`

Deletes a financial transaction.

**Response (204):** Empty body

### 6. Get Financial Statistics
**GET** `/financial-transactions/stats`

Retrieves financial statistics including totals and balance.

**Query Parameters (optional):**
- `empresa`: Filter by company name
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response (200):**
```json
{
  "stats": {
    "totalTransactions": 2,
    "totalReceitas": {
      "amount": 1500.5,
      "count": 1
    },
    "totalDespesas": {
      "amount": 750.125,
      "count": 1
    },
    "saldo": 750.375
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Empresa is required",
      "path": ["empresa"]
    }
  ]
}
```

### Not Found (404)
```json
{
  "error": "Financial transaction not found"
}
```

### Internal Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## Testing Examples (PowerShell)

### Create a new transaction
```powershell
Invoke-RestMethod -Uri "http://localhost:3333/financial-transactions" -Method POST -ContentType "application/json" -Body '{"valor": 1500.50, "empresa": "Banco do Brasil", "data": "2025-09-15T10:00:00Z", "tipo": "Receita"}'
```

### List all transactions
```powershell
Invoke-RestMethod -Uri "http://localhost:3333/financial-transactions" -Method GET
```

### Get statistics
```powershell
Invoke-RestMethod -Uri "http://localhost:3333/financial-transactions/stats" -Method GET
```

### Filter by type
```powershell
Invoke-RestMethod -Uri "http://localhost:3333/financial-transactions?tipo=Despesa" -Method GET
```

### Update a transaction
```powershell
Invoke-RestMethod -Uri "http://localhost:3333/financial-transactions/YOUR_ID_HERE" -Method PUT -ContentType "application/json" -Body '{"valor": 1600.75, "empresa": "Updated Company"}'
```

## Project Structure (MVC Pattern)

```
src/
├── controllers/
│   └── FinancialTransactionController.ts  # Business logic
├── models/
│   └── FinancialTransaction.ts             # Data validation and types
├── routes/
│   └── financialTransactionRoutes.ts       # Route definitions
└── server.ts                               # Application entry point
```

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation with detailed error messages
- ✅ Pagination support
- ✅ Advanced filtering (by type, company, date range)
- ✅ Financial statistics and balance calculation
- ✅ Decimal precision support (up to 3 decimal places)
- ✅ MVC architecture pattern
- ✅ Type-safe with TypeScript
- ✅ Database integration with Prisma ORM