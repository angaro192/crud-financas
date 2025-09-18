# Design: Validação de Tipos Rigorosa nos Controladores

## Overview

Implementação de validação de tipos mais rigorosa nos controladores da aplicação MyFinance para garantir integridade dos dados, melhor experiência do usuário e maior segurança. A solução utiliza o Zod (já presente no projeto) como biblioteca principal para validação de schemas, com integração nativa ao Fastify.

## Arquitetura

### Estrutura de Validação

```mermaid
graph TD
    A[Request] --> B[Fastify Route Handler]
    B --> C[Schema Validation Middleware]
    C --> D{Validation Result}
    D -->|Success| E[Controller Logic]
    D -->|Error| F[Validation Error Response]
    E --> G[Response]
    F --> G
```

### Componentes Principais

| Componente | Responsabilidade | Localização |
|------------|-----------------|-------------|
| **Request Schemas** | Definir estrutura esperada para body, params, query | `src/schemas/` |
| **Validation Middleware** | Aplicar validação automaticamente nas rotas | `src/middleware/` |
| **Error Handler** | Formatar erros de validação de forma consistente | `src/utils/` |
| **Type Definitions** | Tipos TypeScript derivados dos schemas | Gerados automaticamente |

## Schemas de Validação

### Schema para Autenticação

```mermaid
classDiagram
    class LoginSchema {
        +email: string (email format)
        +password: string (min 6 chars)
        +validate(): ValidationResult
    }
    
    class RegisterSchema {
        +email: string (email format)
        +password: string (min 8 chars)
        +name: string (min 2 chars)
        +validate(): ValidationResult
    }
```

### Schema para Transações Financeiras

```mermaid
classDiagram
    class CreateTransactionSchema {
        +description: string (min 3, max 255)
        +amount: number (positive)
        +type: "INCOME" | "EXPENSE"
        +category?: string
        +date?: Date
        +validate(): ValidationResult
    }
    
    class UpdateTransactionSchema {
        +description?: string (min 3, max 255)
        +amount?: number (positive)
        +type?: "INCOME" | "EXPENSE"
        +category?: string
        +date?: Date
        +validate(): ValidationResult
    }
    
    class QueryParamsSchema {
        +page?: number (min 1)
        +limit?: number (min 1, max 100)
        +type?: "INCOME" | "EXPENSE"
        +startDate?: Date
        +endDate?: Date
        +validate(): ValidationResult
    }
```

## Middleware de Validação

### Estrutura do Middleware

```mermaid
sequenceDiagram
    participant Client
    participant FastifyRoute
    participant ValidationMiddleware
    participant ZodSchema
    participant Controller
    
    Client->>FastifyRoute: HTTP Request
    FastifyRoute->>ValidationMiddleware: Request Data
    ValidationMiddleware->>ZodSchema: Validate Body/Params/Query
    
    alt Validation Success
        ZodSchema-->>ValidationMiddleware: Parsed Data
        ValidationMiddleware->>Controller: Validated Request
        Controller-->>Client: Success Response
    else Validation Error
        ZodSchema-->>ValidationMiddleware: Validation Errors
        ValidationMiddleware-->>Client: 400 Bad Request + Error Details
    end
```

### Implementação com Fastify Prevalidation

| Hook | Propósito | Dados Validados |
|------|-----------|-----------------|
| `preValidation` | Validar antes do handler | Body, Params, Query |
| `preHandler` | Transformar dados validados | Aplicar transformações adicionais |
| `onError` | Capturar erros de validação | Formatar resposta de erro |

## Validações por Endpoint

### Endpoints de Autenticação

| Endpoint | Body Schema | Response Schema |
|----------|-------------|-----------------|
| `POST /auth/login` | LoginSchema | AuthResponseSchema |
| `POST /auth/register` | RegisterSchema | AuthResponseSchema |
| `GET /auth/me` | - | UserProfileSchema |

### Endpoints de Transações

| Endpoint | Params | Query | Body | Response |
|----------|--------|-------|------|----------|
| `POST /financial-transactions` | - | - | CreateTransactionSchema | TransactionResponseSchema |
| `GET /financial-transactions` | - | QueryParamsSchema | - | TransactionListSchema |
| `GET /financial-transactions/:id` | UUIDParamSchema | - | - | TransactionResponseSchema |
| `PUT /financial-transactions/:id` | UUIDParamSchema | - | UpdateTransactionSchema | TransactionResponseSchema |
| `PATCH /financial-transactions/:id` | UUIDParamSchema | - | PartialUpdateSchema | TransactionResponseSchema |
| `DELETE /financial-transactions/:id` | UUIDParamSchema | - | - | DeleteResponseSchema |

## Tratamento de Erros de Validação

### Formato Padrão de Erro

```mermaid
classDiagram
    class ValidationErrorResponse {
        +error: string
        +message: string
        +statusCode: 400
        +validation: ValidationDetails[]
        +timestamp: string
    }
    
    class ValidationDetails {
        +field: string
        +message: string
        +value: any
        +code: string
    }
    
    ValidationErrorResponse --> ValidationDetails
```

### Códigos de Erro Específicos

| Código | Descrição | Exemplo |
|--------|-----------|---------|
| `REQUIRED_FIELD` | Campo obrigatório ausente | email é obrigatório |
| `INVALID_FORMAT` | Formato inválido | email deve ter formato válido |
| `OUT_OF_RANGE` | Valor fora do intervalo | amount deve ser positivo |
| `INVALID_TYPE` | Tipo de dado incorreto | page deve ser número |
| `INVALID_UUID` | UUID malformado | ID deve ser UUID válido |

## Integração com Controladores Existentes

### Fluxo de Migração

```mermaid
graph LR
    A[Controlador Atual] --> B[Adicionar Schema]
    B --> C[Configurar Validação na Rota]
    C --> D[Remover Validações Manuais]
    D --> E[Testar Endpoints]
    E --> F[Controlador Atualizado]
```

### Controladores Afetados

| Controlador | Schemas Necessários | Prioridade |
|-------------|-------------------|------------|
| `AuthController` | Login, Register, Token | Alta |
| `FinancialTransactionController` | CRUD Transactions, Query Params | Alta |
| `UserController` | User Management | Média |

## Testing

### Estratégia de Testes

```mermaid
graph TD
    A[Unit Tests] --> B[Schema Validation Tests]
    A --> C[Middleware Tests]
    A --> D[Error Handling Tests]
    
    E[Integration Tests] --> F[Endpoint Validation Tests]
    E --> G[Error Response Tests]
    E --> H[Type Safety Tests]
```

### Cenários de Teste

| Categoria | Cenários | Expectativas |
|-----------|----------|--------------|
| **Dados Válidos** | Requests com dados corretos | Processamento normal |
| **Dados Inválidos** | Campos ausentes, tipos incorretos | Erro 400 com detalhes |
| **Casos Extremos** | Valores limite, strings muito longas | Validação apropriada |
| **Tipos Aninhados** | Objetos complexos, arrays | Validação recursiva |

### Cobertura de Testes

- **Schemas**: 100% dos campos validados
- **Middlewares**: Todos os fluxos de sucesso e erro
- **Integração**: Todos os endpoints com dados válidos e inválidos
- **Performance**: Tempo de validação < 50ms para requests típicos