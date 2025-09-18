# Seed do Banco de Dados - Usuário Inicial

Este documento explica como criar um usuário administrador inicial no sistema MyFinance.

## 🌱 O que é o Seed?

O seed é um script que popula o banco de dados com dados iniciais essenciais. No nosso caso, ele cria um usuário administrador que pode ser usado para acessar o sistema pela primeira vez.

## ⚙️ Pré-requisitos

Antes de executar o seed, certifique-se de que:

### 1. PostgreSQL está rodando
```bash
# Verifique se o PostgreSQL está ativo
psql --version
```

### 2. Arquivo .env configurado
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/myfinance"
JWT_SECRET="sua-chave-secreta-jwt"
```

### 3. Banco de dados criado
```bash
# Crie o banco de dados (se não existir)
creatdb myfinance

# Ou usando psql
psql -c "CREATE DATABASE myfinance;"
```

### 4. Migrações executadas
```bash
# Execute as migrações
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate
```

## 🚀 Como Executar o Seed

### Opção 1: Usando npm (Recomendado)
```bash
npm run seed
```

### Opção 2: Usando Prisma
```bash
npx prisma db seed
```

### Opção 3: Usando tsx diretamente
```bash
npx tsx prisma/seed.ts
```

## 👤 Dados do Usuário Inicial

Após executar o seed, será criado um usuário com os seguintes dados:

- **Nome:** Administrador
- **Email:** `admin@myfinance.com`
- **Senha:** `admin123`

## 🔐 Credenciais de Login

Para fazer login pela primeira vez, use:

```json
{
  "email": "admin@myfinance.com",
  "password": "admin123"
}
```

### Exemplo de Login via API

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@myfinance.com",
    "password": "admin123"
  }'
```

### Exemplo usando PowerShell

```powershell
$loginData = @{
    email = "admin@myfinance.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3333/auth/login" -Method POST -ContentType "application/json" -Body $loginData

# O token JWT estará em $response.token
Write-Host "Token JWT: $($response.token)"
```

## ⚠️ Segurança Importante

### 🔒 Altere a Senha Imediatamente

**MUITO IMPORTANTE:** Após fazer o primeiro login, altere a senha imediatamente por razões de segurança!

### 🛡️ Boas Práticas

1. **Nunca use a senha padrão em produção**
2. **Crie senhas fortes e únicas**
3. **Use variáveis de ambiente para senhas em produção**
4. **Considere implementar rotação de senhas**

## 🔄 Re-executando o Seed

- Se o usuário já existir, o script não criará um duplicado
- O script é seguro para ser executado múltiplas vezes
- Se precisar resetar o usuário, delete-o do banco primeiro

## 🗃️ Estrutura do Usuário Criado

```typescript
{
  id: string;              // UUID gerado automaticamente
  name: "Administrador";   // Nome do usuário
  email: "admin@myfinance.com";  // Email único
  password: string;        // Senha hasheada com bcrypt (salt rounds: 10)
  createdAt: Date;         // Data de criação
  updatedAt: Date;         // Data de última atualização
}
```

## 🛠️ Troubleshooting

### Erro: "User with this email already exists"
- O usuário já foi criado anteriormente
- Use as credenciais existentes ou delete o usuário do banco

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no arquivo `.env`
- Execute `npx prisma migrate dev` se necessário

### Erro de Dependências
- Execute `npm install` para instalar todas as dependências
- Verifique se o Prisma está configurado: `npx prisma generate`

## 📝 Próximos Passos

Após criar o usuário inicial:

1. Faça login usando as credenciais fornecidas
2. Altere a senha para uma senha segura
3. Crie outros usuários conforme necessário
4. Configure as transações financeiras

## 🔧 Personalização

Para personalizar os dados do usuário inicial, edite o arquivo `prisma/seed.ts`:

```typescript
const initialUser = {
  name: 'Seu Nome Aqui',
  email: 'seu-email@example.com',
  password: 'sua-senha-aqui'
};
```

---

**Lembre-se:** A segurança é fundamental! Sempre altere senhas padrão em ambientes de produção.