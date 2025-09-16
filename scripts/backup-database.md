# Database Backup Instructions

## Before Migration to UUIDs

Para criar um backup seguro antes da migração:

### 1. Usando pg_dump (recomendado)
```bash
# Se usando PostgreSQL local
pg_dump -h localhost -U your_username -d myfinance > backup_pre_uuid_migration.sql

# Se usando Docker ou serviço cloud
pg_dump DATABASE_URL > backup_pre_uuid_migration.sql
```

### 2. Usando Prisma para export dos dados
```bash
# Exportar schema atual
npx prisma db pull --schema=prisma/schema_backup.prisma

# Gerar seed script (se necessário)
npx prisma db seed
```

### 3. Verificar backup
```bash
# Verificar se o arquivo foi criado
ls -la backup_pre_uuid_migration.sql

# Verificar conteúdo (primeiras linhas)
head -20 backup_pre_uuid_migration.sql
```

## Restaurar backup (se necessário)
```bash
# Restaurar banco completo
psql -h localhost -U your_username -d myfinance < backup_pre_uuid_migration.sql

# Ou usar Prisma reset + import
npx prisma migrate reset --force
```

**IMPORTANTE**: Execute o backup antes de prosseguir com a migração UUID!