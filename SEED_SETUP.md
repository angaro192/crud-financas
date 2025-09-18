# 🌱 Setup do Seed - Usuário Inicial

## ⚡ Resumo Rápido

Para criar um usuário administrador inicial:

```bash
# 1. Configure o .env (se ainda não foi feito)
cp .env.example .env

# 2. Execute o seed
npm run seed
```

**Credenciais padrão:**
- 📧 **Email:** `admin@myfinance.com`  
- 🔑 **Senha:** `admin123`

## 📋 Checklist de Configuração

### ✅ Pré-requisitos
- [ ] PostgreSQL instalado e rodando
- [ ] Arquivo `.env` configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Migrações executadas (`npx prisma migrate dev`)

### ✅ Execução do Seed
- [ ] Executar `npm run seed`
- [ ] Verificar mensagem de sucesso
- [ ] Anotar as credenciais mostradas

### ✅ Teste de Login
- [ ] Iniciar servidor (`npm run dev`)
- [ ] Testar login com as credenciais
- [ ] Alterar senha após primeiro acesso

## 🔧 Comandos Úteis

```bash
# Executar seed (versão segura com validações)
npm run seed

# Executar seed (versão simples)
npm run seed:simple

# Executar seed via Prisma
npx prisma db seed

# Verificar se usuário foi criado
npx prisma studio
```

## 🚨 Troubleshooting Rápido

### Erro: "Can't reach database server"
```bash
# Verificar se PostgreSQL está rodando
pg_ctl status

# Ou no Windows
net start postgresql-x64-15
```

### Erro: "DATABASE_URL not found"
```bash
# Criar arquivo .env
cp .env.example .env
# Editar com suas configurações
```

### Erro: "User already exists"
✅ **Normal!** O usuário já foi criado. Use as credenciais existentes.

## 📞 Suporte

Se encontrar problemas, verifique:
1. O arquivo `SEED_GUIDE.md` para instruções completas
2. O arquivo `README.md` para configuração geral do projeto
3. Os logs detalhados do comando seed

---

**⚠️ Lembre-se:** Sempre altere a senha padrão em produção!