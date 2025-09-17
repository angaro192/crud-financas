# 🤖 MyFinance - Sistema de Gestão Financeira Pessoal

> **⚠️ IMPORTANTE: Este projeto foi desenvolvido integralmente por Inteligência Artificial com o mínimo de review humano possível. O código foi gerado automaticamente e pode conter implementações que necessitam de revisão adicional para uso em produção.**

## 📋 Sobre o Projeto

**MyFinance** é um sistema completo de gestão financeira pessoal desenvolvido para ajudar usuários a controlar suas receitas e despesas de forma segura e organizada. O sistema oferece funcionalidades robustas de autenticação, isolamento de dados por usuário e relatórios financeiros.

### 🎯 Características Principais

- **Gestão de Transações Financeiras**: Controle completo de receitas e despesas
- **Sistema de Autenticação JWT**: Segurança robusta com tokens de acesso
- **Isolamento de Dados**: Cada usuário acessa apenas suas próprias informações
- **API RESTful**: Interface bem estruturada seguindo padrões REST
- **Validação de Dados**: Validação rigorosa com Zod em todos os endpoints
- **Banco de Dados Relacional**: PostgreSQL com Prisma ORM

## 🛠️ Stack Tecnológica

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Fastify 5.x (alta performance)
- **Linguagem**: TypeScript
- **ORM**: Prisma 6.x
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Criptografia**: bcrypt para senhas
- **Validação**: Zod para esquemas de dados
- **Testes**: Jest com TypeScript

### Desenvolvimento
- **Build Tool**: tsup
- **Dev Server**: tsx
- **Type Checking**: TypeScript 5.x

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL
- npm ou yarn

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd myfinance
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configuração do Banco de Dados

1. Crie um banco PostgreSQL
2. Configure a variável de ambiente `DATABASE_URL`:

```bash
# Crie um arquivo .env na raiz do projeto
DATABASE_URL="postgresql://usuario:senha@localhost:5432/myfinance"
JWT_SECRET="sua-chave-secreta-jwt"
```

### 4. Execute as Migrações

```bash
npx prisma migrate dev
```

### 5. Gere o Cliente Prisma

```bash
npx prisma generate
```

## 🎮 Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`

### Produção

```bash
# Build do projeto
npm run build

# Executar
npm start
```

### Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

## 📡 API Endpoints

### 🔓 Endpoints Públicos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Login do usuário |

### 🔒 Endpoints Protegidos (Requer Token JWT)

#### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/register` | Registrar novo usuário (apenas usuários autenticados) |
| `GET` | `/auth/me` | Informações do usuário atual |

#### Gerenciamento de Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/users` | Listar todos os usuários |
| `POST` | `/users` | Criar novo usuário |

#### Transações Financeiras
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/financial-transactions` | Criar transação |
| `GET` | `/financial-transactions` | Listar transações do usuário |
| `GET` | `/financial-transactions/stats` | Estatísticas financeiras |
| `GET` | `/financial-transactions/:id` | Buscar transação específica |
| `PUT` | `/financial-transactions/:id` | Atualizar transação |
| `PATCH` | `/financial-transactions/:id` | Atualização parcial |
| `DELETE` | `/financial-transactions/:id` | Deletar transação |

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos, inclua o header:

```
Authorization: Bearer <seu-token-jwt>
```

### Exemplo de Login

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@example.com", "password": "senha123"}'
```

## 💾 Modelo de Dados

### User (Usuário)
```typescript
{
  id: string;        // UUID
  name: string;      // Nome do usuário
  email: string;     // Email único
  password: string;  // Senha criptografada
  createdAt: Date;   // Data de criação
  updatedAt: Date;   // Data de atualização
}
```

### FinancialTransaction (Transação Financeira)
```typescript
{
  id: string;        // UUID
  valor: Decimal;    // Valor da transação
  empresa: string;   // Nome da empresa/descrição
  data: Date;        // Data da transação
  tipo: string;      // "Receita" ou "Despesa"
  userId: string;    // ID do usuário proprietário
  createdAt: Date;   // Data de criação
  updatedAt: Date;   // Data de atualização
}
```

## 🛡️ Recursos de Segurança

1. **Autenticação JWT**: Todos os endpoints sensíveis protegidos
2. **Registro protegido**: Apenas usuários autenticados podem registrar novos usuários
3. **Isolamento de dados**: Usuários só acessam suas próprias transações
4. **Validação de propriedade**: Verificação automática se a transação pertence ao usuário
5. **Hash de senhas**: Senhas criptografadas com bcrypt
6. **Validação de entrada**: Esquemas Zod para todos os endpoints
7. **UUIDs**: Identificadores únicos para todas as entidades

## 📊 Estrutura do Projeto

```
myfinance/
├── prisma/
│   ├── migrations/          # Migrações do banco de dados
│   └── schema.prisma       # Schema do Prisma
├── src/
│   ├── controllers/        # Controladores da aplicação
│   ├── middleware/         # Middlewares (autenticação, etc.)
│   ├── models/            # Modelos de dados
│   ├── routes/            # Definição das rotas
│   ├── utils/             # Utilitários
│   └── server.ts          # Servidor principal
├── tests/                 # Arquivos de teste
├── scripts/               # Scripts auxiliares
└── docs/                  # Documentação adicional
```

## 🧪 Testes

O projeto inclui testes unitários e de integração utilizando Jest. Para executar:

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- --testNamePattern="AuthController"

# Cobertura de código
npm test -- --coverage
```

## 📚 Documentação Adicional

- [SECURITY_TEST.md](./SECURITY_TEST.md) - Guia de testes de segurança
- [AUTH_GUIDE.md](./AUTH_GUIDE.md) - Guia de autenticação
- [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) - Relatório de migrações

## 🚀 Deploy

### Variáveis de Ambiente Necessárias

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="sua-chave-secreta-muito-segura"
PORT=3333
NODE_ENV="production"
```

### Comandos de Deploy

```bash
# Build do projeto
npm run build

# Executar migrações em produção
npx prisma migrate deploy

# Iniciar aplicação
npm start
```

## 🤝 Contribuição

Como este projeto foi gerado por IA, contribuições são especialmente bem-vindas para:

1. **Revisão de Código**: Identificar possíveis melhorias ou problemas
2. **Testes Adicionais**: Expandir a cobertura de testes
3. **Documentação**: Melhorar e expandir a documentação
4. **Segurança**: Revisar e fortalecer aspectos de segurança
5. **Performance**: Otimizações de performance

## 📄 Licença

Este projeto está sob a licença ISC.

## ⚠️ Disclaimer

Este código foi gerado por IA e deve ser revisado cuidadosamente antes de uso em produção. Recomenda-se:

- Revisão completa do código por desenvolvedores experientes
- Testes extensivos em ambiente de desenvolvimento
- Auditoria de segurança
- Validação das regras de negócio

---

**Desenvolvido com 🤖 por Inteligência Artificial**