import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

// Carrega variáveis de ambiente
config();

const prisma = new PrismaClient();

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com banco de dados estabelecida');
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro de conexão com banco de dados:', errorMessage);
    console.log('\n🔧 Soluções possíveis:');
    console.log('1. Verifique se o PostgreSQL está rodando');
    console.log('2. Confirme a DATABASE_URL no arquivo .env');
    console.log('3. Execute: npx prisma migrate dev');
    return false;
  }
}

async function createInitialUser() {
  // Configurações do usuário inicial
  const initialUser = {
    name: 'Administrador',
    email: 'admin@myfinance.com',
    password: 'admin123' // Senha padrão - ALTERE APÓS O PRIMEIRO LOGIN
  };

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: initialUser.email }
    });

    if (existingUser) {
      console.log('⚠️  Usuário administrador já existe!');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Nome:', existingUser.name);
      console.log('🆔 ID:', existingUser.id);
      console.log('\n🔐 Use estas credenciais para login:');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Senha: admin123 (se não foi alterada)`);
      return existingUser;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(initialUser.password, 10);

    // Criar usuário inicial
    const user = await prisma.user.create({
      data: {
        name: initialUser.name,
        email: initialUser.email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email:', user.email);
    console.log('👤 Nome:', user.name);
    console.log('🆔 ID:', user.id);
    console.log('📅 Criado em:', user.createdAt);
    
    console.log('\n🔐 Credenciais de login:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Senha: ${initialUser.password}`);
    
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

    return user;

  } catch (error) {
    console.error('❌ Erro ao criar usuário inicial:', error);
    throw error;
  }
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Verificar variáveis de ambiente
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não encontrada!');
    console.log('🔧 Crie um arquivo .env com:');
    console.log('DATABASE_URL="postgresql://usuario:senha@localhost:5432/myfinance"');
    process.exit(1);
  }

  // Verificar conexão com banco
  const connected = await checkDatabaseConnection();
  if (!connected) {
    process.exit(1);
  }

  // Criar usuário inicial
  await createInitialUser();

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📖 Próximos passos:');
  console.log('1. Inicie o servidor: npm run dev');
  console.log('2. Faça login com as credenciais mostradas acima');
  console.log('3. Altere a senha para uma senha segura');
}

main()
  .catch((e) => {
    console.error('\n❌ Falha no seed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🔌 Conexão com banco de dados encerrada.');
  });