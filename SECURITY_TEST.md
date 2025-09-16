# Teste de Autenticação JWT - MyFinance

## ✅ Status dos Endpoints Protegidos

Todos os endpoints que acessam dados sensíveis agora exigem autenticação JWT:

### 🔓 Endpoints Públicos (sem token necessário):
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login do usuário

### 🔒 Endpoints Protegidos (token obrigatório):

#### Autenticação:
- `GET /auth/me` - Informações do usuário atual

#### Gerenciamento de Usuários:
- `GET /users` - Listar todos os usuários
- `POST /users` - Criar novo usuário

#### Transações Financeiras (isoladas por usuário):
- `POST /financial-transactions` - Criar transação (associada ao usuário logado)
- `GET /financial-transactions` - Listar transações (apenas do usuário logado)
- `GET /financial-transactions/stats` - Estatísticas (apenas do usuário logado)
- `GET /financial-transactions/:id` - Buscar transação (apenas se pertencer ao usuário)
- `PUT /financial-transactions/:id` - Atualizar transação (apenas se pertencer ao usuário)
- `PATCH /financial-transactions/:id` - Atualização parcial (apenas se pertencer ao usuário)
- `DELETE /financial-transactions/:id` - Deletar transação (apenas se pertencer ao usuário)

## 🧪 Teste Rápido em PowerShell

### 1. Registrar um usuário:
```powershell
$registerResponse = Invoke-RestMethod -Uri "http://localhost:3333/auth/register" -Method POST -ContentType "application/json" -Body '{"name": "Teste User", "email": "teste@example.com", "password": "123456"}'
$token = $registerResponse.token
Write-Host "Token obtido: $token"
```

### 2. Testar endpoint protegido (com token):
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3333/auth/me" -Method GET -Headers $headers
```

### 3. Testar endpoint protegido (sem token - deve falhar):
```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3333/auth/me" -Method GET
} catch {
    Write-Host "❌ Acesso negado sem token (correto!)" -ForegroundColor Red
    $_.Exception.Response.StatusCode
}
```

### 4. Criar transação financeira (protegida):
```powershell
$headers = @{ Authorization = "Bearer $token" }
$transactionData = '{"valor": 1500.50, "empresa": "Empresa Teste", "data": "2025-09-15T10:00:00Z", "tipo": "Receita"}'
$transaction = Invoke-RestMethod -Uri "http://localhost:3333/financial-transactions" -Method POST -ContentType "application/json" -Headers $headers -Body $transactionData
Write-Host "Transação criada com ID: $($transaction.id)"
```

### 5. Listar transações (apenas do usuário logado):
```powershell
$headers = @{ Authorization = "Bearer $token" }
$transactions = Invoke-RestMethod -Uri "http://localhost:3333/financial-transactions" -Method GET -Headers $headers
Write-Host "Número de transações do usuário: $($transactions.transactions.Count)"
```

## 🛡️ Recursos de Segurança Implementados:

1. **Autenticação JWT**: Todos os endpoints sensíveis protegidos
2. **Isolamento de dados**: Usuários só acessam suas próprias transações
3. **Validação de propriedade**: Verificação automática se a transação pertence ao usuário
4. **Hash de senhas**: Senhas criptografadas com bcrypt
5. **Validação de entrada**: Esquemas Zod para todos os endpoints
6. **Relacionamento no banco**: Transações associadas ao usuário que as criou

## ⚠️ Erros Esperados sem Token:

- **401 Unauthorized**: "Access token is required"
- **401 Unauthorized**: "Invalid token"
- **401 Unauthorized**: "Token expired"
- **404 Not Found**: Para transações que não pertencem ao usuário

## 🎯 Resultado Final:

✅ **Todos os endpoints estão protegidos com autenticação JWT**
✅ **Cada usuário só pode acessar suas próprias transações**
✅ **Sistema completamente seguro e isolado por usuário**